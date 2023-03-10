import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { getTransactionHash } from "./common-utils"
import {
  NameRegistered as NameRegisteredEvent,
  NameRenewed as NameRenewedEvent,
  Transfer as NameRegisteredTransferEvent,
} from '../generated/BaseRegistrar/BaseRegistrar';
import {
  NameRegistered as ControllerNameRegisteredEventOld,
} from '../generated/EthRegistrarControllerOld/EthRegistrarControllerOld';
import {
  NameRegistered as ControllerNameRegisteredEvent,
  NameRenewed as ControllerNameRenewedEvent
} from '../generated/EthRegistrarController/EthRegistrarController';

export function getHandleNameRegisteredEvent(): NameRegisteredEvent {
  return createHandleNameRegisteredEvent()
}

export function getHandleNameRenewedEvent(): NameRenewedEvent {
  return createHandleNameRenewedEvent()
}

export function getHandleNameRegisteredByControllerOldEvent(): ControllerNameRegisteredEventOld {
  return createHandleNameRegisteredByControllerOldEvent()
}

export function getHandleNameRegisteredByControllerEvent(): ControllerNameRegisteredEvent {
  return createHandleNameRegisteredByControllerEvent()
}

export function getHandleNameRenewedByControllerEvent(): ControllerNameRenewedEvent {
  return createHandleNameRenewedByControllerEvent()
}


export function getHandleNameTransferredEvent(): NameRegisteredTransferEvent {
  return createHandleNameTransferredEvent()
}

export function createHandleNameTransferredEvent(): NameRegisteredTransferEvent {
  let event = changetype<NameRegisteredTransferEvent>(newMockEvent())

  event.parameters = new Array()
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(78)
  event.transaction.from = Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148")
  event.transaction.value = BigInt.fromString("1000000000000000000")

  event.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff66cc") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("91429126920367530313023827682976888360097522553506880517423103419682943364318")))
  )

  return event
}

export function createHandleNameRegisteredEvent(
): NameRegisteredEvent {
  let event = changetype<NameRegisteredEvent>(newMockEvent())

  event.parameters = new Array()
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)
  event.transaction.from = Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148")
  event.transaction.value = BigInt.fromString("1000000000000000000")

  event.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("91429126920367530313023827682976888360097522553506880517423103419682943364318")))
  )
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("expires", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10098239)))
  )

  return event
}

export function createHandleNameRenewedEvent(
): NameRenewedEvent {
  let event = changetype<NameRenewedEvent>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(76)
  event.transaction.value = BigInt.fromString("1000000000000000000")
  event.transaction.from = Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148")

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("91429126920367530313023827682976888360097522553506880517423103419682943364318")))
  )
  event.parameters.push(
    new ethereum.EventParam("expires", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10098239)))
  )

  return event
}

export function createHandleNameRegisteredByControllerOldEvent(
): ControllerNameRegisteredEventOld {
  let event = changetype<ControllerNameRegisteredEventOld>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")

  event.parameters = new Array()

  event.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString("blackburn"))
  )
  event.parameters.push(
    new ethereum.EventParam("label", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0x99726e0d8b407cf2176c79d70375d2c906063193e0a0951bf2aa26e62bfadaab")))
  )
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("cost", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1000000000000000000")))
  )
  event.parameters.push(
    new ethereum.EventParam("expires", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10098239)))
  )
  return event
}

export function createHandleNameRegisteredByControllerEvent(
): ControllerNameRegisteredEvent {
  let event = changetype<ControllerNameRegisteredEvent>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")

  event.parameters = new Array()

  event.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString("blackburn"))
  )
  event.parameters.push(
    new ethereum.EventParam("label", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0x99726e0d8b407cf2176c79d70375d2c906063193e0a0951bf2aa26e62bfadaab")))
  )
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("cost", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1000000000000000000")))
  )
  event.parameters.push(
    new ethereum.EventParam("expires", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10098239)))
  )
  return event
}

export function createHandleNameRenewedByControllerEvent(
): ControllerNameRenewedEvent {
  let event = changetype<ControllerNameRenewedEvent>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")

  event.parameters = new Array()

  event.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString("blackburn"))
  )
  event.parameters.push(
    new ethereum.EventParam("label", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0x99726e0d8b407cf2176c79d70375d2c906063193e0a0951bf2aa26e62bfadaab")))
  )
  event.parameters.push(
    new ethereum.EventParam("cost", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1000000000000000000")))
  )
  event.parameters.push(
    new ethereum.EventParam("expires", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10098239)))
  )
  return event
}

// specific to ens
export function byteArrayFromHex(s: string): ByteArray {
  if (s.length % 2 !== 0) {
    throw new TypeError("Hex string must have an even number of characters")
  }
  let out = new Uint8Array(s.length / 2)
  for (var i = 0; i < s.length; i += 2) {
    out[i / 2] = parseInt(s.substring(i, i + 2), 16) as u32
  }
  return changetype<ByteArray>(out)
}

export function uint256ToByteArray(i: BigInt): ByteArray {
  let hex = i.toHex().slice(2).padStart(64, '0')
  return byteArrayFromHex(hex)
}