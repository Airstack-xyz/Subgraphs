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
