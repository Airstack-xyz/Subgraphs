import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
  logStore,
} from "matchstick-as/assembly/index"
import { crypto, ens, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { createParentDomain, getNameByLabelHashAndNode, getHandleNewTTLEvent, getHandleNewResolverEvent, getHandleTransferEvent, getHandleNewOwnerEvent } from "./ens-registry-utils"
import { handleNewResolver, handleTransferOldRegistry, handleTransfer, handleNewOwnerOldRegistry, handleNewOwner, handleNewTTL, handleNewTTLOldRegistry, handleNewResolverOldRegistry } from "../src/ens-registry"
import { ETHEREUM_MAINNET_ID, ZERO_ADDRESS } from "../modules/airstack/domain-name/utils"
import { TOKEN_ADDRESS_ENS } from "../src/utils";
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common"

describe("Unit tests for ens registry handlers", () => {
  afterEach(() => {
    clearStore()
  })

  test("Test handleNewOwner", () => {
    // prep
    let parentDomainId = "0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2";
    createParentDomain(parentDomainId);
    // call event handler
    let event = getHandleNewOwnerEvent();
    handleNewOwner(event)
    // assert here
    let domainId = crypto.keccak256(event.params.node.concat(event.params.label)).toHex();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // assert here
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // IsMigratedMapping
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "id", domainId);
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "true");
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "lastUpdatedAt", blockId);
    // ReverseRegistrar
    let labelName = ens.nameByHash(event.params.label.toHexString());
    let name = getNameByLabelHashAndNode(event.params.label, event.params.node);
    let reverseRegistrarId = crypto.keccak256(Bytes.fromUTF8(name)).toHexString();
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "id", reverseRegistrarId);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "name", name);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "domain", domainId);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "createdAt", blockId);
    // AirAccount
    let ownerAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "id", ownerAccountId);
    assert.fieldEquals("AirAccount", ownerAccountId, "address", event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirDomain
    assert.fieldEquals("AirDomain", parentDomainId, "subdomainCount", BIGINT_ONE.toString());
    assert.fieldEquals("AirDomain", domainId, "labelName", labelName!);
    assert.fieldEquals("AirDomain", domainId, "owner", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString()));
    assert.fieldEquals("AirDomain", domainId, "parent", parentDomainId);
    assert.fieldEquals("AirDomain", domainId, "labelHash", event.params.label.toHexString());
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "true");
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
    // prep
    let parentDomainId = "0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2";
    createParentDomain(parentDomainId);
    // call event handler
    let event = getHandleNewOwnerEvent();
    handleNewOwnerOldRegistry(event)
    // assert here
    let domainId = crypto.keccak256(event.params.node.concat(event.params.label)).toHex();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // assert here
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "ens")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "ens-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // IsMigratedMapping
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "id", domainId);
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "false");
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "lastUpdatedAt", blockId);
    // ReverseRegistrar
    let labelName = ens.nameByHash(event.params.label.toHexString());
    let name = getNameByLabelHashAndNode(event.params.label, event.params.node);
    let reverseRegistrarId = crypto.keccak256(Bytes.fromUTF8(name)).toHexString();
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "id", reverseRegistrarId);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "name", name);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "domain", domainId);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "createdAt", blockId);
    // AirAccount
    let ownerAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "id", ownerAccountId);
    assert.fieldEquals("AirAccount", ownerAccountId, "address", event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_DOMAIN_OWNER_CHANGED_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirDomain
    assert.fieldEquals("AirDomain", parentDomainId, "subdomainCount", BIGINT_ONE.toString());
    assert.fieldEquals("AirDomain", domainId, "labelName", labelName!);
    assert.fieldEquals("AirDomain", domainId, "owner", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString()));
    assert.fieldEquals("AirDomain", domainId, "parent", parentDomainId);
    assert.fieldEquals("AirDomain", domainId, "labelHash", event.params.label.toHexString());
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "false");
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
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // IsMigratedMapping
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "id", domainId);
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "true");
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "lastUpdatedAt", blockId);
    // AirAccount
    let zeroAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "id", zeroAccountId);
    assert.fieldEquals("AirAccount", zeroAccountId, "address", ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "createdAt", blockId);
    let newOwnerAddress = ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", newOwnerAddress, "id", newOwnerAddress);
    assert.fieldEquals("AirAccount", newOwnerAddress, "address", event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", newOwnerAddress, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_DOMAIN_TRANSFER_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_DOMAIN_TRANSFER_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "owner", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString()));
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
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // IsMigratedMapping
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "id", domainId);
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "false");
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "lastUpdatedAt", blockId);
    // AirAccount
    let zeroAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "id", zeroAccountId);
    assert.fieldEquals("AirAccount", zeroAccountId, "address", ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "createdAt", blockId);
    let newOwnerAddress = ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", newOwnerAddress, "id", newOwnerAddress);
    assert.fieldEquals("AirAccount", newOwnerAddress, "address", event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", newOwnerAddress, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_DOMAIN_TRANSFER_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_DOMAIN_TRANSFER_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "owner", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString()));
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
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // IsMigratedMapping
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "id", domainId);
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "true");
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "lastUpdatedAt", blockId);
    // AirResolver
    assert.fieldEquals("AirResolver", resolverId, "id", resolverId);
    assert.fieldEquals("AirResolver", resolverId, "address", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.resolver.toHexString()));
    assert.fieldEquals("AirResolver", resolverId, "domain", domainId);
    // AirAccount
    let zeroAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "id", zeroAccountId);
    assert.fieldEquals("AirAccount", zeroAccountId, "address", ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "createdAt", blockId);
    let newOwnerAddress = ETHEREUM_MAINNET_ID.concat("-").concat(event.params.resolver.toHexString());
    assert.fieldEquals("AirAccount", newOwnerAddress, "id", newOwnerAddress);
    assert.fieldEquals("AirAccount", newOwnerAddress, "address", event.params.resolver.toHexString());
    assert.fieldEquals("AirAccount", newOwnerAddress, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
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
    handleNewResolverOldRegistry(event)
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
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // IsMigratedMapping
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "id", domainId);
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "false");
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "lastUpdatedAt", blockId);
    // AirResolver
    assert.fieldEquals("AirResolver", resolverId, "id", resolverId);
    assert.fieldEquals("AirResolver", resolverId, "address", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.resolver.toHexString()));
    assert.fieldEquals("AirResolver", resolverId, "domain", domainId);
    // AirAccount
    let zeroAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "id", zeroAccountId);
    assert.fieldEquals("AirAccount", zeroAccountId, "address", ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "createdAt", blockId);
    let newOwnerAddress = ETHEREUM_MAINNET_ID.concat("-").concat(event.params.resolver.toHexString());
    assert.fieldEquals("AirAccount", newOwnerAddress, "id", newOwnerAddress);
    assert.fieldEquals("AirAccount", newOwnerAddress, "address", event.params.resolver.toHexString());
    assert.fieldEquals("AirAccount", newOwnerAddress, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_DOMAIN_NEW_RESOLVER_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
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
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // IsMigratedMapping
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "id", domainId);
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "true");
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "lastUpdatedAt", blockId);
    // AirAccount
    let zeroAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "id", zeroAccountId);
    assert.fieldEquals("AirAccount", zeroAccountId, "address", ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId);
    // AirExtra
    assert.fieldEquals("AirExtra", domainId.concat("-").concat('ttl'), "id", domainId.concat("-").concat('ttl'));
    assert.fieldEquals("AirExtra", domainId.concat("-").concat('ttl'), "name", "ttl");
    assert.fieldEquals("AirExtra", domainId.concat("-").concat('ttl'), "value", event.params.ttl.toString());
    assert.fieldEquals("AirExtra", domainId.concat("-").concat('ttl'), "domain", domainId);
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
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // IsMigratedMapping
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "id", domainId);
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "isMigrated", "false");
    assert.fieldEquals("DomainVsIsMigratedMapping", domainId, "lastUpdatedAt", blockId);
    // AirAccount
    let zeroAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "id", zeroAccountId);
    assert.fieldEquals("AirAccount", zeroAccountId, "address", ZERO_ADDRESS);
    assert.fieldEquals("AirAccount", zeroAccountId, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_DOMAIN_NEW_TTL_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "lastBlock", blockId);
    // AirExtra
    assert.fieldEquals("AirExtra", domainId.concat("-").concat('ttl'), "id", domainId.concat("-").concat('ttl'));
    assert.fieldEquals("AirExtra", domainId.concat("-").concat('ttl'), "name", "ttl");
    assert.fieldEquals("AirExtra", domainId.concat("-").concat('ttl'), "value", event.params.ttl.toString());
    assert.fieldEquals("AirExtra", domainId.concat("-").concat('ttl'), "domain", domainId);
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