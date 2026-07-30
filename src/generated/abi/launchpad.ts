import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    DexParamsUpdated: event("0xfb455b21d97b2e28ec18674868dc35861cb3886b5bafd53f9a9fe568d5634c20", "DexParamsUpdated(address,address,int24)", {"poolFactory": indexed(p.address), "positionManager": indexed(p.address), "tickSpacing": p.int24}),
    FeeParamsUpdated: event("0xe55b0232856c9787e1d18d323fcc7fd2371c0d41ccb77af911e06e97468e524e", "FeeParamsUpdated(address,uint16)", {"feeRecipient": indexed(p.address), "tradeFee": p.uint16}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    IsMarketPausedUpdated: event("0x90dff0bda39fe28004b990d48b20cb1b31d8554cac6533e727af686723a3394f", "IsMarketPausedUpdated(bool)", {"isMarketPaused": p.bool}),
    MarketDataCreated: event("0xb2a2c49bd87956107df0c757a3c7f3a1f02a8f6386b099bdb3148a19fd9bde45", "MarketDataCreated(address,uint256,uint256,uint256,uint256)", {"token": indexed(p.address), "tokenTotalSupply": p.uint256, "bondingCurveSupply": p.uint256, "tokenPrice": p.uint256, "tokenFinalPrice": p.uint256}),
    MarketDataUpdated: event("0x6f949ad4bac60e9f8b03bc0f1091ab6c7da138d865ba48464b6e0cd7bd3c3503", "MarketDataUpdated(address,uint256,uint256,uint256)", {"token": indexed(p.address), "ethReserve": p.uint256, "tokenReserve": p.uint256, "tokenPrice": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    PriceFeedUpdated: event("0xe5b20b8497e4f3e2435ef9c20e2e26b47497ee13745ce1c681ad6640653119e6", "PriceFeedUpdated(address)", {"priceFeed": indexed(p.address)}),
    ReserveParamsUpdated: event("0x3a9793454a936c91e2cf5333bd01680aa8397017d0d543237f8bc6086c5ea06b", "ReserveParamsUpdated(uint256,uint256,uint256)", {"baseEthVirtualReserve": p.uint256, "baseTokenVirtualReserve": p.uint256, "baseEthPriceInUsd": p.uint256}),
    RewardParamsUpdated: event("0x574e639532dde6da633572ebff0d262d597496d2e2b4b876370a0400d80468b9", "RewardParamsUpdated(uint16,uint16)", {"tradeFeeShare": p.uint16, "migrationRemainingEthShare": p.uint16}),
    SupplyParamsUpdated: event("0x81391b42569be4fc270fd6f669361a1c5045489e6036b409937807c4f2b63f73", "SupplyParamsUpdated(uint256,uint256)", {"tokenTotalSupply": p.uint256, "bondingCurveSupply": p.uint256}),
    TokenLaunched: event("0x13fd710a4f3e6dd35b3c756e56dadbdc1daa79f8e3a2a7758f13731f1aefc602", "TokenLaunched(address,address,string,string,string,string,string,string,string,string,string,string,string)", {"token": indexed(p.address), "creator": indexed(p.address), "name": p.string, "symbol": p.string, "description": p.string, "logoUrl": p.string, "websiteUrl": p.string, "xUrl": p.string, "telegramUrl": p.string, "discordUrl": p.string, "redditUrl": p.string, "facebookUrl": p.string, "instagramUrl": p.string}),
    TokenMigrated: event("0xf3c83d8e76cef55dc49b749dd53058325073a50b828db860ef649b3c1b829e3a", "TokenMigrated(address,address,uint256,uint256,uint256)", {"token": indexed(p.address), "dexPool": indexed(p.address), "tokenId": p.uint256, "ethLiquidity": p.uint256, "tokenLiquidity": p.uint256}),
    TokensBought: event("0x4a179a798aae7b667a57d4131a74ac237388c46efd74875a1fa82f5bc9e4a6d5", "TokensBought(address,address,uint256,uint256,uint256)", {"token": indexed(p.address), "buyer": indexed(p.address), "tokenAmount": p.uint256, "cost": p.uint256, "fee": p.uint256}),
    TokensSold: event("0xa0fe9740856690637d999c103293d3c823fc3b81443c34c6004bb582ab4b6166", "TokensSold(address,address,uint256,uint256,uint256)", {"token": indexed(p.address), "seller": indexed(p.address), "tokenAmount": p.uint256, "payout": p.uint256, "fee": p.uint256}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
    WrappedEthUpdated: event("0x4a886e8b6a59acded071751092181388ac1c805eb39ecf565d529ec8e42750bc", "WrappedEthUpdated(address)", {"wrappedEth": indexed(p.address)}),
}

export const functions = {
    UPGRADE_INTERFACE_VERSION: viewFun("0xad3cb1cc", "UPGRADE_INTERFACE_VERSION()", {}, p.string),
    bondingCurveSupply: viewFun("0x2b8a30d2", "bondingCurveSupply()", {}, p.uint256),
    buyTokens: fun("0x0752881a", "buyTokens(address,uint256)", {"token": p.address, "minExpectedTokens": p.uint256}, p.uint256),
    estimateEthForSellingTokens: viewFun("0xe75c04a4", "estimateEthForSellingTokens(address,uint256)", {"token": p.address, "tokenAmount": p.uint256}, p.uint256),
    estimateEthToBuyTokens: viewFun("0x16c39e9c", "estimateEthToBuyTokens(address,uint256)", {"token": p.address, "tokenAmount": p.uint256}, p.uint256),
    estimateFirstTokensToBuy: viewFun("0x95941f25", "estimateFirstTokensToBuy(uint256)", {"ethAmount": p.uint256}, p.uint256),
    estimateTokensToBuy: viewFun("0xc016679b", "estimateTokensToBuy(address,uint256)", {"token": p.address, "ethAmount": p.uint256}, p.uint256),
    initialize: fun("0x1459457a", "initialize(address,address,address,address,address)", {"feeRecipient": p.address, "priceFeed": p.address, "wrappedEth": p.address, "dexPoolFactory": p.address, "dexPositionManager": p.address}, ),
    launchToken: fun("0x40888d7d", "launchToken(string,string,(string,string,string,(string,string,string,string,string,string)))", {"name": p.string, "symbol": p.string, "info": p.struct({"description": p.string, "logoUrl": p.string, "websiteUrl": p.string, "socialMedia": p.struct({"xUrl": p.string, "telegramUrl": p.string, "discordUrl": p.string, "redditUrl": p.string, "facebookUrl": p.string, "instagramUrl": p.string})})}, p.address),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    proxiableUUID: viewFun("0x52d1902d", "proxiableUUID()", {}, p.bytes32),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    sellTokens: fun("0xe4e57b9e", "sellTokens(address,uint256,uint256)", {"token": p.address, "tokenAmount": p.uint256, "minExpectedEth": p.uint256}, p.uint256),
    setDexParams: fun("0x8f49b5f8", "setDexParams(address,address,int24)", {"poolFactory": p.address, "positionManager": p.address, "tickSpacing": p.int24}, ),
    setFeeParams: fun("0x7c8cf3e5", "setFeeParams(address,uint16)", {"feeRecipient": p.address, "tradeFee": p.uint16}, ),
    setIsMarketPaused: fun("0x26e875be", "setIsMarketPaused(bool)", {"isMarketPaused": p.bool}, ),
    setPriceFeed: fun("0x724e78da", "setPriceFeed(address)", {"priceFeed": p.address}, ),
    setReserveParams: fun("0x369b7e77", "setReserveParams(uint256,uint256,uint256)", {"baseEthVirtualReserve": p.uint256, "baseTokenVirtualReserve": p.uint256, "baseEthPriceInUsd": p.uint256}, ),
    setRewardParams: fun("0x7f4d75fa", "setRewardParams(uint16,uint16)", {"tradeFeeShare": p.uint16, "migrationRemainingEthShare": p.uint16}, ),
    setSupplyParams: fun("0xff57d29f", "setSupplyParams(uint256,uint256)", {"tokenTotalSupply": p.uint256, "bondingCurveSupply": p.uint256}, ),
    setWrappedEth: fun("0x59b68214", "setWrappedEth(address)", {"wrappedEth": p.address}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    upgradeToAndCall: fun("0x4f1ef286", "upgradeToAndCall(address,bytes)", {"newImplementation": p.address, "data": p.bytes}, ),
}

export class Contract extends ContractBase {

    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(functions.UPGRADE_INTERFACE_VERSION, {})
    }

    bondingCurveSupply() {
        return this.eth_call(functions.bondingCurveSupply, {})
    }

    estimateEthForSellingTokens(token: EstimateEthForSellingTokensParams["token"], tokenAmount: EstimateEthForSellingTokensParams["tokenAmount"]) {
        return this.eth_call(functions.estimateEthForSellingTokens, {token, tokenAmount})
    }

    estimateEthToBuyTokens(token: EstimateEthToBuyTokensParams["token"], tokenAmount: EstimateEthToBuyTokensParams["tokenAmount"]) {
        return this.eth_call(functions.estimateEthToBuyTokens, {token, tokenAmount})
    }

    estimateFirstTokensToBuy(ethAmount: EstimateFirstTokensToBuyParams["ethAmount"]) {
        return this.eth_call(functions.estimateFirstTokensToBuy, {ethAmount})
    }

    estimateTokensToBuy(token: EstimateTokensToBuyParams["token"], ethAmount: EstimateTokensToBuyParams["ethAmount"]) {
        return this.eth_call(functions.estimateTokensToBuy, {token, ethAmount})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }
}

/// Event types
export type DexParamsUpdatedEventArgs = EParams<typeof events.DexParamsUpdated>
export type FeeParamsUpdatedEventArgs = EParams<typeof events.FeeParamsUpdated>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type IsMarketPausedUpdatedEventArgs = EParams<typeof events.IsMarketPausedUpdated>
export type MarketDataCreatedEventArgs = EParams<typeof events.MarketDataCreated>
export type MarketDataUpdatedEventArgs = EParams<typeof events.MarketDataUpdated>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PriceFeedUpdatedEventArgs = EParams<typeof events.PriceFeedUpdated>
export type ReserveParamsUpdatedEventArgs = EParams<typeof events.ReserveParamsUpdated>
export type RewardParamsUpdatedEventArgs = EParams<typeof events.RewardParamsUpdated>
export type SupplyParamsUpdatedEventArgs = EParams<typeof events.SupplyParamsUpdated>
export type TokenLaunchedEventArgs = EParams<typeof events.TokenLaunched>
export type TokenMigratedEventArgs = EParams<typeof events.TokenMigrated>
export type TokensBoughtEventArgs = EParams<typeof events.TokensBought>
export type TokensSoldEventArgs = EParams<typeof events.TokensSold>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type WrappedEthUpdatedEventArgs = EParams<typeof events.WrappedEthUpdated>

/// Function types
export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof functions.UPGRADE_INTERFACE_VERSION>
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof functions.UPGRADE_INTERFACE_VERSION>

export type BondingCurveSupplyParams = FunctionArguments<typeof functions.bondingCurveSupply>
export type BondingCurveSupplyReturn = FunctionReturn<typeof functions.bondingCurveSupply>

export type BuyTokensParams = FunctionArguments<typeof functions.buyTokens>
export type BuyTokensReturn = FunctionReturn<typeof functions.buyTokens>

export type EstimateEthForSellingTokensParams = FunctionArguments<typeof functions.estimateEthForSellingTokens>
export type EstimateEthForSellingTokensReturn = FunctionReturn<typeof functions.estimateEthForSellingTokens>

export type EstimateEthToBuyTokensParams = FunctionArguments<typeof functions.estimateEthToBuyTokens>
export type EstimateEthToBuyTokensReturn = FunctionReturn<typeof functions.estimateEthToBuyTokens>

export type EstimateFirstTokensToBuyParams = FunctionArguments<typeof functions.estimateFirstTokensToBuy>
export type EstimateFirstTokensToBuyReturn = FunctionReturn<typeof functions.estimateFirstTokensToBuy>

export type EstimateTokensToBuyParams = FunctionArguments<typeof functions.estimateTokensToBuy>
export type EstimateTokensToBuyReturn = FunctionReturn<typeof functions.estimateTokensToBuy>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type LaunchTokenParams = FunctionArguments<typeof functions.launchToken>
export type LaunchTokenReturn = FunctionReturn<typeof functions.launchToken>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SellTokensParams = FunctionArguments<typeof functions.sellTokens>
export type SellTokensReturn = FunctionReturn<typeof functions.sellTokens>

export type SetDexParamsParams = FunctionArguments<typeof functions.setDexParams>
export type SetDexParamsReturn = FunctionReturn<typeof functions.setDexParams>

export type SetFeeParamsParams = FunctionArguments<typeof functions.setFeeParams>
export type SetFeeParamsReturn = FunctionReturn<typeof functions.setFeeParams>

export type SetIsMarketPausedParams = FunctionArguments<typeof functions.setIsMarketPaused>
export type SetIsMarketPausedReturn = FunctionReturn<typeof functions.setIsMarketPaused>

export type SetPriceFeedParams = FunctionArguments<typeof functions.setPriceFeed>
export type SetPriceFeedReturn = FunctionReturn<typeof functions.setPriceFeed>

export type SetReserveParamsParams = FunctionArguments<typeof functions.setReserveParams>
export type SetReserveParamsReturn = FunctionReturn<typeof functions.setReserveParams>

export type SetRewardParamsParams = FunctionArguments<typeof functions.setRewardParams>
export type SetRewardParamsReturn = FunctionReturn<typeof functions.setRewardParams>

export type SetSupplyParamsParams = FunctionArguments<typeof functions.setSupplyParams>
export type SetSupplyParamsReturn = FunctionReturn<typeof functions.setSupplyParams>

export type SetWrappedEthParams = FunctionArguments<typeof functions.setWrappedEth>
export type SetWrappedEthReturn = FunctionReturn<typeof functions.setWrappedEth>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

