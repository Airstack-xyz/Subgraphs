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
  AirExtra,
  AirDomainTransferred,
  AirDomainNameWrapped,
  AirDomainRegistrationOrRenew,
  AirBlock,
  AirDomainRegistered,
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
} from "../../../generated/schema"
import {
  AIR_DOMAIN_CHANGED_ID,
  AIR_DOMAIN_REGISTRATION_OR_RENEW_CHANGED_ID,
  AIR_RESOLVER_CHANGED_ID,
  ROOT_NODE,
  ZERO_ADDRESS,
} from "./utils"
import {
  BIG_INT_ZERO,
  getChainId,
  updateAirEntityCounter,
  getOrCreateAirBlock,
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
    let airDomainRegistered = new AirDomainRegistered(
      createEventId(txHash, logIndex)
    )
    airDomainRegistered.domain = domain.id
    airDomainRegistered.owner = ownerAirDomainAccount.id
    airDomainRegistered.createdAt = airBlock.id
    airDomainRegistered.hash = txHash
    airDomainRegistered.save()
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
    log.debug("trackDomainNewTTL", [])

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

      let aAirResolvedAddressChanged = new AirResolvedAddressChanged(
        txHash
          .toHexString()
          .concat("-")
          .concat(logIndex.toString())
      )
      aAirResolvedAddressChanged.resolver = airResolver.id
      let airBlock = getOrCreateAirBlock(block)
      aAirResolvedAddressChanged.createdAt = airBlock.id
      aAirResolvedAddressChanged.hash = txHash
      aAirResolvedAddressChanged.resolvedAddress = resolvedDomainAccount.id
      aAirResolvedAddressChanged.save()

      // update resolvedArray
      let resolvedDomainArr = resolvedDomainAccount.resolved
      if (!resolvedDomainArr) {
        resolvedDomainArr = []
      }
      resolvedDomainArr.push(airDomain.id)
      resolvedDomainAccount.resolved = resolvedDomainArr
      resolvedDomainAccount.save()

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
    let airDomainRegistration = getOrCreateAirDomainRegistrationOrRenew(
      txHash,
      airDomain.id,
      block
    )
    airDomainRegistration.domain = airDomain.id
    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)
    airDomainRegistration.owner = ownerDomainAccount.id
    airDomainRegistration.cost = cost
    airDomainRegistration.registrationDate = registrationDate
    airDomainRegistration.isRenew = false
    airDomainRegistration.hash = txHash
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomainRegistration.createdAt = airBlock.id
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
    let airDomainRegistration = getOrCreateAirDomainRegistrationOrRenew(
      txHash,
      airDomain.id,
      block
    )
    airDomainRegistration.domain = airDomain.id
    let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)
    airDomainRegistration.owner = ownerDomainAccount.id
    airDomainRegistration.expiryDate = expiryDate
    airDomainRegistration.isRenew = false
    airDomainRegistration.hash = txHash
    airDomainRegistration.registrationDate = block.timestamp
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomainRegistration.createdAt = airBlock.id
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
    let airDomainRenew = getOrCreateAirDomainRegistrationOrRenew(
      txHash,
      airDomain.id,
      block
    )
    airDomainRenew.expiryDate = expiryDate
    airDomainRenew.isRenew = true
    airDomainRenew.hash = txHash
    airDomainRenew.domain = airDomain.id
    airDomainRenew.registrationDate = block.timestamp

    let renewerDomainAccount = getOrCreateAirDomainAccount(renewer, block)
    airDomainRenew.owner = renewerDomainAccount.id
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomainRenew.createdAt = airBlock.id
    airDomainRenew.save()
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
    let airDomainRegistration = getOrCreateAirDomainRegistrationOrRenew(
      txHash,
      airDomain.id,
      block
    )
    airDomainRegistration.cost = cost
    airDomainRegistration.domain = airDomain.id
    airDomainRegistration.owner = ownerDomainAccount.id
    airDomainRegistration.expiryDate = expiryDate
    airDomainRegistration.isRenew = false
    airDomainRegistration.hash = txHash
    airDomainRegistration.registrationDate = block.timestamp
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomainRegistration.createdAt = airBlock.id
    airDomainRegistration.save()
  }
  export function trackAirDomainFusesSet(
    domainId: string,
    fuses: BigInt,
    block: ethereum.Block
  ): void {
    let airDomain = getAirDomain(domainId)
    airDomain.fuses = fuses
    saveAirDomain(airDomain, block)
  }
  export function trackAirDomainExpiryExtended(
    txHash: Bytes,
    from: Address,
    domainId: string,
    expiry: BigInt,
    block: ethereum.Block
  ): void {
    let airDomain = getAirDomain(domainId)
    airDomain.expiryDate = expiry
    saveAirDomain(airDomain, block)

    let airDomainRenew = getOrCreateAirDomainRegistrationOrRenew(
      txHash,
      airDomain.id,
      block
    )
    airDomainRenew.expiryDate = expiry
    airDomainRenew.registrationDate = block.timestamp
    airDomainRenew.isRenew = true
    airDomainRenew.domain = airDomain.id
    airDomainRenew.hash = txHash
    let ownerDomainAccount = getOrCreateAirDomainAccount(from, block)
    airDomainRenew.owner = ownerDomainAccount.id
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomainRenew.createdAt = airBlock.id
    airDomainRenew.save()
  }
  export function trackAirDomainRenewalNameCostExpiry(
    domainId: string,
    name: string,
    label: Bytes,
    cost: BigInt,
    expiryDate: BigInt,
    owner: Address,
    txHash: Bytes,
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
    let airDomainRenew = getOrCreateAirDomainRegistrationOrRenew(
      txHash,
      airDomain.id,
      block
    )
    airDomainRenew.cost = cost
    airDomainRenew.domain = airDomain.id
    airDomainRenew.owner = ownerDomainAccount.id
    airDomainRenew.expiryDate = expiryDate
    airDomainRenew.isRenew = true
    airDomainRenew.hash = txHash
    airDomainRenew.registrationDate = block.timestamp
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomainRenew.createdAt = airBlock.id
    airDomainRenew.save()
  }

  export function trackNameWrapped(
    domainId: string,
    name: string,
    labelName: string,
    expiryDate: BigInt,
    owner: Address,
    txHash: Bytes,
    block: ethereum.Block,
    logIndex: BigInt,
    fuses: BigInt
  ): void {
    log.debug("trackAirDomainRenewalNameCostExpiry txHash {} logIndex {}", [
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

    let airDomainRegistration = getOrCreateAirDomainRegistrationOrRenew(
      txHash,
      airDomain.id,
      block
    )
    airDomainRegistration.domain = airDomain.id
    airDomainRegistration.hash = txHash
    airDomainRegistration.expiryDate = expiryDate
    airDomainRegistration.registrationDate = block.timestamp
    airDomainRegistration.owner = ownerDomainAccount.id
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    airDomainRegistration.createdAt = airBlock.id
    airDomainRegistration.save()
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
  export function getOrCreateAirDomainRegistrationOrRenew(
    hash: Bytes,
    domainId: string,
    block: ethereum.Block
  ): AirDomainRegistrationOrRenew {
    let airBlock = getOrCreateAirBlock(block)
    airBlock.save()
    let id = domainId.concat("-").concat(hash.toHexString())
    let airDomainRegistration = AirDomainRegistrationOrRenew.load(id)
    if (!airDomainRegistration) {
      airDomainRegistration = new AirDomainRegistrationOrRenew(id)
      airDomainRegistration.createdAt = airBlock.id
    }
    return airDomainRegistration
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
  export function getAirDomainRegistrationOrRenew(
    txHash: Bytes,
    domainId: string,
    throwErr: bool
  ): AirDomainRegistrationOrRenew | null {
    let id = domainId.concat(txHash.toHexString())
    let airDomainRegistrationOrRenew = AirDomainRegistrationOrRenew.load(id)
    if (!airDomainRegistrationOrRenew && throwErr) {
      throw new Error("AirDomainRegistrationOrRenew not found,id: " + id)
    }
    return airDomainRegistrationOrRenew
  }

  function createEventId(txHash: Bytes, logIndex: BigInt): string {
    return txHash
      .toHexString()
      .concat("-")
      .concat(logIndex.toString())
  }
}
