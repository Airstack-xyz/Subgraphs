import { Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import { newBlock } from "./utils"
import {
    _handleNewOwner,
    _handleNewResolver,
    _handleNewTTL,
    _handleTransfer,
} from "../src/ens-registry"

export function mockHandleTransfer(transfer: TransferInput): void {
    const txHash = Bytes.fromHexString(transfer.hash)
    const block = newBlock()
    const logIndex = BigInt.fromString(transfer.logIndex)
    const from = Address.fromString(transfer.from)
    const node = Bytes.fromHexString(transfer.node)
    const owner = Address.fromString(transfer.owner)
    _handleTransfer(txHash, block, logIndex, from, node, owner)
}

export function mockHandleNewOwner(newOwner: NewOwnerInput): void {
    const txHash = Bytes.fromHexString(newOwner.hash)
    const block = newBlock()
    const logIndex = BigInt.fromString(newOwner.logIndex)
    const label = Bytes.fromHexString(newOwner.label)
    const node = Bytes.fromHexString(newOwner.node)
    const owner = Address.fromString(newOwner.owner)
    _handleNewOwner(txHash, logIndex, node, label, owner, block)
}

export function mockHandleNewTTL(newTTL: NewTTLInput): void {
    const txHash = Bytes.fromHexString(newTTL.hash)
    const block = newBlock()
    const logIndex = BigInt.fromString(newTTL.logIndex)
    const ttl = BigInt.fromString(newTTL.ttl)
    const node = Bytes.fromHexString(newTTL.node)
    _handleNewTTL(txHash, logIndex, node, ttl, block)
}

export function mockHandleNewResolver(newResolver: NewResolverInput): void {
    const txHash = Bytes.fromHexString(newResolver.hash)
    const block = newBlock()
    const logIndex = BigInt.fromString(newResolver.logIndex)
    const resolver = Address.fromString(newResolver.resolver)
    const node = Bytes.fromHexString(newResolver.node)
    _handleNewResolver(txHash, logIndex, node, resolver, block)
}

export class TransferInput {
    hash: string
    logIndex: string
    from: string
    node: string
    owner: string
}

export class NewOwnerInput {
    hash: string
    logIndex: string
    node: string
    label: string
    owner: string
}

export class NewTTLInput {
    hash: string
    logIndex: string
    node: string
    ttl: string
}

export class NewResolverInput {
    hash: string
    logIndex: string
    node: string
    resolver: string
}
