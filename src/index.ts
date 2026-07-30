/* eslint-disable no-restricted-syntax */
import { TypeormDatabase } from '@subsquid/typeorm-store';
import _ from 'lodash';

import { getConfig } from './config';
import { events } from './generated/abi/launchpad';
import { handleMarketDataCreated } from './logHandlers/handleMarketDataCreated';
import { handleMarketDataUpdated } from './logHandlers/handleMarketDataUpdated';
import { handleTokenLaunched } from './logHandlers/handleTokenLaunched';
import { handleTokenMigrated } from './logHandlers/handleTokenMigrated';
import { handleTokensBought } from './logHandlers/handleTokensBought';
import { handleTokensSold } from './logHandlers/handleTokensSold';
import { logger } from './logger';
import { getProcessor } from './processor';
import { Models } from './types/Models';
import { mergeTokensWithExistingOnes } from './utils/tokenUtils';
import { emitTokenUpdate, emitTrade } from './ws';

process.env.TZ = 'UTC';

const config = getConfig();
const processor = getProcessor(config);
const database = new TypeormDatabase();

processor.run(database, async (ctx) => {
  const models: Models = {
    accounts: [],
    tokensToCreate: [],
    tokensToUpdate: [],
    socialMedia: [],
    dexLiquidities: [],
    trades: [],
  };
  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      const event = log.topics[0];
      if (event === events.TokenLaunched.topic) {
        logger.info(`TokenLaunched event happened on transaction ${log.transactionHash}`);
        handleTokenLaunched(models, block.header.timestamp, events.TokenLaunched.decode(log));
      } else if (event === events.MarketDataCreated.topic) {
        logger.info(`MarketDataCreated event happened on transaction ${log.transactionHash}`);
        handleMarketDataCreated(models, block.header.timestamp, events.MarketDataCreated.decode(log));
      } else if (event === events.TokensBought.topic) {
        logger.info(`TokensBought event happened on transaction ${log.transactionHash}`);
        handleTokensBought(models, log.transactionHash, block.header.timestamp, events.TokensBought.decode(log));
      } else if (event === events.TokensSold.topic) {
        logger.info(`TokensSold event happened on transaction ${log.transactionHash}`);
        handleTokensSold(models, log.transactionHash, block.header.timestamp, events.TokensSold.decode(log));
      } else if (event === events.MarketDataUpdated.topic) {
        logger.info(`MarketDataUpdated event happened on transaction ${log.transactionHash}`);
        handleMarketDataUpdated(models, block.header.timestamp, events.MarketDataUpdated.decode(log));
      } else if (event === events.TokenMigrated.topic) {
        logger.info(`TokenMigrated event happened on transaction ${log.transactionHash}`);
        handleTokenMigrated(models, block.header.timestamp, events.TokenMigrated.decode(log));
      }
    }
  }

  await ctx.store.upsert(_.uniqBy(models.accounts, 'id'));
  await ctx.store.insert(models.tokensToCreate);

  const tokensToUpdate = await mergeTokensWithExistingOnes(ctx.store, models.tokensToUpdate);

  await Promise.all([
    ctx.store.insert(models.socialMedia),
    ctx.store.upsert(tokensToUpdate),
    ctx.store.insert(models.trades),
    ctx.store.insert(models.dexLiquidities),
  ]);

  models.trades.forEach((trade) => {
    emitTrade(trade);
  });
  tokensToUpdate.forEach((token) => {
    emitTokenUpdate(token);
  });
});
