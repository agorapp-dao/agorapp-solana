import { App } from './app';
import { config } from './config';

export const app = new App();

process.on('unhandledRejection', error => {
  console.log(error);
  throw error;
});

process.on('uncaughtException', error => {
  console.log(error);
  process.exit(1);
});

app.express.listen(config.port, () => {
  console.log(`server is running on port ${config.port}`);
});
