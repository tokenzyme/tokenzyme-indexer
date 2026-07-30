import { Store } from '@subsquid/typeorm-store';
import _ from 'lodash';

import { Token } from '../model';

const mergeDuplicateTokens = (tokens: Token[]): Token[] => {
  const tokensById = _.groupBy(tokens, 'id');
  return Object.values(tokensById).map((group) => {
    const merged = group.reduce((acc, current) => {
      return _.merge(acc, current);
    }, {});
    return new Token(merged);
  });
};

export const mergeTokensWithExistingOnes = async (store: Store, tokens: Token[]): Promise<Token[]> => {
  const tokensToUpdate = mergeDuplicateTokens(tokens);
  const existingTokens = await store.findBy(
    Token,
    tokensToUpdate.map((token) => ({ id: token.id })),
  );

  const tokenById = _.keyBy(existingTokens, 'id');
  return tokensToUpdate.map(
    (token) =>
      new Token({
        ...tokenById[token.id],
        ..._.omitBy(token, (value) => value === undefined),
      }),
  );
};
