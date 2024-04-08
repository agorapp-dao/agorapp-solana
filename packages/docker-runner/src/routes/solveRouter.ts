import { Router, Request, Response, NextFunction } from 'express';
import { dockerService } from '../services/dockerService';
import { TTestRequest } from '@agorapp-dao/runner-common/src/types';

export const solveRouter = Router({ mergeParams: true });

solveRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reqBody = req.body as TTestRequest;
    if (!reqBody.image) throw new Error('image is required');

    const { result, error, output } = await dockerService.run(reqBody.image, 'test', req.body);

    if (error) {
      console.error(`Error running docker image ${reqBody.image}`, error, output);
    }

    res.status(200).json(error ? { error } : result);
  } catch (error) {
    next(error);
  }
});
