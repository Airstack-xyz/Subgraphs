import {
  BigInt,
  ByteArray,
} from "@graphprotocol/graph-ts";

export const AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID = "AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER";
export const AIR_DOMAIN_TRANSFER_ENTITY_COUNTER_ID = "AIR_DOMAIN_TRANSFER_ENTITY_COUNTER";
export const AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER_ID = "AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER";
export const AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER_ID = "AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER";
export const AIR_NAME_REGISTERED_ENTITY_COUNTER_ID = "AIR_NAME_REGISTERED_ENTITY_COUNTER";
export const AIR_NAME_RENEWED_ENTITY_COUNTER_ID = "AIR_NAME_RENEWED_ENTITY_COUNTER";
export const AIR_ADDR_CHANGED_ENTITY_COUNTER_ID = "AIR_ADDR_CHANGED_ENTITY_COUNTER";

export const AIR_META_ID = "AIR_META";
export const ETHEREUM_MAINNET_ID = "1";

export const ROOT_NODE = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

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