import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

////////////////////
///// Versions /////
////////////////////

export const PROTOCOL_SCHEMA_VERSION = "1.3.0";

export const DEFAULT_DECIMALS = 18;

export namespace Address {
  Zero: "0x0000000000000000000000000000000000000000";
}

export namespace BIGINT {
  export const NEG_ONE = BigInt.fromI32(-1);
  export const ZERO = BigInt.fromI32(0);
  export const ONE = BigInt.fromI32(1);
  export const TWO = BigInt.fromI32(2);
  export const TEN = BigInt.fromI32(10);
  export const HUNDRED = BigInt.fromI32(100);
  export const _192 = BigInt.fromI32(192);
  export const TEN_THOUSAND = BigInt.fromI32(10000);
  export const MILLION = BigInt.fromI32(1000000);
  export const MAX = BigInt.fromString(
    "115792089237316195423570985008687907853269984665640564039457584007913129639935"
  );
}

export namespace BIG_DECIMAL {
  export const NEG_ONE = new BigDecimal(BIGINT.NEG_ONE);
  export const ZERO = new BigDecimal(BIGINT.ZERO);
  export const ONE = new BigDecimal(BIGINT.ONE);
  export const TWO = new BigDecimal(BIGINT.TWO);
  export const TEN = new BigDecimal(BIGINT.TEN);
  export const HUNDRED = new BigDecimal(BIGINT.HUNDRED);
  export const _192 = new BigDecimal(BIGINT._192);
  export const TEN_THOUSAND = new BigDecimal(BIGINT.TEN_THOUSAND);
  export const MILLION = new BigDecimal(BIGINT.MILLION);
}

////////////////////////
///// Schema Enums /////
////////////////////////

// The network names corresponding to the Network enum in the schema.
// They also correspond to the ones in `dataSource.network()` after converting to lower case.
// See below for a complete list:
// https://thegraph.com/docs/en/hosted-service/what-is-hosted-service/#supported-networks-on-the-hosted-service
export namespace NetworkSchemaName {
  export const ARBITRUM_ONE = "ARBITRUM_ONE";
  export const AVALANCHE = "AVALANCHE";
  export const AURORA = "AURORA";
  export const BSC = "BSC"; // aka BNB Chain
  export const CELO = "CELO";
  export const MAINNET = "MAINNET"; // Ethereum mainnet
  export const FANTOM = "FANTOM";
  export const FUSE = "FUSE";
  export const MOONBEAM = "MOONBEAM";
  export const MOONRIVER = "MOONRIVER";
  export const NEAR_MAINNET = "NEAR_MAINNET";
  export const OPTIMISM = "OPTIMISM";
  export const MATIC = "MATIC"; // aka Polygon
  export const XDAI = "XDAI"; // aka Gnosis Chain
}
export namespace NetworkName {
  export const ARBITRUM_ONE = "arbitrum-one";
  export const AVALANCHE = "avalanche";
  export const AURORA = "aurora";
  export const BSC = "bsc";
  export const CELO = "celo";
  export const MAINNET = "mainnet";
  export const FANTOM = "fantom";
  export const FUSE = "fuse";
  export const MOONBEAM = "Moonbeam";
  export const MOONRIVER = "moonriver";
  export const NEAR_MAINNET = "near";
  export const OPTIMISM = "optimism";
  export const MATIC = "matic";
  export const XDAI = "xdai";
}

export namespace ProtocolType {
  export const EXCHANGE = "EXCHANGE";
  export const LENDING = "LENDING";
  export const YIELD = "YIELD";
  export const BRIDGE = "BRIDGE";
  export const GENERIC = "GENERIC";
}

export namespace VaultFeeType {
  export const MANAGEMENT_FEE = "MANAGEMENT_FEE";
  export const PERFORMANCE_FEE = "PERFORMANCE_FEE";
  export const DEPOSIT_FEE = "DEPOSIT_FEE";
  export const WITHDRAWAL_FEE = "WITHDRAWAL_FEE";
}

