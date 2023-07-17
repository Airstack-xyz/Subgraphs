import { log } from "@graphprotocol/graph-ts"
import { AirExtra, AirDomain, AirBlock } from "../../../generated/schema"
import { updateAirEntityCounter } from "../common/index"

export const AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID = "AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER"
export const AIR_DOMAIN_CHANGED_ID = "AIR_DOMAIN_CHANGED"
export const AIR_RESOLVER_CHANGED_ID = "AIR_RESOLVER_CHANGED"
export const AIR_DOMAIN_REGISTRATION_OR_RENEW_CHANGED_ID =
    "AIR_DOMAIN_REGISTRATION_OR_RENEW_CHANGED"
export const AIR_DOMAIN_TRANSFER_ENTITY_COUNTER_ID = "AIR_DOMAIN_TRANSFER_ENTITY_COUNTER"
export const AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER_ID = "AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER"
export const AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER_ID = "AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER"
export const AIR_NAME_REGISTERED_ENTITY_COUNTER_ID = "AIR_NAME_REGISTERED_ENTITY_COUNTER"
export const AIR_NAME_RENEWED_ENTITY_COUNTER_ID = "AIR_NAME_RENEWED_ENTITY_COUNTER"
export const AIR_ADDR_CHANGED_ENTITY_COUNTER_ID = "AIR_ADDR_CHANGED_ENTITY_COUNTER"
export const AIR_SET_PRIMARY_DOMAIN_ENTITY_COUNTER_ID = "AIR_SET_PRIMARY_DOMAIN_ENTITY_COUNTER"

export const AIR_DOMAIN_LAST_UPDATED_INDEX_ENTITY_COUNTER_ID =
    "AIR_DOMAIN_LAST_UPDATED_INDEX_ENTITY_COUNTER"

export const AIR_META_ID = "AIR_META"
export const ETHEREUM_MAINNET_ID = "1"
export const AIR_EXTRA_TTL = "ttl"

export const ROOT_NODE = "0x0000000000000000000000000000000000000000000000000000000000000000"
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

/**
 * @dev this function does not save the returned entity
 * @dev this function creates an air extra entity
 * @param name air extra name
 * @param value air extra value
 * @param extraId air extra entity id
 * @returns air extra entity
 */
export function createAirExtra(name: string, value: string, id: string): AirExtra {
    let entity = AirExtra.load(id)
    if (entity == null) {
        entity = new AirExtra(id)
        entity.name = name
        entity.value = value
    }
    return entity as AirExtra
}

//specific to ens
/**
 * @dev this function is used to check if the label is valid to prevent homoglyph attacks (which ens is prone to)
 * @param name ens label name
 * @param txHash transaction hash
 * @returns boolean - true if label is valid
 */
export function checkValidLabel(name: string, txHash: string): boolean {
    for (let i = 0; i < name.length; i++) {
        let c = name.charCodeAt(i)
        if (c === 0) {
            log.warning("Invalid label '{}' contained null byte. Skipping. txhash {}", [
                name,
                txHash,
            ])
            return false
        } else if (c === 46) {
            log.warning("Invalid label '{}' contained separator char '.'. Skipping. txhash {}", [
                name,
                txHash,
            ])
            return false
        }
    }
    return true
}

/**
 * @dev this function is used to save air domain entity and update the last updated index and block
 * @param domain air domain entity to be saved
 * @param airBlock air block entity
 */
export function saveDomainEntity(domain: AirDomain, airBlock: AirBlock): void {
    domain.lastUpdatedIndex = updateAirEntityCounter(
        AIR_DOMAIN_LAST_UPDATED_INDEX_ENTITY_COUNTER_ID,
        airBlock
    )
    domain.lastUpdatedBlock = airBlock.id
    domain.save()
}
