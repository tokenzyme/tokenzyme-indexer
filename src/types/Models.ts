import { Account, DexLiquidity, SocialMedia, Token, Trade } from '../model';

export interface Models {
  accounts: Account[];
  tokensToCreate: Token[];
  tokensToUpdate: Token[];
  socialMedia: SocialMedia[];
  dexLiquidities: DexLiquidity[];
  trades: Trade[];
}
