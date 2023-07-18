import { assert, beforeEach, clearStore, describe, test } from "matchstick-as/assembly/index"
import {
    mockHandleNewOwner,
    mockHandleNewResolver,
    mockHandleNewTTL,
    mockHandleTransfer,
} from "./ens-registry-utils"
import {
    childNewOwner,
    childNewResolver,
    intialTransfer,
    newResolver,
    newTTL,
    rootNewOwner,
    secondTransfer,
} from "./ens-old-example"
import { Bytes, crypto } from "@graphprotocol/graph-ts"
import { getAddrChangedEvent } from "./resolver-utils"
import {
    resolvedAddressSet,
    resolvedAddressSetChild,
    resolvedAddressSetSomethingElse,
} from "./resolver-example"
import { handleAddrChanged } from "../src/resolver"
import { primaryDomainSet, primaryDomainSet2 } from "./reverse-registrar-example"
import { mockSetName } from "./reverse-registrar-utils"

const ETH_NODE = "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
describe("Testing ens (integration)", () => {
    beforeEach(() => {
        clearStore()
    })
    test("testing primary domain getting resolvedAddress changed & coming back", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)
        // newResolver
        mockHandleNewResolver(newResolver)
        // address changed
        let addressChanged = getAddrChangedEvent(resolvedAddressSet)
        handleAddrChanged(addressChanged)
        // checking resolvedAdddress of domain
        assert.fieldEquals(
            "AirDomain",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
            "resolvedAddress",
            "1-".concat(resolvedAddressSet.a.toLowerCase())
        )
        // checking primary domain -> false
        assert.fieldEquals(
            "AirDomain",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
            "isPrimary",
            "false"
        )
        // setting it as primary domain
        mockSetName(primaryDomainSet)
        assert.fieldEquals(
            "AirDomain",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
            "isPrimary",
            "true"
        )
        // setting resolvedAddress as something else
        let resolvedAddressSomethingElse = getAddrChangedEvent(resolvedAddressSetSomethingElse)
        handleAddrChanged(resolvedAddressSomethingElse)
        // checking resolvedAdddress of domain
        assert.fieldEquals(
            "AirDomain",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
            "resolvedAddress",
            "1-".concat(resolvedAddressSetSomethingElse.a.toLowerCase())
        )
        // checking isPrimary
        assert.fieldEquals(
            "AirDomain",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
            "isPrimary",
            "false"
        )
        // setting back to previous resolvedAddress
        handleAddrChanged(addressChanged)

        // checking resolvedAdddress of domain
        assert.fieldEquals(
            "AirDomain",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
            "resolvedAddress",
            "1-".concat(resolvedAddressSet.a.toLowerCase())
        )
        // checking isPrimary -> should turn to true
        assert.fieldEquals(
            "AirDomain",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
            "isPrimary",
            "true"
        )
        // // newDomain 0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a
        // mockHandleNewOwner(childNewOwner)

        // // newResolver for new Domain
        // mockHandleNewResolver(childNewResolver)
        // // resolver address changed
        // let childAddressChanged = getAddrChangedEvent(resolverAddressSetChild)
        // handleAddrChanged(childAddressChanged)

        // // now 2 users Domain has same resolvedAddress,setting one as primary
        // assert.fieldEquals(
        //     "AirDomain",
        //     "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
        //     "isPrimary",
        //     "false"
        // )
        // assert.fieldEquals(
        //     "AirDomain",
        //     "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
        //     "isPrimary",
        //     "false"
        // )

        // assert.fieldEquals(
        //     "AirDomain",
        //     "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
        //     "isPrimary",
        //     "true"
        // )
        // assert.fieldEquals(
        //     "AirDomain",
        //     "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
        //     "isPrimary",
        //     "false"
        // )

        // mockSetName(primaryDomainSet2)

        // assert.fieldEquals(
        //     "AirDomain",
        //     "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
        //     "isPrimary",
        //     "false"
        // )
        // assert.fieldEquals(
        //     "AirDomain",
        //     "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
        //     "isPrimary",
        //     "true"
        // )
    })
})
