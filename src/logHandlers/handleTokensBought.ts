import { BigDecimal } from '@subsquid/big-decimal';
import { formatEther } from 'ethers';

import { Account, Trade, TradeType } from '../model';
import { Models } from '../types/Models';

interface TokensBoughtRecord {
  token: string;
  buyer: string;
  tokenAmount: bigint;
  cost: bigint;
  fee: bigint;
}

export const handleTokensBought = (
  models: Models,
  txId: string,
  blockTimestamp: number,
  record: TokensBoughtRecord,
): void => {
  models.accounts.push(
    new Account({
      id: record.buyer.toLowerCase(),
    }),
  );
  const tokenAmount = BigDecimal(formatEther(record.tokenAmount));
  const ethAmount = BigDecimal(formatEther(record.cost));
  const fee = BigDecimal(formatEther(record.fee));
  models.trades.push(
    new Trade({
      id: txId,
      tokenId: record.token.toLowerCase(),
      accountId: record.buyer.toLowerCase(),
      type: TradeType.BUY,
      tokenAmount,
      ethAmount,
      fee,
      avgPrice: ethAmount.minus(fee).div(tokenAmount),
      createdAt: new Date(blockTimestamp),
    }),
  );
};
