import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
} from "matchstick-as/assembly/index"
import { Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import { ExampleEntity } from "../generated/schema"
import { Transfer } from "../generated/ENSRegistry/ENSRegistry"
import {
    handleNewOwner,
    handleNewResolver,
    handleNewTTL,
    handleTransfer,
} from "../src/ens-registry"
import {
    createNewOwnerEvent,
    createNewResolverEvent,
    createNewTTLEvent,
    createTransferEvent,
} from "./ens-registry-utils"
import { newOwner, newResolver, newTTL, transfer } from "./ens-registry-example"

describe("Testing ens registry", () => {
    test("testing Transfer", () => {
        const transferEvent = createTransferEvent(transfer)
        handleTransfer(transferEvent)
    })
    test("testing NewOwner", () => {
        const newOwnerEvent = createNewOwnerEvent(newOwner)
        handleNewOwner(newOwnerEvent)
    })
    test("testing NewResolver", () => {
        const NewResolverEvent = createNewResolverEvent(newResolver)
        handleNewResolver(NewResolverEvent)
    })
    test("testing NewTTL", () => {
        const newTTLEvent = createNewTTLEvent(newTTL)
        handleNewTTL(newTTLEvent)
    })
})
