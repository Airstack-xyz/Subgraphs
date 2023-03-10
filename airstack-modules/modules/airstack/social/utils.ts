import {
  AirExtra,
} from "../../../generated/schema";

export namespace AirProtocolType {
  export const SOCIAL = "SOCIAL";
}

export namespace AirProtocolActionType {
  export const REGISTRATION = "REGISTRATION";
}

export const AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER_ID = "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER";

export function createUserEntityId(chainId: string, dappUserId: string): string {
  return chainId.concat("-").concat(dappUserId);
}


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