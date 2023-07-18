import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { newBlock } from "./utils"
import { _handleNameRegistered, _handleNameRenewed } from "../src/eth-registrar-controller"
// NameRegistered (string name, index_topic_1 bytes32 label, index_topic_2 address owner, uint256 cost, uint256 expires)
export class NameRegisteredInput {
    controller: string
    hash: string
    name: string
    label: string
    owner: string
    cost: string
    expires: string
    logIndex: string
}

export function mockNameRegistered(input: NameRegisteredInput): void {
    const controller = Address.fromString(input.controller)
    const txHash = Bytes.fromHexString(input.hash)
    const name = input.name
    const label = Bytes.fromHexString(input.label)
    const owner = Address.fromString(input.owner)
    const cost = BigInt.fromString(input.cost)
    const expires = BigInt.fromString(input.expires)
    const logIndex = BigInt.fromString(input.logIndex)
    const block = newBlock()

    _handleNameRegistered(controller, txHash, block, name, label, owner, cost, expires, logIndex)
}
// NameRenewed (string name, index_topic_1 bytes32 label, uint256 cost, uint256 expires)
export class NameRenewedInput {
    controller: string
    hash: string
    name: string
    label: string
    cost: string
    from: string
    expires: string
    logIndex: string
}

export function mockNameRenewed(input: NameRenewedInput): void {
    const controller = Address.fromString(input.controller)
    const txHash = Bytes.fromHexString(input.hash)
    const name = input.name
    const label = Bytes.fromHexString(input.label)
    const from = Address.fromString(input.from)
    const cost = BigInt.fromString(input.cost)
    const expires = BigInt.fromString(input.expires)
    const logIndex = BigInt.fromString(input.logIndex)
    const block = newBlock()

    _handleNameRenewed(controller, txHash, block, name, label, cost, from, expires, logIndex)
}


