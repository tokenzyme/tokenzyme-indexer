import { BigDecimal } from '@subsquid/big-decimal';
import { formatEther } from 'ethers';

import { Token } from '../model';
import { Models } from '../types/Models';

interface MarketDataUpdatedRecord {
  token: string;
  ethReserve: bigint;
  tokenReserve: bigint;
  tokenPrice: bigint;
}

export const handleMarketDataUpdated = (
  models: Models,
  blockTimestamp: number,
  record: MarketDataUpdatedRecord,
): void => {
  models.tokensToUpdate.push(
    new Token({
      id: record.token.toLowerCase(),
      ethReserve: BigDecimal(formatEther(record.ethReserve)),
      reserve: BigDecimal(formatEther(record.tokenReserve)),
      price: BigDecimal(formatEther(record.tokenPrice)),
      updatedAt: new Date(blockTimestamp),
    }),
  );
};
