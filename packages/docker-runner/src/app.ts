import express, { Application, Router } from 'express';
import { fallbackErrorHandler, statusRouter } from '@agorapp-dao/runner-common';
import { solveRouter } from './routes/solveRouter';
import { actionRouter } from './routes/actionRouter';

export class App {
  express: Application;

  constructor() {
    this.express = express();
    this._mountRoutes();
  }

  _mountRoutes() {
    const router = Router({ mergeParams: true });
    router.use(express.json());

    router.use('/solve', solveRouter);
    router.use('/action', actionRouter);
    router.use('/status', statusRouter);
    this.express.use('/v1', router);
    router.use(fallbackErrorHandler);
  }
}
