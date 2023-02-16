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