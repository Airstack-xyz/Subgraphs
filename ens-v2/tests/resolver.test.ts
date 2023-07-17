import { Bytes, log } from "@graphprotocol/graph-ts"
import { assert, beforeEach, clearStore, describe, test } from "matchstick-as/assembly/index"

import { mockHandleNewOwner, mockHandleNewResolver, mockHandleTransfer } from "./ens-registry-utils"
import {
    intialTransfer,
    newResolver,
    rootNewOwner,
    childNewOwner,
    childNewResolver,
} from "./ens-old-example"
import {
    getAddrChangedEvent,
    getAddressChangedEvent,
    getTextChangedEvent,
    getTextChangedWithValueEvent,
} from "./resolver-utils"
import {
    multiCoin,
    resolverAddressSet,
    resolverAddressSetChild,
    trackExtra,
    trackExtraWithValue,
} from "./resolver-example"
import {
    handleAddrChanged,
    handleAddressChanged,
    handleTextChanged,
    handleTextChangedWithValue,
} from "../src/resolver"
export const chainIdPrefix = "1-"
export const joiner = "-"

describe("Testing Resolver", () => {
    beforeEach(() => {
        clearStore() // <-- clear the store before each test in the file
    })
    test("testing resolvedAddress change", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)
        // newResolver
        mockHandleNewResolver(newResolver)
        // address changed
        let addressChanged = getAddrChangedEvent(resolverAddressSet)
        handleAddrChanged(addressChanged)
        // checking resolvedAdddress of domain
        assert.fieldEquals(
            "AirDomain",
            resolverAddressSet.node,
            "resolvedAddress",
            chainIdPrefix.concat(resolverAddressSet.a.toLowerCase())
        )
        // checking resolved field of AirDomainAccount
        assert.fieldEquals(
            "AirDomainAccount",
            chainIdPrefix.concat(resolverAddressSet.a.toLowerCase()),
            "resolved",
            "[" + resolverAddressSet.node + "]"
        )
        // newDomain 0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a
        mockHandleNewOwner(childNewOwner)

        // newResolver for new Domain
        mockHandleNewResolver(childNewResolver)
        // resolver address changed
        let childAddressChanged = getAddrChangedEvent(resolverAddressSetChild)
        handleAddrChanged(childAddressChanged)

        // checking resolvedAdddress of domain
        assert.fieldEquals(
            "AirDomain",
            resolverAddressSetChild.node,
            "resolvedAddress",
            chainIdPrefix.concat(resolverAddressSetChild.a.toLowerCase())
        )
        // checking resolved field of AirDomainAccount
        assert.fieldEquals(
            "AirDomainAccount",
            chainIdPrefix.concat(resolverAddressSetChild.a.toLowerCase()),
            "resolved",
            "[" + resolverAddressSet.node + ", " + resolverAddressSetChild.node + "]"
        )
    })
    // Getting this: Mapping aborted at ~lib/@graphprotocol/graph-ts/chain/ethereum.ts, line 63, column 7, with message: Ethereum value is not bytes.
    // wasm backtrace:
    // test("testing addressChanged", () => {
    //     // create root
    //     mockHandleTransfer(intialTransfer)
    //     // newOwner
    //     mockHandleNewOwner(rootNewOwner)
    //     // newResolver
    //     mockHandleNewResolver(newResolver)

    //     let multiCoinEvent = getAddressChangedEvent(multiCoin)
    //     handleAddressChanged(multiCoinEvent)
    // })

    test("test textchanged ", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)
        // newResolver
        mockHandleNewResolver(newResolver)

        let trackExtraEvent = getTextChangedEvent(trackExtra)
        handleTextChanged(trackExtraEvent)
        //AirExtra id 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a-vnd.ethers
        assert.fieldEquals(
            "AirExtra",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a-vnd.ethers",
            "name",
            "vnd.ethers"
        )
        assert.fieldEquals(
            "AirExtra",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a-vnd.ethers",
            "value",
            ""
        )
        //AirResolver id 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a
        assert.fieldEquals(
            "AirResolver",
            trackExtra.node
                .toLowerCase()
                .concat(joiner)
                .concat(trackExtra.resolverAddress.toLowerCase()),
            "extras",
            "[0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a-vnd.ethers]"
        )
    })

    test("test textchangedwithvalue ", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)
        // newResolver
        mockHandleNewResolver(newResolver)

        let trackExtraEvent = getTextChangedWithValueEvent(trackExtraWithValue)
        handleTextChangedWithValue(trackExtraEvent)
        //AirExtra id 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a-vnd.ethers
        assert.fieldEquals(
            "AirExtra",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a-vnd.ethers",
            "name",
            "vnd.ethers"
        )
        assert.fieldEquals(
            "AirExtra",
            "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a-vnd.ethers",
            "value",
            "value"
        )
        //AirResolver id 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a
        assert.fieldEquals(
            "AirResolver",
            trackExtra.node
                .toLowerCase()
                .concat(joiner)
                .concat(trackExtra.resolverAddress.toLowerCase()),
            "extras",
            "[0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae-0x19555a92a4c70b7ceb3b2b2b738d028a451da85a-vnd.ethers]"
        )
    })
})