export namespace LiquidityPoolFeeType {
  export const FIXED_TRADING_FEE = "FIXED_TRADING_FEE";
  export const TIERED_TRADING_FEE = "TIERED_TRADING_FEE";
  export const DYNAMIC_TRADING_FEE = "DYNAMIC_TRADING_FEE";
  export const FIXED_LP_FEE = "FIXED_LP_FEE";
  export const DYNAMIC_LP_FEE = "DYNAMIC_LP_FEE";
  export const FIXED_PROTOCOL_FEE = "FIXED_PROTOCOL_FEE";
  export const DYNAMIC_PROTOCOL_FEE = "DYNAMIC_PROTOCOL_FEE";
}

export namespace HelperStoreType {
  export const NATIVE_TOKEN = "NATIVE_TOKEN";
  export const USERS = "USERS";
  // Pool addresses are also stored in the HelperStore
}

export namespace UsageType {
  export const DEPOSIT = "DEPOSIT";
  export const WITHDRAW = "WITHDRAW";
  export const SWAP = "SWAP";
}

export namespace FeeSwitch {
  export const ON = "ON";
  export const OFF = "OFF";
  // Pool addresses are also stored in the HelperStore
}

export namespace RewardIntervalType {
  export const BLOCK = "BLOCK";
  export const TIMESTAMP = "TIMESTAMP";
  export const NONE = "NONE";
}

export namespace AirTokenStandardType {
  export const ERC1155 = "ERC1155";
  export const ERC721 = "ERC721";
  export const ERC20 = "ERC20";
}

export namespace AirInterfaceId {
  export const EIP1155: string = "0xd9b67a26";
  export const EIP721: string = "0x80ac58cd";
  export const EIP165: string = "0x01ffc9a7";
  export const Null: string = "0x00000000";
}

export namespace AirProtocolType {
  export const GENERIC = "GENERIC";
  export const EXCHANGE = "EXCHANGE";
  export const LENDING = "LENDING";
  export const YIELD = "YIELD";
  export const BRIDGE = "BRIDGE";
  export const DAO = "DAO";
  export const NFT_MARKET_PLACE = "NFT_MARKET_PLACE";
  export const STAKING = "STAKING";
  export const P2E = "P2E";
  export const LAUNCHPAD = "LAUNCHPAD";
}

export namespace AirProtocolActionType {
  // ### NFT Marketplace/Tokens ###;
  export const BUY = "BUY";
  export const SELL = "SELL";
  export const MINT = "MINT";
  export const BURN = "BURN";
  // ### NFT (ex: Poap) ###;
  export const ATTEND = "ATTEND";
  // ### P2E (NFT + Utility) ###;
  export const EARN = "EARN";
  // ### DEX ###;
  export const SWAP = "SWAP";
  export const ADD_LIQUIDITY = "ADD_LIQUIDITY";
  export const REMOVE_LIQUIDITY = "REMOVE_LIQUIDITY";
  export const ADD_TO_FARM = "ADD_TO_FARM";
  export const REMOVE_FROM_FARM = "REMOVE_FROM_FARM";
  export const CLAIM_FARM_REWARD = "CLAIM_FARM_REWARD";
  // ### Lending ###;
  export const LEND = "LEND";
  export const BORROW = "BORROW";
  export const FLASH_LOAN = "FLASH_LOAN";
  // ### Staking / Delegating ###;
  export const STAKE = "STAKE";
  export const RESTAKE = "RESTAKE";
  export const UNSTAKE = "UNSTAKE";
  export const DELEGATE = "DELEGATE";
  export const CLAIM_REWARDS = "CLAIM_REWARDS";
}

export namespace AirTokenUsageType {
  export const GENERIC = "GENERIC";
  export const LP = "LP";
  export const REWARD = "REWARD";
  export const STAKE = "STAKE";
  export const MINT = "MINT";
}
