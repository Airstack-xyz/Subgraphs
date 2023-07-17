import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
    _handleControllerAdded,
    _handleNameRegistered,
    _handleNameRenewed,
    _handleTransfer,
} from "../src/ens-token"
import { newBlock } from "./utils"
export class ControllerAddedInput {
    hash: string
    controller: string
}
export function mockHandleControllerAdded(input: ControllerAddedInput): void {
    const txHash = Bytes.fromHexString(input.hash)
    const controller = Address.fromString(input.controller)
    _handleControllerAdded(txHash, controller)
}

export class HandleNameRegisteredInput {
    hash: string
    logIndex: string
    id: string
    owner: string
    expires: string
    tokenAddress: string
}
export function mockHandleNameRegistered(input: HandleNameRegisteredInput): void {
    const block = newBlock()
    const txHash = Bytes.fromHexString(input.hash)
    const id = BigInt.fromString(input.id)
    const logIndex = BigInt.fromString(input.logIndex)
    const expires = BigInt.fromString(input.expires)
    const owner = Address.fromString(input.owner)
    const tokenAddress = Address.fromString(input.tokenAddress)
    _handleNameRegistered(tokenAddress, txHash, block, id, expires, owner, logIndex)
}

export class HandleNameRenewed {
    hash: string
    logIndex: string
    id: string
    expires: string
    tokenAddress: string
    from: string
}
export function mockHandleNameRenewed(input: HandleNameRenewed): void {
    const block = newBlock()
    const txHash = Bytes.fromHexString(input.hash)
    const id = BigInt.fromString(input.id)
    const logIndex = BigInt.fromString(input.logIndex)
    const expires = BigInt.fromString(input.expires)
    const tokenAddress = Address.fromString(input.tokenAddress)
    const from = Address.fromString(input.from)
    _handleNameRenewed(tokenAddress, txHash, from, block, id, expires, logIndex)
}

export class TransferInput {
    tokenAddress: string
    hash: string
    from: string
    to: string
    tokenId: string
    logIndex: string
}
export function mockHandleTokenTransfer(input: TransferInput): void {
    const block = newBlock()
    const txHash = Bytes.fromHexString(input.hash)
    const tokenAddress = Address.fromString(input.tokenAddress)
    const from = Address.fromString(input.from)
    const to = Address.fromString(input.to)

    const tokenId = BigInt.fromString(input.tokenId)
    const logIndex = BigInt.fromString(input.logIndex)
    _handleTransfer(tokenAddress, txHash, block, from, to, tokenId, logIndex)
}
