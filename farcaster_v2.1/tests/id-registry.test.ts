import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ChangeRecoveryAddress } from "../generated/schema"
import { ChangeRecoveryAddress as ChangeRecoveryAddressEvent } from "../generated/IdRegistry/IdRegistry"
import { handleChangeRecoveryAddress } from "../src/id-registry"
import { createChangeRecoveryAddressEvent } from "./id-registry-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let recovery = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newChangeRecoveryAddressEvent = createChangeRecoveryAddressEvent(
      id,
      recovery
    )
    handleChangeRecoveryAddress(newChangeRecoveryAddressEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ChangeRecoveryAddress created and stored", () => {
    assert.entityCount("ChangeRecoveryAddress", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ChangeRecoveryAddress",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "recovery",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
