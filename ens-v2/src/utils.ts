import { Address, ByteArray, Bytes, BigInt, crypto, ethereum } from "@graphprotocol/graph-ts"
import {
    AirAccount,
    AirDomain,
    AirDomainAccount,
    AirDomainRegistration,
    AirResolver,
} from "../generated/schema"
import { BIG_INT_ZERO, getChainId, getOrCreateAirAccount, getOrCreateAirBlock } from "./common"

export const ROOT_NODE = "0x0000000000000000000000000000000000000000000000000000000000000000"
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
export function getNameHash(node: Bytes, label: Bytes): string {
    return crypto.keccak256(concat(node, label)).toHexString()
}

export function getTokenId(label: Bytes): string {
    return BigInt.fromUnsignedBytes(label).toString()
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
    let airDomainAccount = AirDomainAccount.load(addrStr)
    if (!airDomainAccount) {
        airDomainAccount = new AirDomainAccount(addrStr)
        airDomainAccount.address = airAccount.id
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
    return airDomain
}

export const getOrCreateAirDomain = (id: string, block: ethereum.Block): AirDomain => {
    let airDomain = AirDomain.load(id)
    if (airDomain == null) {
        airDomain = createAirDomain(id, block)
    }
    return airDomain
}

export const saveDomain = (domain: AirDomain, block: ethereum.Block): void => {
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
    resolverAddress: string,
    block: ethereum.Block
): AirResolver => {
    const id = domainId.concat("-").concat(resolverAddress)
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
    }
    return airResolver
}

export const getOrCreateAirDomainRegistration = (
    domainId: string,
    block: ethereum.Block
): AirDomainRegistration => {
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
