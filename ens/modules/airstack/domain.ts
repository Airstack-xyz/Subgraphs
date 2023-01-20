import {
  Address,
  BigInt,
  dataSource,
  Bytes,
  crypto,
  log,
} from "@graphprotocol/graph-ts";

import {
  AirAccount,
  AirEntityCounter,
  AirToken,
  AirBlock,
  AirMeta,
  AirDomain,
  AirDomainOwnerChangedTransaction,
  AirDomainTransferTransaction,
  AirResolver,
  AirDomainNewResolverTransaction,
} from "../../generated/schema";

import { AIR_META_ID, AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID, AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER_ID, AIR_DOMAIN_TRANSFER_ENTITY_COUNTER_ID, BIGINT_ONE, SUBGRAPH_SCHEMA_VERSION, SUBGRAPH_VERSION, SUBGRAPH_NAME, SUBGRAPH_SLUG, processNetwork, BIG_INT_ZERO, ROOT_NODE, ZERO_ADDRESS, EMPTY_STRING } from "./utils";

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
    let id = createEntityId(transactionHash, blockHeight, logIndex);
    let entity = AirDomainOwnerChangedTransaction.load(id);
    if (entity == null) {
      entity = new AirDomainOwnerChangedTransaction(id);
      entity.previousOwner = getOrCreateAirAccount(chainId, previousOwner).id;
      entity.newOwner = getOrCreateAirAccount(chainId, newOwner).id;
      entity.transactionHash = transactionHash.toHex();
      entity.tokenId = tokenId;
      entity.domain = domain.id;
      let airBlock = getOrCreateAirBlock(
        chainId,
        blockHeight,
        blockHash,
        blockTimestamp,
      );
      entity.block = airBlock.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID, airBlock);
      entity.save();
    }
  }

  /**
   * @dev This function tracks a domain transfer transaction
   * @param previousOwnerId previous domain owner id
   * @param newOwnerAddress new domain owner address
   * @param blockHeight block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param chainId chain id
   * @param logIndex event log index - used to create unique id
   * @param transactionHash transaction hash
   * @param domain air domain object
   */
  export function trackDomainTransferTransaction(
    previousOwnerId: string,
    newOwnerAddress: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    chainId: string,
    logIndex: BigInt,
    transactionHash: Bytes,
    domain: AirDomain,
  ): void {
    let id = createEntityId(transactionHash, blockHeight, logIndex);
    let entity = AirDomainTransferTransaction.load(id);
    if (entity == null) {
      entity = new AirDomainTransferTransaction(id);
      entity.from = previousOwnerId;
      entity.to = getOrCreateAirAccount(chainId, newOwnerAddress).id;
      let airBlock = getOrCreateAirBlock(
        chainId,
        blockHeight,
        blockHash,
        blockTimestamp,
      );
      entity.block = airBlock.id;
      entity.transactionHash = transactionHash.toHex();
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_TRANSFER_ENTITY_COUNTER_ID, airBlock);
      entity.save();
    }
  }

  export function trackDomainNewResolverTransaction(
    resolver: string,
    node: string,
    chainId: string,
    block: AirBlock,
    transactionHash: Bytes,
    logIndex: BigInt,
  ): void {
    // get domain
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block));
    // get previous resolver
    let previousResolverId = domain.resolver;
    // create new resolver
    let resolverEntity = getOrCreateAirResolver(domain, chainId, resolver);
    log.info("resolverEntity: {}", [resolverEntity.address])
    // update domain resolver
    domain.resolver = resolverEntity.id;
    // update domain resolved address
    if (resolverEntity.addr) {
      domain.resolvedAddress = resolverEntity.addr;
    }
    // do recursive domain delete
    domain.lastBlock = block.id;
    recurseDomainDelete(domain, chainId);
    domain.save();

    // create new resolver transaction
    getOrCreateAirDomainNewResolverTransaction(
      previousResolverId,
      resolverEntity.address,
      block,
      transactionHash,
      logIndex,
      domain,
    )
  }

  /**
   * @dev This function creates a resolver entity id
   * @param resolver domain resolver address
   * @param node domain node
   * @returns returns a resolver entity id
   */
  export function createResolverEntityId(resolver: string, node: string): string {
    return resolver.concat("-").concat(node);
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
   * @dev 
   * @param domain air domain entity
   * @param chainId chain id
   * @param resolver resolver contract address
   * @param addr content value of addr record
   * @returns 
   */
  export function getOrCreateAirResolver(
    domain: AirDomain,
    chainId: string,
    resolver: string,
    addr: string = "",
  ): AirResolver {
    let id = createResolverEntityId(resolver, domain.id);
    let entity = AirResolver.load(id);
    if (entity == null) {
      entity = new AirResolver(id);
      entity.address = getOrCreateAirAccount(chainId, resolver).id;
      entity.domain = domain.id;
    }
    if (addr != "") {
      entity.addr = getOrCreateAirAccount(chainId, addr).id;
    }
    entity.save();
    return entity as AirResolver;
  }

  export function getOrCreateAirDomainNewResolverTransaction(
    previousResolverId: string | null,
    newResolverId: string,
    block: AirBlock,
    transactionHash: Bytes,
    logIndex: BigInt,
    domain: AirDomain,
  ): AirDomainNewResolverTransaction {
    let id = createEntityId(transactionHash, block.number, logIndex);
    let entity = AirDomainNewResolverTransaction.load(id);
    if (entity == null) {
      entity = new AirDomainNewResolverTransaction(id);
      entity.previousResolver = previousResolverId;
      entity.newOwnerResolver = newResolverId;
      entity.block = block.id;
      entity.transactionHash = transactionHash.toHex();
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER_ID, block);
      entity.save();
    }
    return entity as AirDomainNewResolverTransaction;
  }

  /**
   * @dev this function gets or creates a new air domain entity
   * @param domain Domain class object
   * @returns AirDomain entity
   */
  export function getOrCreateAirDomain(
    domain: Domain,
  ): AirDomain {
    // return root domain if id is ROOT_NODE
    if (domain.id == ROOT_NODE) {
      return getOrCreateAirRootDomain(domain.block);
    }
    let entity = AirDomain.load(domain.id);
    if (entity == null) {
      entity = new AirDomain(domain.id);
      entity.subdomainCount = BIG_INT_ZERO;
      entity.isPrimary = domain.isPrimary;
      entity.createdAt = domain.block.id;
      entity.lastBlock = domain.block.id;
      if (domain.name != EMPTY_STRING) {
        entity.name = domain.name;
      }
      if (domain.labelName) {
        entity.labelName = domain.labelName;
      }
      if (domain.labelHash) {
        entity.labelhash = domain.labelHash;
        entity.tokenId = BigInt.fromUnsignedBytes(domain.labelHash).toString();
      }
      if (domain.parent) {
        entity.parent = domain.parent.id;
      }
      if (domain.resolver != EMPTY_STRING) {
        entity.resolver = domain.resolver;
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
    }
    entity.save();
    return entity as AirDomain;
  }

  /**
   * @dev this function gets or creates a new air root domain entity
   * @param block air block for current transaction
   * @returns root AirDomain entity
   */
  function getOrCreateAirRootDomain(block: AirBlock): AirDomain {
    let rootNode = AirDomain.load(ROOT_NODE);
    if (rootNode == null) {
      rootNode = new AirDomain(ROOT_NODE);
      rootNode.tokenId = ROOT_NODE;
      rootNode.subdomainCount = BIG_INT_ZERO;
      rootNode.owner = ZERO_ADDRESS;
      rootNode.isPrimary = false;
      rootNode.createdAt = block.id;
      rootNode.lastBlock = block.id;
    }
    return rootNode as AirDomain;
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
   * @dev this function deletes all subdomains of a given domain
   * @param domain air domain entity
   * @param chainId chain id
   * @returns parent domain id
   */
  export function recurseDomainDelete(domain: AirDomain, chainId: string): string | null {
    if (domain.owner == getOrCreateAirAccount(chainId, ZERO_ADDRESS).id && domain.subdomainCount == BIG_INT_ZERO) {
      const parentDomain = AirDomain.load(domain.parent!)
      if (parentDomain != null) {
        parentDomain.subdomainCount = parentDomain.subdomainCount.minus(BIGINT_ONE)
        parentDomain.save()
        return recurseDomainDelete(parentDomain, chainId)
      }
      return null
    }
    return domain.id
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
    if (address == EMPTY_STRING) {
      address = ZERO_ADDRESS;
    }
    let entity = AirAccount.load(chainID + "-" + address);
    if (entity == null) {
      entity = new AirAccount(chainID + "-" + address);
      entity.address = address;
      entity.save();
    }
    return entity as AirAccount;
  }

  /**
   * @dev this class has all fields required to create a domain entity
   */
  export class Domain {
    constructor(
      public id: string,
      public chainId: string,
      public block: AirBlock,
      public label: Bytes = Bytes.fromHexString(ZERO_ADDRESS),
      public name: string = EMPTY_STRING,
      public labelName: string = EMPTY_STRING,
      public labelHash: Bytes = Bytes.fromHexString(ZERO_ADDRESS),
      public parent: AirDomain = new AirDomain(ROOT_NODE),
      public subdomainCount: BigInt = BIG_INT_ZERO,
      public resolvedAddress: string = EMPTY_STRING,
      public owner: string = EMPTY_STRING,
      public ttl: BigInt = BIG_INT_ZERO,
      public isPrimary: boolean = false,
      public resolver: string = EMPTY_STRING,
    ) { }
  }
}