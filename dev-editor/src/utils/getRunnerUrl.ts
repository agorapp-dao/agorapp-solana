export function getRunnerUrl(runner: string): string {
  const runnersHostname = process.env.RUNNERS_HOSTNAME || `localhost`;

  switch (runner) {
    case 'docker-runner':
      return `http://${runnersHostname}:7009`;
    case 'func':
      return `http://${runnersHostname}:7080`;
    case 'motoko':
      return `http://${runnersHostname}:7002`;
    case 'solidity':
      return `http://${runnersHostname}:7000`;
    case 'azle':
      return `http://${runnersHostname}:7004`;
    case 'solana':
      return `http://${runnersHostname}:7005`;
    default:
      throw new Error(`Runner ${runner} not supported`);
  }
}
