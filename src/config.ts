export interface Config {
  network: 'mainnet' | 'testnet' | 'testnet-legacy' | 'fork';
  rpcUrl: string;
  rpcRateLimit: number;
  finalityConfirmation: number;
  fromBlock: number;
  launchpadAddress: string;
}

export const getConfig = (): Config => {
  const network = process.env.NETWORK;
  const rpcUrl = process.env.RPC_URL;
  const rpcRateLimit = process.env.RPC_RATE_LIMIT != null ? parseInt(process.env.RPC_RATE_LIMIT, 10) : undefined;
  const finalityConfirmation =
    process.env.FINALITY_CONFIRMATION != null ? parseInt(process.env.FINALITY_CONFIRMATION, 10) : undefined;
  const fromBlock = process.env.FROM_BLOCK != null ? parseInt(process.env.FROM_BLOCK, 10) : undefined;
  const launchpadAddress = process.env.LAUNCHPAD_ADDRESS;

  if (!network) {
    throw new Error('Missing NETWORK environment variable');
  }
  if (network !== 'mainnet' && network !== 'testnet' && network !== 'testnet-legacy' && network !== 'fork') {
    throw new Error('Invalid NETWORK environment variable');
  }
  if (!rpcUrl) {
    throw new Error('Missing RPC_URL environment variable');
  }
  if (rpcRateLimit == null) {
    throw new Error('Missing RPC_RATE_LIMIT environment variable');
  }
  if (finalityConfirmation == null) {
    throw new Error('Missing FINALITY_CONFIRMATION environment variable');
  }
  if (fromBlock == null) {
    throw new Error('Missing FROM_BLOCK environment variable');
  }
  if (!launchpadAddress) {
    throw new Error('Missing LAUNCHPAD_ADDRESS environment variable');
  }

  return {
    network,
    rpcUrl,
    rpcRateLimit,
    finalityConfirmation,
    fromBlock,
    launchpadAddress,
  };
};
