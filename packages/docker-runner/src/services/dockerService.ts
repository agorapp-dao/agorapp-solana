import Docker from 'dockerode';
import { allowedImages } from './allowedImages';

type RunOpts = {
  timeout?: number;
  memory?: number;
};

type RunResult = {
  result: unknown;
  output: string;
  error?: string;

  containerId: string; // useful for testing
};

class DockerService {
  private docker = new Docker();

  /**
   * Creates a container and runs the image with the given args. The image must be in the `allowedImages`. Once the
   * container completes, it returns the result and any output from the container.
   *
   * @param image   Name of the image to run.
   * @param action  Action to run in the container, will be passed to the container as an environment variable.
   * @param args    JSON with arguments, will be passed to the container as an environment variable.
   */
  async run(image: string, action: 'test' | 'action', args: unknown): Promise<RunResult> {
    if (!allowedImages[image]) {
      throw new Error(`Image ${image} is not allowed`);
    }

    return await this.runUnrestricted(image, action, args, {
      timeout: allowedImages[image].timeout,
      memory: allowedImages[image].memory,
    });
  }

  /**
   * Unrestricted version of the run method. If you use this method, make sure to properly validate the
   * image name and limit the memory and timeout.
   *
   * @param image
   * @param action
   * @param args
   * @param opts
   */
  async runUnrestricted(
    image: string,
    action: 'test' | 'action',
    args: unknown,
    opts?: RunOpts,
  ): Promise<RunResult> {
    opts = opts || {};
    opts.timeout = opts.timeout || 2_000;
    opts.memory = opts.memory || 24 * Math.pow(1024, 2);
    let output = '';

    const imageTag = process.env.DOCKER_TAG || 'local';

    const container = await this.docker.createContainer({
      Cmd: [],
      Image: image + ':' + imageTag,
      HostConfig: {
        AutoRemove: true,
        Memory: opts.memory,
        // If --memory-swap is set to the same value as --memory, and --memory is set to a positive integer, the container does not have access to swap.
        MemorySwappiness: opts.memory,
      },
      Env: [`DOCKER_RUNNER_ACTION=${action}`, `DOCKER_RUNNER_ARGS=${JSON.stringify(args)}`],
      NetworkDisabled: true,
      AttachStdin: false,
      Tty: true,
      OpenStdin: false,
    });

    const stream = await container.attach({ stream: true, stdout: true, stderr: true });
    stream.setEncoding('utf8');
    stream.on('data', data => {
      output += data;
    });
    await container.start();

    let didTimeout = false;
    const runTimeout = setTimeout(async () => {
      didTimeout = true;
      await container.stop({ t: 0 });
      await container.remove();
    }, opts.timeout);

    const { StatusCode } = await container.wait();
    clearTimeout(runTimeout);

    if (didTimeout) {
      return {
        result: null,
        error: 'Your code took too long to execute.',
        output,
        containerId: container.id,
      };
    }

    if (StatusCode !== 0) {
      return {
        result: null,
        error: `Container exited with a status code ${StatusCode}.`,
        output,
        containerId: container.id,
      };
    }

    // container passes result as a JSON on a single line starting with "DOCKER_RUNNER_RESULT="
    let result: unknown;
    const lines = output.split('\r\n');
    for (const line of lines) {
      if (line.startsWith('DOCKER_RUNNER_RESULT=')) {
        result = JSON.parse(line.slice('DOCKER_RUNNER_RESULT='.length));
      }
    }

    return {
      result,
      output,
      containerId: container.id,
    };
  }
}

export const dockerService = new DockerService();
