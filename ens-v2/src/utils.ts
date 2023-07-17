import {
    ByteArray,
    ethereum,
    BigInt,
    Bytes,
    ens,
    Address,
    crypto,
    log,
} from "@graphprotocol/graph-ts"
import { ControllerEntity, ControllerNameWrapperEntity, ResolverEntity } from "../generated/schema"
import {
    ETHRegistrarControllerNameWrapperTemplate,
    ETHRegistrarControllerTemplate,
    ResolverTemplate,
} from "../generated/templates"

export const ROOT_NODE = "0x0000000000000000000000000000000000000000000000000000000000000000"

export const ETH_NODE = "93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
export const ADDR_REVERSE_NODE =
    "0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2"
export const rootNode: ByteArray = byteArrayFromHex(ETH_NODE)
/**
 * Helper for concatenating two byte arrays
 * @param a ByteArray
 * @param b ByteArray
 * @returns ByteArray
 */
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

export function createEventID(block: ethereum.Block, logIndex: BigInt): string {
    return block.number
        .toString()
        .concat("-")
        .concat(logIndex.toString())
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

export function getNameHashFromTokenId(tokenId: BigInt): string {
    const namehash =
        "0x" +
        tokenId
            .toHex()
            .slice(2)
            .padStart(64, "0")
    return namehash
}
/**
 * Tries to find a name from label using mapping / ens function provided
 * @param label
 * @returns name string
 */
export const tryFindName = (label: Bytes): string => {
    const labelStr = label.toHexString()
    let labelNameFromENS = ens.nameByHash(labelStr)
    if (labelNameFromENS == null || labelNameFromENS == "") {
        return ""
    }
    return labelNameFromENS!
}
const ControllerArr = [
    "0xb22c1c159d12461ea124b0deb4b5b93020e6ad16",
    "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5",
]

export function createController(controller: Address, txHash: Bytes): void {
    let controllerStr = controller.toHexString().toLowerCase()
    let alreadyExist = ControllerArr.includes(controllerStr)
    log.debug("alreadyExist {}", [alreadyExist.toString()])
    if (!alreadyExist) {
        let controllerEntity = ControllerEntity.load(controllerStr)
        if (!controllerEntity) {
            controllerEntity = new ControllerEntity(controllerStr)
            controllerEntity.txHash = txHash
            controllerEntity.save()
            // create new datasource
            ETHRegistrarControllerTemplate.create(controller)
        }
    }
}
const ControllerNameWrapperArr = ["0x253553366da8546fc250f225fe3d25d0c782303b"]
export function createControllerNameWrapper(controller: Address, txHash: Bytes): void {
    let controllerStr = controller.toHexString().toLowerCase()
    let alreadyExist = ControllerNameWrapperArr.includes(controllerStr)
    if (!alreadyExist) {
        let controllerEntity = ControllerNameWrapperEntity.load(controllerStr)
        if (!controllerEntity) {
            controllerEntity = new ControllerNameWrapperEntity(controllerStr)
            controllerEntity.txHash = txHash
            controllerEntity.save()
            // create new datasource
            ETHRegistrarControllerNameWrapperTemplate.create(controller)
        }
    }
}

export function getNameHashFromBytes(node: Bytes, label: Bytes): string {
    return crypto.keccak256(concat(node, label)).toHexString()
}

export function getNameHashFromByteArray(node: ByteArray, label: ByteArray): string {
    return crypto.keccak256(concat(node, label)).toHex()
}

export function getTokenId(label: Bytes): string {
    return BigInt.fromUnsignedBytes(label).toString()
}

export function checkValidLabel(name: string): boolean {
    for (let i = 0; i < name.length; i++) {
        let c = name.charCodeAt(i)
        if (c === 0) {
            log.warning("Invalid label '{}' contained null byte. Skipping.", [name])
            return false
        } else if (c === 46) {
            log.warning("Invalid label '{}' contained separator char '.'. Skipping.", [name])
            return false
        }
    }

    return true
}

export function decodeNameInBytes(buf: Bytes): Array<string> {
    let offset = 0
    let list = new ByteArray(0)
    let dot = Bytes.fromHexString("2e")
    let len = buf[offset++]
    let hex = buf.toHexString()
    let firstLabel = ""
    if (len === 0) {
        return [firstLabel, "."]
    }

    while (len) {
        let label = hex.slice((offset + 1) * 2, (offset + 1 + len) * 2)
        let labelBytes = Bytes.fromHexString(label)

        if (!checkValidLabel(labelBytes.toString())) {
            return ["", ""]
        }

        if (offset > 1) {
            list = concat(list, dot)
        } else {
            firstLabel = labelBytes.toString()
        }
        list = concat(list, labelBytes)
        offset += len
        len = buf[offset++]
    }
    return [firstLabel, list.toString()]
}

export function createNewResolver(resolver: Address): void {
    let resolverEntity = ResolverEntity.load(resolver.toHexString())
    if (!resolverEntity) {
        resolverEntity = new ResolverEntity(resolver.toHexString())
        ResolverTemplate.create(resolver)
    }
    resolverEntity.save()
}
