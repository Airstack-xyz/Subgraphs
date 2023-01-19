import {
  Address,
  BigInt,
  dataSource,
  Bytes,
  crypto,
  ByteArray,
} from "@graphprotocol/graph-ts";

import {
  AirAccount,
  AirEntityCounter,
  AirToken,
  AirBlock,
  AirMeta,
  AirDomain,
  AirDomainOwnerChangedTransaction
} from "../../generated/schema";

import { AIR_META_ID, AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID, BIGINT_ONE, SUBGRAPH_SCHEMA_VERSION, SUBGRAPH_VERSION, SUBGRAPH_NAME, SUBGRAPH_SLUG, processNetwork, BIG_INT_ZERO, ROOT_NODE, ZERO_ADDRESS } from "./utils";

export namespace domain {
  /**
   * @dev This function tracks a domain owner change transaction
   * @param blockHeight block number in the chain
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param logIndex txn log index
   * @param chainId chain id
   * @param previousOwner specifies the previous owner of the domain
   * @param newOwner specifies the new owner of the domain
   * @param transactionHash transaction hash
   * @param tokenId token id
   * @param domain specifies the domain object linked with the owner change transaction
   */
  export function trackDomainOwnerChangedTransaction(
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    logIndex: BigInt,
    chainId: string,
    previousOwner: string,
    newOwner: string,
    transactionHash: Bytes,
    tokenId: string,
    domain: AirDomain,
  ): void {
    // id: ID! - done
    // previousOwner: AirAccount! # - NA - done
    // newOwner: AirAccount! # - owner - done
    // blockNumber: AirBlock! - done
    // transactionHash: String! - done - done
    // tokenId: String! # dec(labelhash)  # - NA - done
    // domain: Domain! - done
    // index: BigInt! # - NA - done
    let id = createEntityId(transactionHash, blockHeight, logIndex);
    let entity = AirDomainOwnerChangedTransaction.load(id);
    if (entity == null) {
      entity = new AirDomainOwnerChangedTransaction(id);
      entity.previousOwner = previousOwner;
      entity.newOwner = newOwner;
      entity.transactionHash = transactionHash.toHex();
      entity.tokenId = tokenId;
      entity.domain = domain.id;
      let airBlock = getOrCreateAirBlock(
        chainId,
        blockHeight,
        blockHash,
        blockTimestamp,
      )
      entity.block = airBlock.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID, airBlock);
      entity.save();
    }
  }

  /**
   * @dev this function creates ids for entities
   * @param transactionHash transaction hash
   * @param blockHeight block number in the chain
   * @param logIndex txn log index
   * @returns entity id in string format
   */
  export function createEntityId(transactionHash: Bytes, blockHeight: BigInt, logIndex: BigInt): string {
    return transactionHash.toHex().concat("-").concat(blockHeight.toString()).concat('-').concat(logIndex.toString());
  }

  /**
   * @dev this function creates subnode of the node and returns it as air domain entity id
   * @param node takes the node param from the event
   * @param label takes the label param from the event
   * @returns returns a air domain entity id
   */
  export function createAirDomainEntityId(node: Bytes, label: Bytes): string {
    let subnode = makeSubnode(node, label);
    return subnode;
  }

  /**
   * @dev this function creates subnode of the node and label
   * @param node takes the node param from the event
   * @param label takes the label param from the event
   * @returns returns a subnode in hex string format
   */
  function makeSubnode(node: Bytes, label: Bytes): string {
    return crypto.keccak256(node.concat(label)).toHexString()
  }

  /**
   * @dev this function gets or creates a new air domain entity
   * @param domain Domain class object
   * @returns AirDomain entity
   */
  export function getOrCreateAirDomain(
    domain: Domain,
  ): AirDomain {
    // type AirDomain @entity {
    //     id: ID!                                               # The namehash of the name
    //     name: String                                          # The human readable name, if known.Unknown portions replaced with hash in square brackets(eg, foo.[1234].eth)
    //     labelName: String                                     # The human readable label name(imported from CSV), if known
    //     labelhash: Bytes                                      # keccak256(labelName)
    //     tokenId: String!                                      # dec(labelHash)
    //     parent: AirDomain                                        # The namehash(id) of the parent name
    //     subdomains: [AirDomain!]! @derivedFrom(field: "parent")  # Can count domains from length of array
    //     subdomainCount: Int!                                  # The number of subdomains
    //     resolvedAddress: AirAccount                           # Address logged from current resolver, if any
    //     owner: AirAccount!
    //     # resolver: Resolver
    //     ttl: BigInt
    //     isPrimary: Boolean! # - NA
    //     createdAt: AirBlock!
    //     lastBlock: AirBlock! # - NA
    //   }
    let id = createAirDomainEntityId(domain.node, domain.label);
    let entity = AirDomain.load(id);
    if (entity == null) {
      entity = new AirDomain(id);
      if (domain.name) {
        entity.name = domain.name;
      }
      if (domain.labelName) {
        entity.labelName = domain.labelName;
      }
      if (domain.labelhash) {
        entity.labelhash = domain.labelhash;
      }
      if (domain.tokenId) {
        entity.tokenId = domain.tokenId;
      }
      if (domain.parent) {
        entity.parent = domain.parent.id;
      }
      if (domain.subdomainCount) {
        entity.subdomainCount = domain.subdomainCount.toI32();
      }
      if (domain.resolvedAddress && domain.chainId) {
        entity.resolvedAddress = getOrCreateAirAccount(domain.chainId, domain.resolvedAddress).id;
      }
      if (domain.owner && domain.chainId) {
        entity.owner = getOrCreateAirAccount(domain.chainId, domain.owner).id;
      }
      if (domain.ttl) {
        entity.ttl = domain.ttl;
      }
      entity.isPrimary = domain.isPrimary;
      if (domain.block) {
        entity.createdAt = domain.block.id;
      }
      if (domain.lastBlock) {
        entity.lastBlock = domain.lastBlock.id;
      }
      entity.save();
    }
    return entity as AirDomain;
  }

  /**
   * @dev this function gets or creates a new air domain owner changed transaction entity
   * @param blockHeight block number in the chain
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param logIndex txn log index 
   * @param chainId chain id
   * @param previousOwner specifies the previous owner of the domain
   * @param newOwner specifies the new owner of the domain
   * @param transactionHash transaction hash
   * @param tokenId token id
   * @param domain specifies the domain object linked with the owner change transaction 
   * @returns AirDomainOwnerChangedTransaction entity
   */
  export function getOrCreateAirDomainOwnerChangedTransaction(
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    logIndex: BigInt,
    chainId: string,
    previousOwner: Address,
    newOwner: Address,
    transactionHash: Bytes,
    tokenId: string,
    domain: AirDomain,
  ): AirDomainOwnerChangedTransaction {
    // id: ID! - done
    // previousOwner: AirAccount! # - NA - done
    // newOwner: AirAccount! # - owner - done
    // blockNumber: AirBlock! - done
    // transactionHash: String! - done - done
    // tokenId: String! # dec(labelhash)  # - NA - done 
    // domain: Domain! - done
    // index: BigInt! # - NA - done
    let id = createEntityId(transactionHash, blockHeight, logIndex);
    let entity = AirDomainOwnerChangedTransaction.load(id);
    if (entity == null) {
      entity = new AirDomainOwnerChangedTransaction(id);
      entity.previousOwner = previousOwner.toHex();
      entity.newOwner = newOwner.toHex();
      entity.transactionHash = transactionHash.toHex();
      entity.tokenId = tokenId;
      entity.domain = domain.id;
      let airBlock = getOrCreateAirBlock(
        chainId,
        blockHeight,
        blockHash,
        blockTimestamp,
      )
      entity.block = airBlock.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID, airBlock);
      entity.save();
    }
    return entity as AirDomainOwnerChangedTransaction;
  }

  /**
   * @dev this function updates air entity counter for a given entity id
   * @param id entity id for entity to be updated
   * @param block air block object
   * @returns updated entity count
   */
  export function updateAirEntityCounter(
    id: string,
    block: AirBlock,
  ): BigInt {
    let entity = AirEntityCounter.load(id);
    if (entity == null) {
      entity = new AirEntityCounter(id);
      entity.count = BIGINT_ONE;
      entity.createdAt = block.id;
      entity.lastUpdatedAt = block.id;
      createAirMeta(SUBGRAPH_SLUG, SUBGRAPH_NAME);
    } else {
      entity.count = entity.count.plus(BIGINT_ONE);
      entity.lastUpdatedAt = block.id;
    }
    entity.save();
    return entity.count;
  }

  /**
   * @dev this function creates air meta entity
   * @param slug subgraph slug
   * @param name subgraph name
   */
  export function createAirMeta(
    slug: string,
    name: string
    // should ideally have version also being passed from here
  ): void {
    let meta = AirMeta.load(AIR_META_ID);
    if (meta == null) {
      meta = new AirMeta(AIR_META_ID);
      meta.network = processNetwork(dataSource.network());
      meta.schemaVersion = SUBGRAPH_SCHEMA_VERSION;
      meta.version = SUBGRAPH_VERSION;
      meta.slug = slug;
      meta.name = name;
      meta.save();
    }
  }

  /**
   * @dev this function gets or creates a new air block entity
   * @param chainId chain id
   * @param blockHeight block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @returns AirBlock entity
   */
  export function getOrCreateAirBlock(
    chainId: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt
  ): AirBlock {
    let id = chainId.concat("-").concat(blockHeight.toString());

    let block = AirBlock.load(id);
    if (block == null) {
      block = new AirBlock(id);
      block.hash = blockHash;
      block.number = blockHeight;
      block.timestamp = blockTimestamp
      block.save()
    }
    return block as AirBlock;
  }

  /**
   * @dev this function gets or creates a new air token entity
   * @param chainID chain id
   * @param address token address
   * @returns AirToken entity
   */
  export function getOrCreateAirToken(chainID: string, address: string): AirToken {
    let entity = AirToken.load(chainID + "-" + address);
    if (entity == null) {
      entity = new AirToken(chainID + "-" + address);
      entity.address = address;
      entity.save();
    }
    return entity as AirToken;
  }

  /**
   * @dev this function gets or creates a new air account entity
   * @param chainID chain id
   * @param address account address
   * @returns AirAccount entity
   */
  export function getOrCreateAirAccount(chainID: string, address: string): AirAccount {
    let entity = AirAccount.load(chainID + "-" + address);
    if (entity == null) {
      entity = new AirAccount(chainID + "-" + address);
      entity.address = address;
    }
    return entity as AirAccount;
  }

  /**
   * @dev this class has all fields required to create a domain entity
   */
  export class Domain {
    constructor(
      public node: Bytes,
      public label: Bytes,
      public name: string = "",
      public labelName: string = "",
      public labelhash: Bytes = Bytes.fromHexString("0x"),
      public tokenId: string = "",
      public parent: AirDomain = new AirDomain(""),
      public subdomainCount: BigInt = BIG_INT_ZERO,
      public resolvedAddress: string = "",
      public owner: string = "",
      public ttl: BigInt = BIG_INT_ZERO,
      public isPrimary: boolean = false,
      public block: AirBlock = new AirBlock(""),
      public lastBlock: AirBlock = new AirBlock(""),
      public chainId: string = "",
    ) { }
  }

}