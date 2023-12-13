import {
  BigInt,
  Bytes,
  crypto,
  log,
  ethereum,
  Address,
} from "@graphprotocol/graph-ts"

import {
  AirDomain,
  AirResolver,
  AirDomainAccount,
  AirDomainOwnershipChanged,
  AirDomainManagerChanged,
  AirDomainNameWrapped,
  AirDomainRegistrationOrRenew,
  AirBlock,
  AirDomainNewResolver,
  AirDomainNewTTL,
  AirDomainNameUnwrapped,
  AirNameSet,
  AirLabelName,
  AirText,
  AirTextChanged,
  AirMultiCoinChanged,
  AirMultiCoin,
  AirResolvedAddressChanged,
  AirDomainFusesSet,
  AirDomainCostSet,
  AirNameSetEvent,
} from "../../../generated/schema"
import {
  AIR_DOMAIN_CHANGED_ID,
  AIR_DOMAIN_FUSES_SET_CHANGED_ID,
  AIR_DOMAIN_NAME_UNWRAPPED_ID,
  AIR_DOMAIN_NAME_WRAPPED_ID,
  AIR_DOMAIN_NEW_RESOLVER_ID,
  AIR_DOMAIN_NEW_TTL_CHANGED_ID,
  AIR_NAME_SET_ID,
  AIR_DOMAIN_REGISTRATION_OR_RENEW_CHANGED_ID,
  AIR_DOMAIN_MANAGER_CHANGED_ID,
  AIR_RESOLVER_CHANGED_ID,
  AIR_RESOLVER_MULTICOIN_ADDRESS_CHANGED_ID,
  AIR_RESOLVER_RESOLVED_ADDRESS_CHANGED_ID,
  AIR_RESOLVER_TEXT_CHANGED_ID,
  AIR_TEXT_CHANGED_ID,
  ROOT_NODE,
  AIR_DOMAIN_OWNERSHIP_CHANGED_ID,
  AIR_DOMAIN_COST_CHANGED_ID,
  AIR_DOMAIN_NAME_SET_EVENT_ID,
} from "./utils"
import {
  BIG_INT_ZERO,
  getChainId,
  updateAirEntityCounter,
  getOrCreateAirAccount,
  BIGINT_ONE,
  getOrCreateAirToken,
} from "../common"
const ETH_NODE_STR =
  "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"

export namespace domain {
  // Getter functions
  export function getOrCreateAirDomain(
    id: string,
    block: ethereum.Block
  ): AirDomain {
    let airDomain = AirDomain.load(id)
    if (airDomain == null) {
      airDomain = createAirDomain(id, block)
    }
    return airDomain
  }

  export function getOrCreateAirDomainAccount(
    address: Address,
    block: ethereum.Block
  ): AirDomainAccount {
    const addrStr = address.toHexString()
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    const airAccount = getOrCreateAirAccount(chainId, addrStr, airBlock)
    airAccount.save()
    let airDomainAccount = AirDomainAccount.load(airAccount.id)
    if (!airDomainAccount) {
      airDomainAccount = new AirDomainAccount(airAccount.id)
      airDomainAccount.account = airAccount.id
    }
    airDomainAccount.save()
    return airDomainAccount
  }
  export function getOrCreateAirBlock(block: ethereum.Block): AirBlock {
    const chainId = getChainId()
    const id = chainId.concat("-").concat(block.number.toString())
    let blockEntity = AirBlock.load(id)
    if (blockEntity == null) {
      blockEntity = new AirBlock(id)
      blockEntity.hash = block.hash.toHexString()
      blockEntity.number = block.number
      blockEntity.timestamp = block.timestamp
    }
    blockEntity.save()
    return blockEntity as AirBlock
  }
  export function getAirDomain(domainId: string): AirDomain {
    let airDomain = AirDomain.load(domainId)
    if (!airDomain) {
      throw new Error("Domain not found")
    }
    return airDomain
  }

