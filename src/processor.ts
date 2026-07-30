import { EvmBatchProcessor } from '@subsquid/evm-processor';

import { Config } from './config';
import { events } from './generated/abi/launchpad';

export const getProcessor = (
  config: Config,
): EvmBatchProcessor<{
  log: {
    transactionHash: true;
  };
}> => {
  let gateway: string | null = null;
  if (config.network === 'mainnet') {
    gateway = 'https://v2.archive.subsquid.io/network/sonic-mainnet';
  } else if (config.network === 'testnet') {
    gateway = 'https://v2.archive.subsquid.io/network/sonic-testnet';
  }
  const processor = new EvmBatchProcessor()
    .setRpcEndpoint({
      url: config.rpcUrl,
      rateLimit: config.rpcRateLimit,
    })
    .setFinalityConfirmation(config.finalityConfirmation)
    .setBlockRange({ from: config.fromBlock })
    .setFields({ log: { transactionHash: true } })
    .addLog({
      address: [config.launchpadAddress],
      topic0: [
        events.TokenLaunched.topic,
        events.TokenMigrated.topic,
        events.TokensBought.topic,
        events.TokensSold.topic,
        events.MarketDataCreated.topic,
        events.MarketDataUpdated.topic,
      ],
    });
  if (gateway) {
    processor.setGateway(gateway);
  }
  return processor;
};
