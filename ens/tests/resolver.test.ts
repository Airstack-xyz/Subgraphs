import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
} from "matchstick-as/assembly/index"
import { handleAddrChanged, handleVersionChanged } from "../src/resolver"
import { getHandleAddrChangedEvent, getHandleVersionChangedEvent } from "./resolver-utils"
import { ETHEREUM_MAINNET_ID } from "../modules/airstack/domain-name/utils"

describe("Unit tests for resolver handlers", () => {
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

    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")

    // AirResolver
    assert.fieldEquals("AirResolver", resolverId, "domain", domainId)

    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId)

    // getOrCreateAirAddrChanged
    assert.fieldEquals("AirAddrChanged", addrChangedId, "resolver", resolverId)
    assert.fieldEquals("AirAddrChanged", addrChangedId, "block", blockId)
    assert.fieldEquals("AirAddrChanged", addrChangedId, "transactionHash", event.transaction.hash.toHexString())
    assert.fieldEquals("AirAddrChanged", addrChangedId, "previousResolvedAddress", "null")
    assert.fieldEquals("AirAddrChanged", addrChangedId, "newResolvedAddress", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.a.toHexString()))
    assert.fieldEquals("AirAddrChanged", addrChangedId, "domain", domainId)
    assert.fieldEquals("AirAddrChanged", addrChangedId, "tokenId", "null",)
    assert.fieldEquals("AirAddrChanged", addrChangedId, "index", "1")
  })

  test("test handleVersionChanged", () => {
    let event = getHandleVersionChangedEvent();
    handleVersionChanged(event)
    // assert here
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString())
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString())
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString())
    // AirDomain
    let domainId = event.params.node.toHexString();
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId)
    // AirResolver
    let resolverId = event.address.toHexString().concat("-").concat(event.params.node.toHexString())
    assert.fieldEquals("AirResolver", resolverId, "domain", domainId)
    assert.fieldEquals("AirResolver", resolverId, "address", ETHEREUM_MAINNET_ID.concat("-").concat(event.address.toHexString()))
  })

})