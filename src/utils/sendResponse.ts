import { Response } from 'express';

type TMeta = {
  page?: number;
  limit?: number;
  total?: number;
};

type TResponse<T> = {
  success: boolean;
  message: string;
  meta?: TMeta;
  data?: T;
};

// Every successful response in the API goes through this, so the shape
// is always predictable for whoever consumes the API (you, in Postman,
// or a frontend later).
const sendResponse = <T>(res: Response, statusCode: number, payload: TResponse<T>) => {
  res.status(statusCode).json({
    success: payload.success,
    message: payload.message,
    meta: payload.meta,
    data: payload.data,
  });
};

export default sendResponse;
