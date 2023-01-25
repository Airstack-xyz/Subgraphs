import {
  Address,
  BigInt,
  dataSource,
  Bytes,
  crypto,
  log,
  ByteArray,
  ens,
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
  AirDomainNewTTLTransaction,
  AirNameRegisteredTransaction,
  AirNameRenewedTransaction,
  AirAddrChanged,
} from "../../generated/schema";
import { uint256ToByteArray } from "./utils";
import { AIR_META_ID, AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID, AIR_ADDR_CHANGED_TRANSACTION_COUNTER_ID, AIR_NAME_RENEWED_TRANSACTION_COUNTER_ID, AIR_NAME_REGISTERED_TRANSACTION_COUNTER_ID, AIR_DOMAIN_NEW_TTL_TRANSACTION_COUNTER_ID, AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER_ID, AIR_DOMAIN_TRANSFER_ENTITY_COUNTER_ID, BIGINT_ONE, SUBGRAPH_SCHEMA_VERSION, SUBGRAPH_VERSION, SUBGRAPH_NAME, SUBGRAPH_SLUG, processNetwork, BIG_INT_ZERO, ROOT_NODE, ZERO_ADDRESS, EMPTY_STRING } from "./utils";

export namespace domain {
  /**
   * @dev This function tracks a domain owner change transaction
   * @param blockHeight block number in the chain
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param logIndex txn log index
   * @param chainId chain id
   * @param newOwner specifies the new owner of the domain
   * @param transactionHash transaction hash
   * @param isMigrated specifies if the domain is migrated
   * @param node specifies the node of the domain
   * @param label specifies the label of the domain
   * @param fromOldRegistry specifies if the event is from the old registry
   */
  export function trackDomainOwnerChangedTransaction(
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    logIndex: BigInt,
    chainId: string,
    newOwner: string,
    transactionHash: Bytes,
    isMigrated: boolean,
    node: Bytes,
    label: Bytes,
    fromOldRegistry: boolean,
  ): void {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domainId = createAirDomainEntityId(node, label);
    let domain = getOrCreateAirDomain(new Domain(domainId, chainId, block));
    if (fromOldRegistry && domain.isMigrated == true) {
      // this domain was migrated from the old registry, so we don't need to hanlde old registry event now
      return;
    }
    let previousOwnerId = domain.owner;
    let parent = getOrCreateAirDomain(new Domain(
      node.toHexString(),
      chainId,
      block,
    ));
    if (domain.parent == null && parent != null) {
      parent.subdomainCount = parent.subdomainCount.plus(BIGINT_ONE);
    }
    if (domain.name == null) {
      let labelName = ens.nameByHash(label.toHexString());
      if (labelName != null) {
        domain.labelName = labelName;
      }
      if (labelName === null) {
        labelName = '[' + label.toHexString().slice(2) + ']';
      }
      if (node.toHexString() == ROOT_NODE) {
        domain.name = labelName;
      } else {
        let name = parent.name;
        if (labelName && name) {
          domain.name = labelName + '.' + name;
        }
      }
    }
    let tokenId = BigInt.fromUnsignedBytes(label).toString();
    domain.owner = getOrCreateAirAccount(chainId, newOwner).id;
    domain.parent = parent.id;
    domain.labelhash = label;
    domain.isMigrated = isMigrated;
    domain.tokenId = tokenId;
    domain.lastBlock = block.id;
    recurseDomainDelete(domain, chainId, block);
    domain.save();

    getOrCreateAirDomainOwnerChangedTransaction(
      block,
      logIndex,
      chainId,
      previousOwnerId,
      newOwner,
      transactionHash,
      tokenId,
      domain,
    );
  }

