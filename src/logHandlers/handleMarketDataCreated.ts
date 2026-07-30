import { BigDecimal } from '@subsquid/big-decimal';
import { formatEther } from 'ethers';

import { Token } from '../model';
import { Models } from '../types/Models';

interface MarketDataCreatedRecord {
  token: string;
  tokenTotalSupply: bigint;
  bondingCurveSupply: bigint;
  tokenPrice: bigint;
  tokenFinalPrice: bigint;
}

export const handleMarketDataCreated = (
  models: Models,
  blockTimestamp: number,
  record: MarketDataCreatedRecord,
): void => {
  models.tokensToUpdate.push(
    new Token({
      id: record.token.toLowerCase(),
      totalSupply: BigDecimal(formatEther(record.tokenTotalSupply)),
      bondingCurveSupply: BigDecimal(formatEther(record.bondingCurveSupply)),
      reserve: BigDecimal(formatEther(record.bondingCurveSupply)),
      price: BigDecimal(formatEther(record.tokenPrice)),
      finalPrice: BigDecimal(formatEther(record.tokenFinalPrice)),
      updatedAt: new Date(blockTimestamp),
    }),
  );
};
