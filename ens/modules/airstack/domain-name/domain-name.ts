import {
  BigInt,
  Bytes,
  crypto,
  log,
  ByteArray,
  ens,
} from "@graphprotocol/graph-ts";

import {
  AirAccount,
  AirToken,
  AirBlock,
  AirDomain,
  AirDomainOwnerChangedTransaction,
  AirDomainTransferTransaction,
  AirResolver,
  AirDomainNewResolverTransaction,
  AirDomainNewTTLTransaction,
  AirNameRegisteredTransaction,
  AirNameRenewedTransaction,
  AirAddrChanged,
  AirPrimaryDomainTransaction,
  ReverseRegistrar,
  PrimaryDomain,
  DomainVsIsMigratedMapping,
} from "../../../generated/schema";
import { uint256ToByteArray, AIR_SET_PRIMARY_DOMAIN_ENTITY_COUNTER_ID, AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID, AIR_ADDR_CHANGED_ENTITY_COUNTER_ID, AIR_NAME_RENEWED_ENTITY_COUNTER_ID, AIR_NAME_REGISTERED_ENTITY_COUNTER_ID, AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER_ID, AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER_ID, AIR_DOMAIN_TRANSFER_ENTITY_COUNTER_ID, ROOT_NODE, ZERO_ADDRESS, ETHEREUM_MAINNET_ID } from "./utils";
import { BIGINT_ONE, BIG_INT_ZERO, EMPTY_STRING, updateAirEntityCounter, getOrCreateAirBlock } from "../common";

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
   * @param tokenAddress contract address of nft token
   * @param fromOldRegistry specifies if the event is from the old registry
   */
  export function trackDomainOwnerChangedTransaction(
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    logIndex: BigInt,
    chainId: string,
    newOwner: string,
    transactionHash: string,
    isMigrated: boolean,
    node: Bytes,
    label: Bytes,
    tokenAddress: string,
    fromOldRegistry: boolean,
  ): void {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domainId = createAirDomainEntityId(node, label);
    let domain = getOrCreateAirDomain(new Domain(domainId, chainId, block, tokenAddress));
    let isMigratedMapping = getOrCreateIsMigratedMapping(domainId, block.id);
    if (fromOldRegistry && isMigratedMapping.isMigrated == true) {
      // this domain was migrated from the old registry, so we don't need to hanlde old registry event now
      return;
    }
    let previousOwnerId = domain.owner;
    let parent = getOrCreateAirDomain(new Domain(
      node.toHexString(),
      chainId,
      block,
      tokenAddress,
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
    domain.labelHash = label;
    domain.tokenId = tokenId;
    domain.lastBlock = block.id;
    recurseSubdomainCountDecrement(domain, chainId, block, tokenAddress);
    domain.save();

    // creating reverse registrar to get domainId when setting primary domain
    if (domain.name) {
      createReverseRegistrar(domain.name!, domain.id, block);
    }
    // creating is migrated mapping
    getOrCreateIsMigratedMapping(domainId, block.id, isMigrated);
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
   * @param tokenAddress contract address of nft token
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
    transactionHash: string,
    tokenAddress: string,
    fromOldRegistry: boolean,
  ): void {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block, tokenAddress));
    let isMigratedMapping = getOrCreateIsMigratedMapping(domain.id, block.id);
    if (fromOldRegistry && isMigratedMapping.isMigrated == true) {
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
      entity.transactionHash = transactionHash;
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
   * @param tokenAddress contract address of nft token
   * @param fromOldRegistry specifies if the event is from the old registry
   */
  export function trackDomainNewResolverTransaction(
    resolver: string,
    node: string,
    chainId: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    transactionHash: string,
    logIndex: BigInt,
    tokenAddress: string,
    fromOldRegistry: boolean,
  ): void {
    // get block
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    // get domain
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block, tokenAddress));
    let isMigratedMapping = getOrCreateIsMigratedMapping(domain.id, block.id);
    if (fromOldRegistry && node != ROOT_NODE && isMigratedMapping.isMigrated == true) {
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
    if (resolverEntity.resolvedAddress) {
      domain.resolvedAddress = resolverEntity.resolvedAddress;
    }
    // do recursive subdomain count decrement
    domain.lastBlock = block.id;
    recurseSubdomainCountDecrement(domain, chainId, block, tokenAddress);
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
   * @param tokenAddress contract address of nft token
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
    transactionHash: string,
    tokenAddress: string,
    fromOldRegistry: boolean,
  ): void {
    // get block
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    // get domain
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block, tokenAddress));
    let isMigratedMapping = getOrCreateIsMigratedMapping(domain.id, block.id);
    if (fromOldRegistry && isMigratedMapping.isMigrated == true) {
      // this domain was migrated from the old registry, so we don't need to hanlde old registry event now
      return;
    }
    // get previous ttl
    let oldTTL: BigInt | null = null;
    if (domain.ttl) {
      oldTTL = domain.ttl;
    }
    // update domain ttl
    domain.ttl = newTTL;
    domain.lastBlock = block.id;
    domain.save();
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
   * @param paymentToken payment token address
   * @param labelId label id
   * @param rootNode root node byte array
   * @param tokenAddress contract address of nft token
   */
  export function trackNameRegisteredTransaction(
    transactionHash: string,
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
    tokenAddress: string,
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
      tokenAddress,
    ));

    if (labelName != null) {
      domain.labelName = labelName
    }
    domain.expiryTimestamp = expiryTimestamp;
    domain.lastBlock = block.id;
    domain.registrationCost = cost;
    domain.paymentToken = getOrCreateAirToken(chainId, paymentToken).id;
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
   * @param paymentToken payment token address
   * @param renewer renewer address
   * @param labelId label id
   * @param rootNode root node byte array
   * @param expiryTimestamp expiry date
   * @param tokenAddress token address
   */
  export function trackNameRenewedTransaction(
    transactionHash: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    chainId: string,
    cost: BigInt | null,
    paymentToken: string,
    renewer: string,
    labelId: BigInt,
    rootNode: ByteArray,
    expiryTimestamp: BigInt,
    tokenAddress: string,
  ): void {
    let label = uint256ToByteArray(labelId);
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domainId = crypto.keccak256(rootNode.concat(label)).toHex();
    let domain = getOrCreateAirDomain(new Domain(
      domainId,
      chainId,
      block,
      tokenAddress,
    ));
    domain.expiryTimestamp = expiryTimestamp;
    domain.lastBlock = block.id;
    domain.save();
    // create name renewed transaction
    getOrCreateAirNameRenewedTransaction(
      transactionHash,
      chainId,
      block,
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
   * @param paymentToken payment token address
   * @param blockHeight block height
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param chainId chain id
   * @param rootNode root node ByteArray
   * @param tokenAddress contract address of nft token
   * @param transactionHash transaction hash
   * @param renewer renewer address - can be null
   * @param expiryTimestamp expiry date - can be null
   * @param fromRegistrationEvent true if called from a registration event
   */
  export function trackSetNamePreImage(
    name: string,
    label: Bytes,
    cost: BigInt,
    paymentToken: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    chainId: string,
    rootNode: ByteArray,
    tokenAddress: string,
    transactionHash: string,
    renewer: string | null,
    expiryTimestamp: BigInt | null,
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
      block,
      tokenAddress,
    ));

    // tracking registration cost in domain entity  - renewal cost is not being tracked yet
    if (fromRegistrationEvent) {
      domain.registrationCost = cost;
      domain.paymentToken = getOrCreateAirToken(chainId, paymentToken).id;
      domain.lastBlock = block.id;
    } else {
      // name renewal event
      // updating renewal cost in name renewed transaction entity
      getOrCreateAirNameRenewedTransaction(
        transactionHash,
        chainId,
        block,
        domain,
        cost,
        paymentToken,
        renewer!,
        expiryTimestamp!,
      );
    }
    if (domain.labelName !== name) {
      domain.labelName = name
      domain.name = name + '.eth'
      domain.lastBlock = block.id;
      // creating reverse registrar to get domainId when setting primary domain
      if (domain.name) {
        createReverseRegistrar(domain.name!, domain.id, block);
      }
    }
    domain.save();
    //new name registered event
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
   * @param tokenAddress contract address of nft token
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
    transactionHash: string,
    tokenAddress: string,
  ): void {
    let addrAccount = getOrCreateAirAccount(chainId, addr);
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block, tokenAddress));
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
   * @param tokenAddress contract address of nft token
   */
  export function trackResolverVersionChange(
    chainId: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    node: string,
    resolverAddress: string,
    tokenAddress: string,
  ): void {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let domain = getOrCreateAirDomain(new Domain(node, chainId, block, tokenAddress));
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
   * @param from event.from address
   * @param blockHeight block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param tokenAddress contract address of nft token
   */
  export function trackSetPrimaryDomainTransaction(
    ensName: string,
    chainId: string,
    from: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    transactionHash: string,
    tokenAddress: string,
  ): void {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let reverseRegistrar = getReverseRegistrar(ensName);
    if (reverseRegistrar == null) {
      log.warning("Reverse registrar not found for name {} txhash {}", [ensName, transactionHash]);
      return;
    }
    log.info("Reverse registrar found for name {} domainId {} txHash {}", [ensName, reverseRegistrar.domain, transactionHash])
    let domain = getOrCreateAirDomain(new Domain(reverseRegistrar.domain, chainId, block, tokenAddress));
    let fromAccount = getOrCreateAirAccount(chainId, from);
    // when domain's resolvedAddress is set as from address
    if (domain.resolvedAddress == fromAccount.id) {
      // get or create primary domain entity
      let primaryDomainEntity = getOrCreatePrimaryDomain(domain, fromAccount, block);
      // when primary domain already exists for a resolved address and is not same as new domain
      if (primaryDomainEntity.domain != domain.id) {
        log.info("Primary domain already exists for resolvedAddressId {} oldDomain {} newDomain {}", [fromAccount.id, primaryDomainEntity.domain, domain.id])
        // unset isPrimary on old domain
        let oldPrimaryDomain = getOrCreateAirDomain(new Domain(primaryDomainEntity.domain, chainId, block, tokenAddress));
        oldPrimaryDomain.isPrimary = false;
        oldPrimaryDomain.lastBlock = block.id;
        oldPrimaryDomain.save();
        // set new primary domain for resolved address
        primaryDomainEntity.domain = domain.id;
        primaryDomainEntity.lastUpdatedAt = block.id;
        primaryDomainEntity.save();
      }
      // set isPrimary on new domain
      domain.isPrimary = true;
      domain.lastBlock = block.id;
      domain.save();
    }
    // record a set primary domain transaction with new domain
    getOrCreateAirPrimaryDomainTransaction(
      block,
      transactionHash,
      domain,
      from,
      chainId,
    )
  }

  // end of track functions and start of get or create and helper functions
  /**
   * @dev This function gets or creates a primary domain entity
   * @param domain air domain
   * @param fromAccount air account
   * @param block air block
   * @returns primary domain entity
   */
  function getOrCreatePrimaryDomain(
    domain: AirDomain,
    fromAccount: AirAccount,
    block: AirBlock,
  ): PrimaryDomain {
    let id = fromAccount.id;
    let entity = PrimaryDomain.load(id);
    if (entity == null) {
      entity = new PrimaryDomain(id);
      entity.domain = domain.id;
      entity.lastUpdatedAt = block.id;
      entity.save();
      log.info("Primary domain now for resolvedAddressId {} domain {}", [fromAccount.id, domain.id])
    }
    return entity as PrimaryDomain;
  }

  /**
   * @dev This function gets or creates a air primary domain transaction
   * @param block air block
   * @param transactionHash transaction hash
   * @param domain air domain
   * @param resolvedAddress domain resolved address
   * @param chainId chain id
   * @returns air primary domain transaction
   */
  function getOrCreateAirPrimaryDomainTransaction(
    block: AirBlock,
    transactionHash: string,
    domain: AirDomain,
    resolvedAddress: string,
    chainId: string,
  ): AirPrimaryDomainTransaction {
    let id = ETHEREUM_MAINNET_ID.concat('-').concat(transactionHash);
    let entity = AirPrimaryDomainTransaction.load(id);
    if (entity == null) {
      entity = new AirPrimaryDomainTransaction(id);
      entity.block = block.id;
      entity.transactionHash = transactionHash;
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.index = updateAirEntityCounter(AIR_SET_PRIMARY_DOMAIN_ENTITY_COUNTER_ID, block);
      entity.resolvedAddress = getOrCreateAirAccount(chainId, resolvedAddress).id; //make sure to remove the old primary ens if changed
      entity.save();
    }
    return entity as AirPrimaryDomainTransaction;
  }

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
    transactionHash: string,
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
      entity.transactionHash = transactionHash;
      entity.previousResolvedAddress = previousResolvedAddressId;
      entity.newResolvedAddress = getOrCreateAirAccount(chainId, newResolvedAddress).id;
      entity.domain = domain.id;
      entity.tokenId = domain.tokenId;
      entity.index = updateAirEntityCounter(AIR_ADDR_CHANGED_ENTITY_COUNTER_ID, block);
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
  function createEntityId(transactionHash: string, blockHeight: BigInt, logIndex: BigInt): string {
    return transactionHash.concat("-").concat(blockHeight.toString()).concat('-').concat(logIndex.toString());
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
   * @param domain air domain
   * @param cost cost of the transaction
   * @param paymentToken payment token
   * @param renewer renewer address
   * @param expiryTimestamp expiry date of the domain
   * @returns AirNameRenewedTransaction entity
   */
  function getOrCreateAirNameRenewedTransaction(
    transactionHash: string,
    chainId: string,
    block: AirBlock,
    domain: AirDomain,
    cost: BigInt | null,
    paymentToken: string,
    renewer: string,
    expiryTimestamp: BigInt,
  ): AirNameRenewedTransaction {
    let id = transactionHash.concat("-").concat(domain.id);
    let entity = AirNameRenewedTransaction.load(id);
    if (entity == null) {
      entity = new AirNameRenewedTransaction(id);
      entity.block = block.id;
      entity.transactionHash = transactionHash;
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.cost = cost;
      entity.index = updateAirEntityCounter(AIR_NAME_RENEWED_ENTITY_COUNTER_ID, block);
      if (paymentToken) {
        entity.paymentToken = getOrCreateAirToken(chainId, paymentToken).id;
      }
      entity.renewer = getOrCreateAirAccount(chainId, renewer).id;
      entity.expiryTimestamp = expiryTimestamp;
      entity.save();
    }
    // getting renewal events from 2 contracts, old contract gives cost, new contract gives null, so if old contract event is processed first, then we update the cost
    // if new contract event is processed first, then we don't update the cost
    if (cost && !entity.cost) {
      entity.cost = cost;
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
    transactionHash: string,
    logIndex: BigInt,
    domain: AirDomain,
    cost: BigInt,
    paymentToken: string,
    registrant: string,
    expiryTimestamp: BigInt,
  ): AirNameRegisteredTransaction {
    let block = getOrCreateAirBlock(chainId, blockHeight, blockHash, blockTimestamp);
    let id = createEntityId(transactionHash, block.number, logIndex);
    let entity = AirNameRegisteredTransaction.load(id);
    if (entity == null) {
      entity = new AirNameRegisteredTransaction(id);
      entity.block = block.id;
      entity.transactionHash = transactionHash;
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.index = updateAirEntityCounter(AIR_NAME_REGISTERED_ENTITY_COUNTER_ID, block);
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
    resolvedAddress: string | null = EMPTY_STRING,
  ): AirResolver {
    let id = createResolverEntityId(resolver, domain.id);
    let entity = AirResolver.load(id);
    if (entity == null) {
      entity = new AirResolver(id);
      entity.address = getOrCreateAirAccount(chainId, resolver).id;
      entity.domain = domain.id;
    }
    if (resolvedAddress && resolvedAddress != EMPTY_STRING) {
      entity.resolvedAddress = getOrCreateAirAccount(chainId, resolvedAddress).id;
    } else if (resolvedAddress == null) {
      entity.resolvedAddress = null;
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
    transactionHash: string,
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
      entity.transactionHash = transactionHash;
      entity.newTTL = newTTL;
      entity.block = block.id;
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER_ID, block);
      entity.save();
    }
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
    transactionHash: string,
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
      entity.transactionHash = transactionHash;
      entity.tokenId = domain.tokenId;
      entity.domain = domain.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER_ID, block);
      entity.save();
    }
    return entity as AirDomainNewResolverTransaction;
  }

  /**
   * @dev this function creates a new DomainVsIsMigratedMapping entity
   * @param domaiId air domain entity id
   * @param blockId air block entity id
   * @param isMigrated is migrated flag - only required when creating a new entity
   * @returns DomainVsIsMigratedMapping entity
  */
  function getOrCreateIsMigratedMapping(domainId: string, blockId: string, isMigrated: boolean = false): DomainVsIsMigratedMapping {
    let entity = DomainVsIsMigratedMapping.load(domainId);
    if (entity == null) {
      entity = new DomainVsIsMigratedMapping(domainId);
      entity.isMigrated = isMigrated;
      entity.lastUpdatedAt = blockId;
      entity.save();
    }
    return entity as DomainVsIsMigratedMapping;
  }

  /**
   * @dev this function creates a new reverse registrar entity if it does not exist
   * @param name ens name, ex: 'schiller.eth'
   * @param domainId air domain id
   * @param block air block entity
   * @returns ReverseRegistrar entity
   */
  function createReverseRegistrar(
    name: string,
    domainId: string,
    block: AirBlock,
  ): ReverseRegistrar {
    let id = crypto.keccak256(Bytes.fromUTF8(name)).toHexString();
    let entity = ReverseRegistrar.load(id);
    if (entity == null) {
      entity = new ReverseRegistrar(id);
      entity.name = name;
      entity.domain = domainId;
      entity.createdAt = block.id;
      entity.save();
    }
    return entity as ReverseRegistrar;
  }

  /**
   * @dev this function gets a reverse registrar entity
   * @param name ens name, ex: 'schiller.eth'
   * @returns ReverseRegistrar entity
   */
  function getReverseRegistrar(
    name: string,
  ): ReverseRegistrar | null {
    let id = crypto.keccak256(Bytes.fromUTF8(name)).toHexString();
    return ReverseRegistrar.load(id);
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
      entity.tokenAddress = getOrCreateAirToken(domain.chainId, domain.tokenAddress).id;
      entity.isPrimary = false;
      entity.expiryTimestamp = BIG_INT_ZERO;
      entity.registrationCost = BIG_INT_ZERO;
      entity.createdAt = domain.block.id;
      entity.lastBlock = domain.block.id;
      entity.save();
    }
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
    transactionHash: string,
    tokenId: string,
    domain: AirDomain,
  ): AirDomainOwnerChangedTransaction {
    let id = createEntityId(transactionHash, block.number, logIndex);
    let entity = AirDomainOwnerChangedTransaction.load(id);
    if (entity == null) {
      entity = new AirDomainOwnerChangedTransaction(id);
      entity.previousOwner = previousOwnerId;
      entity.newOwner = getOrCreateAirAccount(chainId, newOwner).id;
      entity.transactionHash = transactionHash;
      entity.tokenId = tokenId;
      entity.domain = domain.id;
      entity.block = block.id;
      entity.index = updateAirEntityCounter(AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER_ID, block);
      entity.save();
    }
    return entity as AirDomainOwnerChangedTransaction;
  }

  /**
   * @dev this function does a recursive subdomain count decrement
   * @param domain air domain entity
   * @param chainId chain id
   * @param block air block entity
   * @param tokenAddress contract address of nft token
   * @returns air domain entity id
   */
  function recurseSubdomainCountDecrement(domain: AirDomain, chainId: string, block: AirBlock, tokenAddress: string): string | null {
    if ((domain.resolver == null || domain.resolver!.split("-")[0] == ZERO_ADDRESS) &&
      domain.owner == getOrCreateAirAccount(chainId, ZERO_ADDRESS).id && domain.subdomainCount == BIG_INT_ZERO) {
      if (domain.parent) {
        const parentDomain = getOrCreateAirDomain(new Domain(domain.parent!, chainId, block, tokenAddress));
        if (parentDomain) {
          parentDomain.subdomainCount = parentDomain.subdomainCount.minus(BIGINT_ONE)
          parentDomain.lastBlock = block.id;
          parentDomain.save();
          return recurseSubdomainCountDecrement(parentDomain, chainId, block, tokenAddress)
        }
      }
      return null
    }
    return domain.id
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
   * @param tokenAddress token address of domain nft token contract
   */
  export class Domain {
    constructor(
      public id: string,
      public chainId: string,
      public block: AirBlock,
      public tokenAddress: string,
    ) { }
  }
}