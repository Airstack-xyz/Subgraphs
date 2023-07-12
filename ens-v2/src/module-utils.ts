import { Address, Bytes, ByteArray, crypto, ethereum, BigInt } from "@graphprotocol/graph-ts"
import {
    AirDomain,
    AirDomainAccount,
    AirDomainRegistration,
    AirExtra,
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
import { ETH_NODE } from "./ens-utils"

export const rootNode: ByteArray = byteArrayFromHex(ETH_NODE)

// Helper for concatenating two byte arrays
export function concat(a: ByteArray, b: ByteArray): ByteArray {
    let out = new Uint8Array(a.length + b.length)
    for (let i = 0; i < a.length; i++) {
        out[i] = a[i]
    }
    for (let j = 0; j < b.length; j++) {
        out[a.length + j] = b[j]
    }
    // return out as ByteArray
    return changetype<ByteArray>(out)
}

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

export const createOrUpdateAirExtra = (domainId: string, name: string, value: string): AirExtra => {
    const id = domainId.concat("-").concat(name)

    let airExtraEntity = AirExtra.load(id)
    if (airExtraEntity == null) {
        airExtraEntity = new AirExtra(id)
    }
    airExtraEntity.name = name
    airExtraEntity.value = value
    airExtraEntity.save()
    return airExtraEntity
}

export function uint256ToByteArray(i: BigInt): ByteArray {
    let hex = i
        .toHex()
        .slice(2)
        .padStart(64, "0")
    return byteArrayFromHex(hex)
}

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
