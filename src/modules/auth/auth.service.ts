import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import config from '../../config';
import { prisma } from '../../config/prisma';
import AppError from '../../errors/AppError';

type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

// Business logic lives here, NOT in the controller. The controller only
// handles req/res; the service knows nothing about Express. This means
// you could reuse this function from a CLI script or a test file later
// without touching Express at all.
const registerUser = async (payload: TRegisterPayload) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw new AppError(400, 'An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    },
    select: {
      // never return the password hash, even hashed - just leave it out entirely
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(404, 'No account found with this email');
  }

  if (user.status === 'SUSPENDED') {
    throw new AppError(403, 'This account has been suspended. Contact support.');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError(401, 'Incorrect password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret as string,
    { expiresIn: config.jwtExpiresIn } as jwt.SignOptions,
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

export const authService = {
  registerUser,
  loginUser,
  getMe,
};
