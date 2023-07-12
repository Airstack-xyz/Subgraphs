import { ByteArray, Bytes, ethereum, crypto, BigInt } from "@graphprotocol/graph-ts"

export const ROOT_NODE = "0x0000000000000000000000000000000000000000000000000000000000000000"

export const ETH_NODE = "93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
export const ADDR_REVERSE_NODE =
    "0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2"
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

export function getNameHashFromBytesArr(node: ByteArray, label: ByteArray): string {
    return crypto.keccak256(concat(node, label)).toHex()
}
