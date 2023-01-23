import {
    BigInt,
    ByteArray,
    TypedMap
} from "@graphprotocol/graph-ts";

export const AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID = "AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER";
export const AIR_DOMAIN_TRANSFER_ENTITY_COUNTER_ID = "AIR_DOMAIN_TRANSFER_ENTITY_COUNTER";
export const AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER_ID = "AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER";
export const AIR_DOMAIN_NEW_TTL_TRANSACTION_COUNTER_ID = "AIR_DOMAIN_NEW_TTL_TRANSACTION_COUNTER";
export const AIR_NAME_REGISTERED_TRANSACTION_COUNTER_ID = "AIR_NAME_REGISTERED_TRANSACTION_COUNTER";
export const AIR_NAME_RENEWED_TRANSACTION_COUNTER_ID = "AIR_NAME_RENEWED_TRANSACTION_COUNTER";
export const AIR_META_ID = "AIR_META";
export const ETHEREUM_MAINNET_ID = "1";

export const EMPTY_STRING = "";
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIG_INT_ZERO = BigInt.fromI32(0);
export const ROOT_NODE = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const SUBGRAPH_SCHEMA_VERSION = "1.0.0";
export const SUBGRAPH_NAME = "AIRSTACK-SUBGRAPH";
export const SUBGRAPH_VERSION = "AIRSTACK-SUBGRAPH";
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

export function processNetwork(network: string): string {
    const value = AIR_NETWORK_MAP.get(network);
    const result: string = value !== null ? value : "unknown";
    return result;
}

export function byteArrayFromHex(s: string): ByteArray {
    if (s.length % 2 !== 0) {
        throw new TypeError("Hex string must have an even number of characters")
    }
    let out = new Uint8Array(s.length / 2)
    for (var i = 0; i < s.length; i += 2) {
        out[i / 2] = parseInt(s.substring(i, i + 2), 16) as u32
    }
    return changetype<ByteArray>(out)
}

export function uint256ToByteArray(i: BigInt): ByteArray {
    let hex = i.toHex().slice(2).padStart(64, '0')
    return byteArrayFromHex(hex)
}

export function expiryDateToBlockNumber(expiryDate: BigInt): BigInt {
    return expiryDate.div(BigInt.fromI32(15))
}