  export function saveAirDomain(
    domain: AirDomain,
    block: ethereum.Block
  ): void {
    const airBlock = getOrCreateAirBlock(block)
    if (!domain.registrationDate) {
      domain.registrationDate = block.timestamp
    }
    domain.lastUpdatedBlock = airBlock.id
    domain.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_CHANGED_ID,
      airBlock
    )
    domain.save()
  }

  export function saveAirText(text: AirText, block: ethereum.Block): void {
    const airBlock = getOrCreateAirBlock(block)
    airBlock.save()

    text.lastUpdatedBlock = airBlock.id
    text.lastUpdatedIndex = updateAirEntityCounter(
      AIR_TEXT_CHANGED_ID,
      airBlock
    )
    text.save()
  }

  export function createAirDomainWithManager(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    manager: Address,
    block: ethereum.Block
  ): void {
    let managerDomainAccount = getOrCreateAirDomainAccount(manager, block)
    let domain = getOrCreateAirDomain(domainId, block)
    let labelName = getOrCreateAirLabelName("", ROOT_NODE, block)
    domain.name = []
    domain.encodedName = ""
    domain.manager = managerDomainAccount.id
    saveAirLabelName(labelName, block)
    saveAirDomain(domain, block)

    // book keeping
    let airDomainManagerChanged = new AirDomainManagerChanged(
      createEventId("AirDomainManagerChanged", txHash, logIndex)
    )
    airDomainManagerChanged.domain = domain.id
    airDomainManagerChanged.newManager = managerDomainAccount.id
    let airBlock = getOrCreateAirBlock(block)
    airDomainManagerChanged.createdAt = airBlock.id
    airDomainManagerChanged.hash = txHash
    airDomainManagerChanged.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_MANAGER_CHANGED_ID,
      airBlock
    )
    airDomainManagerChanged.save()
  }

  export function createAirDomain(
    id: string,
    block: ethereum.Block
  ): AirDomain {
    const airDomain = new AirDomain(id)
    const airBlock = getOrCreateAirBlock(block)
    airDomain.encodedName = ""
    airDomain.name = []
    airDomain.labelName = ""
    airDomain.isMigrated = false
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedBlock = airBlock.id
    airDomain.subdomainCount = BIG_INT_ZERO
    airDomain.fuses = BIG_INT_ZERO
    airDomain.isNameWrapped = false
    return airDomain
  }

  export function trackAirDomainManagerTransfer(
    txHash: Bytes,
    logIndex: BigInt,
    oldManager: Address,
    newManager: Address,
    domainId: string,
    migrate: bool,
    block: ethereum.Block
  ): void {
    log.debug("trackAirDomainManagerTransfer txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = getAirDomain(domainId)
    if (!migrate && airDomain.isMigrated) {
      log.info("domainId {} is already migrated,txHash {}", [
        domainId,
        txHash.toHexString(),
      ])
      return
    }
    if (migrate && !airDomain.isMigrated) {
      log.info("migrating domainId {} ,txHash {}", [
        domainId,
        txHash.toHexString(),
      ])
      airDomain.isMigrated = true
    }

    let oldManagerDomainAccount = getOrCreateAirDomainAccount(oldManager, block)
    let newManagerDomainAccount = getOrCreateAirDomainAccount(newManager, block)
    airDomain.manager = newManagerDomainAccount.id
    saveAirDomain(airDomain, block)
    // book keeping
    let airDomainManagerChanged = new AirDomainManagerChanged(
      createEventId("AirDomainManagerChanged", txHash, logIndex)
    )
    airDomainManagerChanged.domain = airDomain.id
    airDomainManagerChanged.newManager = newManagerDomainAccount.id
    airDomainManagerChanged.oldManager = oldManagerDomainAccount.id
    let airBlock = getOrCreateAirBlock(block)
    airDomainManagerChanged.createdAt = airBlock.id
    airDomainManagerChanged.hash = txHash
    airDomainManagerChanged.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_MANAGER_CHANGED_ID,
      airBlock
    )
    airDomainManagerChanged.save()
  }

  export function getOrCreateAirLabelName(
    labelName: string,
    labelHash: string,
    block: ethereum.Block
  ): AirLabelName {
    const airBlock = getOrCreateAirBlock(block)
    let airLabelName = AirLabelName.load(labelHash)
    if (!airLabelName) {
      airLabelName = new AirLabelName(labelHash)
      airLabelName.name = labelName
      airLabelName.createdAt = airBlock.id
    }
    return airLabelName
  }

  export function saveAirLabelName(
    airLabelName: AirLabelName,
    block: ethereum.Block
  ): void {
    const airBlock = getOrCreateAirBlock(block)
    airLabelName.lastUpdatedBlock = airBlock.id
    airLabelName.save()
  }

  export function trackAirLabelName(
    labelName: string,
    labelHash: string,
    block: ethereum.Block
  ): void {
    let airLabelName = getOrCreateAirLabelName(labelName, labelHash, block)
    if (airLabelName.name != "" && labelName != "") {
      log.debug("fixing labelHash {} 's labelname {}", [labelHash, labelName])
      airLabelName.name = labelName
      saveAirLabelName(airLabelName, block)
    }
  }
  // /**
  //  *
  //  * @param txHash
  //  * @param logIndex
  //  * @param parentDomainId
  //  * @param childDomainId
  //  * @param childName
  //  * @param childLabelHash
  //  * @param childLabelName
  //  * @param owner
  //  * @param block
  //  */

  export function trackSubDomainNewManager(
    txHash: Bytes,
    logIndex: BigInt,
    parentDomainId: string,
    domainId: string,
    labelHash: string,
    labelName: string,
    manager: Address,
    migrate: bool,
    block: ethereum.Block
  ): void {
    log.debug("trackSubDomainNewManager txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let parentAirDomain = getAirDomain(parentDomainId)
    parentAirDomain.subdomainCount = parentAirDomain.subdomainCount.plus(
      BIGINT_ONE
    )
    saveAirDomain(parentAirDomain, block)
    let airLabelName = getOrCreateAirLabelName(labelName, labelHash, block)
    let domain = getOrCreateAirDomain(domainId, block)
    if (!migrate && domain.isMigrated) {
      log.info("domainId {} is already migrated,txHash {}", [
        domainId,
        txHash.toHexString(),
      ])
      return
    }
    if (migrate && !domain.isMigrated) {
      log.info("migrating domainId {} ,txHash {}", [
        domainId,
        txHash.toHexString(),
      ])
      domain.isMigrated = true
    }
    domain.parent = parentAirDomain.id
    let domainName = parentAirDomain.name
    if (!domainName) {
      domainName = []
    }
    if (parentAirDomain.encodedName.length == 0) {
      domain.encodedName = labelHash
    } else {
      domain.encodedName = labelHash
        .concat(".")
        .concat(parentAirDomain.encodedName)
    }
    // pushing to array
    domainName.push(airLabelName.id)
    domain.name = domainName
    domain.labelName = airLabelName.id
    saveAirLabelName(airLabelName, block)

    let managerAirDomainAccount = getOrCreateAirDomainAccount(manager, block)
    managerAirDomainAccount.save()
    domain.manager = managerAirDomainAccount.id
    let airBlock = getOrCreateAirBlock(block)
    saveAirDomain(domain, block)

    // book keeping
    createAirDomainRegistrationOrRenew(
      txHash,
      logIndex,
      false,
      domain,
      BIG_INT_ZERO,
      BIG_INT_ZERO,
      BIG_INT_ZERO,
      managerAirDomainAccount,
      airBlock
    )
    // book keeping
    let airDomainManagerChanged = new AirDomainManagerChanged(
      createEventId("AirDomainManagerChanged", txHash, logIndex)
    )
    airDomainManagerChanged.domain = domain.id
    airDomainManagerChanged.newManager = managerAirDomainAccount.id
    airDomainManagerChanged.createdAt = airBlock.id
    airDomainManagerChanged.hash = txHash
    airDomainManagerChanged.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_MANAGER_CHANGED_ID,
      airBlock
    )
    airDomainManagerChanged.save()
  }

  export function trackDomainNewResolver(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    resolver: Address,
    migrate: bool,
    block: ethereum.Block
  ): void {
    log.debug("trackDomainNewResolver txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = getAirDomain(domainId)
    if (!migrate && airDomain.isMigrated) {
      log.info("domainId {} is already migrated,txHash {}", [
        domainId,
        txHash.toHexString(),
      ])
      return
    }
    if (migrate && !airDomain.isMigrated) {
      log.info("migrating domainId {} ,txHash {}", [
        domainId,
        txHash.toHexString(),
      ])
      airDomain.isMigrated = true
    }
    let resolverId: string | null
    // create resolver
    if (resolver.equals(Address.zero())) {
      resolverId = null
      airDomain.resolver = null
      saveAirDomain(airDomain, block)
    } else {
      let airResolver = getOrCreateAirResolver(domainId, resolver, block)
      airResolver.domain = domainId
      airResolver.resolverAddress = resolver
      saveAirResolver(airResolver, block)
      airDomain.resolver = airResolver.id
      saveAirDomain(airDomain, block)
      resolverId = airResolver.id
    }
    let airBlock = getOrCreateAirBlock(block)
    // book keeping
    let airDomainNewResolver = new AirDomainNewResolver(
      createEventId("AirDomainNewResolver", txHash, logIndex)
    )
    airDomainNewResolver.domain = airDomain.id
    airDomainNewResolver.resolver = resolverId
    airDomainNewResolver.createdAt = airBlock.id
    airDomainNewResolver.hash = txHash
    airDomainNewResolver.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_NEW_RESOLVER_ID,
      airBlock
    )
    airDomainNewResolver.save()
  }
  export function trackDomainNewTTL(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    ttl: BigInt,
    migrate: bool,
    block: ethereum.Block
  ): void {
    log.debug("trackDomainNewTTL txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = getAirDomain(domainId)
    if (!migrate && airDomain.isMigrated) {
      log.info("domainId {} is already migrated,txHash {}", [
        domainId,
        txHash.toHexString(),
      ])
      return
    }
    if (migrate && !airDomain.isMigrated) {
      log.info("migrating domainId {} ,txHash {}", [
        domainId,
        txHash.toHexString(),
      ])
      airDomain.isMigrated = true
    }
    airDomain.ttl = ttl
    saveAirDomain(airDomain, block)
    let airBlock = getOrCreateAirBlock(block)
    // book keeping
    let airDomainNewTTL = new AirDomainNewTTL(
      createEventId("AirDomainNewTTL", txHash, logIndex)
    )
    airDomainNewTTL.domain = airDomain.id
    airDomainNewTTL.ttl = ttl
    airDomainNewTTL.createdAt = airBlock.id
    airDomainNewTTL.hash = txHash
    airDomainNewTTL.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_NEW_TTL_CHANGED_ID,
      airBlock
    )
    airDomainNewTTL.save()
  }

  // resolver functions

  // this function updates lastUpdatedIndex of AirDomain if AirDomain & AirResolver are connected
  export function updateAirDomainLastUpdatedIndex(
    airDomain: AirDomain,
    airResolver: AirResolver,
    block: ethereum.Block
  ): void {
    if (airDomain.resolver == airResolver.id) {
      saveAirDomain(airDomain, block)
    }
  }

  export function trackResolvedAddress(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    resolverAddress: Address,
    resolvedAddress: Address,
    block: ethereum.Block
  ): void {
    log.debug("trackResolvedAddress txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = AirDomain.load(domainId)
    if (!airDomain) {
      log.debug(
        "trackResolvedAddress txHash {} logIndex {} domainId {} not found",
        [txHash.toHexString(), logIndex.toString(), domainId]
      )
      return
    }

    // update resolver only
    let resolvedDomainAccount = getOrCreateAirDomainAccount(
      resolvedAddress,
      block
    )

    let airResolver = getOrCreateAirResolver(domainId, resolverAddress, block)
    airResolver.resolvedAddress = resolvedDomainAccount.id
    saveAirResolver(airResolver, block)
    let airResolvedAddressChanged = new AirResolvedAddressChanged(
      txHash
        .toHexString()
        .concat("-")
        .concat(logIndex.toString())
    )
    airResolvedAddressChanged.resolver = airResolver.id
    let airBlock = getOrCreateAirBlock(block)
    airResolvedAddressChanged.createdAt = airBlock.id
    airResolvedAddressChanged.hash = txHash
    airResolvedAddressChanged.resolvedAddress = resolvedDomainAccount.id
    airResolvedAddressChanged.lastUpdatedIndex = updateAirEntityCounter(
      AIR_RESOLVER_RESOLVED_ADDRESS_CHANGED_ID,
      airBlock
    )
    airResolvedAddressChanged.save()
    updateAirDomainLastUpdatedIndex(airDomain, airResolver, block)
  }
  export function trackMultiCoinAddress(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    resolverAddress: Address,
    coinType: BigInt,
    newAddress: Bytes,
    block: ethereum.Block
  ): void {
    log.debug("trackMultiCoinAddress txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = AirDomain.load(domainId)
    if (!airDomain) {
      log.debug(
        "trackMultiCoinAddress txHash {} logIndex {} domainId {} not found",
        [txHash.toHexString(), logIndex.toString(), domainId]
      )
      return
    }
    let airResolver = getOrCreateAirResolver(domainId, resolverAddress, block)
    let airMultiCoin = AirMultiCoin.load(
      airResolver.id.concat("-").concat(coinType.toString())
    )
    if (!airMultiCoin) {
      airMultiCoin = new AirMultiCoin(
        airResolver.id.concat("-").concat(coinType.toString())
      )
    }
    airMultiCoin.resolver = airResolver.id
    airMultiCoin.coinType = coinType
    airMultiCoin.address = newAddress
    airMultiCoin.save()

    saveAirResolver(airResolver, block)
    updateAirDomainLastUpdatedIndex(airDomain, airResolver, block)
    // book keeping

    let airMultiCoinChanged = new AirMultiCoinChanged(
      txHash
        .toHexString()
        .concat("-")
        .concat(logIndex.toString())
    )
    airMultiCoinChanged.resolver = airResolver.id
    let airBlock = getOrCreateAirBlock(block)
    airMultiCoinChanged.createdAt = airBlock.id
    airMultiCoinChanged.hash = txHash
    airMultiCoinChanged.coinType = coinType
    airMultiCoinChanged.address = newAddress
    airMultiCoinChanged.lastUpdatedIndex = updateAirEntityCounter(
      AIR_RESOLVER_MULTICOIN_ADDRESS_CHANGED_ID,
      airBlock
    )
    airMultiCoinChanged.save()
  }
  export function trackAirTextChange(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    resolverAddress: Address,
    name: string,
    value: string,
    block: ethereum.Block
  ): void {
    log.debug("trackAirTextChange txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = AirDomain.load(domainId)
    if (!airDomain) {
      log.debug(
        "trackAirTextChange txHash {} logIndex {} domainId {} not found",
        [txHash.toHexString(), logIndex.toString(), domainId]
      )
      return
    }
    let airBlock = getOrCreateAirBlock(block)
    let airResolver = getOrCreateAirResolver(domainId, resolverAddress, block)
    let airText = AirText.load(airResolver.id.concat("-").concat(name))
    if (!airText) {
      airText = new AirText(airResolver.id.concat("-").concat(name))
      airText.createdAt = airBlock.id
    }
    airText.resolver = airResolver.id
    airText.name = name
    airText.value = value
    saveAirText(airText, block)

    saveAirResolver(airResolver, block)
    updateAirDomainLastUpdatedIndex(airDomain, airResolver, block)
    // book keeping
    let airTextChanged = new AirTextChanged(
      txHash
        .toHexString()
        .concat("-")
        .concat(logIndex.toString())
    )
    airTextChanged.resolver = airResolver.id
    airTextChanged.createdAt = airBlock.id
    airTextChanged.hash = txHash
    airTextChanged.name = name
    airTextChanged.value = value
    airTextChanged.lastUpdatedIndex = updateAirEntityCounter(
      AIR_RESOLVER_TEXT_CHANGED_ID,
      airBlock
    )
    airTextChanged.save()
  }

  export function trackAirDomainRegistrationDateAndCost(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    registrationDate: BigInt,
    cost: BigInt,
    owner: Address,
    block: ethereum.Block
  ): void {
    log.debug("trackAirDomainRegistrationDateAndCost txHash {}", [
      txHash.toHexString(),
    ])

    let airDomain = getAirDomain(domainId)
    airDomain.registrationDate = registrationDate
    airDomain.cost = cost
    saveAirDomain(airDomain, block)

    // book keeping
    let airBlock = getOrCreateAirBlock(block)
    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)
    createAirDomainRegistrationOrRenew(
      txHash,
      logIndex,
      false,
      airDomain,
      registrationDate,
      BIG_INT_ZERO,
      cost,
      ownerDomainAccount,
      airBlock
    )
  }
  export function trackAirDomainOwnershipRegistrationAndExpiry(
    tokenAddress: Address,
    tokenId: BigInt,
    domainId: string,
    expiryDate: BigInt,
    txHash: Bytes,
    owner: Address,
    block: ethereum.Block,
    logIndex: BigInt
  ): void {
    log.debug("trackAirDomainRegistrationExpiry txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let ownerAirDomainAccount = getOrCreateAirDomainAccount(owner, block)
    let airDomain = getAirDomain(domainId)
    let airToken = getOrCreateAirToken(getChainId(), tokenAddress.toHexString())
    airToken.save()
    airDomain.owner = ownerAirDomainAccount.id
    airDomain.tokenAddress = airToken.id
    airDomain.tokenId = tokenId.toString()
    airDomain.expiryDate = expiryDate
    saveAirDomain(airDomain, block)

    let airBlock = getOrCreateAirBlock(block)
    // book keeping
    createAirDomainRegistrationOrRenew(
      txHash,
      logIndex,
      false,
      airDomain,
      BIG_INT_ZERO,
      expiryDate,
      BIG_INT_ZERO,
      ownerAirDomainAccount,
      airBlock
    )
  }
  export function trackAirDomainRegistrationNameRenewed(
    tokenAddress: Address,
    tokenId: BigInt,
    domainId: string,
    expiryDate: BigInt,
    txHash: Bytes,
    renewer: Address,
    block: ethereum.Block,
    logIndex: BigInt
  ): void {
    log.debug("trackAirDomainRegistrationNameRenewed txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = getAirDomain(domainId)
    let airToken = getOrCreateAirToken(getChainId(), tokenAddress.toHexString())
    airToken.save()
    airDomain.tokenAddress = airToken.id
    airDomain.tokenId = tokenId.toString()
    airDomain.expiryDate = expiryDate
    saveAirDomain(airDomain, block)

    let renewerDomainAccount = getOrCreateAirDomainAccount(renewer, block)
    let airBlock = getOrCreateAirBlock(block)
    createAirDomainRegistrationOrRenew(
      txHash,
      logIndex,
      true,
      airDomain,
      BIG_INT_ZERO,
      expiryDate,
      BIG_INT_ZERO,
      renewerDomainAccount,
      airBlock
    )
  }
  export function trackAirDomainOwnershipTransfer(
    tokenAddress: Address,
    tokenId: BigInt,
    domainId: string,
    from: Address,
    to: Address,
    txHash: Bytes,
    block: ethereum.Block,
    logIndex: BigInt
  ): void {
    log.debug(
      "trackAirDomainOwnershipTransfer txHash {} logIndex {}  tokenAddress {}",
      [txHash.toHexString(), logIndex.toString(), tokenAddress.toHexString()]
    )
    let airDomain = getOrCreateAirDomain(domainId, block)
    let airToken = getOrCreateAirToken(getChainId(), tokenAddress.toHexString())
    airToken.save()
    airDomain.tokenAddress = airToken.id
    airDomain.tokenId = tokenId.toString()
    let fromDomainAccount = getOrCreateAirDomainAccount(from, block)
    let toDomainAccount = getOrCreateAirDomainAccount(to, block)
    airDomain.owner = toDomainAccount.id
    saveAirDomain(airDomain, block)

    // book keeping
    let airDomainOwnershipChanged = new AirDomainOwnershipChanged(
      txHash
        .toHexString()
        .concat("-")
        .concat(logIndex.toString())
    )
    airDomainOwnershipChanged.domain = airDomain.id
    let airBlock = getOrCreateAirBlock(block)
    airDomainOwnershipChanged.createdAt = airBlock.id
    airDomainOwnershipChanged.hash = txHash
    airDomainOwnershipChanged.newOwner = toDomainAccount.id
    airDomainOwnershipChanged.oldOwner = fromDomainAccount.id
    airDomainOwnershipChanged.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_OWNERSHIP_CHANGED_ID,
      airBlock
    )
    airDomainOwnershipChanged.save()
  }
  export function trackAirDomainCost(
    domainId: string,
    cost: BigInt,
    txHash: Bytes,
    logIndex: BigInt,
    block: ethereum.Block
  ): void {
    let airDomain = getAirDomain(domainId)
    airDomain.cost = cost
    saveAirDomain(airDomain, block)
    let airBlock = getOrCreateAirBlock(block)
    let airDomainCostSet = new AirDomainCostSet(
      createEventId("AirDomainCostSet", txHash, logIndex)
    )
    airDomainCostSet.domain = airDomain.id
    airDomainCostSet.cost = cost
    airDomainCostSet.hash = txHash
    airDomainCostSet.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_COST_CHANGED_ID,
      airBlock
    )
    airDomainCostSet.createdAt = airBlock.id
    airDomainCostSet.save()
  }
  export function trackAirDomainFusesSet(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    fuses: BigInt,
    block: ethereum.Block
  ): void {
    let airDomain = getAirDomain(domainId)
    airDomain.fuses = fuses
    saveAirDomain(airDomain, block)
    let airBlock = getOrCreateAirBlock(block)
    // book keeping
    let airDomainFusesSet = new AirDomainFusesSet(
      createEventId("AirDomainFusesSet", txHash, logIndex)
    )
    airDomainFusesSet.domain = airDomain.id
    airDomainFusesSet.createdAt = airBlock.id
    airDomainFusesSet.hash = txHash
    airDomainFusesSet.fuses = fuses
    airDomainFusesSet.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_FUSES_SET_CHANGED_ID,
      airBlock
    )
    airDomainFusesSet.save()
  }
  export function trackAirDomainExpiryExtended(
    txHash: Bytes,
    logIndex: BigInt,
    from: Address,
    domainId: string,
    expiry: BigInt,
    block: ethereum.Block
  ): void {
    let airDomain = getAirDomain(domainId)
    airDomain.expiryDate = expiry
    saveAirDomain(airDomain, block)

    let ownerDomainAccount = getOrCreateAirDomainAccount(from, block)
    let airBlock = getOrCreateAirBlock(block)
    createAirDomainRegistrationOrRenew(
      txHash,
      logIndex,
      true,
      airDomain,
      BIG_INT_ZERO,
      expiry,
      BIG_INT_ZERO,
      ownerDomainAccount,
      airBlock
    )
  }
  export function trackAirDomainRenewalNameCostExpiry(
    domainId: string,
    name: string,
    label: Bytes,
    cost: BigInt,
    expiryDate: BigInt,
    owner: Address,
    txHash: Bytes,
    logIndex: BigInt,
    block: ethereum.Block
  ): void {
    const labelHashStr = label.toHexString()
    log.debug(
      "trackAirDomainRenewalNameCostExpiry attempting to fix AirLabelName for hash {} with labelName {}",
      [labelHashStr, name]
    )
    trackAirLabelName(name, labelHashStr, block)
    let airDomain = getAirDomain(domainId)

    airDomain.expiryDate = expiryDate
    airDomain.cost = cost
    saveAirDomain(airDomain, block)

    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)

    let airBlock = getOrCreateAirBlock(block)

    createAirDomainRegistrationOrRenew(
      txHash,
      logIndex,
      true,
      airDomain,
      BIG_INT_ZERO,
      expiryDate,
      cost,
      ownerDomainAccount,
      airBlock
    )
  }
  const PARENT_CANNOT_CONTROL = BigInt.fromI32(65536)

  function checkPccBurned(fuses: BigInt): boolean {
    return fuses == PARENT_CANNOT_CONTROL
  }

  export function trackNameWrapped(
    domainId: string,
    labelName: string,
    expiryDate: BigInt,
    owner: Address,
    txHash: Bytes,
    block: ethereum.Block,
    logIndex: BigInt,
    fuses: BigInt
  ): void {
    log.debug("trackNameWrapped txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])

    let airDomain = getAirDomain(domainId)
    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)
    if (!airDomain.labelName && labelName.length > 0) {
      airDomain.labelName = labelName
    }
    airDomain.fuses = fuses
    airDomain.isNameWrapped = true
    if (
      checkPccBurned(fuses) &&
      (!airDomain.expiryDate || expiryDate > airDomain.expiryDate!)
    ) {
      log.debug("Updating expiryDate of nameWrapped airDomain {} txHash {} ", [
        airDomain.id,
        txHash.toHexString(),
      ])
      airDomain.expiryDate = expiryDate
    }
    saveAirDomain(airDomain, block)

    let airBlock = getOrCreateAirBlock(block)

    // book keeping
    let airDomainNameWrapped = new AirDomainNameWrapped(
      txHash
        .toHexString()
        .concat("-")
        .concat(logIndex.toString())
    )
    airDomainNameWrapped.domain = airDomain.id
    airDomainNameWrapped.createdAt = airBlock.id
    airDomainNameWrapped.hash = txHash
    airDomainNameWrapped.owner = ownerDomainAccount.id
    airDomainNameWrapped.expiryDate = expiryDate
    airDomainNameWrapped.fuses = fuses
    airDomainNameWrapped.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_NAME_WRAPPED_ID,
      airBlock
    )
    airDomainNameWrapped.save()
  }
  export function trackNameUnwrapped(
    txHash: Bytes,
    logIndex: BigInt,
    owner: Address,
    domainId: string,
    block: ethereum.Block
  ): void {
    log.debug("trackNameUnwrapped ", [])
    let airDomain = getAirDomain(domainId)
    airDomain.isNameWrapped = false
    if (airDomain.expiryDate && airDomain.parent !== ETH_NODE_STR) {
      airDomain.expiryDate = null
    }
    saveAirDomain(airDomain, block)

    // book keeping
    let airDomainNameUnwrapped = new AirDomainNameUnwrapped(
      txHash
        .toHexString()
        .concat("-")
        .concat(logIndex.toString())
    )
    airDomainNameUnwrapped.domain = airDomain.id

    let airBlock = getOrCreateAirBlock(block)

    airDomainNameUnwrapped.createdAt = airBlock.id
    airDomainNameUnwrapped.hash = txHash
    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)

    airDomainNameUnwrapped.owner = ownerDomainAccount.id
    airDomainNameUnwrapped.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_NAME_UNWRAPPED_ID,
      airBlock
    )
    airDomainNameUnwrapped.save()
  }

  export function trackSetName(
    txHash: Bytes,
    logOrCallIndex: BigInt,
    name: string,
    domainId: string,
    resolvedAddress: Address,
    block: ethereum.Block
  ): void {
    log.debug("trackSetName txHash {}", [txHash.toHexString()])
    let resolvedAddressDomainAccount = getOrCreateAirDomainAccount(
      resolvedAddress,
      block
    )
    let airBlock = getOrCreateAirBlock(block)
    let airNameSet = createOrUpdateAirNameSet(
      resolvedAddressDomainAccount,
      name,
      domainId,
      block
    )
    resolvedAddressDomainAccount.nameSet = airNameSet.id
    resolvedAddressDomainAccount.save()
    // book keeping
    let airNameSetEvent = new AirNameSetEvent(
      createEventId("AirNameSetEvent", txHash, logOrCallIndex)
    )
    airNameSetEvent.nameSet = airNameSet.id
    airNameSetEvent.createdAt = airNameSet.lastUpdatedBlock
    airNameSetEvent.hash = txHash
    airNameSetEvent.resolvedAddressDomainAccount =
      resolvedAddressDomainAccount.id
    airNameSetEvent.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_NAME_SET_EVENT_ID,
      airBlock
    )
    airNameSetEvent.save()
  }

  export function getOrCreateAirResolver(
    domainId: string,
    resolverAddress: Bytes,
    block: ethereum.Block
  ): AirResolver {
    let airBlock = getOrCreateAirBlock(block)
    const id = domainId.concat("-").concat(resolverAddress.toHexString())
    let airResolver = AirResolver.load(id)
    if (!airResolver) {
      airResolver = new AirResolver(id)
      airResolver.domain = domainId
      airResolver.createdAt = airBlock.id
      airResolver.resolverAddress = resolverAddress
    }
    return airResolver
  }

  export function saveAirResolver(
    resolver: AirResolver,
    block: ethereum.Block
  ): void {
    const airBlock = getOrCreateAirBlock(block)
    resolver.lastUpdatedBlock = airBlock.id
    resolver.lastUpdatedIndex = updateAirEntityCounter(
      AIR_RESOLVER_CHANGED_ID,
      airBlock
    )
    resolver.save()
  }

  function createEventId(
    entityName: string,
    txHash: Bytes,
    logIndex: BigInt
  ): string {
    return entityName
      .concat("-")
      .concat(txHash.toHexString())
      .concat("-")
      .concat(logIndex.toString())
  }

  function createAirDomainRegistrationOrRenew(
    txHash: Bytes,
    logIndex: BigInt,
    isRenew: boolean,
    domain: AirDomain,
    registrationDate: BigInt,
    expiryDate: BigInt,
    cost: BigInt,
    owner: AirDomainAccount,
    block: AirBlock
  ): void {
    let airDomainRegistrationOrRenew = new AirDomainRegistrationOrRenew(
      createEventId("AirDomainRegistrationOrRenew", txHash, logIndex)
    )
    airDomainRegistrationOrRenew.isRenew = isRenew
    airDomainRegistrationOrRenew.hash = txHash
    airDomainRegistrationOrRenew.domain = domain.id
    airDomainRegistrationOrRenew.registrationDate = registrationDate
    airDomainRegistrationOrRenew.expiryDate = expiryDate
    airDomainRegistrationOrRenew.cost = cost
    airDomainRegistrationOrRenew.owner = owner.id
    airDomainRegistrationOrRenew.createdAt = block.id
    airDomainRegistrationOrRenew.lastUpdatedIndex = updateAirEntityCounter(
      AIR_DOMAIN_REGISTRATION_OR_RENEW_CHANGED_ID,
      block
    )
    airDomainRegistrationOrRenew.save()
  }
  function createOrUpdateAirNameSet(
    from: AirDomainAccount,
    name: string,
    domainId: string,
    block: ethereum.Block
  ): AirNameSet {
    let airNameSetId = from.id.concat("-").concat(domainId)
    let airBlock = getOrCreateAirBlock(block)
    let airNameSet = AirNameSet.load(airNameSetId)
    if (!airNameSet) {
      airNameSet = new AirNameSet(airNameSetId)
      airNameSet.createdAt = airBlock.id
    }
    airNameSet.from = from.id
    airNameSet.name = name
    airNameSet.domain = domainId
    airNameSet.domainId = domainId
    airNameSet.lastUpdatedBlock = airBlock.id
    airNameSet.lastUpdatedIndex = updateAirEntityCounter(
      AIR_NAME_SET_ID,
      airBlock
    )
    airNameSet.save()
    // updates lastUpdatedIndex only if it's connected to AirDomain
    let airDomain = AirDomain.load(domainId)
    if (airDomain) {
      saveAirDomain(airDomain, block)
    }
    return airNameSet
  }
}
