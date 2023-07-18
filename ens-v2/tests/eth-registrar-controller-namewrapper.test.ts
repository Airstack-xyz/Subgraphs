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
import { mockNameRegistered, mockNameRenewed } from "./eth-registrar-controller-namewrapper-utils"
import { nameRegistered3, nameRenewed } from "./eth-registrar-controller-namewrapper-example"
export const chainIdPrefix = "1-"
export const joiner = "-"

describe("Testing Controller", () => {
    beforeEach(() => {
        clearStore() // <-- clear the store before each test in the file
    })
    test("testing nameRegistered & nameRenewed", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)

        // newDomain 0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a
        mockHandleNewOwner(childNewOwner)

        mockNameRegistered(nameRegistered3)
        // checking AirDomain
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "expiryDate",
            nameRegistered3.expires
        )
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "cost",
            "15"
        )
        //   0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a-0x88bc13b084fea1313ee6f062087ae3bc20111b388f270c67f55bd107a166c667
        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a" +
                "-" +
                nameRegistered3.hash,
            "cost",
            "15"
        )
        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a" +
                "-" +
                nameRegistered3.hash,
            "domain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a"
        )
        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a" +
                "-" +
                nameRegistered3.hash,
            "cost",
            "15"
        )
        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a" +
                "-" +
                nameRegistered3.hash,
            "isRenew",
            "false"
        )
        // try renewal
        mockNameRenewed(nameRenewed)
        // checking AirDomain
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "expiryDate",
            nameRenewed.expires
        )
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "cost",
            nameRenewed.cost
        )
        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a" +
                "-" +
                nameRenewed.hash,
            "isRenew",
            "true"
        )
        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a" +
                "-" +
                nameRenewed.hash,
            "expiryDate",
            nameRenewed.expires
        )
    })
})
