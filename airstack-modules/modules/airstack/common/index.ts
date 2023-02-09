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
} from "../../../generated/schema";

export const AIR_META_ID = "AIR_META";

export const EMPTY_STRING = "";
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIG_INT_ZERO = BigInt.fromI32(0);

export const SUBGRAPH_SCHEMA_VERSION = "1.0.0";

export const SUBGRAPH_NAME = "AIRSTACK_SUBGRAPH";
export const SUBGRAPH_VERSION = "AIRSTACK_SUBGRAPH";
export const SUBGRAPH_SLUG = "AIRSTACK_SUBGRAPH";

const AIR_NETWORK_MAP = new TypedMap<string, string>();
AIR_NETWORK_MAP.set("arbitrum-one", "ARBITRUM_ONE");
AIR_NETWORK_MAP.set("arweave-mainnet", "ARWEAVE_MAINNET");
AIR_NETWORK_MAP.set("aurora", "AURORA");
AIR_NETWORK_MAP.set("avalanche", "AVALANCHE");
AIR_NETWORK_MAP.set("boba", "BOBA");
AIR_NETWORK_MAP.set("bsc", "BSC");
AIR_NETWORK_MAP.set("celo", "CELO");
AIR_NETWORK_MAP.set("COSMOS", "COSMOS");
AIR_NETWORK_MAP.set("CRONOS", "CRONOS");
AIR_NETWORK_MAP.set("mainnet", "MAINNET");
AIR_NETWORK_MAP.set("fantom", "FANTOM");
AIR_NETWORK_MAP.set("fuse", "FUSE");
AIR_NETWORK_MAP.set("harmony", "HARMONY");
AIR_NETWORK_MAP.set("juno", "JUNO");
AIR_NETWORK_MAP.set("moonbeam", "MOONBEAM");
AIR_NETWORK_MAP.set("moonriver", "MOONRIVER");
AIR_NETWORK_MAP.set("near-mainnet", "NEAR_MAINNET");
AIR_NETWORK_MAP.set("optimism", "OPTIMISM");
AIR_NETWORK_MAP.set("osmosis", "OSMOSIS");
AIR_NETWORK_MAP.set("matic", "MATIC");
AIR_NETWORK_MAP.set("xdai", "XDAI");

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

export function processNetwork(network: string): string {
  const value = AIR_NETWORK_MAP.get(network);
  const result: string = value !== null ? value : "unknown";
  return result;
}

export function processChainId(): string {
  let network = dataSource.network();
  const value = AIR_CHAIN_ID_MAP.get(network);
  const result: string = value !== null ? value : "unknown";
  return result;
}

//air entity funcitons

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
    meta.network = processNetwork(dataSource.network());
    meta.schemaVersion = SUBGRAPH_SCHEMA_VERSION;
    meta.version = SUBGRAPH_VERSION;
    meta.slug = slug;
    meta.name = name;
    meta.save();
  }
}

/**
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
  let id = chainId.concat("-").concat(blockHeight.toString());

  let block = AirBlock.load(id);
  if (block == null) {
    block = new AirBlock(id);
    block.hash = blockHash;
    block.number = blockHeight;
    block.timestamp = blockTimestamp
    block.save()
  }
  return block as AirBlock;
}

/**
 * @dev this function gets or creates a new air account entity
 * @param chainId chain id
 * @param address account address
 * @param block air block object
 * @returns AirAccount entity
 */
export function getOrCreateAirAccount(chainId: string, address: string, block: AirBlock): AirAccount {
  let id = chainId.concat("-").concat(address);
  let entity = AirAccount.load(id);
  if (entity == null) {
    entity = new AirAccount(id);
    entity.address = address;
    entity.createdAt = block.id;
  }
  return entity as AirAccount;
}
