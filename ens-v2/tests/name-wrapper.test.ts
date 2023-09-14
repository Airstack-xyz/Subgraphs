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
  mockHandleNewTTL,
  mockHandleTransfer,
} from "./ens-registry-utils"
import {
  handleControllerChanged,
  handleExpiryExtended,
  handleFusesSet,
  handleNameUnwrapped,
  handleNameWrapped,
} from "../src/name-wrapper"
import { Bytes, crypto, BigInt, log } from "@graphprotocol/graph-ts"
import {
  createControllerChangedEvent,
  createNameWrappedEvent,
  createNameUnwrappedEvent,
  createFusesSetEvent,
  createExpiryExtendedEvent,
  NameWrappedInput,
  NameUnwrappedInput,
  FusesSetInput,
  ExpiryExtendedInput,
} from "./name-wrapper-utils"
import {
  controllerAdded,
  controllerAdded2,
  controllerRemoved,
  expiryExtended,
  fusesSet,
  nameUnwrapped,
  nameWrapped,
} from "./name-wrapper-example"

import { childNewOwner, intialTransfer, rootNewOwner } from "./ens-old-example"
import { ETH_NODE } from "../src/utils"
import { AirDomain } from "../generated/schema"
import { mockAirBlock, mockAirDomainAccount, mockAirLabelName } from "./mock"

