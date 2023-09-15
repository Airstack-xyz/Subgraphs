import {
  assert,
  beforeEach,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index"
import {
  TransferInput,
  mockHandleControllerAdded,
  mockHandleNameRegistered,
  mockHandleNameRenewed,
  mockHandleTokenTransfer,
} from "./ens-token-utils"
import {
  controllerAdded,
  controllerAlreadyThere,
  nameRegistered,
  nameRenewed,
  newOwner,
  transfer,
} from "./ens-token-example"
import { mockHandleNewOwner, mockHandleTransfer } from "./ens-registry-utils"
import { intialTransfer, rootNewOwner } from "./ens-old-example"
import { AirDomain } from "../generated/schema"
import { BigInt, log } from "@graphprotocol/graph-ts"
import { mockAirBlock, mockAirDomainAccount, mockAirLabelName } from "./mock"

describe("Testing ens token", () => {
  beforeEach(() => {
    clearStore()
  })
  test("testing New Controller", () => {
    // create root
    mockHandleControllerAdded(controllerAdded)
    // // newOwner
    // mockHandleNewOwner(rootNewOwner)

    assert.fieldEquals(
      "ControllerEntity",
      controllerAdded.controller.toLowerCase(),
      "txHash",
      controllerAdded.hash.toLowerCase()
    )
  })
  test("testing Controller which is already tracked", () => {
    // create root
    mockHandleControllerAdded(controllerAlreadyThere)
    // // newOwner
    // mockHandleNewOwner(rootNewOwner)

    assert.entityCount("ControllerEntity", 0)
  })
  // test("testing handleNameREgistered", () => {
  //     // create root
  //     mockHandleTransfer(intialTransfer)
  //     // newOwner
  //     mockHandleNewOwner(rootNewOwner)
  //     // new owner related to nameRegistered
  //     mockHandleNewOwner(newOwner)

  //     // handle nameRegistered
  //     mockHandleNameRegistered(nameRegistered)
  //     assert.fieldEquals(
  //         "AirDomain",
  //         "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118",
  //         "tokenAddress",
  //         nameRegistered.tokenAddress
  //     )

  //     assert.fieldEquals(
  //         "AirDomainRegistrationOrRenew",
  //         "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118-".concat(
  //             nameRegistered.hash.toLowerCase()
  //         ),
  //         "hash",
  //         nameRegistered.hash
  //     )
  //     assert.fieldEquals(
  //         "AirDomainRegistrationOrRenew",
  //         "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118-".concat(
  //             nameRegistered.hash.toLowerCase()
  //         ),
  //         "isRenew",
  //         "false"
  //     )
  // })
  // test("testing handleNameRenewed", () => {
  //     // create root
  //     mockHandleTransfer(intialTransfer)
  //     // newOwner
  //     mockHandleNewOwner(rootNewOwner)
  //     // new owner related to nameRegistered
  //     mockHandleNewOwner(newOwner)

  //     // handle nameRegistered
  //     mockHandleNameRenewed(nameRenewed)

  //     assert.fieldEquals(
  //         "AirDomainRegistrationOrRenew",
  //         "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118-".concat(
  //             nameRegistered.hash.toLowerCase()
  //         ),
  //         "hash",
  //         nameRegistered.hash
  //     )
  //     assert.fieldEquals(
  //         "AirDomainRegistrationOrRenew",
  //         "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118-".concat(
  //             nameRegistered.hash.toLowerCase()
  //         ),
  //         "isRenew",
  //         "true"
  //     )
  // })

  test("testing handleTransfer, minting", () => {
    const input: TransferInput = {
      hash:
        "0xb0b74ad159d40f4587b4e7fefcb15215588bbe16af307561feecfbb89f092a3d",
      from: "0x0000000000000000000000000000000000000000",
      to: "0x0EaBFFD8cE94ab2387fC44Ba32642aF0c58Af433",
      tokenId:
        "72366803686942511032805581501287712263234841027461449776987202114023055837180",
      tokenAddress: "0xfac7bea255a6990f749363002136af6556b31e04",
      logIndex: "1",
    }

    // handle nameRegistered
    mockHandleTokenTransfer(input)
    const domainId =
      "0x302a85657b594b995ac8f8257af5cd83a2c5b45788a1ab19e6fc74cb21fba80f"
    let domain = AirDomain.load(domainId)

    assert.stringEquals(chainIdConcat(input.to.toLowerCase()), domain!.owner!)
    assert.stringEquals(chainIdConcat(input.to.toLowerCase()), domain!.manager!)
    assert.stringEquals(input.tokenAddress.toLowerCase(), domain!.tokenAddress!)
    assert.stringEquals(input.tokenId.toLowerCase(), domain!.tokenId!)
  })

  test("testing handleTransfer, already existing domain", () => {
    let airDomainAccount = mockAirDomainAccount(
      "0x0EaBFFD8cE94ab2387fC44Ba32642aF0c58Af433".toLowerCase()
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
    const domainId =
      "0x302a85657b594b995ac8f8257af5cd83a2c5b45788a1ab19e6fc74cb21fba80f"

    let airDomain = new AirDomain(domainId)
    airDomain.encodedName =
      "0x6472b4c739f6e46480609823a81b3f9445e39367a87cda58fef1366555b24337.0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0"
    airDomain.name = [airLabelName1.id, airLabelName2.id]
    airDomain.labelName = airLabelName2.id
    airDomain.labelName = airLabelName2.id
    airDomain.subdomainCount = BigInt.fromI32(0)
    airDomain.fuses = BigInt.fromI32(0)
    airDomain.manager = airDomainAccount.id
    airDomain.owner = airDomainAccount.id
    airDomain.isPrimary = false
    airDomain.isNameWrapped = true
    airDomain.createdAt = airBlock.id
    airDomain.lastUpdatedIndex = BigInt.fromI32(0)
    airDomain.save()

    const input: TransferInput = {
      hash:
        "0xb0b74ad159d40f4587b4e7fefcb15215588bbe16af307561feecfbb89f092a3d",
      from: "0x0EaBFFD8cE94ab2387fC44Ba32642aF0c58Af433".toLowerCase(),
      to: "0xF0AD5cAd05e10572EfcEB849f6Ff0c68f9700455".toLowerCase(),
      tokenId:
        "72366803686942511032805581501287712263234841027461449776987202114023055837180",
      tokenAddress: "0xfac7bea255a6990f749363002136af6556b31e04",
      logIndex: "1",
    }
    // handle nameRegistered
    mockHandleTokenTransfer(input)
  })
})

function chainIdConcat(key: string): string {
  return "1-".concat(key)
}
