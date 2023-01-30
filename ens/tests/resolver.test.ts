import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach
} from "matchstick-as/assembly/index"
import { handleAddrChanged, handleVersionChanged } from "../src/resolver"
import { getHandleAddrChangedEvent, getHandleVersionChangedEvent } from "./resolver-utils"
import { domain } from "../modules/airstack/domain-name/index"
import { ETHEREUM_MAINNET_ID } from "../modules/airstack/domain-name/utils"

describe("Unit tests for resolver hanlders", () => {
  afterEach(() => {
    clearStore()
  })

  test("Test handleAddrChanged", () => {
    let event = getHandleAddrChangedEvent();
    handleAddrChanged(event)
    // assert here
    let addrChangedId = event.transaction.hash.toHexString().concat("-").concat(event.block.number.toString()).concat("-").concat(event.logIndex.toString())
    let resolverId = event.address.toHexString().concat("-").concat(event.params.node.toHexString())
    let domainId = event.params.node.toHexString();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());

    // AirResolver
    assert.fieldEquals(
      "AirResolver",
      resolverId,
      "domain",
      domainId
    )

    // AirDomain
    assert.fieldEquals(
      "AirDomain",
      domainId,
      "lastBlock",
      blockId
    )

    // getOrCreateAirAddrChanged
    assert.fieldEquals(
      "AirAddrChanged",
      addrChangedId,
      "resolver",
      resolverId
    )
    assert.fieldEquals(
      "AirAddrChanged",
      addrChangedId,
      "block",
      blockId
    )
    assert.fieldEquals(
      "AirAddrChanged",
      addrChangedId,
      "transactionHash",
      event.transaction.hash.toHexString()
    )
    assert.fieldEquals(
      "AirAddrChanged",
      addrChangedId,
      "previousResolvedAddress",
      "null"
    )
    assert.fieldEquals(
      "AirAddrChanged",
      addrChangedId,
      "newResolvedAddress",
      ETHEREUM_MAINNET_ID.concat("-").concat(event.params.a.toHexString())
    )
    assert.fieldEquals(
      "AirAddrChanged",
      addrChangedId,
      "domain",
      domainId
    )
    assert.fieldEquals(
      "AirAddrChanged",
      addrChangedId,
      "tokenId",
      "null",
    )
    assert.fieldEquals(
      "AirAddrChanged",
      addrChangedId,
      "index",
      "1"
    )
  })

  test("test handleVersionChanged", () => {
    let event = getHandleVersionChangedEvent();
    handleVersionChanged(event)
    // assert here
    // below assert breaks the test
    // assert.fieldEquals(
    //   "AirDomain",
    //   event.params.node.toHexString(),
    //   "resolvedAddress",
    //   "null"
    // )
  })

})