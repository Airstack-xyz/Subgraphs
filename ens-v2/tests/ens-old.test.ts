import { assert, describe, test } from "matchstick-as/assembly/index"

import {
    handleNewOwner,
    handleNewResolver,
    handleNewTTL,
    handleTransfer,
} from "../src/ens-registry"
import { handleHashRegistered1 } from "../src/registrar"
import {
    createNewOwnerEvent,
    createNewResolverEvent,
    createNewTTLEvent,
    createTransferEvent,
} from "./ens-registry-utils"

import {
    hashRegistered1,
    newOwner1,
    newResolverInput1,
    newTTL1,
    rootNewOwner,
    transferInput1,
} from "./ens-old-example"
import { createHashRegistered } from "./registrar-utils"

describe("Testing ens old", () => {
    test("testing NewOwner", () => {
        const rootNewOwnerEvent = createNewOwnerEvent(rootNewOwner)
        handleNewOwner(rootNewOwnerEvent)
        const newOwnerEvent = createNewOwnerEvent(newOwner1)
        handleNewOwner(newOwnerEvent)
        const hashRegisteredEvent = createHashRegistered(hashRegistered1)
        handleHashRegistered1(hashRegisteredEvent)
        assert.fieldEquals(
            "AirDomain",
            "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
            "id",
            "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79"
        )
        assert.fieldEquals(
            "AirDomain",
            "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
            "labelHash",
            newOwner1.label
        )
        assert.fieldEquals(
            "AirDomain",
            "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
            "labelHash",
            newOwner1.label
        )
        assert.fieldEquals(
            "AirDomain",
            "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
            "parent",
            newOwner1.node
        )
        assert.fieldEquals(
            "AirDomain",
            newOwner1.node,
            "subdomains",
            "[0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79]"
        )
        assert.fieldEquals("AirDomain", newOwner1.node, "subdomainCount", "1")
    })
    test("testing NewTTL", () => {
        const rootNewOwnerEvent = createNewOwnerEvent(rootNewOwner)
        handleNewOwner(rootNewOwnerEvent)
        const newOwnerEvent = createNewOwnerEvent(newOwner1)
        handleNewOwner(newOwnerEvent)

        const newTTLEvent = createNewTTLEvent(newTTL1)
        handleNewTTL(newTTLEvent)
        assert.fieldEquals(
            "AirDomain",
            "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
            "ttl",
            "43200"
        )
    })
    test("testing NewResolver", () => {
        const rootNewOwnerEvent = createNewOwnerEvent(rootNewOwner)
        handleNewOwner(rootNewOwnerEvent)
        const newOwnerEvent = createNewOwnerEvent(newOwner1)
        handleNewOwner(newOwnerEvent)

        const newResolverEvent = createNewResolverEvent(newResolverInput1)
        handleNewResolver(newResolverEvent)
        assert.fieldEquals(
            "AirResolver",
            newResolverInput1.node + "-" + newResolverInput1.resolver,
            "domain",
            newResolverInput1.node
        )
    })
    test("testing Tranfer", () => {
        const rootNewOwnerEvent = createNewOwnerEvent(rootNewOwner)
        handleNewOwner(rootNewOwnerEvent)
        const newOwnerEvent = createNewOwnerEvent(newOwner1)
        handleNewOwner(newOwnerEvent)
        assert.fieldEquals(
            "AirDomain",
            "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
            "owner",
            newOwner1.owner.toLowerCase()
        )
        const transferEvent = createTransferEvent(transferInput1)
        handleTransfer(transferEvent)
        assert.fieldEquals(
            "AirDomain",
            "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
            "owner",
            transferInput1.owner.toLowerCase()
        )
    })
})
