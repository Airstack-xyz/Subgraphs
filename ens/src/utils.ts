import {
  DomainVsIsMigratedMapping,
  ReverseRegistrar,
  NameRegisteredTransactionVsRegistrant,
  AirBlock,
} from "../generated/schema";
import {
  Bytes,
  crypto,
  ethereum,
  ByteArray,
  BigInt,
  log,
} from "@graphprotocol/graph-ts";

// ens constants
export const TOKEN_ADDRESS_ENS = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";

/**
 * @dev this function creates a new DomainVsIsMigratedMapping entity
 * @param domaiId air domain entity id
 * @param chainId chain id
 * @param blockId air block id
 * @param isMigrated is migrated flag - only required when creating a new entity
 * @returns DomainVsIsMigratedMapping entity
*/
export function createIsMigratedMapping(domainId: string, chainId: string, blockId: string, isMigrated: boolean = false): DomainVsIsMigratedMapping {
  let entity = DomainVsIsMigratedMapping.load(domainId);
  if (entity == null) {
    entity = new DomainVsIsMigratedMapping(domainId);
  }
  entity.isMigrated = isMigrated;
  entity.lastUpdatedAt = blockId;
  return entity as DomainVsIsMigratedMapping;
}

/**
 * @dev this function creates subnode of the node and returns it as air domain entity id
 * @param node takes the node param from the event
 * @param label takes the label param from the event
 * @returns returns a air domain entity id
 */
export function createAirDomainEntityId(node: Bytes, label: Bytes): string {
  return crypto.keccak256(node.concat(label)).toHexString()
}

/**
 * @dev this function creates a new reverse registrar entity if it does not exist
 * @param name ens name, ex: 'schiller.eth'
 * @param domainId air domain id
 * @param block air block entity
 * @returns ReverseRegistrar entity
 */
export function createReverseRegistrar(
  name: string,
  domainId: string,
  chainId: string,
  block: ethereum.Block,
): ReverseRegistrar {
  let id = crypto.keccak256(Bytes.fromUTF8(name)).toHexString();
  let entity = ReverseRegistrar.load(id);
  if (entity == null) {
    entity = new ReverseRegistrar(id);
    entity.name = name;
    entity.domain = domainId;
    entity.createdAt = chainId.concat("-").concat(block.number.toString());
    entity.save();
  }
  return entity as ReverseRegistrar;
}

/**
 * @dev this function creates a new NameRegisteredTransactionVsRegistrant entity
 * @param transactionHash transaction hash
 * @param block air block entity
 * @param id domainId-transactionHash
 * @param tokenId transferred token id
 * @param oldRegistrantId name registered txn old registrant id
 * @param newRegistrantId name registered txn new registrant id
 * @returns NameRegisteredTransactionVsRegistrant entity
 */
export function createNameRegisteredTransactionVsRegistrant(
  transactionHash: string,
  block: AirBlock,
  id: string,
  tokenId: string,
  oldRegistrantId: string,
  newRegistrantId: string,
): NameRegisteredTransactionVsRegistrant {
  let entity = NameRegisteredTransactionVsRegistrant.load(id);
  if (entity == null) {
    entity = new NameRegisteredTransactionVsRegistrant(id);
    entity.oldRegistrant = oldRegistrantId;
    entity.newRegistrant = newRegistrantId;
    entity.transactionHash = transactionHash;
    entity.tokenId = tokenId;
    entity.createdAt = block.id;
    entity.save();
  }
  return entity as NameRegisteredTransactionVsRegistrant;
}

// specific to ens
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

/**
 * @dev this function is used to check if the label is valid to prevent homoglyph attacks (which ens is prone to)
 * @param name ens label name
 * @param txHash transaction hash
 * @returns boolean - true if label is valid
 */
export function checkValidLabel(name: string, txHash: string): boolean {
  for (let i = 0; i < name.length; i++) {
    let c = name.charCodeAt(i);
    if (c === 0) {
      log.warning("Invalid label '{}' contained null byte. Skipping. txhash {}", [name, txHash]);
      return false;
    } else if (c === 46) {
      log.warning("Invalid label '{}' contained separator char '.'. Skipping. txhash {}", [name, txHash]);
      return false;
    }
  }
  return true;
}