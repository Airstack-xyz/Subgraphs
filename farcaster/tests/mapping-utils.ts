import { newMockEvent } from "matchstick-as"
import {
  Transfer,
  ChangeRecoveryAddress as ChangeRecoveryAddressFname
} from "../generated/FarcasterNameRegistry/FarcasterNameRegistry";
import { Register, ChangeHome, ChangeRecoveryAddress, Transfer as FidTransfer } from "../generated/FarcasterIdRegistry/FarcasterIdRegistry";
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { UserRegAndProfileFarcasterMapping } from "../generated/schema";

export function getHandleRegisterEvent(): Register {
  return createHandleRegisterEvent()
}

export function getHandleFarcasterNameTransferEvent(): Transfer {
  return createHandleFarcasterNameTransferEvent()
}

export function getHandleChangeHomeEvent(): ChangeHome {
  return createHandleChangeHomeEvent()
}

export function getHandleChangeRecoveryAddressEvent(): ChangeRecoveryAddress {
  return createHandleChangeRecoveryAddressEvent()
}

export function getHandleChangeRecoveryAddressEventFname(): ChangeRecoveryAddressFname {
  return createHandleChangeRecoveryAddressEventFname()
}
export function getHandleFarcasterIdTransferEvent(): FidTransfer {
  return createHandleFarcasterIdTransferEvent()
}

function createHandleFarcasterIdTransferEvent(): FidTransfer {
  let event = changetype<FidTransfer>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.address = Address.fromString("0x084b1c3c81545d370f3634392de611cbbcee9258")
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8888") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("9397")))
  )
  return event as FidTransfer;
}

function createHandleRegisterEvent(): Register {
  let event = changetype<Register>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.address = Address.fromString("0x084b1c3c81545d370f3634392de611cbbcee9258")
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234) as BigInt))
  )
  event.parameters.push(
    new ethereum.EventParam("recovery", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabee8248") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("url", ethereum.Value.fromString("https://farcaster.com/u/1234"))
  )
  return event as Register
}

function createHandleFarcasterNameTransferEvent(): Transfer {
  let event = changetype<Transfer>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(Address.fromString("0x0000000000000000000000000000000000000000") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("52188151743400395627052985077509996575321231749758347050596502733779185434624")))
  )
  return event as Transfer
}

function createHandleChangeHomeEvent(): ChangeHome {
  let event = changetype<ChangeHome>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234) as BigInt))
  )
  event.parameters.push(
    new ethereum.EventParam("url", ethereum.Value.fromString("https://farcaster.com/u/12345"))
  )
  return event as ChangeHome
}

function createHandleChangeRecoveryAddressEvent(): ChangeRecoveryAddress {
  let event = changetype<ChangeRecoveryAddress>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234)))
  )
  event.parameters.push(
    new ethereum.EventParam("recovery", ethereum.Value.fromAddress(Address.fromString("0xda107a1caf36d198b12c16c7c7a1d1c795978c42") as Address))
  )
  return event as ChangeRecoveryAddress
}

function createHandleChangeRecoveryAddressEventFname(): ChangeRecoveryAddressFname {
  let event = changetype<ChangeRecoveryAddressFname>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("51735769851106138132655535136624048777650501777323249040829743839027683917824")))
  )
  event.parameters.push(
    new ethereum.EventParam("recovery", ethereum.Value.fromAddress(Address.fromString("0xda107a1caf36d198b12c16c7c7a1d1c795978c42") as Address))
  )
  return event as ChangeRecoveryAddressFname
}

function getTransactionHash(): Bytes {
  return Bytes.fromHexString("0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467") as Bytes
}

export const FARCASTER_ID_REGISTRY_CONTRACT = Address.fromString('0xda107a1caf36d198b12c16c7b6a1d1c795978c42');
export const FARCASTER_NAME_REGISTRY_CONTRACT = Address.fromString('0xe3be01d99baa8db9905b33a3ca391238234b79d1');

export function createOrUpdateUserRegAndProfileFarcasterMapping(
  id: string,
  farcasterId: string,
  transactionHash: string | null,
  logOrCallIndex: BigInt | null,
  fromAddress: string | null,
  toAddress: string,
  tokenUri: string | null,
  homeUrl: string | null,
  recoveryAddress: string | null,
  farcasterProfileName: string | null,
  tokenId: string | null,
): UserRegAndProfileFarcasterMapping {
  let entity = UserRegAndProfileFarcasterMapping.load(id);
  if (entity == null) {
    entity = new UserRegAndProfileFarcasterMapping(id);
  }
  if (transactionHash) entity.transactionHash = transactionHash;
  if (logOrCallIndex) entity.logOrCallIndex = logOrCallIndex;
  if (fromAddress) entity.fromAddress = fromAddress;
  if (toAddress) entity.toAddress = toAddress;
  if (farcasterProfileName) entity.farcasterProfileName = farcasterProfileName;
  if (farcasterId) entity.farcasterId = farcasterId;
  if (tokenUri) entity.tokenUri = tokenUri;
  if (homeUrl) entity.homeUrl = homeUrl;
  if (recoveryAddress) entity.recoveryAddress = recoveryAddress;
  if (tokenId) entity.tokenId = tokenId;
  entity.save();
  return entity as UserRegAndProfileFarcasterMapping;
}