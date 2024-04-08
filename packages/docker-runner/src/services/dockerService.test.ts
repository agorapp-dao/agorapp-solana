import chai, { expect } from 'chai';
import { dockerService } from './dockerService';
import Docker from 'dockerode';
import { sleep } from '@agorapp-dao/runner-common';

chai.config.truncateThreshold = 0;

describe('dockerService', () => {
  describe('runImage', () => {
    it('passes result as JSON on a single line', async () => {
      const { result, error } = await dockerService.runUnrestricted(
        'test-docker-runner',
        'test',
        {
          action: 'testResult',
        },
        // on CI some extra time is needed for the first test to run
        { timeout: 10_000 },
      );
      expect(error).to.be.undefined;
      expect(result).to.deep.equal({ passed: true });
    });

    it('returns stderr from the container', async () => {
      const { output, error } = await dockerService.runUnrestricted(
        'test-docker-runner',
        'test',
        {},
      );
      expect(error).to.equal('Container exited with a status code 1.');
      expect(output).to.include('DOCKER_RUNNER_ARGS must contain an action property');
    });

    it('returns stdout from the container', async () => {
      const { output } = await dockerService.runUnrestricted('test-docker-runner', 'test', {
        action: 'testStdOut',
      });
      expect(output.trim()).to.equal('stdout: hello');
    });

    it('cannot access network', async () => {
      let res = await dockerService.runUnrestricted(
        'test-docker-runner',
        'test',
        { action: 'testNetwork' },
        { timeout: 10_000 },
      );
      expect(res.output).to.include('getaddrinfo EAI_AGAIN'); // dns timeout

      res = await dockerService.runUnrestricted('test-docker-runner', 'test', {
        action: 'testPing',
      });
      expect(res.output).to.include('Network unreachable');
    }).timeout(10_000);

    it('does not keep container after run', async () => {
      const { output, containerId } = await dockerService.runUnrestricted(
        'test-docker-runner',
        'test',
        {
          action: 'testStdOut',
        },
      );

      // wait for the container to be removed
      await sleep(500);

      const docker = new Docker();
      const containers = await docker.listContainers({ all: true });
      const containerIds = containers.map(c => c.Id);
      expect(containerIds).to.not.include(containerId, 'container should be removed after run');
    });

    it('timeouts', async () => {
      const { error, containerId } = await dockerService.runUnrestricted(
        'test-docker-runner',
        'test',
        { action: 'testTimeout' },
        { timeout: 500 },
      );

      expect(error).to.equal('Your code took too long to execute.');

      // wait for the container to be removed
      await sleep(500);

      // check that the container was removed
      const docker = new Docker();
      const containers = await docker.listContainers({ all: true });
      const containerIds = containers.map(c => c.Id);
      expect(containerIds).to.not.include(containerId, 'container should be removed after run');
    });

    it('limits the memory', async () => {
      const res = await dockerService.runUnrestricted(
        'test-docker-runner',
        'test',
        { action: 'testMemoryLimit' },
        { memory: 24 * Math.pow(1024, 2) },
      );
      expect(res.output).to.equal('allocate memory\r\n');
      expect(res.error).to.equal('Container exited with a status code 137.');
    });
  });
});
