import { BigDecimal } from '@subsquid/big-decimal';
import { formatEther } from 'ethers';

import { Account, Trade, TradeType } from '../model';
import { Models } from '../types/Models';

interface TokensSoldRecord {
  token: string;
  seller: string;
  tokenAmount: bigint;
  payout: bigint;
  fee: bigint;
}

export const handleTokensSold = (
  models: Models,
  txId: string,
  blockTimestamp: number,
  record: TokensSoldRecord,
): void => {
  models.accounts.push(
    new Account({
      id: record.seller.toLowerCase(),
    }),
  );
  const tokenAmount = BigDecimal(formatEther(record.tokenAmount));
  const ethAmount = BigDecimal(formatEther(record.payout));
  const fee = BigDecimal(formatEther(record.fee));
  models.trades.push(
    new Trade({
      id: txId,
      tokenId: record.token.toLowerCase(),
      accountId: record.seller.toLowerCase(),
      type: TradeType.SELL,
      tokenAmount,
      ethAmount,
      fee,
      avgPrice: ethAmount.plus(fee).div(tokenAmount),
      createdAt: new Date(blockTimestamp),
    }),
  );
};
