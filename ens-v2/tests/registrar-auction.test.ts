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
    resolvedAddressSet,
    resolvedAddressSetChild,
    trackExtra,
    trackExtraWithValue,
} from "./resolver-example"
import {
    handleAddrChanged,
    handleAddressChanged,
    handleTextChanged,
    handleTextChangedWithValue,
} from "../src/resolver"
import { mockSetName } from "./reverse-registrar-utils"
import { primaryDomainSet, primaryDomainSet2 } from "./reverse-registrar-example"
import { mockHandleRegistered } from "./registrar-auction-utils"
import { hashRegistered } from "./registrar-auction-example"
export const chainIdPrefix = "1-"
export const joiner = "-"

describe("Testing Registrar auction", () => {
    beforeEach(() => {
        clearStore() // <-- clear the store before each test in the file
    })
    test("testing hashRegistered", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)

        // newDomain 0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a
        mockHandleNewOwner(childNewOwner)

        mockHandleRegistered(hashRegistered)
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "registrationDate",
            hashRegistered.registrationDate
        )
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "cost",
            hashRegistered.value
        )
    })
})
