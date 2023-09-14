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
  AirDomainTransferred,
  AirDomainNameWrapped,
  AirDomainRegistrationOrRenew,
  AirBlock,
  AirDomainNewResolver,
  AirDomainNewTTL,
  AirDomainNameUnwrapped,
  AirDomainPrimary,
  AirLabelName,
  AirText,
  AirTextChanged,
  AirMultiCoinChanged,
  AirMultiCoin,
  AirResolvedAddressChanged,
  AirDomainPrimarySet,
  AirDomainFusesSet,
} from "../../../generated/schema"
import {
  AIR_DOMAIN_CHANGED_ID,
  AIR_RESOLVER_CHANGED_ID,
  ROOT_NODE,
} from "./utils"
import {
  BIG_INT_ZERO,
  getChainId,
  updateAirEntityCounter,
  getOrCreateAirAccount,
  BIGINT_ONE,
} from "../common"

export namespace domain {
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
    airBlock.save()
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
    return blockEntity as AirBlock
  }

  export function createAirDomainWithOwner(
    domainId: string,
    owner: Address,
    block: ethereum.Block
  ): void {
    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)
    let domain = getOrCreateAirDomain(domainId, block)
    let labelName = getOrCreateAirLabelName(ROOT_NODE, ROOT_NODE, block)
    domain.labelName = labelName.id
    domain.name = [labelName.id]
    domain.encodedName = ""
    saveAirLabelName(labelName, block)
    domain.owner = ownerDomainAccount.id
    domain.manager = ownerDomainAccount.id
    saveAirDomain(domain, block)
  }

  export function getOrCreateAirDomain(
    id: string,
    block: ethereum.Block
  ): AirDomain {
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    let airDomain = AirDomain.load(id)
    if (airDomain == null) {
      airDomain = createAirDomain(id, block)
    }
    return airDomain
  }

  export function createAirDomain(
    id: string,
    block: ethereum.Block
  ): AirDomain {
    const airDomain = new AirDomain(id)
    const airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomain.encodedName = ""
    airDomain.name = []
    airDomain.labelName = ""
    airDomain.isPrimary = false
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedBlock = airBlock.id
    airDomain.subdomainCount = BIG_INT_ZERO
    airDomain.fuses = BIG_INT_ZERO
    airDomain.isNameWrapped = false
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

  export function trackAirDomainTransfer(
    txHash: Bytes,
    logIndex: BigInt,
    oldOwner: Address,
    newOwner: Address,
    domainId: string,
    block: ethereum.Block
  ): void {
    log.debug("trackAirDomainTransfer txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let oldOwnerDomainAccount = getOrCreateAirDomainAccount(oldOwner, block)
    let newOwnerDomainAccount = getOrCreateAirDomainAccount(newOwner, block)
    let airDomain = AirDomain.load(domainId)
    if (!airDomain) {
      throw new Error("Domain not found,domainId: " + domainId)
    }
    airDomain.owner = newOwnerDomainAccount.id
    airDomain.manager = newOwnerDomainAccount.id
    saveAirDomain(airDomain, block)
    // book keeping
    let airDomainTransferred = new AirDomainTransferred(
      createEventId(txHash, logIndex)
    )
    airDomainTransferred.domain = airDomain.id
    airDomainTransferred.newOwner = newOwnerDomainAccount.id
    airDomainTransferred.oldOwner = oldOwnerDomainAccount.id
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomainTransferred.createdAt = airBlock.id
    airDomainTransferred.hash = txHash
    airDomainTransferred.save()
  }

  export function getOrCreateAirLabelName(
    labelName: string,
    labelHash: string,
    block: ethereum.Block
  ): AirLabelName {
    const airBlock = getOrCreateAirBlock(block)
    airBlock.save()

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
    airBlock.save()
    airLabelName.lastUpdatedBlock = airBlock.id
    airLabelName.save()
  }

  export function trackAirLabelName(
    labelName: string,
    labelHash: string,
    block: ethereum.Block
  ): void {
    let airLabelName = getOrCreateAirLabelName(labelName, labelHash, block)
    if (airLabelName.name.length == 0 && labelName.length > 0) {
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

  export function trackSubDomainNewOwner(
    txHash: Bytes,
    logIndex: BigInt,
    parentDomainId: string,
    domainId: string,
    labelHash: string,
    labelName: string,
    owner: Address,
    block: ethereum.Block
  ): void {
    log.debug("trackSubDomainNewOwner txHash {} logIndex {}", [
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
    domain.parent = parentAirDomain.id
    let domainName = parentAirDomain.name
    if (domainName.length == 1 && domainName[0] == ROOT_NODE) {
      domainName = []
    }
    if (parentAirDomain.encodedName.length == 0) {
      domain.encodedName = labelHash
    } else {
      domain.encodedName = labelHash
        .concat(".")
        .concat(parentAirDomain.encodedName)
    }
    let status = domainName.push(airLabelName.id)
    log.debug("pushStatus {}", [status.toString()])
    domain.name = domainName
    domain.labelName = airLabelName.id
    saveAirLabelName(airLabelName, block)

    let ownerAirDomainAccount = getOrCreateAirDomainAccount(owner, block)
    ownerAirDomainAccount.save()
    domain.manager = ownerAirDomainAccount.id
    domain.owner = ownerAirDomainAccount.id
    domain.isPrimary = false
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    domain.createdAt = airBlock.id
    saveAirDomain(domain, block)

    // book keeping
    let airDomainRegistration = new AirDomainRegistrationOrRenew(
      createEventId(txHash, logIndex)
    )
    airDomainRegistration.domain = domain.id
    airDomainRegistration.owner = ownerAirDomainAccount.id
    airDomainRegistration.createdAt = airBlock.id
    airDomainRegistration.hash = txHash
    airDomainRegistration.save()
  }

  export function trackDomainNewResolver(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    resolver: Address,
    block: ethereum.Block
  ): void {
    log.debug("trackDomainNewResolver txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = getAirDomain(domainId)
    // create resolver
    let airResolver = getOrCreateAirResolver(domainId, resolver, block)
    airResolver.domain = domainId
    airResolver.resolverAddress = resolver
    saveAirResolver(airResolver, block)
    airDomain.resolver = airResolver.id
    saveAirDomain(airDomain, block)
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    // book keeping
    let airDomainNewResolver = new AirDomainNewResolver(
      createEventId(txHash, logIndex)
    )
    airDomainNewResolver.domain = airDomain.id
    airDomainNewResolver.resolver = airResolver.id
    airDomainNewResolver.createdAt = airBlock.id
    airDomainNewResolver.hash = txHash
    airDomainNewResolver.save()
  }
  export function trackDomainNewTTL(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    ttl: BigInt,
    block: ethereum.Block
  ): void {
    log.debug("trackDomainNewTTL txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = getAirDomain(domainId)
    airDomain.ttl = ttl
    saveAirDomain(airDomain, block)
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    // book keeping
    let airDomainNewTTL = new AirDomainNewTTL(createEventId(txHash, logIndex))
    airDomainNewTTL.domain = airDomain.id
    airDomainNewTTL.ttl = ttl
    airDomainNewTTL.createdAt = airBlock.id
    airDomainNewTTL.hash = txHash
    airDomainNewTTL.save()
  }
  export function trackResolvedAddress(
    txHash: Bytes,
    logIndex: BigInt,
    domainId: string,
    resolverAddress: Address,
    resolvedAddress: Address,
    block: ethereum.Block
  ): void {
    log.debug("trackResolvedAddress", [])

    let airDomain = AirDomain.load(domainId)
    let resolverId = domainId.concat("-").concat(resolverAddress.toHexString())
    if (airDomain && airDomain.resolver == resolverId) {
      let resolvedDomainAccount = getOrCreateAirDomainAccount(
        resolvedAddress,
        block
      )

      let airResolver = AirResolver.load(resolverId)
      if (!airResolver) {
        throw new Error(
          "AirResolver should not be empty,txHash +" + txHash.toHexString()
        )
      }
      airResolver.resolvedAddress = resolvedDomainAccount.id
      saveAirResolver(airResolver, block)
      // book keeping

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
      airResolvedAddressChanged.save()

      // update primary domain
      let airPrimarySet = AirDomainPrimary.load(resolvedAddress.toHexString())
      if (airPrimarySet) {
        if (domainId == airPrimarySet.domain) {
          if (!airDomain.isPrimary) {
            log.debug(
              "switching isPrimary back , resolverAddress {} resolvedAddress {} txHash {}",
              [
                resolverAddress.toHexString(),
                resolvedAddress.toHexString(),
                txHash.toHexString(),
              ]
            )
            airDomain.isPrimary = true
            saveAirDomain(airDomain, block)

            // book keeping
            let airDomainPrimarySet = new AirDomainPrimarySet(
              createEventId(txHash, logIndex)
                .concat("-")
                .concat("AirDomainPrimarySet")
            )
            airDomainPrimarySet.domain = airDomain.id
            let airBlock = getOrCreateAirBlock(block)
            airDomainPrimarySet.createdAt = airBlock.id
            airDomainPrimarySet.hash = txHash
            airDomainPrimarySet.resolvedAddress = resolvedDomainAccount.id
            airDomainPrimarySet.save()
          }
        }
      }
    }
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
    log.debug("trackMultiCoinAddress", [])
    let airResolver = getAirResolver(domainId, resolverAddress, false)
    if (!airResolver) {
      return
    }
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
    log.debug("trackAirTextChange", [])

    let airResolver = getAirResolver(domainId, resolverAddress, false)
    if (!airResolver) {
      return
    }

    let airText = AirText.load(airResolver.id.concat("-").concat(name))
    if (!airText) {
      airText = new AirText(airResolver.id.concat("-").concat(name))
    }
    airText.resolver = airResolver.id
    airText.name = name
    airText.value = value
    airText.save()

    saveAirResolver(airResolver, block)

    // book keeping
    let airTextChanged = new AirTextChanged(
      txHash
        .toHexString()
        .concat("-")
        .concat(logIndex.toString())
    )
    airTextChanged.resolver = airResolver.id
    let airBlock = getOrCreateAirBlock(block)
    airTextChanged.createdAt = airBlock.id
    airTextChanged.hash = txHash
    airTextChanged.name = name
    airTextChanged.value = value
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
    airBlock.save()
    let airDomainRegistration = new AirDomainRegistrationOrRenew(
      createEventId(txHash, logIndex)
    )
    airDomainRegistration.domain = airDomain.id
    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)
    airDomainRegistration.owner = ownerDomainAccount.id
    airDomainRegistration.createdAt = airBlock.id
    airDomainRegistration.hash = txHash
    airDomainRegistration.isRenew = false
    airDomainRegistration.cost = cost
    airDomainRegistration.registrationDate = registrationDate
    airDomainRegistration.save()
  }
  export function trackAirDomainRegistrationExpiry(
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
    let airDomain = getAirDomain(domainId)
    if (airDomain.tokenAddress != tokenAddress.toHexString()) {
      airDomain.tokenAddress = tokenAddress.toHexString()
      airDomain.tokenId = tokenId.toString()
    }
    airDomain.expiryDate = expiryDate
    saveAirDomain(airDomain, block)

    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    // book keeping
    let airDomainRegistration = new AirDomainRegistrationOrRenew(
      createEventId(txHash, logIndex)
    )
    let ownerAirDomainAccount = getOrCreateAirDomainAccount(owner, block)
    airDomainRegistration.domain = airDomain.id
    airDomainRegistration.owner = ownerAirDomainAccount.id
    airDomainRegistration.createdAt = airBlock.id
    airDomainRegistration.hash = txHash
    airDomainRegistration.isRenew = false
    airDomainRegistration.save()
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
    if (airDomain.tokenAddress != tokenAddress.toHexString()) {
      airDomain.tokenAddress = tokenAddress.toHexString()
      airDomain.tokenId = tokenId.toString()
    }
    airDomain.expiryDate = expiryDate
    saveAirDomain(airDomain, block)

    let renewerDomainAccount = getOrCreateAirDomainAccount(renewer, block)
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    let airDomainRegistration = new AirDomainRegistrationOrRenew(
      createEventId(txHash, logIndex)
    )
    airDomainRegistration.domain = airDomain.id
    airDomainRegistration.owner = renewerDomainAccount.id
    airDomainRegistration.createdAt = airBlock.id
    airDomainRegistration.hash = txHash
    airDomainRegistration.isRenew = true
    airDomainRegistration.save()
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
    log.debug("trackAirDomainOwnershipTransfer txHash {} logIndex {}", [
      txHash.toHexString(),
      logIndex.toString(),
    ])
    let airDomain = getOrCreateAirDomain(domainId, block)
    if (airDomain.tokenAddress != tokenAddress.toHexString()) {
      airDomain.tokenAddress = tokenAddress.toHexString()
      airDomain.tokenId = tokenId.toString()
    }
    let fromDomainAccount = getOrCreateAirDomainAccount(from, block)
    let toDomainAccount = getOrCreateAirDomainAccount(to, block)

    airDomain.owner = toDomainAccount.id
    if (airDomain.manager == "") {
      airDomain.manager = toDomainAccount.id
    }
    saveAirDomain(airDomain, block)

    // book keeping
    let airDomainTransfer = new AirDomainTransferred(
      txHash
        .toHexString()
        .concat("-")
        .concat(logIndex.toString())
    )
    airDomainTransfer.domain = airDomain.id
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomainTransfer.createdAt = airBlock.id
    airDomainTransfer.hash = txHash
    airDomainTransfer.newOwner = toDomainAccount.id
    airDomainTransfer.oldOwner = fromDomainAccount.id
    airDomainTransfer.save()
  }
  export function trackAirDomainRegistrationNameCostExpiry(
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
      "trackAirDomainRegistrationNameCostExpiry attempting to fix AirLabelName for hash {} with labelName {}",
      [labelHashStr, name]
    )
    trackAirLabelName(name, labelHashStr, block)
    let airDomain = getAirDomain(domainId)
    airDomain.cost = cost
    airDomain.expiryDate = expiryDate
    saveAirDomain(airDomain, block)
    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)

    saveAirDomain(airDomain, block)

    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()

    let airDomainRegistration = new AirDomainRegistrationOrRenew(
      createEventId(txHash, logIndex)
    )
    airDomainRegistration.domain = airDomain.id
    airDomainRegistration.owner = ownerDomainAccount.id
    airDomainRegistration.createdAt = airBlock.id
    airDomainRegistration.hash = txHash
    airDomainRegistration.isRenew = false
    airDomainRegistration.save()
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
    airBlock.save()
    // book keeping
    let airDomainFusesSet = new AirDomainFusesSet(
      createEventId(txHash, logIndex)
    )
    airDomainFusesSet.domain = airDomain.id
    airDomainFusesSet.createdAt = airBlock.id
    airDomainFusesSet.hash = txHash
    airDomainFusesSet.fuses = fuses
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
    airBlock.save()

    let airDomainRegistration = new AirDomainRegistrationOrRenew(
      createEventId(txHash, logIndex)
    )
    airDomainRegistration.domain = airDomain.id
    airDomainRegistration.owner = ownerDomainAccount.id
    airDomainRegistration.createdAt = airBlock.id
    airDomainRegistration.hash = txHash
    airDomainRegistration.isRenew = true
    airDomainRegistration.save()
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
    airBlock.save()

    let airDomainRegistration = new AirDomainRegistrationOrRenew(
      createEventId(txHash, logIndex)
    )
    airDomainRegistration.domain = airDomain.id
    airDomainRegistration.owner = ownerDomainAccount.id
    airDomainRegistration.createdAt = airBlock.id
    airDomainRegistration.hash = txHash
    airDomainRegistration.isRenew = true
    airDomainRegistration.save()
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
    airDomain.expiryDate = expiryDate
    saveAirDomain(airDomain, block)

    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()

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
    airBlock.save()

    airDomainNameUnwrapped.createdAt = airBlock.id
    airDomainNameUnwrapped.hash = txHash
    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)

    airDomainNameUnwrapped.owner = ownerDomainAccount.id
    airDomainNameUnwrapped.save()
  }

  function getOrCreateAirDomainPrimary(
    resolvedAddress: Address
  ): AirDomainPrimary {
    let airDomainPrimary = AirDomainPrimary.load(resolvedAddress.toHexString())
    if (!airDomainPrimary) {
      airDomainPrimary = new AirDomainPrimary(resolvedAddress.toHexString())
    }
    return airDomainPrimary
  }

  export function trackSetPrimaryDomain(
    txHash: Bytes,
    logOrCallIndex: BigInt,
    domainId: string,
    resolvedAddress: Address,
    block: ethereum.Block
  ): void {
    log.debug("trackSetPrimaryDomain txHash {}", [txHash.toHexString()])
    let resolvedAddressDomainAccount = getOrCreateAirDomainAccount(
      resolvedAddress,
      block
    )
    let airDomain = AirDomain.load(domainId)
    if (!airDomain) {
      log.error(" airDomain not found , domainId {}", [domainId])
      return
    }
    let airResolverId = airDomain.resolver
    if (!airResolverId) {
      log.error(" airResolverId not found ", [])
      return
    }
    let airResolver = AirResolver.load(airResolverId!)
    if (!airResolver) {
      log.error(" airResolver not found ", [])
      return
    }
    if (airResolver.resolvedAddress == resolvedAddressDomainAccount.id) {
      airDomain.isPrimary = true
    }
    saveAirDomain(airDomain, block)
    let airPrimarySets = getOrCreateAirDomainPrimary(resolvedAddress)
    airPrimarySets.domain = airDomain.id
    airPrimarySets.save()
    let airDomainAccount = getOrCreateAirDomainAccount(resolvedAddress, block)
    // book keeping
    let airDomainPrimarySet = new AirDomainPrimarySet(
      createEventId(txHash, logOrCallIndex)
        .concat("-")
        .concat("AirDomainPrimarySet")
    )
    airDomainPrimarySet.domain = airDomain.id
    let airBlock = getOrCreateAirBlock(block)
    airDomainPrimarySet.createdAt = airBlock.id
    airDomainPrimarySet.hash = txHash
    airDomainPrimarySet.resolvedAddress = airDomainAccount.id
    airDomainPrimarySet.save()
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
    airBlock.save()
    resolver.lastUpdatedBlock = airBlock.id
    resolver.lastUpdatedIndex = updateAirEntityCounter(
      AIR_RESOLVER_CHANGED_ID,
      airBlock
    )
    resolver.save()
  }

  export function getAirResolver(
    domainId: string,
    resolverAddress: Address,
    throwErr: bool
  ): AirResolver | null {
    let resolverId = domainId.concat("-").concat(resolverAddress.toHexString())
    let airResolver = AirResolver.load(resolverId)
    if (!airResolver && throwErr) {
      throw new Error(
        "Resolver not found,domainId: " +
          domainId +
          ", resolverAdress: " +
          resolverAddress.toHexString()
      )
    }
    return airResolver
  }

  function createEventId(txHash: Bytes, logIndex: BigInt): string {
    return txHash
      .toHexString()
      .concat("-")
      .concat(logIndex.toString())
  }
}
