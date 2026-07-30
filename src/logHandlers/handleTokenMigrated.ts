import { BigDecimal } from '@subsquid/big-decimal';
import { formatEther } from 'ethers';

import { DexLiquidity, Token } from '../model';
import { Models } from '../types/Models';

interface TokenMigratedRecord {
  token: string;
  dexPool: string;
  tokenId: bigint;
  ethLiquidity: bigint;
  tokenLiquidity: bigint;
}

export const handleTokenMigrated = (models: Models, blockTimestamp: number, record: TokenMigratedRecord): void => {
  models.tokensToUpdate.push(
    new Token({
      id: record.token.toLowerCase(),
      dexPoolAddress: record.dexPool,
      migratedAt: new Date(blockTimestamp),
      updatedAt: new Date(blockTimestamp),
    }),
  );
  models.dexLiquidities.push(
    new DexLiquidity({
      id: record.token.toLowerCase(),
      tokenId: Number(record.tokenId),
      ethLiquidity: BigDecimal(formatEther(record.ethLiquidity)),
      tokenLiquidity: BigDecimal(formatEther(record.tokenLiquidity)),
      createdAt: new Date(blockTimestamp),
    }),
  );
};
