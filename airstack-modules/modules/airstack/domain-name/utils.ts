import {
  AirExtra,
} from "../../../generated/schema";

export const AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID = "AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER";
export const AIR_DOMAIN_TRANSFER_ENTITY_COUNTER_ID = "AIR_DOMAIN_TRANSFER_ENTITY_COUNTER";
export const AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER_ID = "AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER";
export const AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER_ID = "AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER";
export const AIR_NAME_REGISTERED_ENTITY_COUNTER_ID = "AIR_NAME_REGISTERED_ENTITY_COUNTER";
export const AIR_NAME_RENEWED_ENTITY_COUNTER_ID = "AIR_NAME_RENEWED_ENTITY_COUNTER";
export const AIR_ADDR_CHANGED_ENTITY_COUNTER_ID = "AIR_ADDR_CHANGED_ENTITY_COUNTER";
export const AIR_SET_PRIMARY_DOMAIN_ENTITY_COUNTER_ID = "AIR_SET_PRIMARY_DOMAIN_ENTITY_COUNTER";

export const AIR_META_ID = "AIR_META";
export const ETHEREUM_MAINNET_ID = "1";
export const AIR_EXTRA_TTL = 'ttl';

export const ROOT_NODE = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * @dev this function does not save the returned entity
 * @dev this function creates an air extra entity
 * @param name air extra name
 * @param value air extra value
 * @param extraId air extra entity id
 * @returns air extra entity
 */
export function createAirExtra(
  name: string,
  value: string,
  id: string,
): AirExtra {
  let entity = AirExtra.load(id);
  if (entity == null) {
    entity = new AirExtra(id);
    entity.name = name;
    entity.value = value;
  }
  return entity as AirExtra;
}