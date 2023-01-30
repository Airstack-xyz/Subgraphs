import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { getTransactionHash } from "./common-utils"
import {
  NewOwner as NewOwnerEvent,
  NewResolver as NewResolverEvent,
  NewTTL as NewTTLEvent,
  Transfer as TransferEvent
} from "../generated/EnsRegistry/EnsRegistry"

export function getHandleNewOwnerEvent(): NewOwnerEvent {
  return createHandleNewOwnerEvent()
}

export function getHandleTransferEvent(): TransferEvent {
  return createHandleTransferEvent()
}

export function getHandleNewResolverEvent(): NewResolverEvent {
  return createHandleNewResolverEvent()
}

export function getHandleNewTTLEvent(): NewTTLEvent {
  return createHandleNewTTLEvent()
}

function createHandleNewOwnerEvent(): NewOwnerEvent {
  let event = changetype<NewOwnerEvent>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2") as Bytes))
  )
  event.parameters.push(
    new ethereum.EventParam("label", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0xa4757f81c024f155983881ff8228a21c098ecc3708b3b0ba64b8d605d5e9849b") as Bytes))
  )
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  return event
}

function createHandleTransferEvent(): TransferEvent {
  let event = changetype<TransferEvent>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2") as Bytes))
  )
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  return event
}

function createHandleNewResolverEvent(): NewResolverEvent {
  let event = changetype<NewResolverEvent>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0xad3988d642ba25a8ca9d8889e0cfd6c550060e35455c55c936be87f9cfb97407") as Bytes))
  )
  event.parameters.push(
    new ethereum.EventParam("resolver", ethereum.Value.fromAddress(Address.fromString("0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41") as Address))
  )
  return event
}

function createHandleNewTTLEvent(): NewTTLEvent {
  let event = changetype<NewTTLEvent>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0xad3988d642ba25a8ca9d8889e0cfd6c550060e35455c55c936be87f9cfb97407") as Bytes))
  )
  event.parameters.push(
    new ethereum.EventParam("ttl", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(100)))
  )
  return event
}