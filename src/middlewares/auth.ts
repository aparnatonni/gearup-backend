import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

// Augment Express's Request type so req.user is known everywhere in TypeScript,
// instead of using `any` and losing autocomplete/type-safety in every controller.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role: string };
    }
  }
}

// Usage:
//   router.post('/gear', auth('PROVIDER'), gearController.create)
//   router.get('/admin/users', auth('ADMIN'), adminController.getUsers)
//   router.get('/me', auth(), authController.getMe)   // no roles = just "must be logged in"
const auth = (...allowedRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'You are not authorized. Please log in.');
    }

    const token = authHeader.split(' ')[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
    } catch (err) {
      throw new AppError(401, 'Invalid or expired token');
    }

    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      throw new AppError(403, 'You do not have permission to perform this action');
    }

    req.user = decoded as JwtPayload & { id: string; role: string };
    next();
  });
};

export default auth;
