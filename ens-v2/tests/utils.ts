import { Address, Bytes, ethereum, BigInt } from "@graphprotocol/graph-ts"

function bigIntValue(arg: string): ethereum.Value {
    return ethereum.Value.fromUnsignedBigInt(BigInt.fromString(arg))
}
export function getBigIntEventParam(eventName: string, arg: string): ethereum.EventParam {
    let eventParam = new ethereum.EventParam(eventName, bigIntValue(arg))
    return eventParam
}

function addressValue(arg: string): ethereum.Value {
    return ethereum.Value.fromAddress(Address.fromString(arg))
}

export function getAddressEventParam(eventName: string, arg: string): ethereum.EventParam {
    let eventParam = new ethereum.EventParam(eventName, addressValue(arg))
    return eventParam
}
function bytesValue(arg: string): ethereum.Value {
    return ethereum.Value.fromBytes(Bytes.fromHexString(arg))
}

export function getBytesEventParam(eventName: string, arg: string): ethereum.EventParam {
    let eventParam = new ethereum.EventParam(eventName, bytesValue(arg))
    return eventParam
}

let defaultAddress = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A")
let defaultAddressBytes = defaultAddress as Bytes
let defaultBigInt = BigInt.fromI32(1)

export function newBlock(): ethereum.Block {
    return new ethereum.Block(
        defaultAddressBytes,
        defaultAddressBytes,
        defaultAddressBytes,
        defaultAddress,
        defaultAddressBytes,
        defaultAddressBytes,
        defaultAddressBytes,
        defaultBigInt,
        defaultBigInt,
        defaultBigInt,
        defaultBigInt,
        defaultBigInt,
        defaultBigInt,
        defaultBigInt,
        defaultBigInt
    )
}
