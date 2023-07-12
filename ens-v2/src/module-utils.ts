import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts"
import {
    AirDomain,
    AirDomainAccount,
    AirDomainRegistration,
    AirResolver,
} from "../generated/schema"
import {
    BIG_INT_ZERO,
    getChainId,
    getOrCreateAirAccount,
    getOrCreateAirBlock,
    getOrCreateAirBlock2,
    updateAirEntityCounter,
} from "./common"
export function createEventID(event: ethereum.Event): string {
    return event.block.number
        .toString()
        .concat("-")
        .concat(event.logIndex.toString())
}
export function getOrCreateAirDomainAccount(
    address: Address,
    block: ethereum.Block
): AirDomainAccount {
    const addrStr = address.toHexString()
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
        chainId,
        block.number,
        block.hash.toHexString(),
        block.timestamp
    )
    airBlock.save()
    const airAccount = getOrCreateAirAccount(chainId, addrStr, airBlock)
    airAccount.save()
    let airDomainAccount = AirDomainAccount.load(airAccount.id)
    if (!airDomainAccount) {
        airDomainAccount = new AirDomainAccount(airAccount.id)
        airDomainAccount.account = airAccount.id
    }
    return airDomainAccount
}

export const createAirDomain = (id: string, block: ethereum.Block): AirDomain => {
    const airDomain = new AirDomain(id)
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
        chainId,
        block.number,
        block.hash.toHexString(),
        block.timestamp
    )
    airBlock.save()
    airDomain.isPrimary = false
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedBlock = airBlock.id
    airDomain.subdomainCount = BIG_INT_ZERO
    airDomain.fueses = BIG_INT_ZERO
    return airDomain
}

export const getOrCreateAirDomain = (id: string, block: ethereum.Block): AirDomain => {
    let airBlock = getOrCreateAirBlock2(block)
    airBlock.save()
    let airDomain = AirDomain.load(id)
    if (airDomain == null) {
        airDomain = createAirDomain(id, block)
    }
    airDomain.lastUpdatedIndex = updateAirEntityCounter("AIR_DOMAIN", airBlock)
    return airDomain
}

export const saveAirDomain = (domain: AirDomain, block: ethereum.Block): void => {
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
        chainId,
        block.number,
        block.hash.toHexString(),
        block.timestamp
    )
    airBlock.save()
    domain.lastUpdatedBlock = airBlock.id
    domain.save()
}

export const getOrCreateAirResolver = (
    domainId: string,
    resolverAddress: Bytes,
    block: ethereum.Block
): AirResolver => {
    let airBlock = getOrCreateAirBlock2(block)
    const id = domainId.concat("-").concat(resolverAddress.toHexString())
    let airResolver = AirResolver.load(id)
    if (!airResolver) {
        const chainId = getChainId()
        const airBlock = getOrCreateAirBlock(
            chainId,
            block.number,
            block.hash.toHexString(),
            block.timestamp
        )
        airBlock.save()
        airResolver = new AirResolver(id)
        airResolver.createdAt = airBlock.id
        airResolver.resolverAddress = resolverAddress
    }
    airResolver.lastUpdatedIndex = updateAirEntityCounter("AIR_RESOLVER", airBlock)

    return airResolver
}

export const getOrCreateAirDomainRegistration = (
    domainId: string,
    block: ethereum.Block
): AirDomainRegistration => {
    let airBlock = getOrCreateAirBlock2(block)

    let airDomainRegistration = AirDomainRegistration.load(domainId)
    if (!airDomainRegistration) {
        const chainId = getChainId()
        const airBlock = getOrCreateAirBlock(
            chainId,
            block.number,
            block.hash.toHexString(),
            block.timestamp
        )
        airBlock.save()
        airDomainRegistration = new AirDomainRegistration(domainId)
        airDomainRegistration.createdAt = airBlock.id
    }
    airDomainRegistration.lastUpdatedIndex = updateAirEntityCounter(
        "AIR_DOMAIN_REGISTRATION",
        airBlock
    )

    return airDomainRegistration
}
export const saveAirDomainRegistration = (
    registration: AirDomainRegistration,
    block: ethereum.Block
): void => {
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
        chainId,
        block.number,
        block.hash.toHexString(),
        block.timestamp
    )
    airBlock.save()
    registration.lastUpdatedBlock = airBlock.id
    registration.save()
}

export const saveAirResolver = (resolver: AirResolver, block: ethereum.Block): void => {
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
        chainId,
        block.number,
        block.hash.toHexString(),
        block.timestamp
    )
    airBlock.save()
    resolver.lastUpdatedBlock = airBlock.id
    resolver.save()
}
