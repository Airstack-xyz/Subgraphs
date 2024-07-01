import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts"
import {
  assert,
  beforeEach,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index"
import * as airstack from "../modules/airstack/domain-name"

import { AirDomain, AirResolver } from "../generated/schema"
import { mockAirBlock, mockAirDomainAccount, mockAirLabelName } from "./mock"
import { newBlock } from "./utils"
export const chainIdPrefix = "1-"
export const joiner = "-"

describe("Testing Reverse registrar", () => {
  beforeEach(() => {
    clearStore() // <-- clear the store before each test in the file
  })
  test("testing primary set change", () => {
    let airBlock = mockAirBlock()
    airBlock.save()
    let airLabelName1 = mockAirLabelName("0xeth", "eth")
    airLabelName1.save()
    let airLabelName2 = mockAirLabelName("0xmozilla", "mozilla")
    airLabelName2.save()
    let airDomainAccount = mockAirDomainAccount("0xuserAddress")
    airDomainAccount.save()

    // creating airDomain
    const domainId =
      "0x0028ddb6c1ffcc054599b0b53a0510825538a6f16d1a0db09e7cbbdf7084f090"
    let airDomain = new AirDomain(domainId)

    airDomain.encodedName = "0xmozilla.0xeth"
    airDomain.name = [airLabelName1.id, airLabelName2.id]
    airDomain.labelName = airLabelName2.id
    airDomain.subdomainCount = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.manager = airDomainAccount.id
    airDomain.owner = airDomainAccount.id
    airDomain.isNameWrapped = false
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedIndex = BigInt.fromI32(0)
    airDomain.save()
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "1")

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
    airstack.domain.trackSetName(
      Bytes.fromHexString(
        "0xe6ac67ca8da45ca7522f66f184d9912360e3498274eea6c15021b2658d90d4d0"
      ),
      BigInt.fromString("1"),
      "mozilla.eth",
      "0x0028ddb6c1ffcc054599b0b53a0510825538a6f16d1a0db09e7cbbdf7084f090",
      Address.fromString(resolvedAddress),
      newBlock()
    )
    assert.fieldEquals("AirDomain", domainId, "isPrimary", "true")
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "1")
  })
})
