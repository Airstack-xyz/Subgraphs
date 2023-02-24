import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
} from "matchstick-as/assembly/index"
import { ByteArray, crypto, Bytes } from "@graphprotocol/graph-ts"
import { handleNameTransferred, handleNameRenewedByController, handleNameRegistered, handleNameRenewed, handleNameRegisteredByControllerOld, handleNameRegisteredByController } from "../src/eth-registrar"
import { getHandleNameTransferredEvent, getHandleNameRenewedByControllerEvent, getHandleNameRegisteredEvent, getHandleNameRenewedEvent, getHandleNameRegisteredByControllerOldEvent, getHandleNameRegisteredByControllerEvent } from "./eth-registrar-utils"
import { ETHEREUM_MAINNET_ID, ZERO_ADDRESS } from "../modules/airstack/domain-name/utils"
import { uint256ToByteArray, byteArrayFromHex } from "../src/utils"
import { BIGINT_ONE } from "../modules/airstack/common"
import { AirDomain } from "../generated/schema"

const rootNode: ByteArray = byteArrayFromHex("93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae");

describe("Unit tests for eth registrar handlers", () => {
  afterEach(() => {
    clearStore()
  })

  test("Test handleNameRegistered", () => {
    let event = getHandleNameRegisteredEvent();
    handleNameRegistered(event)
    // assert here
    let domainId = crypto.keccak256(rootNode.concat(uint256ToByteArray(event.params.id))).toHex();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // assert here
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
    // AirAccount
    let ownerAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "id", ownerAccountId);
    assert.fieldEquals("AirAccount", ownerAccountId, "address", event.params.owner.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_NAME_REGISTERED_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_NAME_REGISTERED_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirToken
    let airTokenId = ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS);
    assert.fieldEquals("AirToken", airTokenId, "id", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirToken", airTokenId, "address", ZERO_ADDRESS);
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "expiryTimestamp", event.params.expires.toString());
    assert.fieldEquals("AirDomain", domainId, "paymentToken", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedBlock", blockId);
    // AirNameRegisteredTransaction
    let nameRegisteredId = domainId.concat("-").concat(event.transaction.hash.toHexString());
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "paymentToken", airTokenId);
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "block", blockId);
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "tokenId", "null");
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "domain", domainId);
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "index", BIGINT_ONE.toString());
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "cost", "null");
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "registrant", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.owner.toHexString()));
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "expiryTimestamp", event.params.expires.toString());
  })

  test("test handleNameRenewed", () => {
    let event = getHandleNameRenewedEvent();
    handleNameRenewed(event)
    // assert here
    let domainId = crypto.keccak256(rootNode.concat(uint256ToByteArray(event.params.id))).toHex();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // assert here
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
    // AirAccount
    let ownerAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(event.transaction.from.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "id", ownerAccountId);
    assert.fieldEquals("AirAccount", ownerAccountId, "address", event.transaction.from.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_NAME_RENEWED_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_NAME_RENEWED_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirToken
    let airTokenId = ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS);
    assert.fieldEquals("AirToken", airTokenId, "id", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirToken", airTokenId, "address", ZERO_ADDRESS);
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "expiryTimestamp", event.params.expires.toString());
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedBlock", blockId);
    // AirNameRenewedTransaction
    let nameRenewedId = event.transaction.hash.toHexString().concat("-").concat(domainId);
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "paymentToken", airTokenId);
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "block", blockId);
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "tokenId", "null");
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "domain", domainId);
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "index", BIGINT_ONE.toString());
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "cost", "null");
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "renewer", ETHEREUM_MAINNET_ID.concat("-").concat(event.transaction.from.toHexString()));
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "expiryTimestamp", event.params.expires.toString());
  })

  test("test handleNameRegisteredByControllerOld", () => {
    let event = getHandleNameRegisteredByControllerOldEvent();
    handleNameRegisteredByControllerOld(event)
    // given
    let domainId = crypto.keccak256(rootNode.concat(event.params.label)).toHex();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    let reverseRegistrarId = crypto.keccak256(Bytes.fromUTF8(event.params.name.concat(".eth"))).toHexString();
    // assert here
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "registrationCost", event.params.cost.toString());
    assert.fieldEquals("AirDomain", domainId, "paymentToken", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedBlock", blockId);
    assert.fieldEquals("AirDomain", domainId, "labelName", event.params.name);
    assert.fieldEquals("AirDomain", domainId, "name", event.params.name.concat(".eth"));
    // ReverseRegistrar
    let domain = AirDomain.load(domainId)!;
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "id", crypto.keccak256(Bytes.fromUTF8(event.params.name.concat(".eth"))).toHexString());
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "name", domain.name!);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "domain", domainId);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "createdAt", blockId);
  })

  test("test handleNameRegisteredByController", () => {
    let event = getHandleNameRegisteredByControllerEvent();
    handleNameRegisteredByController(event)
    // assert here
    let domainId = crypto.keccak256(rootNode.concat(event.params.label)).toHex();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    let reverseRegistrarId = crypto.keccak256(Bytes.fromUTF8(event.params.name.concat(".eth"))).toHexString();
    // assert here
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "registrationCost", event.params.cost.toString());
    assert.fieldEquals("AirDomain", domainId, "paymentToken", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedBlock", blockId);
    assert.fieldEquals("AirDomain", domainId, "labelName", event.params.name);
    assert.fieldEquals("AirDomain", domainId, "name", event.params.name.concat(".eth"));
    // ReverseRegistrar
    let domain = AirDomain.load(domainId)!;
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "id", crypto.keccak256(Bytes.fromUTF8(event.params.name.concat(".eth"))).toHexString());
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "name", domain.name!);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "domain", domainId);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "createdAt", blockId);
  })

  test("test handleNameRenewedByController", () => {
    let event = getHandleNameRenewedByControllerEvent();
    handleNameRenewedByController(event)
    // assert here
    let domainId = crypto.keccak256(rootNode.concat(event.params.label)).toHex();
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    let reverseRegistrarId = crypto.keccak256(Bytes.fromUTF8(event.params.name.concat(".eth"))).toHexString();
    // assert here
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // AirAccount
    let ownerAccountId = ETHEREUM_MAINNET_ID.concat("-").concat(event.transaction.from.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "id", ownerAccountId);
    assert.fieldEquals("AirAccount", ownerAccountId, "address", event.transaction.from.toHexString());
    assert.fieldEquals("AirAccount", ownerAccountId, "createdAt", blockId);
    // AirEntityCounter
    let airEntityCounterId = "AIR_NAME_RENEWED_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_NAME_RENEWED_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", blockId);
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", blockId);
    // AirToken
    let airTokenId = ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS);
    assert.fieldEquals("AirToken", airTokenId, "id", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirToken", airTokenId, "address", ZERO_ADDRESS);
    // AirDomain
    assert.fieldEquals("AirDomain", domainId, "registrationCost", "0");
    assert.fieldEquals("AirDomain", domainId, "expiryTimestamp", event.params.expires.toString());
    assert.fieldEquals("AirDomain", domainId, "lastUpdatedBlock", blockId);
    assert.fieldEquals("AirDomain", domainId, "labelName", event.params.name);
    assert.fieldEquals("AirDomain", domainId, "name", event.params.name.concat(".eth"));
    // AirNameRenewedTransaction
    let nameRenewedId = event.transaction.hash.toHexString().concat("-").concat(domainId);
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "block", blockId);
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "tokenId", "null");
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "domain", domainId);
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "cost", event.params.cost.toString());
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "index", BIGINT_ONE.toString());
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "paymentToken", ETHEREUM_MAINNET_ID.concat("-").concat(ZERO_ADDRESS));
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "renewer", ETHEREUM_MAINNET_ID.concat("-").concat(event.transaction.from.toHexString()));
    assert.fieldEquals("AirNameRenewedTransaction", nameRenewedId, "expiryTimestamp", event.params.expires.toString());
    // ReverseRegistrar
    let domain = AirDomain.load(domainId)!;
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "id", crypto.keccak256(Bytes.fromUTF8(event.params.name.concat(".eth"))).toHexString());
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "name", domain.name!);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "domain", domainId);
    assert.fieldEquals("ReverseRegistrar", reverseRegistrarId, "createdAt", blockId);
  })

  test("Test handleNameTransferred", () => {
    // create a name registration txn to test the transfer function
    let nameRegisteredEvent = getHandleNameRegisteredEvent();
    handleNameRegistered(nameRegisteredEvent)
    // create event params for name transferred event
    // call handleNameTransferred
    // assert here
    let event = getHandleNameTransferredEvent();
    handleNameTransferred(event)
    // assert here
    let blockId = ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString());
    // NameRegisteredTransactionVsRegistrant
    let label = uint256ToByteArray(event.params.tokenId);
    let domainId = crypto.keccak256(rootNode.concat(label)).toHex();
    let nameRegisteredTransactionVsRegistrantId = domainId.concat("-").concat(event.transaction.hash.toHexString());
    assert.fieldEquals("NameRegisteredTransactionVsRegistrant", nameRegisteredTransactionVsRegistrantId, "id", domainId.concat("-").concat(event.transaction.hash.toHexString()));
    assert.fieldEquals("NameRegisteredTransactionVsRegistrant", nameRegisteredTransactionVsRegistrantId, "oldRegistrant", ETHEREUM_MAINNET_ID.concat("-").concat(nameRegisteredEvent.params.owner.toHexString()));
    assert.fieldEquals("NameRegisteredTransactionVsRegistrant", nameRegisteredTransactionVsRegistrantId, "newRegistrant", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.to.toHexString()));
    assert.fieldEquals("NameRegisteredTransactionVsRegistrant", nameRegisteredTransactionVsRegistrantId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("NameRegisteredTransactionVsRegistrant", nameRegisteredTransactionVsRegistrantId, "tokenId", event.params.tokenId.toString());
    assert.fieldEquals("NameRegisteredTransactionVsRegistrant", nameRegisteredTransactionVsRegistrantId, "createdAt", ETHEREUM_MAINNET_ID.concat("-").concat(event.block.number.toString()));
    // AirBlock
    assert.fieldEquals("AirBlock", blockId, "id", blockId);
    assert.fieldEquals("AirBlock", blockId, "number", event.block.number.toString());
    assert.fieldEquals("AirBlock", blockId, "hash", event.block.hash.toHexString());
    assert.fieldEquals("AirBlock", blockId, "timestamp", event.block.timestamp.toString());
    // AirAccount
    let oldRegistrant = ETHEREUM_MAINNET_ID.concat("-").concat(nameRegisteredEvent.params.owner.toHexString());
    assert.fieldEquals("AirAccount", oldRegistrant, "id", oldRegistrant);
    assert.fieldEquals("AirAccount", oldRegistrant, "address", nameRegisteredEvent.params.owner.toHexString());
    assert.fieldEquals("AirAccount", oldRegistrant, "createdAt", blockId);
    let newRegistrant = ETHEREUM_MAINNET_ID.concat("-").concat(event.params.to.toHexString());
    assert.fieldEquals("AirAccount", newRegistrant, "id", newRegistrant);
    assert.fieldEquals("AirAccount", newRegistrant, "address", event.params.to.toHexString());
    assert.fieldEquals("AirAccount", newRegistrant, "createdAt", blockId);
    // AirNameRegisteredTransaction
    let nameRegisteredId = domainId.concat("-").concat(event.transaction.hash.toHexString());
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "registrant", ETHEREUM_MAINNET_ID.concat("-").concat(event.params.to.toHexString()));
  })
})