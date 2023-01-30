import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
} from "matchstick-as/assembly/index"
import { crypto, ens, BigInt } from "@graphprotocol/graph-ts"
import { getHandleNewTTLEvent, getHandleNewResolverEvent, getHandleTransferEvent, getHandleNewOwnerEvent } from "./ens-registry-utils"
import { handleNewResolver, handleTransferOldRegistry, handleTransfer, handleNewOwnerOldRegistry, handleNewOwner, handleNewTTL, handleNewTTLOldRegistry } from "../src/ens-registry"
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

  test("Test handleNewOwnerOldRegistry", () => {
    let event = getHandleNewOwnerEvent();
    handleNewOwnerOldRegistry(event)
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
    assert.fieldEquals("AirDomain", domainId, "isMigrated", "false");
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

  test("Test handleTransfer", () => {
    let event = getHandleTransferEvent();
    handleTransfer(event)
    // assert here
    let domainId = event.params.node.toHexString();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // assert here
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirDomainTransferTransaction
    let domainOwnerChangedEntityId = event.transaction.hash.toHexString().concat("-").concat(event.block.number.toString()).concat("-").concat(event.logIndex.toString());
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "from", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "to", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString()));
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "block", blockId);
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "tokenId", "null");
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "domain", domainId);
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "index", BIGINT_ONE.toString());
  })


  test("Test handleTransferOldRegistry", () => {
    let event = getHandleTransferEvent();
    handleTransferOldRegistry(event)
    // assert here
    let domainId = event.params.node.toHexString();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // assert here
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirDomainTransferTransaction
    let domainOwnerChangedEntityId = event.transaction.hash.toHexString().concat("-").concat(event.block.number.toString()).concat("-").concat(event.logIndex.toString());
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "from", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "to", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString()));
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "block", blockId);
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "tokenId", "null");
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "domain", domainId);
    assert.fieldEquals("AirDomainTransferTransaction", domainOwnerChangedEntityId, "index", BIGINT_ONE.toString());
  })

  test("Test handleNewResolver", () => {
    let event = getHandleNewResolverEvent();
    handleNewResolver(event)
    // assert here
    let domainId = event.params.node.toHexString();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    let resolverId = event.params.resolver.toHexString().concat("-").concat(domainId);
    // assert here
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "resolver", resolverId);
    assert.fieldEquals("AirDomain", domainId, "subdomainCount", BIG_INT_ZERO.toString());
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId);
    // AirDomainNewResolverTransaction
    let domainNewResolverEntityId = event.transaction.hash.toHexString().concat("-").concat(event.block.number.toString()).concat("-").concat(event.logIndex.toString());
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "previousResolver", "null");
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "newOwnerResolver", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.resolver.toHexString()));
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "block", blockId);
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "tokenId", "null");
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "domain", domainId);
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "index", BIGINT_ONE.toString());
  })

  test("Test handleNewResolverOldRegistry", () => {
    let event = getHandleNewResolverEvent();
    handleNewResolver(event)
    // assert here
    let domainId = event.params.node.toHexString();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    let resolverId = event.params.resolver.toHexString().concat("-").concat(domainId);
    // assert here
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "resolver", resolverId);
    assert.fieldEquals("AirDomain", domainId, "subdomainCount", BIG_INT_ZERO.toString());
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId);
    // AirDomainNewResolverTransaction
    let domainNewResolverEntityId = event.transaction.hash.toHexString().concat("-").concat(event.block.number.toString()).concat("-").concat(event.logIndex.toString());
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "previousResolver", "null");
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "newOwnerResolver", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.resolver.toHexString()));
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "block", blockId);
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "tokenId", "null");
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "domain", domainId);
    assert.fieldEquals("AirDomainNewResolverTransaction", domainNewResolverEntityId, "index", BIGINT_ONE.toString());
  })

  test("Test handleNewTTL", () => {
    let event = getHandleNewTTLEvent();
    handleNewTTL(event)
    // assert here
    let domainId = event.params.node.toHexString();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // assert here
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "ttl", event.params.ttl.toString());
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId);
    // AirDomainNewTTLTransaction
    let domainNewResolverEntityId = event.transaction.hash.toHexString().concat("-").concat(event.block.number.toString()).concat("-").concat(event.logIndex.toString());
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "oldTTL", "null");
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "newTTL", event.params.ttl.toString());
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "block", blockId);
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "tokenId", "null");
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "domain", domainId);
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "index", BIGINT_ONE.toString());
  })

  test("Test handleNewTTLOldRegistry", () => {
    let event = getHandleNewTTLEvent();
    handleNewTTLOldRegistry(event)
    // assert here
    let domainId = event.params.node.toHexString();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // assert here
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "ttl", event.params.ttl.toString());
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId);
    // AirDomainNewTTLTransaction
    let domainNewResolverEntityId = event.transaction.hash.toHexString().concat("-").concat(event.block.number.toString()).concat("-").concat(event.logIndex.toString());
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "oldTTL", "null");
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "newTTL", event.params.ttl.toString());
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "block", blockId);
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "tokenId", "null");
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "domain", domainId);
    assert.fieldEquals("AirDomainNewTTLTransaction", domainNewResolverEntityId, "index", BIGINT_ONE.toString());
  })
})