  /**
   * @dev This function tracks a domain transfer transaction
   * @param node specifies the node of the domain
   * @param chainId chain id
   * @param newOwnerAddress specifies the new owner of the domain
   * @param blockHeight block number in the chain
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param logIndex txn log index
   * @param transactionHash transaction hash
   * @param fromOldRegistry specifies if the event is from the old registry
   */
  export function trackDomainTransferTransaction(
    node: string,
    chainId: string,
    newOwnerAddress: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    logIndex: BigInt,
    transactionHash: Bytes,
    fromOldRegistry: boolean,
  ): void {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block));
    if (fromOldRegistry && domain.isMigrated == true) {
      // this domain was migrated from the old registry, so we don't need to hanlde old registry event now
      return;
    }
    let previousOwnerId = domain.owner;
    if (previousOwnerId == null) {
      previousOwnerId = getOrCreateAirAccount(chainId, ZERO_ADDRESS).id;
    }
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

  /**
   * @dev This function tracks a new resolver transaction
   * @param resolver resolver contract address
   * @param node domain node
   * @param chainId chain id
   * @param blockHeight block number in the chain
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param transactionHash transaction hash
   * @param logIndex event log index
   * @param fromOldRegistry specifies if the event is from the old registry
   */
  export function trackDomainNewResolverTransaction(
    resolver: string,
    node: string,
    chainId: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    transactionHash: Bytes,
    logIndex: BigInt,
    fromOldRegistry: boolean,
  ): void {
    // get block
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    // get domain
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block));

    if (fromOldRegistry && node != ROOT_NODE && domain.isMigrated == true) {
      // this domain was migrated from the old registry, so we don't need to hanlde old registry event now
      return;
    }
    // get previous resolver
    let previousResolverId = domain.resolver;
    // create new resolver
    let resolverEntity = getOrCreateAirResolver(domain, chainId, resolver);
    // update domain resolver
    domain.resolver = resolverEntity.id;
    // update domain resolved address
    if (resolverEntity.addr) {
      domain.resolvedAddress = resolverEntity.addr;
    }
    // do recursive domain delete
    domain.lastBlock = block.id;
    recurseDomainDelete(domain, chainId, block);
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
   * @dev This function tracks a new TTL transaction
   * @param node domain node
   * @param newTTL new TTL
   * @param chainId chain id
   * @param blockHeight block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param logIndex event log index
   * @param transactionHash transaction hash
   * @param fromOldRegistry specifies if the event is from the old registry
   */
  export function trackDomainNewTTLTransaction(
    node: string,
    newTTL: BigInt,
    chainId: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    logIndex: BigInt,
    transactionHash: Bytes,
    fromOldRegistry: boolean,
  ): void {
    // get block
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    // get domain
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block));
    log.info("fromOldRegistry {} newttl {} blockNo {} domainId {} isMigrated {} txhash {}", [fromOldRegistry.toString(), newTTL.toString(), blockHeight.toString(), domain.id, domain.isMigrated.toString(), transactionHash.toHex()]);
    if (fromOldRegistry && domain.isMigrated == true) {
      // this domain was migrated from the old registry, so we don't need to hanlde old registry event now
      return;
    }
    // get previous ttl
    let oldTTL: BigInt | null = BIG_INT_ZERO;
    if (domain.ttl) {
      oldTTL = domain.ttl;
    }
    // update domain ttl
    domain.ttl = newTTL;
    domain.lastBlock = block.id;
    domain.save();
    log.info("saved domain for new ttl {} txnHash {} node {} domainId {}", [newTTL.toString(), transactionHash.toHex(), node, domain.id]);
    // create AirDomainNewTTLTransaction
    getOrCreateAirDomainNewTTLTransaction(
      transactionHash,
      block.number,
      logIndex,
      oldTTL,
      newTTL,
      block,
      domain,
    )
  }

  /**
   * @dev This function tracks a new name registered transaction
   * @param transactionHash transaction hash
   * @param blockHeight block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param logIndex event log index
   * @param chainId chain id
   * @param registrantAddress registrant address
   * @param expiryTimestamp domain expiry date
   * @param cost domain registration cost
   * @param paymentToken payment token address - can be null
   * @param labelId label id
   * @param rootNode root node bye array
   */
  export function trackNameRegisteredTransaction(
    transactionHash: Bytes,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    logIndex: BigInt,
    chainId: string,
    registrantAddress: string,
    expiryTimestamp: BigInt,
    cost: BigInt,
    paymentToken: string,
    labelId: BigInt,
    rootNode: ByteArray,
  ): void {
    // prep mapping data
    let label = uint256ToByteArray(labelId);
    let labelName = ens.nameByHash(label.toHexString());
    let domainId = crypto.keccak256(rootNode.concat(label)).toHex();
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domain = getOrCreateAirDomain(new Domain(
      domainId,
      chainId,
      block,
    ));

    if (labelName != null) {
      domain.labelName = labelName
    }
    domain.expiryTimestamp = expiryTimestamp;
    domain.lastBlock = block.id;
    domain.save();
    // create name registered transaction
    getOrCreateAirNameRegisteredTransaction(
      chainId,
      blockHeight,
      blockHash,
      blockTimestamp,
      transactionHash,
      logIndex,
      domain,
      cost,
      paymentToken,
      registrantAddress,
      expiryTimestamp,
    );
  }

  /**
   * @dev This function tracks a name renewal transaction
   * @param transactionHash transaction hash
   * @param blockHeight block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param chainId chain id
   * @param logIndex txn log index
   * @param cost cost of renewal
   * @param paymentToken payment token address - can be null
   * @param renewer renewer address
   * @param labelId label id
   * @param rootNode root node byte array
   * @param expiryTimestamp expiry date
   */
  export function trackNameRenewedTransaction(
    transactionHash: Bytes,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    chainId: string,
    logIndex: BigInt,
    cost: BigInt,
    paymentToken: string | null,
    renewer: string,
    labelId: BigInt,
    rootNode: ByteArray,
    expiryTimestamp: BigInt,
  ): void {
    let label = uint256ToByteArray(labelId);
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domainId = crypto.keccak256(rootNode.concat(label)).toHex();
    let domain = getOrCreateAirDomain(new Domain(
      domainId,
      chainId,
      block,
    ));
    domain.expiryTimestamp = expiryTimestamp;
    domain.lastBlock = block.id;
    domain.save();
    // create name renewed transaction
    getOrCreateAirNameRenewedTransaction(
      transactionHash,
      chainId,
      block,
      logIndex,
      domain,
      cost,
      paymentToken,
      renewer,
      expiryTimestamp,
    );
  }

  /**
   * @dev This function tracks set name preimage transaction
   * @param name domain name
   * @param label label hash
   * @param cost cost - still needs to be recorded
   * @param blockHeight block height
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param chainId chain id
   * @param rootNode root node ByteArray
   * @param fromRegistrationEvent true if called from a registration event
   */
  export function trackSetNamePreImage(
    name: string,
    label: Bytes,
    cost: BigInt,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    chainId: string,
    rootNode: ByteArray,
    fromRegistrationEvent: boolean,
  ): void {
    const labelHash = crypto.keccak256(ByteArray.fromUTF8(name));
    if (!labelHash.equals(label)) {
      log.warning(
        "Expected '{}' to hash to {}, but got {} instead. Skipping.",
        [name, labelHash.toHex(), label.toHex()]
      );
      return;
    }

    if (name.indexOf(".") !== -1) {
      log.warning("Invalid label '{}'. Skipping.", [name]);
      return;
    }
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domain = getOrCreateAirDomain(new Domain(
      crypto.keccak256(rootNode.concat(label)).toHex(),
      chainId,
      block
    ));

    // tracking registration cost in domain entity  - this is a temporary solution
    if (fromRegistrationEvent) {
      domain.registrationCost = cost;
      domain.lastBlock = block.id;
    }
    if (domain.labelName !== name) {
      domain.labelName = name
      domain.name = name + '.eth'
      domain.lastBlock = block.id;
    }
    domain.save();
  }

  /**
   * @dev This function tracks a addr changed transaction
   * @param chainId chain id
   * @param logIndex event log index
   * @param resolverAddress resolver contract address
   * @param addr new addr
   * @param node domain node
   * @param blockHeight block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param transactionHash transaction hash
   */
  export function trackAddrChangedTransaction(
    chainId: string,
    logIndex: BigInt,
    resolverAddress: string,
    addr: string,
    node: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    transactionHash: Bytes,
  ): void {
    let addrAccount = getOrCreateAirAccount(chainId, addr);
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block));
    let previousResolvedAddressId = domain.resolvedAddress;
    let resolver = getOrCreateAirResolver(domain, chainId, resolverAddress, addr);
    resolver.domain = domain.id;
    resolver.save()

    if (domain.resolver == resolver.id) {
      domain.resolvedAddress = addrAccount.id;
      domain.lastBlock = block.id;
      domain.save();
    }

    getOrCreateAirAddrChanged(
      chainId,
      logIndex,
      resolver,
      block,
      transactionHash,
      previousResolvedAddressId,
      addr,
      domain,
    );
  }

  /**
   * @dev This function tracks a resolver version change
   * @param chainId chaind id
   * @param blockHeight block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param node domain node
   * @param resolverAddress resolver contract address
   */
  export function trackResolverVersionChange(
    chainId: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    node: string,
    resolverAddress: string,
  ): void {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block));
    let resolver = getOrCreateAirResolver(domain, chainId, resolverAddress, null);
    if (domain && domain.resolver === resolver.id) {
      domain.resolvedAddress = null
      domain.lastBlock = block.id;
      domain.save();
    }
  }

  /**
   * @dev This function tracks a set primary domain transaction
   * @param ensName ens name
   * @param chainId chain id
   * @param node domain node
   * @param from event.from address
   * @param blockHeight block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   */
  export function trackSetPrimaryDomainTransaction(
    ensName: string,
    chainId: string,
    node: Bytes,
    from: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
  ): void {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domain = getOrCreateAirDomain(new Domain(
      node.toHexString(),
      chainId,
      block,
    ));
    let fromAccount = getOrCreateAirAccount(chainId, from);
    if (domain.name == ensName && domain.owner == fromAccount.id) {
      domain.isPrimary = true;
      domain.lastBlock = block.id;
      domain.save();
    }
  }

  // end of track functions and start of get or create and helper functions
  /**
   * @dev This function gets or creates a AirAddrChanged entity
   * @param chainId chain id
   * @param logIndex event log index
   * @param resolver resolver contract address
   * @param block air block
   * @param transactionHash transaction hash 
   * @param previousResolvedAddressId air account id of previous resolved address
   * @param newResolvedAddress new resolved address
   * @param domain domain
   * @returns AirAddrChanged entity
   */
  function getOrCreateAirAddrChanged(
    chainId: string,
    logIndex: BigInt,
    resolver: AirResolver,
    block: AirBlock,
    transactionHash: Bytes,
    previousResolvedAddressId: string | null,
    newResolvedAddress: string,
    domain: AirDomain,
  ): AirAddrChanged {
    let id = createEntityId(transactionHash, block.number, logIndex);
    let entity = AirAddrChanged.load(id);
    if (entity == null) {
      entity = new AirAddrChanged(id);
      entity.resolver = resolver.id;
      entity.block = block.id;
      entity.transactionHash = transactionHash.toHexString();
      entity.previousResolvedAddress = previousResolvedAddressId;
      entity.newResolvedAddress = getOrCreateAirAccount(chainId, newResolvedAddress).id;
      entity.domain = domain.id;
      entity.tokenId = domain.tokenId;
      entity.index = updateAirEntityCounter(AIR_ADDR_CHANGED_TRANSACTION_COUNTER_ID, block);
      entity.save();
    }
    return entity as AirAddrChanged;
  }

  /**
   * @dev This function creates a resolver entity id
   * @param resolver domain resolver address
   * @param node domain node
   * @returns returns a resolver entity id
   */
  function createResolverEntityId(resolver: string, node: string): string {
    return resolver.concat("-").concat(node);
  }

  /**
   * @dev this is a generic function to create ids for entities
   * @param transactionHash transaction hash
   * @param blockHeight block number in the chain
   * @param logIndex txn log index
   * @returns entity id in string format
   */
  function createEntityId(transactionHash: Bytes, blockHeight: BigInt, logIndex: BigInt): string {
    return transactionHash.toHex().concat("-").concat(blockHeight.toString()).concat('-').concat(logIndex.toString());
  }

  /**
   * @dev this function creates subnode of the node and returns it as air domain entity id
   * @param node takes the node param from the event
   * @param label takes the label param from the event
   * @returns returns a air domain entity id
   */
  function createAirDomainEntityId(node: Bytes, label: Bytes): string {
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
   * @dev this function gets or creates a new AirNameRenewedTransaction entity
   * @param transactionHash transaction hash
   * @param chainId chain id
   * @param block air block
   * @param logIndex log index
   * @param domain air domain
   * @param cost cost of the transaction
   * @param paymentToken payment token
   * @param renewer renewer address
   * @param expiryTimestamp expiry date of the domain
   * @returns AirNameRenewedTransaction entity
   */
  function getOrCreateAirNameRenewedTransaction(
    transactionHash: Bytes,
    chainId: string,
    block: AirBlock,
    logIndex: BigInt,
    domain: AirDomain,
    cost: BigInt,
    paymentToken: string | null,
    renewer: string,
    expiryTimestamp: BigInt,
  ): AirNameRenewedTransaction {
    let id = createEntityId(transactionHash, block.number, logIndex);
    let entity = AirNameRenewedTransaction.load(id);
    if (entity == null) {
      entity = new AirNameRenewedTransaction(id);
      entity.block = block.id;
      entity.transactionHash = transactionHash.toHex();
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.index = updateAirEntityCounter(AIR_NAME_RENEWED_TRANSACTION_COUNTER_ID, block);
      entity.cost = cost;
      if (paymentToken) {
        entity.paymentToken = getOrCreateAirToken(chainId, paymentToken).id;
      }
      entity.renewer = getOrCreateAirAccount(chainId, renewer).id;
      entity.expiryTimestamp = expiryTimestamp;
      entity.save();
    }
    return entity as AirNameRenewedTransaction;
  }

  /**
   * @dev this function gets or creates an AirNameRegisteredTransaction entity
   * @param chainId chain id
   * @param blockHeight block height
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param transactionHash transaction hash
   * @param logIndex log index
   * @param domain air domain
   * @param cost cost of the transaction
   * @param paymentToken payment token - can be null
   * @param registrant registrant address
   * @param expiryTimestamp expiry date of the domain
   * @returns returns an AirNameRegisteredTransaction entity
   */
  function getOrCreateAirNameRegisteredTransaction(
    chainId: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    transactionHash: Bytes,
    logIndex: BigInt,
    domain: AirDomain,
    cost: BigInt,
    paymentToken: string | null,
    registrant: string,
    expiryTimestamp: BigInt,
  ): AirNameRegisteredTransaction {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let id = createEntityId(transactionHash, block.number, logIndex);
    let entity = AirNameRegisteredTransaction.load(id);
    if (entity == null) {
      entity = new AirNameRegisteredTransaction(id);
      entity.block = block.id;
      entity.transactionHash = transactionHash.toHex();
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.index = updateAirEntityCounter(AIR_NAME_REGISTERED_TRANSACTION_COUNTER_ID, block);
      entity.cost = cost;
      if (paymentToken) {
        entity.paymentToken = getOrCreateAirToken(chainId, paymentToken).id;
      }
      entity.registrant = getOrCreateAirAccount(chainId, registrant).id;
      entity.expiryTimestamp = expiryTimestamp;
      entity.save();
    }
    return entity as AirNameRegisteredTransaction;
  }

  /**
   * @dev this function gets or creates an AirResolver entity
   * @param domain air domain entity
   * @param chainId chain id
   * @param resolver resolver contract address
   * @param addr address of addr record or null
   * @returns AirResolver entity
   */
  function getOrCreateAirResolver(
    domain: AirDomain,
    chainId: string,
    resolver: string,
    addr: string | null = EMPTY_STRING,
  ): AirResolver {
    let id = createResolverEntityId(resolver, domain.id);
    let entity = AirResolver.load(id);
    if (entity == null) {
      entity = new AirResolver(id);
      entity.address = getOrCreateAirAccount(chainId, resolver).id;
      entity.domain = domain.id;
    }
    if (addr && addr != EMPTY_STRING) {
      entity.addr = getOrCreateAirAccount(chainId, addr).id;
    } else if (addr == null) {
      entity.addr = null;
    }
    entity.save();
    return entity as AirResolver;
  }

  /**
   * @dev This function gets or creates a new AirDomainNewTTLTransaction entity
   * @param transactionHash transaction hash
   * @param blockHeight block number in the chain
   * @param logIndex txn log index
   * @param oldTTL old ttl value - can be null
   * @param newTTL new ttl value
   * @param block air block object
   * @param domain air domain object
   * @returns returns a air domain new ttl transaction entity
   */
  function getOrCreateAirDomainNewTTLTransaction(
    transactionHash: Bytes,
    blockHeight: BigInt,
    logIndex: BigInt,
    oldTTL: BigInt | null,
    newTTL: BigInt,
    block: AirBlock,
    domain: AirDomain,
  ): AirDomainNewTTLTransaction {
    let id = createEntityId(transactionHash, blockHeight, logIndex);
    let entity = AirDomainNewTTLTransaction.load(id);
    if (entity == null) {
      entity = new AirDomainNewTTLTransaction(id);
      entity.oldTTL = oldTTL;
      entity.transactionHash = transactionHash.toHexString();
      entity.newTTL = newTTL;
      entity.block = block.id;
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_NEW_TTL_TRANSACTION_COUNTER_ID, block);
      entity.save();
      log.info('Created new AirDomainNewTTLTransaction entity: {} txhash {}', [id, transactionHash.toHexString()])
    }
    log.info('Loaded AirDomainNewTTLTransaction entity: {} txhash {}', [id, transactionHash.toHexString()])
    return entity as AirDomainNewTTLTransaction;
  }

  /**
   * @dev this function gets or creates a new AirDomainNewResolverTransaction entity
   * @param previousResolverId previous resolver Id - can be null
   * @param newResolverId new resolver Id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logIndex log index
   * @param domain air domain entity
   * @returns AirDomainNewResolverTransaction entity
   */
  function getOrCreateAirDomainNewResolverTransaction(
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
  function getOrCreateAirDomain(
    domain: Domain,
  ): AirDomain {
    let entity = AirDomain.load(domain.id);
    if (entity == null) {
      entity = new AirDomain(domain.id);
      entity.subdomainCount = BIG_INT_ZERO;
      entity.owner = getOrCreateAirAccount(domain.chainId, ZERO_ADDRESS).id;
      entity.isPrimary = false;
      entity.isMigrated = false;
      entity.expiryTimestamp = BIG_INT_ZERO;
      entity.registrationCost = BIG_INT_ZERO;
      entity.createdAt = domain.block.id;
      entity.lastBlock = domain.block.id;
    }
    if (entity.id == ROOT_NODE) {
      entity.isMigrated = true;
    }
    entity.save();
    return entity as AirDomain;
  }

  /**
   * @dev this function gets or creates a new air domain owner changed transaction entity
   * @param block air block entity
   * @param logIndex log index
   * @param chainId chain id
   * @param previousOwnerId previous owner id
   * @param newOwner new owner address
   * @param transactionHash transaction hash
   * @param tokenId token id
   * @param domain air domain
   * @returns AirDomainOwnerChangedTransaction entity
   */
  function getOrCreateAirDomainOwnerChangedTransaction(
    block: AirBlock,
    logIndex: BigInt,
    chainId: string,
    previousOwnerId: string,
    newOwner: string,
    transactionHash: Bytes,
    tokenId: string,
    domain: AirDomain,
  ): AirDomainOwnerChangedTransaction {
    let id = createEntityId(transactionHash, block.number, logIndex);
    let entity = AirDomainOwnerChangedTransaction.load(id);
    if (entity == null) {
      entity = new AirDomainOwnerChangedTransaction(id);
      entity.previousOwner = previousOwnerId;
      entity.newOwner = getOrCreateAirAccount(chainId, newOwner).id;
      entity.transactionHash = transactionHash.toHex();
      entity.tokenId = tokenId;
      entity.domain = domain.id;
      entity.block = block.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID, block);
      entity.save();
    }
    return entity as AirDomainOwnerChangedTransaction;
  }

  /**
   * @dev this function does a recursive domain deletion for a particular domain
   * @param domain air domain entity
   * @param chainId chain id
   * @param block air block entity
   * @returns parent domain id
   */
  function recurseDomainDelete(domain: AirDomain, chainId: string, block: AirBlock): string | null {
    if (domain.owner == getOrCreateAirAccount(chainId, ZERO_ADDRESS).id && domain.subdomainCount == BIG_INT_ZERO) {
      if (domain.parent) {
        const parentDomain = getOrCreateAirDomain(new Domain(domain.parent!, chainId, block));
        if (parentDomain) {
          parentDomain.subdomainCount = parentDomain.subdomainCount.minus(BIGINT_ONE)
          parentDomain.lastBlock = block.id;
          parentDomain.save();
          return recurseDomainDelete(parentDomain, chainId, block)
        }
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
  function updateAirEntityCounter(
    id: string,
    block: AirBlock,
  ): BigInt {
    let entity = AirEntityCounter.load(id);
    if (entity == null) {
      if (id == AIR_DOMAIN_NEW_TTL_TRANSACTION_COUNTER_ID) {
        log.info('Creating AirDomainNewTTLTransaction counter blockNo {}', [block.number.toString()]);
      }
      entity = new AirEntityCounter(id);
      entity.count = BIGINT_ONE;
      entity.createdAt = block.id;
      entity.lastUpdatedAt = block.id;
      createAirMeta(SUBGRAPH_SLUG, SUBGRAPH_NAME);
    } else {
      if (id == AIR_DOMAIN_NEW_TTL_TRANSACTION_COUNTER_ID) {
        log.info('updating AirDomainNewTTLTransaction counter old {} new {} blockNo {}', [entity.count.toString(), entity.count.plus(BIGINT_ONE).toString(), block.number.toString()]);
      }
      entity.count = entity.count.plus(BIGINT_ONE);
      entity.lastUpdatedAt = block.id;
    }
    entity.save();
    if (id == AIR_DOMAIN_NEW_TTL_TRANSACTION_COUNTER_ID) {
      log.info('updated AirDomainNewTTLTransaction entity counter {} blockNo', [entity.count.toString(), block.number.toString()]);
    }
    return entity.count as BigInt;
  }

  /**
   * @dev this function creates air meta entity
   * @param slug subgraph slug
   * @param name subgraph name
   */
  function createAirMeta(
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
  function getOrCreateAirBlock(
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
  function getOrCreateAirToken(chainID: string, address: string): AirToken {
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
   * @param chainId chain id
   * @param address account address
   * @returns AirAccount entity
   */
  function getOrCreateAirAccount(chainId: string, address: string): AirAccount {
    if (address == EMPTY_STRING) {
      address = ZERO_ADDRESS;
    }
    let entity = AirAccount.load(chainId + "-" + address);
    if (entity == null) {
      entity = new AirAccount(chainId + "-" + address);
      entity.address = address;
      entity.save();
    }
    return entity as AirAccount;
  }

  /**
   * @dev this class has all fields required to create a domain entity
   * @param id domain id
   * @param chainId chain id
   * @param block air block entity
   */
  export class Domain {
    constructor(
      public id: string,
      public chainId: string,
      public block: AirBlock,
    ) { }
  }
}