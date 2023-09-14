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
import {
  AddrChangedInput,
  AddressChangedInput,
  TextChangedInput,
  TextChangedWithValueInput,
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
import { mockAirBlock, mockAirDomainAccount, mockAirLabelName } from "./mock"
import { AirDomain, AirDomainPrimary, AirResolver } from "../generated/schema"
export const chainIdPrefix = "1-"
export const joiner = "-"

describe("Testing Resolver", () => {
  beforeEach(() => {
    clearStore() // <-- clear the store before each test in the file
  })
  test("testing resolvedAddress change", () => {
    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName("0xeth", "eth")
    let airLabelName2 = mockAirLabelName("0xa", "a")

    let airDomainAccount = mockAirDomainAccount("0xuserAddress")

    // reating airDomain
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

    let airResolver = new AirResolver(
      domainId.concat("-").concat(resolverAddress)
    )
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

    let newResolvedAddress = "0x1da022710dF5002339274AaDEe8D58218e9D6AB5".toLowerCase()
    let newResolvedairDomainAccount = mockAirDomainAccount(newResolvedAddress)
    const input: AddrChangedInput = {
      resolverAddress: resolverAddress,
      hash:
        "0xe6ac67ca8da45ca7522f66f184d9912360e3498274eea6c15021b2658d90d4d0",
      node: domainId,
      a: newResolvedAddress,
    }
    let ev = getAddrChangedEvent(input)
    handleAddrChanged(ev)
    assert.fieldEquals(
      "AirResolver",
      domainId.concat("-").concat(resolverAddress),
      "resolvedAddress",
      newResolvedairDomainAccount.id
    )
    assert.fieldEquals(
      "AirResolver",
      domainId.concat("-").concat(resolverAddress),
      "lastUpdatedIndex",
      "1"
    )
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "0")
  })

  test("testing resolvedAddress & isPrimary change", () => {
    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName("0xeth", "eth")
    let airLabelName2 = mockAirLabelName("0xa", "a")

    let airDomainAccount = mockAirDomainAccount("0xuserAddress")

    // reating airDomain
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

    let airResolver = new AirResolver(
      domainId.concat("-").concat(resolverAddress)
    )
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

    let newResolvedAddress = "0x1da022710dF5002339274AaDEe8D58218e9D6AB5".toLowerCase()
    let newResolvedairDomainAccount = mockAirDomainAccount(newResolvedAddress)
    // mocking AirDomainPrimary
    let airDomainPrimary = new AirDomainPrimary(newResolvedAddress)
    airDomainPrimary.domain = airDomain.id
    airDomainPrimary.save()
    const input: AddrChangedInput = {
      resolverAddress: resolverAddress,
      hash:
        "0xe6ac67ca8da45ca7522f66f184d9912360e3498274eea6c15021b2658d90d4d0",
      node: domainId,
      a: newResolvedAddress,
    }
    assert.fieldEquals("AirDomain", domainId, "isPrimary", "false")
    // calling function
    let ev = getAddrChangedEvent(input)
    handleAddrChanged(ev)

    assert.fieldEquals(
      "AirResolver",
      domainId.concat("-").concat(resolverAddress),
      "resolvedAddress",
      newResolvedairDomainAccount.id
    )
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "1")
    assert.fieldEquals("AirDomain", domainId, "isPrimary", "true")
  })
  test("testing textChanged", () => {
    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName("0xeth", "eth")
    let airLabelName2 = mockAirLabelName("0xa", "a")

    let airDomainAccount = mockAirDomainAccount("0xuserAddress")

    // reating airDomain
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

    let airResolver = new AirResolver(
      domainId.concat("-").concat(resolverAddress)
    )
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

    let input: TextChangedInput = {
      resolverAddress: resolverAddress,
      hash:
        "0xe6ac67ca8da45ca7522f66f184d9912360e3498274eea6c15021b2658d90d4d0",
      node: domainId,
      indexedKey: "hello",
      key: "hello",
    }
    // calling function
    let ev = getTextChangedEvent(input)
    handleTextChanged(ev)

    let updatedAirResolver = AirResolver.load(
      domainId.concat("-").concat(resolverAddress)
    )
    const textId = updatedAirResolver!.text[0]
    assert.fieldEquals(
      "AirText",
      textId,
      "resolver",
      domainId.concat("-").concat(resolverAddress)
    )
    assert.fieldEquals("AirText", textId, "name", "hello")
    assert.fieldEquals("AirText", textId, "value", "")

    assert.fieldEquals(
      "AirResolver",
      domainId.concat("-").concat(resolverAddress),
      "lastUpdatedIndex",
      "1"
    )

    let input2: TextChangedInput = {
      resolverAddress: resolverAddress,
      hash:
        "0xe6ac67ca8da45ca7522f66f184d9912360e3498274eea6c15021b2658d90d4d0",
      node: domainId,
      indexedKey: "hi",
      key: "hi",
    }
    // calling function
    ev = getTextChangedEvent(input2)
    handleTextChanged(ev)

    assert.fieldEquals(
      "AirResolver",
      domainId.concat("-").concat(resolverAddress),
      "lastUpdatedIndex",
      "2"
    )
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "0")
  })

  test("test textchangedwithvalue ", () => {
    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName("0xeth", "eth")
    let airLabelName2 = mockAirLabelName("0xa", "a")

    let airDomainAccount = mockAirDomainAccount("0xuserAddress")

    // reating airDomain
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

    let airResolver = new AirResolver(
      domainId.concat("-").concat(resolverAddress)
    )
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

    let input: TextChangedWithValueInput = {
      resolverAddress: resolverAddress,
      hash:
        "0xe6ac67ca8da45ca7522f66f184d9912360e3498274eea6c15021b2658d90d4d0",
      node: domainId,
      indexedKey: "hello",
      key: "hello",
      value: "0xabc",
    }
    // calling function
    let ev = getTextChangedWithValueEvent(input)
    handleTextChangedWithValue(ev)
    let updatedAirResolver = AirResolver.load(
      domainId.concat("-").concat(resolverAddress)
    )
    const textId = updatedAirResolver!.text[0]
    assert.fieldEquals(
      "AirText",
      textId,
      "resolver",
      domainId.concat("-").concat(resolverAddress)
    )
    assert.fieldEquals("AirText", textId, "name", "hello")
    assert.fieldEquals("AirText", textId, "value", "0xabc")

    assert.fieldEquals(
      "AirResolver",
      domainId.concat("-").concat(resolverAddress),
      "lastUpdatedIndex",
      "1"
    )

    let input2: TextChangedWithValueInput = {
      resolverAddress: resolverAddress,
      hash:
        "0xe6ac67ca8da45ca7522f66f184d9912360e3498274eea6c15021b2658d90d4d0",
      node: domainId,
      indexedKey: "hi",
      key: "hi",
      value: "0xdef",
    }
    // calling function
    ev = getTextChangedWithValueEvent(input2)
    handleTextChangedWithValue(ev)

    assert.fieldEquals(
      "AirResolver",
      domainId.concat("-").concat(resolverAddress),
      "lastUpdatedIndex",
      "2"
    )
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "0")
  })

  test("test MultiCoinAddress ", () => {
    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName("0xeth", "eth")
    let airLabelName2 = mockAirLabelName("0xa", "a")

    let airDomainAccount = mockAirDomainAccount("0xuserAddress")

    // reating airDomain
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

    let airResolver = new AirResolver(
      domainId.concat("-").concat(resolverAddress)
    )
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

    let input: AddressChangedInput = {
      resolverAddress: resolverAddress,
      hash:
        "0xe6ac67ca8da45ca7522f66f184d9912360e3498274eea6c15021b2658d90d4d0",
      node: domainId,
      coinType: "1",
      newAddress: "0x0014a30805f4e0d4d91dbb2816404142340a9850c949",
    }
    // calling function
    let ev = getAddressChangedEvent(input)
    handleAddressChanged(ev)

    let updatedAirResolver = AirResolver.load(
      domainId.concat("-").concat(resolverAddress)
    )
    const multiCoinId = updatedAirResolver!.multiCoin[0]
    assert.fieldEquals(
      "AirMultiCoin",
      multiCoinId,
      "resolver",
      domainId.concat("-").concat(resolverAddress)
    )
    assert.fieldEquals("AirMultiCoin", multiCoinId, "coinType", "1")
    assert.fieldEquals(
      "AirMultiCoin",
      multiCoinId,
      "address",
      "0x0014a30805f4e0d4d91dbb2816404142340a9850c949"
    )

    assert.fieldEquals(
      "AirResolver",
      domainId.concat("-").concat(resolverAddress),
      "lastUpdatedIndex",
      "1"
    )
  })
})
