import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
} from "matchstick-as/assembly/index"
import { handleAddrChanged, handleVersionChanged } from "../src/resolver"
import { createAirDomain, getHandleAddrChangedEvent, getHandleVersionChangedEvent } from "./resolver-utils"
import { ETHEREUM_MAINNET_ID } from "../modules/airstack/domain-name/utils"
import { log } from "@graphprotocol/graph-ts"

describe("Unit tests for resolver handlers", () => {
  afterEach(() => {
    clearStore()
  })

  test("Test handleAddrChanged", () => {
    let domain = createAirDomain("0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff4");
    domain.resolver = "0x314159265dd8dbb310642f98f50c066173c1259b-0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff4";
    domain.save();
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
    assert.fieldEquals("AirResolver", resolverId, "id", resolverId)
    assert.fieldEquals("AirResolver", resolverId, "domain", domainId)
    assert.fieldEquals("AirResolver", resolverId, "address", ETHEREUM_MAINNET_ID.concat("-").concat(event.address.toHexString()))
    assert.fieldEquals("AirResolver", resolverId, "resolvedAddress", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.a.toHexString()))
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // AirAccount
    let resolverAddressAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(event.params.a.toHexString());
    assert.fieldEquals("AirAccount", resolverAddressAccountId, "id", resolverAddressAccountId);
    assert.fieldEquals("AirAccount", resolverAddressAccountId, "address", event.params.a.toHexString());
    assert.fieldEquals("AirAccount", resolverAddressAccountId, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_ADDR_CHANGED_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_ADDR_CHANGED_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "id", domainId)
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId)
    assert.fieldEquals("AirDomain", domainId, "resolvedAddress", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.a.toHexString()))
    // AirResolvedAddressChanged
    assert.fieldEquals("AirResolvedAddressChanged", addrChangedId, "resolver", resolverId)
    assert.fieldEquals("AirResolvedAddressChanged", addrChangedId, "block", blockId)
    assert.fieldEquals("AirResolvedAddressChanged", addrChangedId, "transactionHash", event.transaction.hash.toHexString())
    assert.fieldEquals("AirResolvedAddressChanged", addrChangedId, "previousResolvedAddress", "null")
    assert.fieldEquals("AirResolvedAddressChanged", addrChangedId, "newResolvedAddress", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.a.toHexString()))
    assert.fieldEquals("AirResolvedAddressChanged", addrChangedId, "domain", domainId)
    assert.fieldEquals("AirResolvedAddressChanged", addrChangedId, "tokenId", "null",)
    assert.fieldEquals("AirResolvedAddressChanged", addrChangedId, "index", "1")
  })

  test("test handleVersionChanged", () => {
    let domain = createAirDomain("0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff4");
    domain.resolver = "0x314159265dd8dbb310642f98f50c066173c1259b-0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff4";
    domain.save();
    let event = getHandleVersionChangedEvent();
    handleVersionChanged(event)
    // assert here
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId)
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString())
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString())
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString())
    // AirAccount
    let resolverAddressAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(event.address.toHexString());
    assert.fieldEquals("AirAccount", resolverAddressAccountId, "id", resolverAddressAccountId)
    assert.fieldEquals("AirAccount", resolverAddressAccountId, "address", event.address.toHexString())
    assert.fieldEquals("AirAccount", resolverAddressAccountId, "createdAt", blockId)
    // AirDomain
    let domainId = event.params.node.toHexString();
    assert.fieldEquals("AirDomain", domainId, "id", domainId)
    assert.fieldEquals("AirDomain", domainId, "resolvedAddress", "null")
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId)
    // AirResolver
    let resolverId = event.address.toHexString().concat("-").concat(event.params.node.toHexString())
    assert.fieldEquals("AirResolver", resolverId, "id", resolverId)
    assert.fieldEquals("AirResolver", resolverId, "domain", domainId)
    assert.fieldEquals("AirResolver", resolverId, "address", ETHEREUM_MAINNET_ID.concat("-").concat(event.address.toHexString()))
  })

})