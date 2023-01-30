import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
} from "matchstick-as/assembly/index"
import { crypto, ens, BigInt } from "@graphprotocol/graph-ts"
import { getHandleNewOwnerEvent } from "./ens-registry-utils"
import { handleNewOwner } from "../src/ens-registry"
import { ETHEREUM_MAINNET_ID, ZERO_ADDRESS } from "../modules/airstack/domain-name/utils"
import { TOKEN_ADDRESS_ENS } from "../src/utils";
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common"
describe("Unit tests for ens registry handlers", () => {
  afterEach(() => {
    clearStore()
  })

  test("Test handleNewOwner", () => {
    let event = getHandleNewOwnerEvent();
    handleNewOwner(event)
    // assert here
    let domainId = crypto.keccak256(event.params.node.concat(event.params.label)).toHex();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    let parentDomainId = event.params.node.toHexString();
    // assert here
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirDomain
    assert.fieldEquals("AirDomain", parentDomainId, "subdomainCount", BIG_INT_ZERO.toString());
    let labelName = ens.nameByHash(event.params.label.toHexString());
    assert.fieldEquals("AirDomain", domainId, "labelName", labelName!);
    assert.fieldEquals("AirDomain", domainId, "owner", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString()));
    assert.fieldEquals("AirDomain", domainId, "parent", parentDomainId);
    assert.fieldEquals("AirDomain", domainId, "labelHash", event.params.label.toHexString());
    assert.fieldEquals("AirDomain", domainId, "isMigrated", "true");
    assert.fieldEquals("AirDomain", domainId, "tokenId", BigInt.fromUnsignedBytes(event.params.label).toString());
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId);
    assert.fieldEquals("AirDomain", domainId, "createdAt", blockId);
    assert.fieldEquals("AirDomain", domainId, "registrationCost", BIG_INT_ZERO.toString());
    assert.fieldEquals("AirDomain", domainId, "expiryTimestamp", BIG_INT_ZERO.toString());
    assert.fieldEquals("AirDomain", domainId, "isPrimary", "false");
    assert.fieldEquals("AirDomain", domainId, "tokenAddress", ETHEREUM_MAINNET_ID.concat("-").concat(TOKEN_ADDRESS_ENS));
    // AirDomainOwnerChangedTransaction
    let domainOwnerChangedEntityId = event.transaction.hash.toHexString().concat("-").concat(event.block.number.toString()).concat("-").concat(event.logIndex.toString());
    assert.fieldEquals("AirDomainOwnerChangedTransaction", domainOwnerChangedEntityId, "previousOwner", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirDomainOwnerChangedTransaction", domainOwnerChangedEntityId, "newOwner", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString()));
    assert.fieldEquals("AirDomainOwnerChangedTransaction", domainOwnerChangedEntityId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirDomainOwnerChangedTransaction", domainOwnerChangedEntityId, "tokenId", BigInt.fromUnsignedBytes(event.params.label).toString());
    assert.fieldEquals("AirDomainOwnerChangedTransaction", domainOwnerChangedEntityId, "domain", domainId);
    assert.fieldEquals("AirDomainOwnerChangedTransaction", domainOwnerChangedEntityId, "block", blockId);
    assert.fieldEquals("AirDomainOwnerChangedTransaction", domainOwnerChangedEntityId, "index", BIGINT_ONE.toString());
  })
})