import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
} from "matchstick-as/assembly/index"
import { createNameWrappedEvent } from "./name-wrapper-utils"
import { handleNameWrapped } from "../src/name-wrapper"
import { ETHEREUM_MAINNET_ID } from "../modules/airstack/domain-name/utils"

describe("Unit tests for resolver handlers", () => {
  afterEach(() => {
    clearStore()
  })

  test("Test handleNameWrapped", () => {
    let event = createNameWrappedEvent();
    // call event handler
    handleNameWrapped(event)
    // assert here
    let domainId = event.params.node.toHexString();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens_v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "mainnet")
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "id", domainId)
    assert.fieldEquals("AirDomain", domainId, "labelName", "firstwrappedname")
    assert.fieldEquals("AirDomain", domainId, "name", "firstwrappedname.eth")
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedBlock", blockId)
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedIndex", "1")
  })
})

