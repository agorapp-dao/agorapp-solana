import { Router, Request, Response, NextFunction } from 'express';
import { TActionRequest } from '@agorapp-dao/runner-common/src/types';
import { dockerService } from '../services/dockerService';

export const actionRouter = Router({ mergeParams: true });

actionRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const actionReq = req.body as TActionRequest;
    const { result, error, output } = await dockerService.run(actionReq.image, 'action', req.body);

    if (error) {
      console.error(`Error running docker image ${actionReq.image}`, error, output);
    }

    res.status(200).json(error ? { error } : result);
  } catch (error) {
    next(error);
  }
});
