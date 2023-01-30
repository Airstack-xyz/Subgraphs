import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
} from "matchstick-as/assembly/index"
import { ByteArray, crypto } from "@graphprotocol/graph-ts"
import { handleNameRegistered, handleNameRenewed } from "../src/eth-registrar"
import { getHandleNameRegisteredEvent, getHandleNameRenewedEvent } from "./eth-registrar-utils"
import { ETHEREUM_MAINNET_ID, byteArrayFromHex, uint256ToByteArray } from "../modules/airstack/domain-name/utils"
import { BIGINT_ONE } from "../modules/airstack/common"

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
    let blockId = event.block.number.toString() + "-" + event.logIndex.toString();
    // assert here
    // AirDomain
    assert.fieldEquals("Domain", domainId, "expiryTimestamp", event.params.expires.toString());
    assert.fieldEquals("Domain", domainId, "lastBlock", blockId);
    // AirNameRegisteredTransaction
    let nameRegisteredId = event.transaction.hash.toHexString().concat("-").concat(event.block.number.toString()).concat("-").concat(event.logIndex.toString());
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "block", blockId);
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "transactionHash", event.transaction.hash.toHexString());
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "tokenId", "null");
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "domain", domainId);
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "index", BIGINT_ONE.toString());
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "cost", event.transaction.value.toString());
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "registrant", event.params.owner.toHexString());
    assert.fieldEquals("AirNameRegisteredTransaction", nameRegisteredId, "expiryTimestamp", event.params.expires.toString());
  })

  // test("test handleNameRenewed", () => {
  //   let event = getHandleNameRenewedEvent();
  //   handleNameRenewed(event)
  //   // assert here

  // })

})