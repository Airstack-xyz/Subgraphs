import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import { Transfer, NewOwner, NewResolver, NewTTL } from "../generated/ENSRegistry/ENSRegistry"
import { getAddressEventParam, getBigIntEventParam, getBytesEventParam } from "./utils"

export function createTransferEvent(transfer: TransferInput): Transfer {
    let transferEvent = changetype<Transfer>(newMockEvent())

    // transferEvent.parameters = new Array()

    // transferEvent.parameters.push(
    //     new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(node))
    // )
    // transferEvent.parameters.push(
    //     new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
    // )
    const nodeParam = getBytesEventParam("node", transfer.node)
    const ownerParam = getAddressEventParam("owner", transfer.owner)
    transferEvent.parameters = [nodeParam, ownerParam]
    transferEvent.transaction.hash = Bytes.fromHexString(transfer.hash)
    return transferEvent
}

export function createNewOwnerEvent(newOwner: NewOwnerInput): NewOwner {
    let newOwnerEvent = changetype<NewOwner>(newMockEvent())

    // newOwnerEvent.parameters = new Array()

    // newOwnerEvent.parameters.push(
    //     new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(node))
    // )
    // newOwnerEvent.parameters.push(
    //     new ethereum.EventParam("label", ethereum.Value.fromFixedBytes(label))
    // )
    // newOwnerEvent.parameters.push(
    //     new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
    // )
    const nodeParam = getBytesEventParam("node", newOwner.node)
    const labelParam = getBytesEventParam("label", newOwner.label)
    const ownerParam = getAddressEventParam("owner", newOwner.owner)
    newOwnerEvent.parameters = [nodeParam, labelParam, ownerParam]
    newOwnerEvent.transaction.hash = Bytes.fromHexString(newOwner.hash)

    return newOwnerEvent
}

export function createNewResolverEvent(newResolver: NewResolverInput): NewResolver {
    let newResolverEvent = changetype<NewResolver>(newMockEvent())

    newResolverEvent.parameters = new Array()
    const nodeParam = getBytesEventParam("node", newResolver.node)
    const resolverParam = getAddressEventParam("resolver", newResolver.resolver)

    newResolverEvent.parameters = [nodeParam, resolverParam]
    newResolverEvent.transaction.hash = Bytes.fromHexString(newResolver.hash)

    return newResolverEvent
}

export function createNewTTLEvent(newTTL: NewTTLInput): NewTTL {
    let newTtlEvent = changetype<NewTTL>(newMockEvent())

    newTtlEvent.parameters = new Array()
    const nodeParam = getBytesEventParam("node", newTTL.node)
    const ttlParam = getBigIntEventParam("ttl", newTTL.ttl)
    newTtlEvent.parameters = [nodeParam, ttlParam]
    newTtlEvent.transaction.hash = Bytes.fromHexString(newTTL.hash)

    return newTtlEvent
}
export class TransferInput {
    hash: string
    node: string
    owner: string
}
export class NewOwnerInput {
    hash: string
    node: string
    owner: string
    label: string
}

export class NewResolverInput {
    hash: string
    node: string
    resolver: string
}
export class NewTTLInput {
    hash: string
    node: string
    ttl: string
}
