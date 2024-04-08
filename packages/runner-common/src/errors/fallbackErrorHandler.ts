import { Request, Response, NextFunction } from 'express';
import { ErrorFactory } from './ErrorFactory';

export const fallbackErrorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.error(error);
  response.status(500).json(ErrorFactory.throwInternalServerError().output.payload.message);
};
