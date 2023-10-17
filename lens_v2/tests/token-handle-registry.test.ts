import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt } from "@graphprotocol/graph-ts"
import { HandleLinked } from "../generated/schema"
import { HandleLinked as HandleLinkedEvent } from "../generated/TokenHandleRegistry/TokenHandleRegistry"
import { handleHandleLinked } from "../src/token-handle-registry"
import { createHandleLinkedEvent } from "./token-handle-registry-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let handle = "ethereum.Tuple Not implemented"
    let token = "ethereum.Tuple Not implemented"
    let timestamp = BigInt.fromI32(234)
    let newHandleLinkedEvent = createHandleLinkedEvent(handle, token, timestamp)
    handleHandleLinked(newHandleLinkedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("HandleLinked created and stored", () => {
    assert.entityCount("HandleLinked", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "HandleLinked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "handle",
      "ethereum.Tuple Not implemented"
    )
    assert.fieldEquals(
      "HandleLinked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token",
      "ethereum.Tuple Not implemented"
    )
    assert.fieldEquals(
      "HandleLinked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
