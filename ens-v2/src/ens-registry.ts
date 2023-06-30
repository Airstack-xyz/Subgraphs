import { BigInt, log } from "@graphprotocol/graph-ts"
import {
    ENSRegistry,
    Transfer,
    NewOwner,
    NewResolver,
    NewTTL,
} from "../generated/ENSRegistry/ENSRegistry"

export function handleTransfer(event: Transfer): void {
    const hash = event.transaction.hash
    const node = event.params.node
    const owner = event.params.owner
    log.debug("hash {} node {} owner {}", [
        hash.toHexString(),
        node.toHexString(),
        owner.toHexString(),
    ])
}

export function handleNewOwner(event: NewOwner): void {
    const hash = event.transaction.hash
    const node = event.params.node
    const label = event.params.label
    const owner = event.params.owner
    log.debug("hash {} node {} label {} owner {}", [
        hash.toHexString(),
        node.toHexString(),
        label.toHexString(),
        owner.toHexString(),
    ])
}

export function handleNewResolver(event: NewResolver): void {
    const hash = event.transaction.hash
    const node = event.params.node
    const resolver = event.params.resolver
    log.debug("hash {} node {} resolver {}", [
        hash.toHexString(),
        node.toHexString(),
        resolver.toHexString(),
    ])
}

export function handleNewTTL(event: NewTTL): void {
    const hash = event.transaction.hash
    const node = event.params.node
    const ttl = event.params.ttl
    log.debug("hash {} node {} ttl {}", [hash.toHexString(), node.toHexString(), ttl.toHexString()])
}
