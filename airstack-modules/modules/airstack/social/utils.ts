import { Address } from "@graphprotocol/graph-ts";
import {
  AirExtra,
} from "../../../generated/schema";

export namespace AirProtocolType {
  export const SOCIAL = "SOCIAL";
}

export namespace AirProtocolActionType {
  export const SOCIAL_REGISTRATION = "SOCIAL_REGISTRATION";
  export const SOCIAL_PROFILE_OWNERSHIP_CHANGE = "SOCIAL_PROFILE_OWNERSHIP_CHANGE";
  export const SOCIAL_USER_OWNERSHIP_CHANGE = "SOCIAL_USER_OWNERSHIP_CHANGE";
  export const SOCIAL_PROFILE_NAME_RENEWAL = "SOCIAL_PROFILE_NAME_RENEWAL";
  export const SOCIAL_PROFILE_RECOVERY_ADDRESS_CHANGE = "SOCIAL_PROFILE_RECOVERY_ADDRESS_CHANGE";
  export const SOCIAL_USER_HOME_URL_CHANGE = "SOCIAL_USER_HOME_URL_CHANGE";
  export const SOCIAL_USER_RECOVERY_ADDRESS_CHANGE = "SOCIAL_USER_RECOVERY_ADDRESS_CHANGE";
}

export const AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER_ID = "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER";
export const AIR_PROFILE_OWNERSHIP_CHANGE_TRANSACTION_ENTITY_COUNTER_ID = "AIR_PROFILE_OWNERSHIP_CHANGE_TRANSACTION_ENTITY_COUNTER";
export const AIR_USER_OWNERSHIP_CHANGE_TRANSACTION_ENTITY_COUNTER_ID = "AIR_USER_OWNERSHIP_CHANGE_TRANSACTION_ENTITY_COUNTER";
export const AIR_PROFILE_RECOVERY_ADDRESS_CHANGE_TRANSACTION_ENTITY_COUNTER_ID = "AIR_PROFILE_RECOVERY_ADDRESS_CHANGE_TRANSACTION_ENTITY_COUNTER";
export const AIR_USER_RECOVERY_ADDRESS_CHANGE_TRANSACTION_ENTITY_COUNTER_ID = "AIR_USER_RECOVERY_ADDRESS_CHANGE_TRANSACTION_ENTITY_COUNTER";
export const AIR_USER_HOME_URL_CHANGE_TRANSACTION_ENTITY_COUNTER_ID = "AIR_USER_HOME_URL_CHANGE_TRANSACTION_ENTITY_COUNTER";
export const AIR_PROFILE_NAME_RENEWAL_TRANSACTION_ENTITY_COUNTER_ID = "AIR_PROFILE_NAME_RENEWAL_TRANSACTION_ENTITY_COUNTER";

export const AIR_SOCIAL_USER_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID = "AIR_SOCIAL_USER_ENTITY_LAST_UPDATED_INDEX_COUNTER";
export const AIR_SOCIAL_PROFILE_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID = "AIR_SOCIAL_PROFILE_ENTITY_LAST_UPDATED_INDEX_COUNTER";

export const profileRecoveryAddress = "profileRecoveryAddress";
export const userRecoveryAddress = "userRecoveryAddress";
export const userHomeUrl = "userHomeUrl";
export const profileTokenUri = "profileTokenUri";
export const zeroAddress = Address.fromString("0x0000000000000000000000000000000000000000");

export function createSocialUserEntityId(chainId: string, socialUserId: string): string {
  return chainId.concat("-").concat(socialUserId);
}

/**
 * @dev this function creates an air extra entity
 * @param name air extra name
 * @param value air extra value
 * @param parentId air extra parent entity id
 * @returns air extra entity
 */
export function createAirExtra(
  name: string,
  value: string,
  parentId: string,
): AirExtra {
  const id = parentId.concat("-").concat(name);
  let entity = AirExtra.load(id);
  if (entity == null) {
    entity = new AirExtra(id);
    entity.name = name;
    entity.value = value;
  }
  entity.save();
  return entity as AirExtra;
}