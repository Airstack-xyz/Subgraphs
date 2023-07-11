import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"

import {
    AddrChanged as AddrChangedEvent,
    TextChanged as TextChangedEvent,
    TextChanged1 as TextChangedWithValueEvent,
} from "../generated/Resolver/Resolver"

import {
    createOrUpdateAirExtra,
    getOrCreateAirDomainAccount,
    getOrCreateAirResolver,
    saveAirResolver,
} from "./utils"
import { AirDomain, AirResolver } from "../generated/schema"

export function handleAddrChanged(event: AddrChangedEvent): void {
    const node = event.params.node
    const a = event.params.a
    const resolverAddr = event.address
    const block = event.block

    let entity = AirResolver.load(node.toHexString() + "-" + resolverAddr.toHexString())
    if (!entity) {
        return
    }
    const resolvedDomainAccount = getOrCreateAirDomainAccount(a, block)
    resolvedDomainAccount.save()
    entity.resolvedAddress = resolvedDomainAccount.id

    saveAirResolver(entity, block)
}

export function handleTextChanged(event: TextChangedEvent): void {
    const node = event.params.node
    const indexedKey = event.params.indexedKey
    const key = event.params.key
    const resolverAddr = event.address
    const block = event.block

    let entity = AirResolver.load(node.toHexString() + "-" + resolverAddr.toHexString())
    if (!entity) {
        return
    }
    let extras = entity.extras
    if (extras == null) {
        extras = []
    }
    let airExtra = createOrUpdateAirExtra(node.toHexString(), key, "")
    extras.push(airExtra.id)

    entity.extras = extras

    saveAirResolver(entity, block)
}

export function handleTextChangedWithValue(event: TextChangedWithValueEvent): void {
    const node = event.params.node
    const indexedKey = event.params.indexedKey
    const key = event.params.key
    const value = event.params.value
    const resolverAddr = event.address
    const block = event.block

    let entity = AirResolver.load(node.toHexString() + "-" + resolverAddr.toHexString())
    if (!entity) {
        return
    }
    let extras = entity.extras
    if (extras == null) {
        extras = []
    }
    let airExtra = createOrUpdateAirExtra(node.toHexString(), key, value)
    extras.push(airExtra.id)

    entity.extras = extras

    saveAirResolver(entity, event.block)
}
