import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CancelRecovery } from "../generated/schema"
import { CancelRecovery as CancelRecoveryEvent } from "../generated/FarcasteIdRegistry/FarcasteIdRegistry"
import { handleCancelRecovery } from "../src/farcaste-id-registry"
import { createCancelRecoveryEvent } from "./farcaste-id-registry-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let by = Address.fromString("0x0000000000000000000000000000000000000001")
    let id = BigInt.fromI32(234)
    let newCancelRecoveryEvent = createCancelRecoveryEvent(by, id)
    handleCancelRecovery(newCancelRecoveryEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CancelRecovery created and stored", () => {
    assert.entityCount("CancelRecovery", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CancelRecovery",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "by",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
