import {
  BigInt,
  TypedMap,
  dataSource,
} from "@graphprotocol/graph-ts";
import {
  AirBlock,
  AirEntityCounter,
  AirMeta,
  AirAccount,
  AirToken,
} from "../../../generated/schema";

export const AIR_META_ID = "AIR_META";

export const EMPTY_STRING = "";
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIG_INT_ZERO = BigInt.fromI32(0);

export const SUBGRAPH_SCHEMA_VERSION = "1.0.0";

export const SUBGRAPH_NAME = "opensea";
export const SUBGRAPH_VERSION = "wyvern_exchange";
export const SUBGRAPH_SLUG = "opensea_wyvern_exchange";

const AIR_CHAIN_ID_MAP = new TypedMap<string, string>();
AIR_CHAIN_ID_MAP.set("arbitrum-one", "42161");
AIR_CHAIN_ID_MAP.set("arweave-mainnet", "174");
AIR_CHAIN_ID_MAP.set("aurora", "1313161554");
AIR_CHAIN_ID_MAP.set("avalanche", "43114");
AIR_CHAIN_ID_MAP.set("boba", "288");
AIR_CHAIN_ID_MAP.set("bsc", "56");
AIR_CHAIN_ID_MAP.set("celo", "42220");
AIR_CHAIN_ID_MAP.set("COSMOS", "cosmos");
AIR_CHAIN_ID_MAP.set("CRONOS", "25");
AIR_CHAIN_ID_MAP.set("mainnet", "1");
AIR_CHAIN_ID_MAP.set("goerli", "5");
AIR_CHAIN_ID_MAP.set("fantom", "250");
AIR_CHAIN_ID_MAP.set("fuse", "122");
AIR_CHAIN_ID_MAP.set("harmony", "1666600000");
AIR_CHAIN_ID_MAP.set("juno", "juno-1");
AIR_CHAIN_ID_MAP.set("moonbeam", "1284");
AIR_CHAIN_ID_MAP.set("moonriver", "1285");
AIR_CHAIN_ID_MAP.set("near-mainnet", "1313161554");
AIR_CHAIN_ID_MAP.set("optimism", "10");
AIR_CHAIN_ID_MAP.set("osmosis", "osmosis-1");
AIR_CHAIN_ID_MAP.set("matic", "137");
AIR_CHAIN_ID_MAP.set("xdai", "100");

export function getChainId(): string {
  const network = dataSource.network();
  const value = AIR_CHAIN_ID_MAP.get(network);
  if (value != null) {
    return value!;
  }
  throw new Error("Network not supported");
}

// common air entity functions

/**
 * @dev this function updates air entity counter for a given entity id
 * @param id entity id for entity to be updated
 * @param block air block object
 * @returns updated entity count
 */
export function updateAirEntityCounter(
  id: string,
  block: AirBlock,
): BigInt {
  let entity = AirEntityCounter.load(id);
  if (entity == null) {
    entity = new AirEntityCounter(id);
    entity.count = BIGINT_ONE;
    entity.createdAt = block.id;
    entity.lastUpdatedAt = block.id;
    createAirMeta(SUBGRAPH_SLUG, SUBGRAPH_NAME);
  } else {
    entity.count = entity.count.plus(BIGINT_ONE);
    entity.lastUpdatedAt = block.id;
  }
  entity.save();
  return entity.count as BigInt;
}

/**
 * @dev this function creates air meta entity
 * @param slug subgraph slug
 * @param name subgraph name
 */
export function createAirMeta(
  slug: string,
  name: string
  // should ideally have version also being passed from here
): void {
  let meta = AirMeta.load(AIR_META_ID);
  if (meta == null) {
    meta = new AirMeta(AIR_META_ID);
    meta.network = dataSource.network();
    meta.schemaVersion = SUBGRAPH_SCHEMA_VERSION;
    meta.version = SUBGRAPH_VERSION;
    meta.slug = slug;
    meta.name = name;
    meta.save();
  }
}

/**
 * @dev this function does not save the returned entity
 * @dev this function gets or creates a new air block entity
 * @param chainId chain id
 * @param blockHeight block number
 * @param blockHash block hash
 * @param blockTimestamp block timestamp
 * @returns AirBlock entity
 */
export function getOrCreateAirBlock(
  chainId: string,
  blockHeight: BigInt,
  blockHash: string,
  blockTimestamp: BigInt
): AirBlock {
  const id = chainId.concat("-").concat(blockHeight.toString());
  let block = AirBlock.load(id);
  if (block == null) {
    block = new AirBlock(id);
    block.hash = blockHash;
    block.number = blockHeight;
    block.timestamp = blockTimestamp
  }
  return block as AirBlock;
}

/**
 * @dev this function does not save the returned entity
 * @dev this function gets or creates a new air account entity
 * @param chainId chain id
 * @param address account address
 * @param block air block object
 * @returns AirAccount entity
 */
export function getOrCreateAirAccount(chainId: string, address: string, block: AirBlock): AirAccount {
  const id = chainId.concat("-").concat(address);
  let entity = AirAccount.load(id);
  if (entity == null) {
    entity = new AirAccount(id);
    entity.address = address;
    entity.createdAt = block.id;
  }
  return entity as AirAccount;
}

/**
 * @dev this function does not save the returned entity
 * @dev this function gets or creates a new air token entity
 * @param chainID chain id
 * @param address token address
 * @returns AirToken entity
 */
export function getOrCreateAirToken(chainID: string, address: string): AirToken {
  let entity = AirToken.load(chainID + "-" + address);
  if (entity == null) {
    entity = new AirToken(chainID + "-" + address);
    entity.address = address;
  }
  return entity as AirToken;
}