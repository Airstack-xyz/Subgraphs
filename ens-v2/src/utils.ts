import { Address, ByteArray, Bytes, BigInt, crypto, ethereum } from "@graphprotocol/graph-ts"
import {
    AirAccount,
    AirDomain,
    AirDomainAccount,
    AirDomainRegistration,
    AirExtra,
    AirResolver,
} from "../generated/schema"
import { BIG_INT_ZERO, getChainId, getOrCreateAirAccount, getOrCreateAirBlock } from "./common"
export const ETH_NODE = "93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
export const ROOT_NODE = "0x0000000000000000000000000000000000000000000000000000000000000000"
export const ADDR_REVERSE_NODE =
    "0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2"
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

export function getNameHash(node: Bytes, label: Bytes): string {
    return crypto.keccak256(concat(node, label)).toHexString()
}
export function getNameHashFromBytesArr(node: ByteArray, label: ByteArray): string {
    return crypto.keccak256(concat(node, label)).toHex()
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
    airAccount.save()
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
