import { Address, BigInt, dataSource, ens, ethereum, log } from "@graphprotocol/graph-ts"
import {
    Transfer as TransferEvent,
    NewOwner as NewOwnerEvent,
    NewResolver as NewResolverEvent,
    NewTTL as NewTTLEvent,
} from "../generated/ENSRegistryWithFallback/ENSRegistryWithFallback"
import {
    ADDR_REVERSE_NODE,
    ROOT_NODE,
    createAirDomain,
    createEventID,
    getNameHash,
    getOrCreateAirDomain,
    getOrCreateAirDomainAccount,
    getOrCreateAirResolver,
    getTokenId,
    saveAirResolver,
    saveDomain,
} from "./utils"
import { Resolver, ReverseRegistrar } from "../generated/templates"

import { BIGINT_ONE, getOrCreateAirAccount } from "./common"
import {
    AirDomain,
    AirResolver,
    NewOwnerHashLabelMap,
    NewOwner,
    Transfer,
    NewResolver,
    NewTTL,
    ReverseRegistrar as ReverseRegistrarEntity,
} from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
    const hash = event.transaction.hash
    const node = event.params.node
    const owner = event.params.owner
    if (node.toHexString() == ADDR_REVERSE_NODE) {
        let rev = ReverseRegistrarEntity.load(owner.toHexString())
        if (rev == null) {
            rev = new ReverseRegistrarEntity(owner.toHexString())
            ReverseRegistrar.create(owner)
        }
        rev.save()
    }
    let account = getOrCreateAirDomainAccount(owner, event.block)
    account.save()

    // Update the domain owner
    let domain = AirDomain.load(node.toHexString())
    if (node.toHexString() == ROOT_NODE) {
        // added here because transfer happens before NewOwner
        domain = getOrCreateAirDomain(node.toHexString(), event.block)
    }
    if (!domain) {
        log.error("Domain not found hash {} node {} owner {}", [
            hash.toHexString(),
            node.toHexString(),
            owner.toHexString(),
        ])
        throw new Error("Domain not found")
    }
    domain.owner = account.id
    saveDomain(domain, event.block)

    let domainEvent = new Transfer(createEventID(event))
    domainEvent.blockNumber = event.block.number.toI32()
    domainEvent.txHash = event.transaction.hash
    domainEvent.domain = node.toHexString()
    domainEvent.owner = event.params.owner.toHexString()
    domainEvent.save()
}

export function handleNewOwner(event: NewOwnerEvent): void {
    const hash = event.transaction.hash
    const node = event.params.node
    const label = event.params.label
    const tokenId = getTokenId(label)
    const owner = event.params.owner
    const nameHash = getNameHash(node, label) // new node

    if (nameHash == ADDR_REVERSE_NODE) {
        let rev = ReverseRegistrarEntity.load(owner.toHexString())
        if (rev == null) {
            rev = new ReverseRegistrarEntity(owner.toHexString())
            ReverseRegistrar.create(owner)
        }
        rev.save()
    }

    let account = getOrCreateAirDomainAccount(owner, event.block)
    account.save()

    let domain = getOrCreateAirDomain(nameHash, event.block)
    let parent = AirDomain.load(node.toHexString())

    if (parent) {
        if (!domain.parent) {
            domain.parent = parent.id
            parent.subdomainCount = parent.subdomainCount.plus(BIGINT_ONE)
            saveDomain(parent, event.block)
        }
    }

    if (domain.name == null) {
        // Get label and node names
        let label = ens.nameByHash(event.params.label.toHexString())
        if (label != null) {
            domain.labelName = label
        }

        if (label === null) {
            label = "[" + event.params.label.toHexString().slice(2) + "]"
        }
        if (event.params.node.toHexString() == ROOT_NODE) {
            domain.name = label
        } else {
            parent = parent!
            let name = parent.name
            if (label && name) {
                domain.name = label + "." + name
            }
        }
    }

    domain.owner = account.id
    domain.labelHash = label.toHexString()
    saveDomain(domain, event.block)

    let hashlabelMap = new NewOwnerHashLabelMap(hash.toHexString() + "-" + label.toHexString())
    hashlabelMap.domainId = domain.id
    hashlabelMap.save()

    let domainEvent = new NewOwner(createEventID(event))
    domainEvent.blockNumber = event.block.number.toI32()
    domainEvent.txHash = event.transaction.hash
    domainEvent.parentDomain = event.params.node.toHexString()
    domainEvent.domain = nameHash
    domainEvent.owner = event.params.owner.toHexString()
    domainEvent.save()
}

export function handleNewResolver(event: NewResolverEvent): void {
    const hash = event.transaction.hash
    const node = event.params.node
    const resolver = event.params.resolver

    let airResolver = getOrCreateAirResolver(
        node.toHexString(),
        resolver.toHexString(),
        event.block
    )
    const domain = AirDomain.load(node.toHexString())
    if (!domain) {
        log.error("Domain not found hash {} node {} resolver {}", [
            hash.toHexString(),
            node.toHexString(),
            resolver.toHexString(),
        ])
        throw new Error("Domain not found")
    }
    airResolver.domain = domain.id
    airResolver.address = resolver
    saveAirResolver(airResolver, event.block)

    // create resolver using template
    Resolver.create(resolver)

    let domainEvent = new NewResolver(createEventID(event))
    domainEvent.blockNumber = event.block.number.toI32()
    domainEvent.txHash = event.transaction.hash
    domainEvent.domain = node.toHexString()
    domainEvent.resolver = resolver.toHexString()
    domainEvent.save()
}

export function handleNewTTL(event: NewTTLEvent): void {
    const hash = event.transaction.hash
    const node = event.params.node
    const ttl = event.params.ttl

    let domain = AirDomain.load(node.toHexString())
    // For the edge case that a domain's owner and resolver are set to empty
    // in the same transaction as setting TTL
    if (domain) {
        domain.ttl = ttl
        saveDomain(domain, event.block)
    }

    let domainEvent = new NewTTL(createEventID(event))
    domainEvent.blockNumber = event.block.number.toI32()
    domainEvent.txHash = event.transaction.hash
    domainEvent.domain = node.toHexString()
    domainEvent.ttl = event.params.ttl
    domainEvent.save()
}
