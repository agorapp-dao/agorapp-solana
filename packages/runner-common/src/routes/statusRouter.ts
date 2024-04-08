import { Router, Request, Response } from 'express';

export const statusRouter = Router({ mergeParams: true });

type TResponse = {
  timestamp: string;
};

statusRouter.get('/', async (request: Request, response: Response<TResponse>): Promise<void> => {
  const timestamp = new Date().toISOString();
  response.json({ timestamp });
});
