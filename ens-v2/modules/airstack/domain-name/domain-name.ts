import { BigInt, Bytes, crypto, log, ethereum, Address } from "@graphprotocol/graph-ts"

import {
    AirDomain,
    AirResolver,
    AirDomainAccount,
    AirExtra,
    AirDomainCoin,
    AirDomainTransferred,
    AirDomainNameWrapped,
    AirReverseRegistrar,
    AirDomainRegistrationOrRenew,
    AirBlock,
    AirDomainRegistered,
    AirDomainNewResolver,
    AirDomainNewTTL,
    AirDomainNameUnwrapped,
} from "../../../generated/schema"
import {
    AIR_DOMAIN_CHANGED_ID,
    AIR_DOMAIN_REGISTRATION_OR_RENEW_CHANGED_ID,
    AIR_RESOLVER_CHANGED_ID,
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
    export function saveAirDomain(domain: AirDomain, block: ethereum.Block): void {
        const airBlock = getOrCreateAirBlock(block)
        airBlock.save()
        domain.lastUpdatedBlock = airBlock.id
        domain.lastUpdatedIndex = updateAirEntityCounter(AIR_DOMAIN_CHANGED_ID, airBlock)

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
        domain.owner = ownerDomainAccount.id
        domain.manager = ownerDomainAccount.id
        saveAirDomain(domain, block)
    }

    export function getOrCreateAirDomain(id: string, block: ethereum.Block): AirDomain {
        let airBlock = getOrCreateAirBlock(block)
        airBlock.save()
        let airDomain = AirDomain.load(id)
        if (airDomain == null) {
            airDomain = createAirDomain(id, block)
        }
        return airDomain
    }

    export function createAirDomain(id: string, block: ethereum.Block): AirDomain {
        const airDomain = new AirDomain(id)
        const airBlock = getOrCreateAirBlock(block)
        airBlock.save()
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

    export function trackDomainTransfer(
        txHash: Bytes,
        logIndex: BigInt,
        oldOwner: Address,
        newOwner: Address,
        domainId: string,
        block: ethereum.Block
    ): void {
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
        let airDomainTransferred = new AirDomainTransferred(createEventId(txHash, logIndex))
        airDomainTransferred.domain = airDomain.id
        airDomainTransferred.newOwner = newOwnerDomainAccount.id
        airDomainTransferred.oldOwner = oldOwnerDomainAccount.id
        let airBlock = getOrCreateAirBlock(block)
        airBlock.save()
        airDomainTransferred.lastUpdatedBlock = airBlock.id
        airDomainTransferred.hash = txHash
        airDomainTransferred.save()
    }
    function createEventId(txHash: Bytes, logIndex: BigInt): string {
        return txHash
            .toHexString()
            .concat("-")
            .concat(logIndex.toString())
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
        childDomainId: string,
        childName: string,
        childLabelHash: string,
        childLabelName: string,
        owner: Address,
        block: ethereum.Block
    ): void {
        let parentAirDomain = getAirDomain(parentDomainId)
        parentAirDomain.subdomainCount = parentAirDomain.subdomainCount.plus(BIGINT_ONE)
        saveAirDomain(parentAirDomain, block)

        let childDomain = getOrCreateAirDomain(childDomainId, block)
        childDomain.parent = parentAirDomain.id
        childDomain.name = childName
        childDomain.labelName = childLabelName
        childDomain.labelHash = childLabelHash

        let ownerAirDomainAccount = getOrCreateAirDomainAccount(owner, block)
        ownerAirDomainAccount.save()
        childDomain.manager = ownerAirDomainAccount.id
        childDomain.owner = ownerAirDomainAccount.id
        childDomain.isPrimary = false
        let airBlock = getOrCreateAirBlock(block)
        airBlock.save()
        childDomain.createdAt = airBlock.id
        saveAirDomain(childDomain, block)
        // reverse mapping
        let airReverseRegistrar = getOrCreateAirReverseRegistrar(childName)

        airReverseRegistrar.domain = childDomain.id
        airReverseRegistrar.save()
        // book keeping
        let airDomainRegistered = new AirDomainRegistered(createEventId(txHash, logIndex))
        airDomainRegistered.domain = childDomain.id
        airDomainRegistered.owner = ownerAirDomainAccount.id
        airDomainRegistered.lastUpdatedBlock = airBlock.id
        airDomainRegistered.hash = txHash
        airDomainRegistered.save()
    }

    function getOrCreateAirReverseRegistrar(name: string): AirReverseRegistrar {
        let id = crypto.keccak256(Bytes.fromUTF8(name)).toHexString()
        let airReverseRegistrar = getAirReverseRegistrar(name, false)
        if (!airReverseRegistrar) {
            airReverseRegistrar = new AirReverseRegistrar(id)
            airReverseRegistrar.name = name
        }
        return airReverseRegistrar
    }
    function getAirReverseRegistrar(name: string, throwErr: boolean): AirReverseRegistrar | null {
        let id = crypto.keccak256(Bytes.fromUTF8(name)).toHexString()
        let airReverseRegistrar = AirReverseRegistrar.load(id)
        if (!airReverseRegistrar && throwErr) {
            throw new Error("airReverseRegistrar not found,Id: " + id + ", name: " + name)
        }
        return airReverseRegistrar
    }
    export function trackDomainNewResolver(
        txHash: Bytes,
        logIndex: BigInt,
        domainId: string,
        resolver: Address,
        block: ethereum.Block
    ): void {
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
        let airDomainNewResolver = new AirDomainNewResolver(createEventId(txHash, logIndex))
        airDomainNewResolver.domain = airDomain.id
        airDomainNewResolver.resolver = airResolver.id
        airDomainNewResolver.lastUpdatedBlock = airBlock.id
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
        let airDomain = getAirDomain(domainId)
        airDomain.ttl = ttl
        saveAirDomain(airDomain, block)
        let airBlock = getOrCreateAirBlock(block)
        airBlock.save()
        // book keeping
        let airDomainNewTTL = new AirDomainNewTTL(createEventId(txHash, logIndex))
        airDomainNewTTL.domain = airDomain.id
        airDomainNewTTL.ttl = ttl
        airDomainNewTTL.lastUpdatedBlock = airBlock.id
        airDomainNewTTL.hash = txHash
        airDomainNewTTL.save()
    }
    export function trackResolvedAddress(
        domainId: string,
        resolverAddress: Address,
        resolvedAddress: Address,
        block: ethereum.Block
    ): void {
        let resolvedDomainAccount = getOrCreateAirDomainAccount(resolvedAddress, block)
        let airDomain = AirDomain.load(domainId)
        let resolverId = domainId.concat("-").concat(resolverAddress.toHexString())
        if (airDomain && airDomain.resolver == resolverId) {
            airDomain.resolvedAddress = resolvedDomainAccount.id
            saveAirDomain(airDomain, block)
            // update resolvedArray
            let resolvedDomainArr = resolvedDomainAccount.resolved
            if (!resolvedDomainArr) {
                resolvedDomainArr = []
            }
            resolvedDomainArr.push(airDomain.id)
            resolvedDomainAccount.resolved = resolvedDomainArr
            resolvedDomainAccount.save()
        }
    }
    export function trackMultiCoinAddress(
        domainId: string,
        resolverAddress: Address,
        coinType: BigInt,
        newAddress: Bytes
    ): void {
        let airResolver = getAirResolver(domainId, resolverAddress, false)
        if (!airResolver) {
            return
        }
        let airDomainCoin = AirDomainCoin.load(airResolver.id + "-" + coinType.toString())
        if (!airDomainCoin) {
            airDomainCoin = new AirDomainCoin(airResolver.id + "-" + coinType.toString())
        }
        airDomainCoin.resolver = airResolver.id
        airDomainCoin.coinType = coinType
        airDomainCoin.address = newAddress
        airDomainCoin.save()
    }
    export function trackAirExtra(
        domainId: string,
        resolverAddress: Address,
        name: string,
        value: string,
        block: ethereum.Block
    ): void {
        let airResolver = getAirResolver(domainId, resolverAddress, false)
        if (!airResolver) {
            return
        }
        let extras = airResolver.extras
        if (!extras) {
            extras = []
        }
        let airExtra = AirExtra.load(airResolver.id.concat("-").concat(name))
        if (!airExtra) {
            airExtra = new AirExtra(airResolver.id.concat("-").concat(name))
        }
        airExtra.name = name
        airExtra.value = value
        airExtra.save()
        extras.push(airExtra.id)
        airResolver.extras = extras
        log.debug("airResolver id {}", [airResolver.id])
        saveAirResolver(airResolver, block)
    }
    export function trackAirDomainRegistrationDateAndCost(
        txHash: Bytes,
        domainId: string,
        registrationDate: BigInt,
        cost: BigInt,
        owner: Address,
        block: ethereum.Block
    ): void {
        let airDomain = getAirDomain(domainId)
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
        saveAirDomainRegistrationOrRenew(airDomainRegistration, block)
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
        let airDomain = getAirDomain(domainId)
        if (airDomain.tokenAddress != tokenAddress.toHexString()) {
            airDomain.tokenAddress = tokenAddress.toHexString()
            airDomain.tokenId = tokenId.toString()
        }
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
        saveAirDomainRegistrationOrRenew(airDomainRegistration, block)
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
        let airDomain = getAirDomain(domainId)
        if (airDomain.tokenAddress != tokenAddress.toHexString()) {
            airDomain.tokenAddress = tokenAddress.toHexString()
            airDomain.tokenId = tokenId.toString()
        }
        saveAirDomain(airDomain, block)
        let airDomainRenew = getOrCreateAirDomainRegistrationOrRenew(txHash, airDomain.id, block)
        airDomainRenew.expiryDate = expiryDate
        airDomainRenew.isRenew = true
        airDomainRenew.hash = txHash
        airDomainRenew.domain = airDomain.id
        airDomainRenew.registrationDate = block.timestamp

        let renewerDomainAccount = getOrCreateAirDomainAccount(renewer, block)
        airDomainRenew.owner = renewerDomainAccount.id
        saveAirDomainRegistrationOrRenew(airDomainRenew, block)
    }
    export function trackAirDomainTransfer(
        tokenAddress: Address,
        tokenId: BigInt,
        domainId: string,
        from: Address,
        to: Address,
        txHash: Bytes,
        block: ethereum.Block,
        logIndex: BigInt
    ): void {
        let airDomain = getAirDomain(domainId)
        if (airDomain.tokenAddress != tokenAddress.toHexString()) {
            airDomain.tokenAddress = tokenAddress.toHexString()
            airDomain.tokenId = tokenId.toString()
        }
        let fromDomainAccount = getOrCreateAirDomainAccount(from, block)
        let toDomainAccount = getOrCreateAirDomainAccount(to, block)

        if (from == Address.zero() || airDomain.owner == fromDomainAccount.id) {
            airDomain.owner = toDomainAccount.id
        } else {
            throw new Error(
                "from address: "
                    .concat(from.toHexString())
                    .concat(" is not owner of domain,transfer logic failed, domainId: ")
                    .concat(domainId)
            )
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
        airDomainTransfer.lastUpdatedBlock = airBlock.id
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
        let airDomain = getAirDomain(domainId)
        let enclosedLabelHash = encloseLabelHash(label)
        if (airDomain.labelName != name) {
            airDomain.labelName = name
        }
        if (airDomain.name && airDomain.name!.includes(enclosedLabelHash)) {
            airDomain.name = replaceLabelhash(label, name, airDomain.name!)
            let airReverseRegistrar = getOrCreateAirReverseRegistrar(name)
            airReverseRegistrar.domain = airDomain.id
            airReverseRegistrar.save()
        }
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
        saveAirDomainRegistrationOrRenew(airDomainRegistration, block)
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
        let airDomainRenew = getOrCreateAirDomainRegistrationOrRenew(txHash, airDomain.id, block)
        airDomainRenew.expiryDate = expiry
        airDomainRenew.registrationDate = block.timestamp
        airDomainRenew.isRenew = true
        airDomainRenew.domain = airDomain.id
        airDomainRenew.hash = txHash
        saveAirDomainRegistrationOrRenew(airDomainRenew, block)
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
        let airDomain = getAirDomain(domainId)
        let enclosedLabelHash = encloseLabelHash(label)
        if (airDomain.labelName != name) {
            airDomain.labelName = name
        }
        if (airDomain.name && airDomain.name!.includes(enclosedLabelHash)) {
            airDomain.name = replaceLabelhash(label, name, airDomain.name!)
            let airReverseRegistrar = getOrCreateAirReverseRegistrar(name)
            airReverseRegistrar.domain = airDomain.id
            airReverseRegistrar.save()
        }
        saveAirDomain(airDomain, block)
        let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)
        let airDomainRenew = getOrCreateAirDomainRegistrationOrRenew(txHash, airDomain.id, block)
        airDomainRenew.cost = cost
        airDomainRenew.domain = airDomain.id
        airDomainRenew.owner = ownerDomainAccount.id
        airDomainRenew.expiryDate = expiryDate
        airDomainRenew.isRenew = true
        airDomainRenew.hash = txHash
        airDomainRenew.registrationDate = block.timestamp
        saveAirDomainRegistrationOrRenew(airDomainRenew, block)
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
        let airDomain = getAirDomain(domainId)
        let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)
        if (!airDomain.name && name.length > 0) {
            airDomain.name = name
            let airReverseRegistrar = getOrCreateAirReverseRegistrar(name)
            airReverseRegistrar.domain = airDomain.id
            airReverseRegistrar.save()
        }
        if (!airDomain.labelName && labelName.length > 0) {
            airDomain.labelName = labelName
        }
        airDomain.fuses = fuses
        airDomain.isNameWrapped = true
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
        saveAirDomainRegistrationOrRenew(airDomainRegistration, block)
        // book keeping
        let airDomainNameWrapped = new AirDomainNameWrapped(
            txHash
                .toHexString()
                .concat("-")
                .concat(logIndex.toString())
        )
        airDomainNameWrapped.domain = airDomain.id
        let airBlock = getOrCreateAirBlock(block)
        airBlock.save()
        airDomainNameWrapped.lastUpdatedBlock = airBlock.id
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

        airDomainNameUnwrapped.lastUpdatedBlock = airBlock.id
        airDomainNameUnwrapped.hash = txHash
        let ownerDomainAccount = getOrCreateAirDomainAccount(owner, block)

        airDomainNameUnwrapped.owner = ownerDomainAccount.id
        airDomainNameUnwrapped.save()
    }
    export function trackSetPrimaryDomain(
        name: string,
        resolvedAddress: Address,
        block: ethereum.Block
    ): void {
        let resolvedAddressDomainAccount = getOrCreateAirDomainAccount(resolvedAddress, block)
        let reverseRecord = getAirReverseRegistrar(name, false)
        if (!reverseRecord) {
            log.debug("reverseRecord not found, name {}", [name])
            return
        }
        if (reverseRecord.domain.length > 0) {
            if (
                resolvedAddressDomainAccount.resolved &&
                resolvedAddressDomainAccount.resolved!.includes(reverseRecord.domain)
            ) {
                // removing all primary domains
                for (
                    let index = 0;
                    index < resolvedAddressDomainAccount.resolved!.length;
                    index++
                ) {
                    const domainId = resolvedAddressDomainAccount.resolved![index]
                    let airDomain = getAirDomain(domainId)
                    if (domainId == reverseRecord.domain) {
                        airDomain.isPrimary = true
                        saveAirDomain(airDomain, block)
                    } else if (airDomain.isPrimary) {
                        airDomain.isPrimary = false
                        saveAirDomain(airDomain, block)
                    }
                }
            }
        }
    }
    function encloseLabelHash(labelHash: Bytes): string {
        return "[".concat(labelHash.toHexString()).concat("]")
    }
    function replaceLabelhash(labelHash: Bytes, labelName: string, name: string): string {
        return name.replace(encloseLabelHash(labelHash), labelName)
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
    export function saveAirDomainRegistrationOrRenew(
        entity: AirDomainRegistrationOrRenew,
        block: ethereum.Block
    ): void {
        const airBlock = getOrCreateAirBlock(block)
        airBlock.save()
        entity.lastUpdatedBlock = airBlock.id
        entity.lastUpdatedIndex = updateAirEntityCounter(
            AIR_DOMAIN_REGISTRATION_OR_RENEW_CHANGED_ID,
            airBlock
        )
        entity.save()
    }
    export function saveAirResolver(resolver: AirResolver, block: ethereum.Block): void {
        const airBlock = getOrCreateAirBlock(block)
        airBlock.save()
        resolver.lastUpdatedBlock = airBlock.id
        resolver.lastUpdatedIndex = updateAirEntityCounter(AIR_RESOLVER_CHANGED_ID, airBlock)
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
}
