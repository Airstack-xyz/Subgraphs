import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
  createMockedFunction,
  logStore,
} from "matchstick-as/assembly/index"
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { FARCASTER_ID_REGISTRY_CONTRACT, createOrUpdateUserRegAndProfileFarcasterMapping, getHandleFarcasterNameTransferEvent, getHandleRegisterEvent, getHandleChangeHomeEvent, getHandleChangeRecoveryAddressEvent } from "./mapping-utils"
import { handleFarcasterNameTransfer, handleRegister, handleChangeHomeUrlFid, handleChangeRecoveryAddressFid } from "../src/mapping"
import { AirExtra, AirSocialUser } from "../generated/schema"

describe("Mapping unit tests", () => {
  afterEach(() => {
    clearStore()
  })

  test("Test handleFarcasterNameTransfer, hard passing validation", () => {
    let event = getHandleFarcasterNameTransferEvent();
    // creating this mapping to test the event handler for passing validation
    let UserRegAndProfileFarcasterMappingId = "1234".concat("-").concat(event.params.to.toHexString()).concat("-").concat(event.transaction.hash.toHexString());
    createOrUpdateUserRegAndProfileFarcasterMapping(
      UserRegAndProfileFarcasterMappingId,
      "1234",
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
    createMockedFunction(Address.fromString("0xe3be01d99baa8db9905b33a3ca391238234b79d1"), "expiryOf", "expiryOf(uint256):(uint256)")
      .withArgs([ethereum.Value.fromUnsignedBigInt(event.params.tokenId)])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString("123456789"))]);
    // call event handler
    handleFarcasterNameTransfer(event)
    // assert here
    // UserRegAndProfileFarcasterMapping
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "id", "1234-0x084b1c3c81545d370f3634392de611caabff8148-0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467");
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
    // AirSocialUserRegisteredTransaction
    let AirSocialUserRegisteredTransactionId = "1-1234-0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467-0xe3be01d99baa8db9905b33a3ca391238234b79d1-52188151743400395627052985077509996575321231749758347050596502733779185434624";
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "id", "1-1234-0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467-0xe3be01d99baa8db9905b33a3ca391238234b79d1-52188151743400395627052985077509996575321231749758347050596502733779185434624");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "user", "1-1234");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "profile", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1-52188151743400395627052985077509996575321231749758347050596502733779185434624");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "profileExpiryTimestamp", "123456789");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "address", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "name", "sarvesh");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "extras", "[1-1234-userRecoveryAddress, 1-1234-userHomeUrl, 1-1234-tokenUri]");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "from", "1-0x0000000000000000000000000000000000000000");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "to", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "tokenId", "52188151743400395627052985077509996575321231749758347050596502733779185434624");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "tokenAddress", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "logOrCallIndex", "76");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "transactionHash", "0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "block", "1-10098239");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "index", "1");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "protocolType", "SOCIAL");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "protocolActionType", "SOCIAL_REGISTRATION");
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
    assert.fieldEquals("AirMeta", "AIR_META", "id", "AIR_META")
    assert.fieldEquals("AirMeta", "AIR_META", "name", "farcaster")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "farcaster_v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "mainnet")
    // AirEntityCounter
    let airEntityCounterId = "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", "1-10098239");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", "1-10098239");
    // AirToken
    let airTokenId = "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1";
    assert.fieldEquals("AirToken", airTokenId, "id", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1");
    assert.fieldEquals("AirToken", airTokenId, "address", "0xe3be01d99baa8db9905b33a3ca391238234b79d1");
    // AirExtra
    let airExtraId = "1-1234-userRecoveryAddress";
    assert.fieldEquals("AirExtra", airExtraId, "id", "1-1234-userRecoveryAddress");
    assert.fieldEquals("AirExtra", airExtraId, "name", "userRecoveryAddress");
    assert.fieldEquals("AirExtra", airExtraId, "value", "0x084b1c3c81545d370f3634392de611caabee8248");
    airExtraId = "1-1234-userHomeUrl";
    assert.fieldEquals("AirExtra", airExtraId, "id", "1-1234-userHomeUrl");
    assert.fieldEquals("AirExtra", airExtraId, "name", "userHomeUrl");
    assert.fieldEquals("AirExtra", airExtraId, "value", "https://farcaster.com/u/1234");
    airExtraId = "1-1234-tokenUri";
    assert.fieldEquals("AirExtra", airExtraId, "id", "1-1234-tokenUri");
    assert.fieldEquals("AirExtra", airExtraId, "name", "tokenUri");
    assert.fieldEquals("AirExtra", airExtraId, "value", "https://farcaster.com/u/tokenUri.json");
    // AirSocialUser
    let AirSocialUserId = "1-1234";
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "id", "1-1234");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "socialUserId", "1234");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "address", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "extras", "[1-1234-userRecoveryAddress, 1-1234-userHomeUrl]");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "createdAt", "1-10098239");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "lastUpdatedAt", "1-10098239");
    // AirSocialProfile
    let AirSocialProfileId = "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1-52188151743400395627052985077509996575321231749758347050596502733779185434624";
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "id", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1-52188151743400395627052985077509996575321231749758347050596502733779185434624");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "name", "sarvesh");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "expiryTimestamp", "123456789");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "tokenId", "52188151743400395627052985077509996575321231749758347050596502733779185434624");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "tokenAddress", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "user", "1-1234");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "extras", "[1-1234-tokenUri]");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "createdAt", "1-10098239");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "lastUpdatedAt", "1-10098239");
  })

  test("Test handleRegister, hard passing validation", () => {
    //keeping chanid 1 for unit tests
    // call event handler
    let event = getHandleRegisterEvent()
    // creating this mapping to test the event handler for passing validation
    let UserRegAndProfileFarcasterMappingId = event.params.id.toString().concat("-").concat(event.params.to.toHexString().concat("-").concat(event.transaction.hash.toHexString()));
    createOrUpdateUserRegAndProfileFarcasterMapping(
      UserRegAndProfileFarcasterMappingId,
      event.params.id.toString(),
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
    // mocking the function expiryOf
    createMockedFunction(Address.fromString("0xe3be01d99baa8db9905b33a3ca391238234b79d1"), "expiryOf", "expiryOf(uint256):(uint256)")
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromString("234567890876543234567890987654"))])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString("123456789"))]);
    handleRegister(event)
    // assert here
    // UserRegAndProfileFarcasterMapping
    assert.fieldEquals("UserRegAndProfileFarcasterMapping", UserRegAndProfileFarcasterMappingId, "id", "1234-0x084b1c3c81545d370f3634392de611caabff8148-0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467");
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
    // AirSocialUserRegisteredTransaction
    let AirSocialUserRegisteredTransactionId = "1-1234-0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467-0xe3be01d99baa8db9905b33a3ca391238234b79d1-234567890876543234567890987654";
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "id", "1-1234-0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467-0xe3be01d99baa8db9905b33a3ca391238234b79d1-234567890876543234567890987654");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "user", "1-1234");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "profile", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1-234567890876543234567890987654");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "profileExpiryTimestamp", "123456789");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "address", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "name", "bard");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "extras", "[1-1234-userRecoveryAddress, 1-1234-userHomeUrl, 1-1234-tokenUri]");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "from", "1-0x0000000000000000000000000000000000000000");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "to", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "tokenId", "234567890876543234567890987654");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "tokenAddress", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "logOrCallIndex", "76");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "transactionHash", "0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "block", "1-10098239");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "index", "1");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "protocolType", "SOCIAL");
    assert.fieldEquals("AirSocialUserRegisteredTransaction", AirSocialUserRegisteredTransactionId, "protocolActionType", "SOCIAL_REGISTRATION");
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
    assert.fieldEquals("AirMeta", "AIR_META", "id", "AIR_META")
    assert.fieldEquals("AirMeta", "AIR_META", "name", "farcaster")
    assert.fieldEquals("AirMeta", "AIR_META", "slug", "farcaster_v1")
    assert.fieldEquals("AirMeta", "AIR_META", "version", "v1")
    assert.fieldEquals("AirMeta", "AIR_META", "schemaVersion", "1.0.0")
    assert.fieldEquals("AirMeta", "AIR_META", "network", "mainnet")
    // AirEntityCounter
    let airEntityCounterId = "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER";
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "id", "AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "count", "1");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "createdAt", "1-10098239");
    assert.fieldEquals("AirEntityCounter", airEntityCounterId, "lastUpdatedAt", "1-10098239");
    // AirToken
    let airTokenId = "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1";
    assert.fieldEquals("AirToken", airTokenId, "id", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1");
    assert.fieldEquals("AirToken", airTokenId, "address", "0xe3be01d99baa8db9905b33a3ca391238234b79d1");
    // AirExtra
    let airExtraId = "1-1234-userRecoveryAddress";
    assert.fieldEquals("AirExtra", airExtraId, "id", "1-1234-userRecoveryAddress");
    assert.fieldEquals("AirExtra", airExtraId, "name", "userRecoveryAddress");
    assert.fieldEquals("AirExtra", airExtraId, "value", "0x084b1c3c81545d370f3634392de611caabee8248");
    airExtraId = "1-1234-userHomeUrl";
    assert.fieldEquals("AirExtra", airExtraId, "id", "1-1234-userHomeUrl");
    assert.fieldEquals("AirExtra", airExtraId, "name", "userHomeUrl");
    assert.fieldEquals("AirExtra", airExtraId, "value", "https://farcaster.com/u/1234");
    airExtraId = "1-1234-tokenUri";
    assert.fieldEquals("AirExtra", airExtraId, "id", "1-1234-tokenUri");
    assert.fieldEquals("AirExtra", airExtraId, "name", "tokenUri");
    assert.fieldEquals("AirExtra", airExtraId, "value", "https://farcaster.com/u/tokenUri.json");
    // AirSocialUser
    let AirSocialUserId = "1-1234";
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "id", "1-1234");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "socialUserId", "1234");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "address", "1-0x084b1c3c81545d370f3634392de611caabff8148");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "extras", "[1-1234-userRecoveryAddress, 1-1234-userHomeUrl]");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "createdAt", "1-10098239");
    assert.fieldEquals("AirSocialUser", AirSocialUserId, "lastUpdatedAt", "1-10098239");
    // AirSocialProfile
    let AirSocialProfileId = "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1-234567890876543234567890987654";
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "id", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1-234567890876543234567890987654");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "name", "bard");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "expiryTimestamp", "123456789");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "tokenId", "234567890876543234567890987654");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "tokenAddress", "1-0xe3be01d99baa8db9905b33a3ca391238234b79d1");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "user", "1-1234");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "extras", "[1-1234-tokenUri]");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "createdAt", "1-10098239");
    assert.fieldEquals("AirSocialProfile", AirSocialProfileId, "lastUpdatedAt", "1-10098239");
  })

  test("Test handleChangeHomeUrlFid if", () => {
    // prepare - keeping chanid 1 for unit tests
    let id = "1-1234-userHomeUrl";
    let airExtrasData = new AirExtra(id);
    airExtrasData.name = "userHomeUrl";
    airExtrasData.value = "https://farcaster.com/u/1234";
    airExtrasData.save();
    // create air social user
    let airSocialUser = new AirSocialUser("1-1234");
    airSocialUser.socialUserId = "1234";
    airSocialUser.address = "1-0xda317a1caf36d198b12c16c7c7a1d1c795979d72";
    airSocialUser.extras = [id];
    airSocialUser.createdAt = "1-10098200";
    airSocialUser.lastUpdatedAt = "1-10098200";
    airSocialUser.save();
    // assert here
    assert.fieldEquals("AirExtra", id, "id", id);
    assert.fieldEquals("AirExtra", id, "name", "userHomeUrl");
    assert.fieldEquals("AirExtra", id, "value", "https://farcaster.com/u/1234");
    // assert here for air social user
    assert.fieldEquals("AirSocialUser", "1-1234", "id", "1-1234");
    assert.fieldEquals("AirSocialUser", "1-1234", "socialUserId", "1234");
    assert.fieldEquals("AirSocialUser", "1-1234", "address", "1-0xda317a1caf36d198b12c16c7c7a1d1c795979d72");
    assert.fieldEquals("AirSocialUser", "1-1234", "extras", "[1-1234-userHomeUrl]");
    assert.fieldEquals("AirSocialUser", "1-1234", "createdAt", "1-10098200");
    assert.fieldEquals("AirSocialUser", "1-1234", "lastUpdatedAt", "1-10098200");
    // call event handler for if condition
    let event = getHandleChangeHomeEvent()
    handleChangeHomeUrlFid(event);
    // assert here
    assert.fieldEquals("AirSocialUser", "1-1234", "extras", "[1-1234-userHomeUrl]");
    assert.fieldEquals("AirSocialUser", "1-1234", "lastUpdatedAt", "1-10098200"); // if extra entity exists
    // assert air extra
    assert.fieldEquals("AirExtra", id, "id", id);
    assert.fieldEquals("AirExtra", id, "name", "userHomeUrl");
    assert.fieldEquals("AirExtra", id, "value", "https://farcaster.com/u/12345");
  })

  test("Test handleChangeHomeUrlFid else", () => {
    // prepare - keeping chanid 1 for unit tests
    let id = "1-1234-userHomeUrl";
    // create air social user
    let airSocialUser = new AirSocialUser("1-1234");
    airSocialUser.socialUserId = "1234";
    airSocialUser.address = "1-0xda317a1caf36d198b12c16c7c7a1d1c795979d72";
    airSocialUser.extras = null;
    airSocialUser.createdAt = "1-10098200";
    airSocialUser.lastUpdatedAt = "1-10098200";
    airSocialUser.save();
    // assert here for air social user
    assert.fieldEquals("AirSocialUser", "1-1234", "id", "1-1234");
    assert.fieldEquals("AirSocialUser", "1-1234", "socialUserId", "1234");
    assert.fieldEquals("AirSocialUser", "1-1234", "address", "1-0xda317a1caf36d198b12c16c7c7a1d1c795979d72");
    assert.fieldEquals("AirSocialUser", "1-1234", "extras", "null");
    assert.fieldEquals("AirSocialUser", "1-1234", "createdAt", "1-10098200");
    assert.fieldEquals("AirSocialUser", "1-1234", "lastUpdatedAt", "1-10098200");
    // call event handler for else condition
    let event = getHandleChangeHomeEvent()
    handleChangeHomeUrlFid(event);
    // assert here
    assert.fieldEquals("AirSocialUser", "1-1234", "extras", "[1-1234-userHomeUrl]");
    assert.fieldEquals("AirSocialUser", "1-1234", "lastUpdatedAt", "1-10098239"); // if extra entity exists
    // assert air extra
    assert.fieldEquals("AirExtra", id, "id", id);
    assert.fieldEquals("AirExtra", id, "name", "userHomeUrl");
    assert.fieldEquals("AirExtra", id, "value", "https://farcaster.com/u/12345");
  })

  test("Test handleChangeRecoveryAddressFid if", () => {
    // prepare - keeping chanid 1 for unit tests
    let id = "1-1234-userRecoveryAddress";
    let airExtrasData = new AirExtra(id);
    airExtrasData.name = "userRecoveryAddress";
    airExtrasData.value = "0xca207a1caf36d198b12c16c7c7a1d1c795978c42";
    airExtrasData.save();
    // create air social user
    let airSocialUser = new AirSocialUser("1-1234");
    airSocialUser.socialUserId = "1234";
    airSocialUser.address = "1-0xda317a1caf36d198b12c16c7c7a1d1c795979d72";
    airSocialUser.extras = [id];
    airSocialUser.createdAt = "1-10098200";
    airSocialUser.lastUpdatedAt = "1-10098200";
    airSocialUser.save();
    // assert here for air extra
    assert.fieldEquals("AirExtra", id, "id", id);
    assert.fieldEquals("AirExtra", id, "name", "userRecoveryAddress");
    assert.fieldEquals("AirExtra", id, "value", "0xca207a1caf36d198b12c16c7c7a1d1c795978c42");
    // assert here for air social user
    assert.fieldEquals("AirSocialUser", "1-1234", "id", "1-1234");
    assert.fieldEquals("AirSocialUser", "1-1234", "socialUserId", "1234");
    assert.fieldEquals("AirSocialUser", "1-1234", "address", "1-0xda317a1caf36d198b12c16c7c7a1d1c795979d72");
    assert.fieldEquals("AirSocialUser", "1-1234", "extras", "[1-1234-userRecoveryAddress]");
    assert.fieldEquals("AirSocialUser", "1-1234", "createdAt", "1-10098200");
    assert.fieldEquals("AirSocialUser", "1-1234", "lastUpdatedAt", "1-10098200");
    // call event handler
    let event = getHandleChangeRecoveryAddressEvent()
    handleChangeRecoveryAddressFid(event);
    // assert extra ids and lastUpdatedAt for social user
    assert.fieldEquals("AirSocialUser", "1-1234", "extras", "[1-1234-userRecoveryAddress]");
    assert.fieldEquals("AirSocialUser", "1-1234", "lastUpdatedAt", "1-10098200"); // if extra entity exists
    // assert air extra
    assert.fieldEquals("AirExtra", "1-1234-userRecoveryAddress", "id", "1-1234-userRecoveryAddress");
    assert.fieldEquals("AirExtra", "1-1234-userRecoveryAddress", "name", "userRecoveryAddress");
    assert.fieldEquals("AirExtra", "1-1234-userRecoveryAddress", "value", "0xda107a1caf36d198b12c16c7c7a1d1c795978c42");
  })

  test("Test handleChangeRecoveryAddressFid else", () => {
    // prepare - keeping chanid 1 for unit tests
    let id = "1-1234-userRecoveryAddress";
    // create air social user
    let airSocialUser = new AirSocialUser("1-1234");
    airSocialUser.socialUserId = "1234";
    airSocialUser.address = "1-0xda317a1caf36d198b12c16c7c7a1d1c795979d72";
    airSocialUser.extras = null;
    airSocialUser.createdAt = "1-10098200";
    airSocialUser.lastUpdatedAt = "1-10098200";
    airSocialUser.save();
    // assert here for air social user
    assert.fieldEquals("AirSocialUser", "1-1234", "id", "1-1234");
    assert.fieldEquals("AirSocialUser", "1-1234", "socialUserId", "1234");
    assert.fieldEquals("AirSocialUser", "1-1234", "address", "1-0xda317a1caf36d198b12c16c7c7a1d1c795979d72");
    assert.fieldEquals("AirSocialUser", "1-1234", "extras", "null");
    assert.fieldEquals("AirSocialUser", "1-1234", "createdAt", "1-10098200");
    assert.fieldEquals("AirSocialUser", "1-1234", "lastUpdatedAt", "1-10098200");
    // call event handler for else condition
    let event = getHandleChangeRecoveryAddressEvent()
    handleChangeRecoveryAddressFid(event);
    // assert extra ids and lastUpdatedAt for social user
    assert.fieldEquals("AirSocialUser", "1-1234", "extras", "[1-1234-userRecoveryAddress]");
    assert.fieldEquals("AirSocialUser", "1-1234", "lastUpdatedAt", "1-10098239"); // if extra entity exists
    // assert air extra
    assert.fieldEquals("AirExtra", "1-1234-userRecoveryAddress", "id", "1-1234-userRecoveryAddress");
    assert.fieldEquals("AirExtra", "1-1234-userRecoveryAddress", "name", "userRecoveryAddress");
    assert.fieldEquals("AirExtra", "1-1234-userRecoveryAddress", "value", "0xda107a1caf36d198b12c16c7c7a1d1c795978c42");
  })
})