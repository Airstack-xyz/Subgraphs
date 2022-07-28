import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export namespace Network {
  export const ARBITRUM_ONE = "ARBITRUM_ONE";
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

export namespace CallbackType {
  export const ENTITY_ID = "ENTITY_ID";
}

export namespace AirTokenStandardType {
  export const ERC1155 = "ERC1155";
  export const ERC721 = "ERC721";
  export const ERC20 = "ERC20";
}

export const ERC1155InterfaceId: string = "0xd9b67a26";
export const ERC721InterfaceId: string = "0x80ac58cd";

export const DEFAULT_DECIMALS = 18;

export const INT_ZERO = 0 as i32;
export const INT_ONE = 1 as i32;

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_TWO = BigInt.fromI32(2);
export const BIGINT_TEN = BigInt.fromI32(10);

export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const BIGDECIMAL_ONE = new BigDecimal(BIGINT_ONE);
export const BIGDECIMAL_TWO = new BigDecimal(BIGINT_TWO);
export const BIGDECIMAL_TEN = new BigDecimal(BIGINT_TEN);
