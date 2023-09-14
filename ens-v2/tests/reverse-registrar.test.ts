import { Bytes, log } from "@graphprotocol/graph-ts"
import {
  assert,
  beforeEach,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index"

import {
  mockHandleNewOwner,
  mockHandleNewResolver,
  mockHandleTransfer,
} from "./ens-registry-utils"
import {
  intialTransfer,
  newResolver,
  rootNewOwner,
  childNewOwner,
  childNewResolver,
} from "./ens-old-example"
import { getAddrChangedEvent } from "./resolver-utils"
import { resolvedAddressSet, resolvedAddressSetChild } from "./resolver-example"
import { handleAddrChanged } from "../src/resolver"
import { mockSetName } from "./reverse-registrar-utils"
import {
  primaryDomainSet,
  primaryDomainSet2,
} from "./reverse-registrar-example"
export const chainIdPrefix = "1-"
export const joiner = "-"

describe("Testing Reverse registrar", () => {
  beforeEach(() => {
    clearStore() // <-- clear the store before each test in the file
  })
  test("testing primary set change", () => {
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

    // newDomain 0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a
    mockHandleNewOwner(childNewOwner)

    // newResolver for new Domain
    mockHandleNewResolver(childNewResolver)
    // resolver address changed
    let childAddressChanged = getAddrChangedEvent(resolvedAddressSetChild)
    handleAddrChanged(childAddressChanged)

    // now 2 users Domain has same resolvedAddress,setting one as primary
    assert.fieldEquals(
      "AirDomain",
      "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
      "isPrimary",
      "false"
    )
    assert.fieldEquals(
      "AirDomain",
      "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
      "isPrimary",
      "false"
    )
    mockSetName(primaryDomainSet)

    assert.fieldEquals(
      "AirDomain",
      "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
      "isPrimary",
      "true"
    )
    assert.fieldEquals(
      "AirDomain",
      "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
      "isPrimary",
      "false"
    )

    // mockSetName(primaryDomainSet2)

    // assert.fieldEquals(
    //   "AirDomain",
    //   "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    //   "isPrimary",
    //   "false"
    // )
    // assert.fieldEquals(
    //   "AirDomain",
    //   "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
    //   "isPrimary",
    //   "true"
    // )
  })
})
