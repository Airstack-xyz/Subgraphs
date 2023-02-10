import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
  createMockedFunction,
} from "matchstick-as/assembly/index"
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { FARCASTER_ID_REGISTRY_CONTRACT, createOrUpdateUserRegAndProfileFarcasterMapping, getHandleFarcasterNameTransferEvent, getHandleRegisterEvent, getHandleChangeHomeEvent, getHandleChangeRecoveryAddressEvent } from "./mapping-utils"
import { handleFarcasterNameTransfer, handleRegister, handleChangeHome, handleChangeRecoveryAddress } from "../src/mapping"
import { AirExtraData } from "../generated/schema"

describe("Mapping unit tests", () => {
  afterEach(() => {
    clearStore()
  })

  test("Test handleFarcasterNameTransfer, hard passing validation", () => {
    let event = getHandleFarcasterNameTransferEvent();
    // creating this mapping to test the event handler for passing validation
    let UserRegAndProfileFarcasterMappingId = "1234".concat("-").concat(event.params.to.toHexString());
    createOrUpdateUserRegAndProfileFarcasterMapping(
      UserRegAndProfileFarcasterMappingId,
      "1234",
      BigInt.fromString("10098239"),
      BigInt.fromString("2879823"),
      "0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5",
      "0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467",
      BigInt.fromString('76'),
      null,
      event.params.to.toHexString(),
      null,
      "https://farcaster.com/u/1234",
      "0x084b1c3c81545d370f3634392de611caabee8248",
      null,
      null,
    );
    //mock contract calls
    createMockedFunction(FARCASTER_ID_REGISTRY_CONTRACT, "idOf", "idOf(address):(uint256)")
      .withArgs([ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148"))])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1234"))]);
    createMockedFunction(event.address, "tokenURI", "tokenURI(uint256):(string)")
      .withArgs([ethereum.Value.fromUnsignedBigInt(event.params.tokenId)])
      .returns([ethereum.Value.fromString("https://farcaster.com/u/tokenUri.json")]);
    // call event handler
    handleFarcasterNameTransfer(event)
    // assert here
    // UserRegAndProfileFarcasterMapping
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "id", "1234-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "farcasterId", "1234");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "tokenId", "52188151743400395627052985077509996575321231749758347050596502733779185434624");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "farcasterProfileName", "sarvesh");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "recoveryAddress", "0x084b1c3c81545d370f3634392de611caabee8248");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "homeUrl", "https://farcaster.com/u/1234");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "tokenUri", "https://farcaster.com/u/tokenUri.json");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "fromAddress", "0x0000000000000000000000000000000000000000");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "toAddress", "0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "logOrCallIndex", "76");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "transactionHash", "0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "blockNumber", "10098239");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "blockTimestamp", "2879823");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "blockHash", "0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5");
    // AirUserRegisteredTransaction
    let airUserRegisteredTransactionId = "1-1234-0x084b1c3c81545d370f3634392de611caabff8148-sarvesh";
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "id", "1-1234-0x084b1c3c81545d370f3634392de611caabff8148-sarvesh");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "user", "1-1234");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "profile", "1-1234-sarvesh");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "address", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "extras", "[1-1234-recoveryAddress, 1-1234-homeUrl]");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "from", "1-0x0000000000000000000000000000000000000000");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "to", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "tokenId", "52188151743400395627052985077509996575321231749758347050596502733779185434624");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "logOrCallIndex", "76");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "hash", "0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "block", "1-10098239");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "index", "1");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "protocolType", "SOCIAL");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "protocolActionType", "REGISTRATION");
    // AirBlock
    assert.fieldEquals("AirBlock", "1-10098239", "id", "1-10098239");
    assert.fieldEquals("AirBlock", "1-10098239", "number", "10098239");
    assert.fieldEquals("AirBlock", "1-10098239", "hash", "0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5");
    assert.fieldEquals("AirBlock", "1-10098239", "timestamp", "2879823");
    // AirAccount
    let addressAccountId = "1-0x084b1c3c81545d370f3634392de611caabff8148";
    assert.fieldEquals("AirAccount", addressAccountId, "id", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", addressAccountId, "address", "0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", addressAccountId, "createdAt", "1-10098239");
    let toAccountId = "1-0x084b1c3c81545d370f3634392de611caabff8148";
    assert.fieldEquals("AirAccount", toAccountId, "id", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", toAccountId, "address", "0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", toAccountId, "createdAt", "1-10098239");
    let fromAccountId = "1-0x0000000000000000000000000000000000000000";
    assert.fieldEquals("AirAccount", fromAccountId, "id", "1-0x0000000000000000000000000000000000000000");
    assert.fieldEquals("AirAccount", fromAccountId, "address", "0x0000000000000000000000000000000000000000");
    assert.fieldEquals("AirAccount", fromAccountId, "createdAt", "1-10098239");
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "farcaster")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "farcaster-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirEntityCounter
    let airEntityCounterId = "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", "1-10098239");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", "1-10098239");
    // AirExtraData
    let airExtraDataId = "1-1234-recoveryAddress";
    assert.fieldEquals("AirExtraData", airExtraDataId, "id", "1-1234-recoveryAddress");
    assert.fieldEquals("AirExtraData", airExtraDataId, "name", "recoveryAddress");
    assert.fieldEquals("AirExtraData", airExtraDataId, "value", "0x084b1c3c81545d370f3634392de611caabee8248");
    airExtraDataId = "1-1234-homeUrl";
    assert.fieldEquals("AirExtraData", airExtraDataId, "id", "1-1234-homeUrl");
    assert.fieldEquals("AirExtraData", airExtraDataId, "name", "homeUrl");
    assert.fieldEquals("AirExtraData", airExtraDataId, "value", "https://farcaster.com/u/1234");
    airExtraDataId = "1-1234-tokenUri";
    assert.fieldEquals("AirExtraData", airExtraDataId, "id", "1-1234-tokenUri");
    assert.fieldEquals("AirExtraData", airExtraDataId, "name", "tokenUri");
    assert.fieldEquals("AirExtraData", airExtraDataId, "value", "https://farcaster.com/u/tokenUri.json");
    // AirUser
    let airUserId = "1-1234";
    assert.fieldEquals("AirUser", airUserId, "id", "1-1234");
    assert.fieldEquals("AirUser", airUserId, "address", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirUser", airUserId, "createdAt", "1-10098239");
    // AirProfile
    let airProfileId = "1-1234-sarvesh";
    assert.fieldEquals("AirProfile", airProfileId, "id", "1-1234-sarvesh");
    assert.fieldEquals("AirProfile", airProfileId, "name", "sarvesh");
    assert.fieldEquals("AirProfile", airProfileId, "user", "1-1234");
    assert.fieldEquals("AirProfile", airProfileId, "extras", "[1-1234-tokenUri]");
    assert.fieldEquals("AirProfile", airProfileId, "createdAt", "1-10098239");
  })

  test("Test handleRegister, hard passing validation", () => {
    //keeping chanid 1 for unit tests
    // call event handler
    let event = getHandleRegisterEvent()
    // creating this mapping to test the event handler for passing validation
    let UserRegAndProfileFarcasterMappingId = event.params.id.toString().concat("-").concat(event.params.to.toHexString());
    createOrUpdateUserRegAndProfileFarcasterMapping(
      UserRegAndProfileFarcasterMappingId,
      event.params.id.toString(),
      null,
      null,
      null,
      null,
      null,
      "0x0000000000000000000000000000000000000000",
      event.params.to.toHexString(),
      "https://farcaster.com/u/tokenUri.json",
      null,
      null,
      "bard",
      "234567890876543234567890987654"
    );
    handleRegister(event)
    // assert here
    // UserRegAndProfileFarcasterMapping
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "id", "1234-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "farcasterId", "1234");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "tokenId", "234567890876543234567890987654");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "farcasterProfileName", "bard");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "recoveryAddress", "0x084b1c3c81545d370f3634392de611caabee8248");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "homeUrl", "https://farcaster.com/u/1234");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "tokenUri", "https://farcaster.com/u/tokenUri.json");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "fromAddress", "0x0000000000000000000000000000000000000000");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "toAddress", "0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "logOrCallIndex", "76");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "transactionHash", "0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "blockNumber", "10098239");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "blockTimestamp", "2879823");
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "blockHash", "0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5");
    // AirUserRegisteredTransaction
    let airUserRegisteredTransactionId = "1-1234-0x084b1c3c81545d370f3634392de611caabff8148-bard";
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "id", "1-1234-0x084b1c3c81545d370f3634392de611caabff8148-bard");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "user", "1-1234");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "profile", "1-1234-bard");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "address", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "extras", "[1-1234-recoveryAddress, 1-1234-homeUrl]");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "from", "1-0x0000000000000000000000000000000000000000");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "to", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "tokenId", "234567890876543234567890987654");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "logOrCallIndex", "76");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "hash", "0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "block", "1-10098239");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "index", "1");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "protocolType", "SOCIAL");
    assert.fieldEquals("AirUserRegisteredTransaction", airUserRegisteredTransactionId, "protocolActionType", "REGISTRATION");
    // AirBlock
    assert.fieldEquals("AirBlock", "1-10098239", "id", "1-10098239");
    assert.fieldEquals("AirBlock", "1-10098239", "number", "10098239");
    assert.fieldEquals("AirBlock", "1-10098239", "hash", "0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5");
    assert.fieldEquals("AirBlock", "1-10098239", "timestamp", "2879823");
    // AirAccount
    let addressAccountId = "1-0x084b1c3c81545d370f3634392de611caabff8148";
    assert.fieldEquals("AirAccount", addressAccountId, "id", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", addressAccountId, "address", "0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", addressAccountId, "createdAt", "1-10098239");
    let toAccountId = "1-0x084b1c3c81545d370f3634392de611caabff8148";
    assert.fieldEquals("AirAccount", toAccountId, "id", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", toAccountId, "address", "0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirAccount", toAccountId, "createdAt", "1-10098239");
    let fromAccountId = "1-0x0000000000000000000000000000000000000000";
    assert.fieldEquals("AirAccount", fromAccountId, "id", "1-0x0000000000000000000000000000000000000000");
    assert.fieldEquals("AirAccount", fromAccountId, "address", "0x0000000000000000000000000000000000000000");
    assert.fieldEquals("AirAccount", fromAccountId, "createdAt", "1-10098239");
    // AirMeta
    assert.fieldEquals("AirMeta", "AIR_META", "name", "farcaster")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "farcaster-v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "MAINNET")
    // AirEntityCounter
    let airEntityCounterId = "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", "1-10098239");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", "1-10098239");
    // AirExtraData
    let airExtraDataId = "1-1234-recoveryAddress";
    assert.fieldEquals("AirExtraData", airExtraDataId, "id", "1-1234-recoveryAddress");
    assert.fieldEquals("AirExtraData", airExtraDataId, "name", "recoveryAddress");
    assert.fieldEquals("AirExtraData", airExtraDataId, "value", "0x084b1c3c81545d370f3634392de611caabee8248");
    airExtraDataId = "1-1234-homeUrl";
    assert.fieldEquals("AirExtraData", airExtraDataId, "id", "1-1234-homeUrl");
    assert.fieldEquals("AirExtraData", airExtraDataId, "name", "homeUrl");
    assert.fieldEquals("AirExtraData", airExtraDataId, "value", "https://farcaster.com/u/1234");
    airExtraDataId = "1-1234-tokenUri";
    assert.fieldEquals("AirExtraData", airExtraDataId, "id", "1-1234-tokenUri");
    assert.fieldEquals("AirExtraData", airExtraDataId, "name", "tokenUri");
    assert.fieldEquals("AirExtraData", airExtraDataId, "value", "https://farcaster.com/u/tokenUri.json");
    // AirUser
    let airUserId = "1-1234";
    assert.fieldEquals("AirUser", airUserId, "id", "1-1234");
    assert.fieldEquals("AirUser", airUserId, "address", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirUser", airUserId, "createdAt", "1-10098239");
    // AirProfile
    let airProfileId = "1-1234-bard";
    assert.fieldEquals("AirProfile", airProfileId, "id", "1-1234-bard");
    assert.fieldEquals("AirProfile", airProfileId, "name", "bard");
    assert.fieldEquals("AirProfile", airProfileId, "user", "1-1234");
    assert.fieldEquals("AirProfile", airProfileId, "extras", "[1-1234-tokenUri]");
    assert.fieldEquals("AirProfile", airProfileId, "createdAt", "1-10098239");
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