import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
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
import { HandleSetNameInput, mockSetName } from "./reverse-registrar-utils"
import {
  primaryDomainSet,
  primaryDomainSet2,
} from "./reverse-registrar-example"
import { AirDomain, AirResolver } from "../generated/schema"
import { mockAirBlock, mockAirDomainAccount, mockAirLabelName } from "./mock"
export const chainIdPrefix = "1-"
export const joiner = "-"

describe("Testing Reverse registrar", () => {
  beforeEach(() => {
    clearStore() // <-- clear the store before each test in the file
  })
  test("testing primary set change", () => {
    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName("0xeth", "eth")
    let airLabelName2 = mockAirLabelName("0xa", "a")

    let airDomainAccount = mockAirDomainAccount("0xuserAddress")

    // creating airDomain
    const domainId =
      "0x83853f8c4ca91ae85231d68dec421e7d9210f65860b863a574dfc0dc0c7e815e"
    let airDomain = new AirDomain(domainId)
    airDomain.encodedName = "0xa.0xeth"
    airDomain.name = [airLabelName1.id, airLabelName2.id]
    airDomain.labelName = airLabelName2.id
    airDomain.subdomainCount = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.manager = airDomainAccount.id
    airDomain.owner = airDomainAccount.id
    airDomain.isPrimary = false
    airDomain.isNameWrapped = false
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedIndex = BigInt.fromI32(0)
    airDomain.save()

    // creating airResolver
    let resolverAddress = "0x9062C0A6Dbd6108336BcBe4593a3D1cE05512069".toLowerCase()
    let resolvedAddress = "0x8e00dD033386a96fc1DF99ccB4aC4B538F6e4153".toLowerCase()

    let resolvedairDomainAccount = mockAirDomainAccount(resolvedAddress)

    let airResolver = new AirResolver(resolverAddress.concat(domainId))
    airResolver.domain = airDomain.id
    airResolver.resolverAddress = Address.fromHexString(resolverAddress)
    airResolver.resolvedAddress = resolvedairDomainAccount.id
    airResolver.createdAt = airBlock.id
    airResolver.lastUpdatedBlock = airBlock.id
    airResolver.lastUpdatedIndex = BigInt.fromI32(0)
    airResolver.save()
    // setting resolver
    airDomain.resolver = airResolver.id
    airDomain.save()
    let setNameInput: HandleSetNameInput = {
      name: "a",
      hash:
        "0xe6ac67ca8da45ca7522f66f184d9912360e3498274eea6c15021b2658d90d4d0",
      callIndex: "1",
      from: resolvedAddress,
    }
    mockSetName(setNameInput)
    assert.fieldEquals("AirDomain", domainId, "isPrimary", "true")
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "1")
  })
})
