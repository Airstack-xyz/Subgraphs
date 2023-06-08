import {
  DomainVsIsMigratedMapping,
  ReverseRegistrar,
  NameRegisteredTransactionVsRegistrant,
  AirBlock,
  AirDomain,
  LabelhashToNameMapping,
} from "../generated/schema";
import {
  Bytes,
  crypto,
  ethereum,
  ByteArray,
  BigInt,
} from "@graphprotocol/graph-ts";
import * as airstack from "../modules/airstack/domain-name";
import {
  checkValidLabel, saveDomainEntity
} from "../modules/airstack/domain-name/utils";
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
export function getOrCreateIsMigratedMapping(domainId: string, chainId: string, blockId: string, isMigrated: boolean = false): DomainVsIsMigratedMapping {
  let entity = DomainVsIsMigratedMapping.load(domainId);
  if (entity == null) {
    entity = new DomainVsIsMigratedMapping(domainId);
    entity.isMigrated = isMigrated;
    entity.lastUpdatedAt = blockId;
  }
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

export function createLabelhashToNameMapping(labelhash: string, name: string, createdAt: string): void {
  let entity = LabelhashToNameMapping.load(labelhash);
  if (entity == null) {
    entity = new LabelhashToNameMapping(labelhash);
    entity.name = name;
    entity.createdAt = createdAt;
    entity.save();
  }
}

export function getNameByLabelHash(labelhash: string): string | null {
  let entity = LabelhashToNameMapping.load(labelhash);
  if (entity == null) {
    return null;
  }
  return entity.name;
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

export function decodeName(buf: Bytes, txHash: string): Array<string> | null {
  let offset = 0;
  let list = new ByteArray(0);
  let dot = Bytes.fromHexString("2e");
  let len = buf[offset++];
  let hex = buf.toHexString();
  let firstLabel = "";
  if (len === 0) {
    return [firstLabel, "."];
  }

  while (len) {
    let label = hex.slice((offset + 1) * 2, (offset + 1 + len) * 2);
    let labelBytes = Bytes.fromHexString(label);

    if (!checkValidLabel(labelBytes.toString(), txHash)) {
      return null;
    }

    if (offset > 1) {
      list = list.concat(dot);
    } else {
      firstLabel = labelBytes.toString();
    }
    list = list.concat(labelBytes);
    offset += len;
    len = buf[offset++];
  }
  return [firstLabel, list.toString()];
}

/**
 * @dev function to recursively update subdomain names for a given domain id
 */
export function updateSubdomainNames(parentDomain: AirDomain, block: AirBlock): void {
  let domainId = parentDomain.id;
  let subdomainIds = getSubdomainIds(domainId);
  // make sure parent domain does not have [hex] in it
  if (parentDomain.name != null) {
    let parentDomainName = parentDomain.name!
    if (!parentDomainName.includes("]") && !parentDomainName.includes("[")) {
      for (let i = 0; i < subdomainIds.length; i++) {
        let subdomainId = subdomainIds[i];
        let subdomainEntity = AirDomain.load(subdomainId);
        if (subdomainEntity != null) {
          if (subdomainEntity.name != null) {
            let subdomainEntityNameArray = subdomainEntity.name!.split(".")
            if (subdomainEntityNameArray.length >= 3) { // only allowing domains with format abc.[hex].eth
              // loop through subdomainEntityNameArray
              for (let i = 0; i < subdomainEntityNameArray.length; i++) {
                // only fix index one if it has [hex], assuming 'abc' is correct
                if (i == 1 && subdomainEntityNameArray[i].endsWith("]") || subdomainEntityNameArray[i].startsWith("[")) {
                  let updatedName = subdomainEntityNameArray[0].concat(".").concat(parentDomain.name!)
                  subdomainEntity.name = updatedName;
                }
              }
            }
            saveDomainEntity(subdomainEntity, block);
            updateSubdomainNames(subdomainEntity, block);
          }
        }
      }
    }
  }
}

/** 
 * @dev function to get a list of subdomains given a domain id
*/
export function getSubdomainIds(domainId: string): Array<string> {
  let subdomainIds = new Array<string>();
  let domain = airstack.domain.getAirDomain(domainId);
  if (domain != null && domain.subdomains != null) {
    return domain.subdomains!;
  }
  return subdomainIds;
}