describe("Testing namewrapper", () => {
  beforeEach(() => {
    clearStore()
  })
  test("testing handleControllerChanged ", () => {
    // controller added
    let controllerAddedEvent = createControllerChangedEvent(controllerAdded)
    handleControllerChanged(controllerAddedEvent)
    // won't add ControllerNameWrapperEntity - since controller is hardcoded
    assert.entityCount("ControllerNameWrapperEntity", 0)
  })
  test("testing controllerAdded with new controller", () => {
    // controller added
    let controllerAddedEvent = createControllerChangedEvent(controllerAdded2)
    handleControllerChanged(controllerAddedEvent)
    // adds ControllerNameWrapperEntity
    assert.entityCount("ControllerNameWrapperEntity", 1)
  })
  test("testing controllerRemoved ", () => {
    // controller added
    let controllerRemovedEvent = createControllerChangedEvent(controllerRemoved)
    handleControllerChanged(controllerRemovedEvent)
    assert.entityCount("ControllerNameWrapperRemoved", 1)
  })
  test("testing namewrapped", () => {
    let airDomainAccount = mockAirDomainAccount(
      "0x911143d946ba5d467bfc476491fdb235fef4d667"
    )

    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName(
      "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
      ""
    )
    airLabelName1.save()
    let airLabelName2 = mockAirLabelName(
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337",
      ""
    )
    airLabelName2.save()
    let domainId =
      "0xc44eec7fb870ae46d4ef4392d33fbbbdc164e7817a86289a1fe30e5f4d98ae85"
    let airDomain = new AirDomain(domainId)

    airDomain.encodedName =
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337.0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0"
    airDomain.name = [airLabelName1.id, airLabelName2.id]
    airDomain.labelName = airLabelName2.id
    airDomain.subdomainCount = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.manager = airDomainAccount.id
    airDomain.owner = airDomainAccount.id
    airDomain.isPrimary = false
    airDomain.isNameWrapped = false
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedIndex = BigInt.fromI32(0)
    airDomain.save()
    const nameWrapped: NameWrappedInput = {
      hash:
        "0x4f6d23687502000445f2bf233ab33fbf8ac29e0880dd6e4268bc044a880dc8bc",
      name: "0x106669727374777261707065646e616d650365746800",
      node: domainId,
      owner: "0x29a82e07b96c405ac99a8023f767d2971546de70",
      fuses: "30",
      expiry: "1234",
    }
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "0")
    let nameWrappedEvent = createNameWrappedEvent(nameWrapped)
    handleNameWrapped(nameWrappedEvent)
    assert.fieldEquals("AirDomain", domainId, "isNameWrapped", "true")
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "1")
    assert.fieldEquals("AirDomain", domainId, "fuses", "30")
    assert.fieldEquals("AirDomain", domainId, "expiryDate", "1234")
    assert.fieldEquals(
      "AirLabelName",
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337",
      "name",
      "firstwrappedname"
    )
    assert.fieldEquals(
      "AirLabelName",
      "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
      "name",
      "eth"
    )
  })
  test("testing name unwrapped", () => {
    let airDomainAccount = mockAirDomainAccount(
      "0x911143d946ba5d467bfc476491fdb235fef4d667"
    )

    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName(
      "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
      ""
    )
    airLabelName1.save()
    let airLabelName2 = mockAirLabelName(
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337",
      ""
    )
    airLabelName2.save()
    let domainId =
      "0xc44eec7fb870ae46d4ef4392d33fbbbdc164e7817a86289a1fe30e5f4d98ae85"
    let airDomain = new AirDomain(domainId)

    airDomain.encodedName =
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337.0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0"
    airDomain.name = [airLabelName1.id, airLabelName2.id]
    airDomain.labelName = airLabelName2.id
    airDomain.subdomainCount = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.manager = airDomainAccount.id
    airDomain.owner = airDomainAccount.id
    airDomain.isPrimary = false
    airDomain.isNameWrapped = true
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedIndex = BigInt.fromI32(0)
    airDomain.save()
    const nameWrapped: NameUnwrappedInput = {
      hash:
        "0x4f6d23687502000445f2bf233ab33fbf8ac29e0880dd6e4268bc044a880dc8bc",
      node: domainId,
      owner: "0x29a82e07b96c405ac99a8023f767d2971546de70",
    }
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "0")
    let nameUnwrappedEvent = createNameUnwrappedEvent(nameWrapped)
    handleNameUnwrapped(nameUnwrappedEvent)
    assert.fieldEquals("AirDomain", domainId, "isNameWrapped", "false")
  })

  test("testing fusesSet", () => {
    let airDomainAccount = mockAirDomainAccount(
      "0x911143d946ba5d467bfc476491fdb235fef4d667"
    )

    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName(
      "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
      ""
    )
    airLabelName1.save()
    let airLabelName2 = mockAirLabelName(
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337",
      ""
    )
    airLabelName2.save()
    let domainId =
      "0xc44eec7fb870ae46d4ef4392d33fbbbdc164e7817a86289a1fe30e5f4d98ae85"
    let airDomain = new AirDomain(domainId)

    airDomain.encodedName =
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337.0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0"
    airDomain.name = [airLabelName1.id, airLabelName2.id]
    airDomain.labelName = airLabelName2.id
    airDomain.subdomainCount = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.manager = airDomainAccount.id
    airDomain.owner = airDomainAccount.id
    airDomain.isPrimary = false
    airDomain.isNameWrapped = true
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedIndex = BigInt.fromI32(0)
    airDomain.save()
    const fusesSet: FusesSetInput = {
      hash:
        "0x4f6d23687502000445f2bf233ab33fbf8ac29e0880dd6e4268bc044a880dc8bc",
      node: domainId,
      fuses: "300",
    }
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "0")
    let fuseSetEvent = createFusesSetEvent(fusesSet)
    handleFusesSet(fuseSetEvent)
    assert.fieldEquals("AirDomain", domainId, "fuses", "300")
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "1")
  })

  test("testing fusesSet", () => {
    let airDomainAccount = mockAirDomainAccount(
      "0x911143d946ba5d467bfc476491fdb235fef4d667"
    )

    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName(
      "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
      ""
    )
    airLabelName1.save()
    let airLabelName2 = mockAirLabelName(
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337",
      ""
    )
    airLabelName2.save()
    let domainId =
      "0xc44eec7fb870ae46d4ef4392d33fbbbdc164e7817a86289a1fe30e5f4d98ae85"
    let airDomain = new AirDomain(domainId)

    airDomain.encodedName =
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337.0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0"
    airDomain.name = [airLabelName1.id, airLabelName2.id]
    airDomain.labelName = airLabelName2.id
    airDomain.subdomainCount = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.manager = airDomainAccount.id
    airDomain.owner = airDomainAccount.id
    airDomain.isPrimary = false
    airDomain.isNameWrapped = true
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedIndex = BigInt.fromI32(0)
    airDomain.save()
    const fusesSet: FusesSetInput = {
      hash:
        "0x4f6d23687502000445f2bf233ab33fbf8ac29e0880dd6e4268bc044a880dc8bc",
      node: domainId,
      fuses: "300",
    }
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "0")
    let fuseSetEvent = createFusesSetEvent(fusesSet)
    handleFusesSet(fuseSetEvent)
    assert.fieldEquals("AirDomain", domainId, "fuses", "300")
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "1")
  })

  test("testing handleExpiryExtended", () => {
    let airDomainAccount = mockAirDomainAccount(
      "0x911143d946ba5d467bfc476491fdb235fef4d667"
    )

    let airBlock = mockAirBlock()

    let airLabelName1 = mockAirLabelName(
      "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
      ""
    )
    airLabelName1.save()
    let airLabelName2 = mockAirLabelName(
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337",
      ""
    )
    airLabelName2.save()
    let domainId =
      "0xc44eec7fb870ae46d4ef4392d33fbbbdc164e7817a86289a1fe30e5f4d98ae85"
    let airDomain = new AirDomain(domainId)

    airDomain.encodedName =
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337.0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0"
    airDomain.name = [airLabelName1.id, airLabelName2.id]
    airDomain.labelName = airLabelName2.id
    airDomain.subdomainCount = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.manager = airDomainAccount.id
    airDomain.owner = airDomainAccount.id
    airDomain.isPrimary = false
    airDomain.isNameWrapped = true
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedIndex = BigInt.fromI32(0)
    airDomain.save()
    const fusesSet: ExpiryExtendedInput = {
      hash:
        "0x4f6d23687502000445f2bf233ab33fbf8ac29e0880dd6e4268bc044a880dc8bc",
      node: domainId,
      expiry: "300",
    }
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "0")
    let event = createExpiryExtendedEvent(fusesSet)
    handleExpiryExtended(event)
    assert.fieldEquals("AirDomain", domainId, "expiryDate", "300")
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "1")

    assert.fieldEquals(
      "AirDomainRegistrationOrRenew",
      fusesSet.hash.concat("-").concat("1"),
      "isRenew",
      "true"
    )
  })
})
