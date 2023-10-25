import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AccountCreated } from "../generated/schema"
import { AccountCreated as AccountCreatedEvent } from "../generated/ERC6551Registry/ERC6551Registry"
import { handleAccountCreated } from "../src/erc-6551-registry"
import { createAccountCreatedEvent } from "./erc-6551-registry-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let account = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let implementation = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let chainId = BigInt.fromI32(234)
    let tokenContract = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenId = BigInt.fromI32(234)
    let salt = BigInt.fromI32(234)
    let newAccountCreatedEvent = createAccountCreatedEvent(
      account,
      implementation,
      chainId,
      tokenContract,
      tokenId,
      salt
    )
    handleAccountCreated(newAccountCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AccountCreated created and stored", () => {
    assert.entityCount("AccountCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AccountCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "account",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AccountCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "implementation",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AccountCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "chainId",
      "234"
    )
    assert.fieldEquals(
      "AccountCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenContract",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AccountCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "AccountCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "salt",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
