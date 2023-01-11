import {
    BigInt,
    TypedMap
} from "@graphprotocol/graph-ts";

export const AIR_NFT_SALE_ENTITY_ID = "AIR_NFT_SALE_TRANSACTION_COUNTER";
export const AIR_META_ID = "AIR_META";

export const BIGINT_ONE = BigInt.fromI32(1);
export const SUBGRAPH_VERSION = "1.0.0";
export const SUBGRAPH_NAME = "AIRSTACK-SUBGRAPH";
export const SUBGRAPH_SLUG = "AIRSTACK-SUBGRAPH";

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

export function processNetwork(network: string): string{
    const value = AIR_NETWORK_MAP.get(network);
    const result: string = value !== null ? value : "unknown";
    return result;
}