type TAllowedImage = {
  memory?: number;
  timeout?: number;
};

export const allowedImages: { [image: string]: TAllowedImage } = {
  'rbiosas/lisk-docker-runner': {
    memory: 250 * Math.pow(1024, 2),
    timeout: 10_000,
  },
  'rbiosas/swarm-docker-image': {
    memory: 100 * Math.pow(1024, 2),
    timeout: 5_000,
  },
  'rbiosas/nearjs-docker-image': {
    memory: 250 * Math.pow(1024, 2),
    timeout: 10_000,
  },
};
