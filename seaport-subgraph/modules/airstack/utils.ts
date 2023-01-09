import {
    BigInt,
} from "@graphprotocol/graph-ts";

export const AIR_NFT_SALE_ENTITY_ID = "AIR_NFT_SALE_TRANSACTION_COUNTER";
export const AIR_META_ID = "AIR_META";

export const BIGINT_ONE = BigInt.fromI32(1);
export const SUBGRAPH_VERSION = "1.0.0";



export function processNetwork(network: string): string{
    return network.trim().toUpperCase().replace("-", "_");
}
export const SUBGRAPH_NAME = "Opensea Seaport";
export const SUBGRAPH_SLUG = "opensea-seaport";
