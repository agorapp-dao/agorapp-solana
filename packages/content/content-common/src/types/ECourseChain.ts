export enum ECourseChain {
  ETHEREUM = 'ethereum',
  SWARM = 'swarm',
  ICP = 'icp',
  TON = 'ton',
  LISK = 'lisk',
  NEAR = 'near',
  SOLANA = 'solana',
}

export function parseCourseChain(str: string): ECourseChain {
  if (!Object.values(ECourseChain).includes(str as ECourseChain)) {
    throw new Error(`Invalid chain: ${str}`);
  }
  return str as ECourseChain;
}
