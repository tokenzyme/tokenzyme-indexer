import { BigDecimal } from '@subsquid/big-decimal';

import { Account, SocialMedia, Token } from '../model';
import { Models } from '../types/Models';

interface TokenLaunchedRecord {
  token: string;
  creator: string;
  name: string;
  symbol: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  xUrl: string;
  telegramUrl: string;
  discordUrl: string;
  redditUrl: string;
  facebookUrl: string;
  instagramUrl: string;
}

export const handleTokenLaunched = (models: Models, blockTimestamp: number, record: TokenLaunchedRecord): void => {
  models.accounts.push(
    new Account({
      id: record.creator.toLowerCase(),
    }),
  );
  models.tokensToCreate.push(
    new Token({
      id: record.token.toLowerCase(),
      creatorId: record.creator.toLowerCase(),
      name: record.name,
      symbol: record.symbol,
      description: record.description,
      logoUrl: record.logoUrl,
      websiteUrl: record.websiteUrl || null,
      totalSupply: BigDecimal(0),
      bondingCurveSupply: BigDecimal(0),
      ethReserve: BigDecimal(0),
      reserve: BigDecimal(0),
      price: BigDecimal(0),
      finalPrice: BigDecimal(0),
      createdAt: new Date(blockTimestamp),
    }),
  );
  const socialMedia = new SocialMedia({
    id: record.token.toLowerCase(),
    xUrl: record.xUrl || null,
    telegramUrl: record.telegramUrl || null,
    discordUrl: record.discordUrl || null,
    redditUrl: record.redditUrl || null,
    facebookUrl: record.facebookUrl || null,
    instagramUrl: record.instagramUrl || null,
    createdAt: new Date(blockTimestamp),
  });
  if (Object.entries(socialMedia).some(([key, value]) => key !== 'id' && key !== 'createdAt' && value !== null)) {
    models.socialMedia.push(socialMedia);
  }
};
