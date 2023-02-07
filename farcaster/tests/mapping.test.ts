import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  afterEach,
  createMockedFunction,
} from "matchstick-as/assembly/index"
// import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { getHandleRegisterEvent, getHandleChangeHomeEvent, getHandleChangeRecoveryAddressEvent } from "./mapping-utils"
import { handleRegister, handleChangeHome, handleChangeRecoveryAddress } from "../src/mapping"
import { AirExtraData } from "../generated/schema"

describe("Mapping unit tests", () => {
  afterEach(() => {
    clearStore()
  })
  // test("Test handleFarcasterNameTransfer", () => {
  //   let event = getHandleFarcasterNameTransferEvent()
  //   handleFarcasterNameTransfer(event)
  //   createMockedFunction(FARCASTER_ID_REGISTRY_CONTRACT, 'idOf', 'idOf(address):(uint256)')
  //     .withArgs([ethereum.Value.fromAddress(Address.fromHexString('0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947'))])
  //     .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234))])
  //   // assert here
  //   assert.fieldEquals("AirMeta", "AIR_META", "name", "farcaster")
  //   assert.fieldEquals("AirMeta", "AIR_META", "slug", "farcaster-v1")
  //   assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
  //   assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
  //   assert.fieldEquals("AirMeta", "AIR_META", "network", "GOERLI")
  // })
  test("Test handleRegister", () => {
    //keeping chanid 1 for unit tests
    // call event handler
    let event = getHandleRegisterEvent()
    handleRegister(event)
    // assert here
    // AirUserRegisteredTransaction
    let airUserRegisteredTransactionId = "1-1234-0x084b1c3c81545d370f3634392de611caabff8148";
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "id", "1-1234-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "user", "1-1234");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "address", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "extras", "[1-1234-recoveryAddress, 1-1234-homeUrl]");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "from", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "to", "1-0x084b1c3c81545d370f3634392de611cbbcee9258");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "logOrCallIndex", "76");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "hash", "0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "block", "1-10098239");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "index", "1");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "protocolType", "SOCIAL");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "protocolActionType", "REGISTRATION");
    // AirBlock
    // AirAccount
    let addressAccountId = "1-0x084b1c3c81545d370f3634392de611caabff8148";
    assert.fieldEquals("AirAccount", addressAccountId, "id", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", addressAccountId, "address", "0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", addressAccountId, "createdAt", "1-10098239");
    let toAccountId = "1-0x084b1c3c81545d370f3634392de611cbbcee9258";
    assert.fieldEquals("AirAccount", toAccountId, "id", "1-0x084b1c3c81545d370f3634392de611cbbcee9258");
    assert.fieldEquals("AirAccount", toAccountId, "address", "0x084b1c3c81545d370f3634392de611cbbcee9258");
    assert.fieldEquals("AirAccount", toAccountId, "createdAt", "1-10098239");
    let fromAccountId = "1-0x084b1c3c81545d370f3634392de611caabff8148";
    assert.fieldEquals("AirAccount", fromAccountId, "id", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", fromAccountId, "address", "0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", fromAccountId, "createdAt", "1-10098239");
    // AirMeta
    // AirEntityCounter
    // AirExtraData
    // AirUser
  })
  test("Test handleChangeHome", () => {
    // prepare - keeping chanid 1 for unit tests
    let id = "1-1234-homeUrl";
    let airExtrasData = new AirExtraData(id);
    airExtrasData.name = "homeUrl";
    airExtrasData.value = "https://farcaster.com/u/1234";
    airExtrasData.user = "1-1234";
    airExtrasData.save();
    assert.fieldEquals("AirExtraData", id, "id", id);
    assert.fieldEquals("AirExtraData", id, "name", "homeUrl");
    assert.fieldEquals("AirExtraData", id, "value", "https://farcaster.com/u/1234");
    // call event handler
    let event = getHandleChangeHomeEvent()
    handleChangeHome(event);
    // assert here
    assert.fieldEquals("AirExtraData", id, "id", id);
    assert.fieldEquals("AirExtraData", id, "name", "homeUrl");
    assert.fieldEquals("AirExtraData", id, "value", "https://farcaster.com/u/12345");
    assert.fieldEquals("AirExtraData", id, "user", "1-1234");
  })

  test("Test handleChangeRecoveryAddress", () => {
    // prepare - keeping chanid 1 for unit tests
    let id = "1-1234-recoveryAddress";
    let airExtrasData = new AirExtraData(id);
    airExtrasData.name = "recoveryAddress";
    airExtrasData.value = "0xca207a1caf36d198b12c16c7c7a1d1c795978c42";
    airExtrasData.user = "1-1234";
    airExtrasData.save();
    assert.fieldEquals("AirExtraData", id, "id", id);
    assert.fieldEquals("AirExtraData", id, "name", "recoveryAddress");
    assert.fieldEquals("AirExtraData", id, "value", "0xca207a1caf36d198b12c16c7c7a1d1c795978c42");
    // call event handler
    let event = getHandleChangeRecoveryAddressEvent()
    handleChangeRecoveryAddress(event);
    // assert here
    assert.fieldEquals("AirExtraData", "1-1234-recoveryAddress", "id", "1-1234-recoveryAddress");
    assert.fieldEquals("AirExtraData", "1-1234-recoveryAddress", "name", "recoveryAddress");
    assert.fieldEquals("AirExtraData", "1-1234-recoveryAddress", "value", "0xda107a1caf36d198b12c16c7c7a1d1c795978c42");
    assert.fieldEquals("AirExtraData", "1-1234-recoveryAddress", "user", "1-1234");
  })
})