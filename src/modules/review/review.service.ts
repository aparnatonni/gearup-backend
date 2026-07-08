import { prisma } from '../../config/prisma';
import AppError from '../../errors/AppError';

type TCreateReviewPayload = {
  gearItemId: string;
  rating: number;
  comment?: string;
};

const createReview = async (customerId: string, payload: TCreateReviewPayload) => {
  // The whole point of this check: you can only review gear you actually
  // rented AND returned. Without it, anyone could review anything, which
  // defeats the purpose of reviews being trustworthy.
  const eligibleOrder = await prisma.rentalOrder.findFirst({
    where: {
      customerId,
      status: 'RETURNED',
      items: { some: { gearItemId: payload.gearItemId } },
    },
  });

  if (!eligibleOrder) {
    throw new AppError(400, 'You can only review gear you have rented and returned');
  }

  return prisma.review.create({
    data: {
      customerId,
      gearItemId: payload.gearItemId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });
};

export const reviewService = {
  createReview,
};
