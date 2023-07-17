import { assert, beforeEach, clearStore, describe, test } from "matchstick-as/assembly/index"
import {
    mockHandleNewOwner,
    mockHandleNewResolver,
    mockHandleNewTTL,
    mockHandleTransfer,
} from "./ens-registry-utils"
import {
    intialTransfer,
    newResolver,
    newTTL,
    rootNewOwner,
    secondTransfer,
} from "./ens-old-example"
import { Bytes, crypto } from "@graphprotocol/graph-ts"

const ETH_NODE = "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
describe("Testing ens", () => {
    beforeEach(() => {
        clearStore()
    })
    test("testing NewOwner", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)

        assert.fieldEquals("AirDomain", rootNewOwner.node, "subdomainCount", "1")

        assert.fieldEquals("AirDomain", ETH_NODE, "parent", rootNewOwner.node)
        assert.fieldEquals("AirDomain", ETH_NODE, "labelHash", rootNewOwner.label)

        assert.fieldEquals(
            "AirDomainRegistered",
            createEventId(rootNewOwner.hash, rootNewOwner.logIndex),
            "hash",
            rootNewOwner.hash
        )
        assert.fieldEquals(
            "AirDomainRegistered",
            createEventId(rootNewOwner.hash, rootNewOwner.logIndex),
            "owner",
            concatChainId(rootNewOwner.owner)
        )

        let id = crypto.keccak256(Bytes.fromUTF8("default")).toHexString()
        assert.fieldEquals("AirReverseRegistrar", id, "name", "default")
        assert.fieldEquals("AirReverseRegistrar", id, "domain", ETH_NODE)
    })
    test("testing NewTTL", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)
        // newTTL
        mockHandleNewTTL(newTTL)
        assert.fieldEquals("AirDomain", newTTL.node, "ttl", newTTL.ttl)

        assert.fieldEquals(
            "AirDomainNewTTL",
            createEventId(newTTL.hash, newTTL.logIndex),
            "domain",
            newTTL.node
        )
        assert.fieldEquals(
            "AirDomainNewTTL",
            createEventId(newTTL.hash, newTTL.logIndex),
            "ttl",
            "43200"
        )
        assert.fieldEquals(
            "AirDomainNewTTL",
            createEventId(newTTL.hash, newTTL.logIndex),
            "hash",
            newTTL.hash
        )
    })
    test("testing NewResolver", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)
        // newResolver
        mockHandleNewResolver(newResolver)
        assert.fieldEquals(
            "AirDomain",
            newResolver.node,
            "resolver",
            newResolver.node.concat("-").concat(newResolver.resolver.toLowerCase())
        )
    })
    test("testing Transfer", () => {
        // intial transfer
        mockHandleTransfer(intialTransfer)
        assert.fieldEquals(
            "AirDomainTransferred",
            createEventId(intialTransfer.hash, intialTransfer.logIndex),
            "domain",
            intialTransfer.node
        )
        assert.fieldEquals(
            "AirDomainTransferred",
            createEventId(intialTransfer.hash, intialTransfer.logIndex),
            "oldOwner",
            concatChainId(intialTransfer.from)
        )
        assert.fieldEquals(
            "AirDomainTransferred",
            createEventId(intialTransfer.hash, intialTransfer.logIndex),
            "newOwner",
            concatChainId(intialTransfer.owner)
        )

        assert.fieldEquals(
            "AirDomainTransferred",
            createEventId(intialTransfer.hash, intialTransfer.logIndex),
            "hash",
            intialTransfer.hash
        )
        assert.fieldEquals("AirDomain", intialTransfer.node, "lastUpdatedIndex", "2")

        // intial transfer
        mockHandleTransfer(secondTransfer)
        assert.fieldEquals(
            "AirDomainTransferred",
            createEventId(secondTransfer.hash, intialTransfer.logIndex),
            "domain",
            secondTransfer.node
        )
        assert.fieldEquals(
            "AirDomainTransferred",
            createEventId(secondTransfer.hash, secondTransfer.logIndex),
            "oldOwner",
            concatChainId(secondTransfer.from)
        )
        assert.fieldEquals(
            "AirDomainTransferred",
            createEventId(secondTransfer.hash, secondTransfer.logIndex),
            "newOwner",
            concatChainId(secondTransfer.owner)
        )

        assert.fieldEquals(
            "AirDomainTransferred",
            createEventId(secondTransfer.hash, secondTransfer.logIndex),
            "hash",
            secondTransfer.hash
        )
        assert.fieldEquals("AirDomain", secondTransfer.node, "lastUpdatedIndex", "3")
    })
})

function createEventId(txHash: string, logIndex: string): string {
    return txHash.concat("-").concat(logIndex)
}
function concatChainId(id: string): string {
    return "1-".concat(id.toLowerCase())
}
