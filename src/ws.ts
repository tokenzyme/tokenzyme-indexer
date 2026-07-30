import { createServer } from 'http';

import { Server } from 'socket.io';

import { logger } from './logger';
import { Token, Trade } from './model';

const httpServer = createServer();
// CORS_ORIGIN unset means "allow any origin" — development only. Set it in production.
const wsServer = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN ?? true,
    credentials: true,
  },
});

export const emitTrade = (trade: Trade): void => {
  wsServer.emit(`tokens:${trade.tokenId}:trades`, {
    id: trade.id,
    tokenAddress: trade.tokenId,
    accountAddress: trade.accountId,
    type: trade.type,
    tokenAmount: trade.tokenAmount.toNumber(),
    ethAmount: trade.ethAmount.toNumber(),
    fee: trade.fee.toNumber(),
    avgPrice: trade.avgPrice.toNumber(),
    createdAt: trade.createdAt,
  });
};

export const emitTokenUpdate = (token: Token): void => {
  wsServer.emit(`tokens:${token.id}:updates`, {
    address: token.id,
    ethReserve: token.ethReserve.toNumber(),
    reserve: token.reserve.toNumber(),
    price: token.price.toNumber(),
    dexPoolAddress: token.dexPoolAddress,
    migratedAt: token.migratedAt,
  });
};

httpServer.listen(3002, '0.0.0.0', () => {
  logger.info('WebSocket listening on port 3002');
});
