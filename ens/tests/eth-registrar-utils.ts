import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { getTransactionHash } from "./common-utils"
import {
  NameRegistered as NameRegisteredEvent,
  NameRenewed as NameRenewedEvent,
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

export function createHandleNameRegisteredEvent(
): NameRegisteredEvent {
  let handleNameRegisteredEvent = changetype<NameRegisteredEvent>(newMockEvent())

  handleNameRegisteredEvent.parameters = new Array()
  handleNameRegisteredEvent.block.number = BigInt.fromI32(10098239);
  handleNameRegisteredEvent.block.timestamp = BigInt.fromI32(2879823);
  handleNameRegisteredEvent.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  handleNameRegisteredEvent.transaction.hash = getTransactionHash()
  handleNameRegisteredEvent.logIndex = BigInt.fromI32(76)
  handleNameRegisteredEvent.transaction.value = BigInt.fromString("1000000000000000000")

  handleNameRegisteredEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("91429126920367530313023827682976888360097522553506880517423103419682943364318")))
  )
  handleNameRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  handleNameRegisteredEvent.parameters.push(
    new ethereum.EventParam("expires", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10098239)))
  )

  return handleNameRegisteredEvent
}

export function createHandleNameRenewedEvent(
): NameRenewedEvent {
  let handleNameRenewedEvent = changetype<NameRenewedEvent>(newMockEvent())
  handleNameRenewedEvent.block.number = BigInt.fromI32(10098239);
  handleNameRenewedEvent.block.timestamp = BigInt.fromI32(2879823);
  handleNameRenewedEvent.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  handleNameRenewedEvent.transaction.hash = getTransactionHash()
  handleNameRenewedEvent.logIndex = BigInt.fromI32(76)
  handleNameRenewedEvent.transaction.value = BigInt.fromString("1000000000000000000")
  handleNameRenewedEvent.transaction.from = Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148")

  handleNameRenewedEvent.parameters = new Array()
  handleNameRenewedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("91429126920367530313023827682976888360097522553506880517423103419682943364318")))
  )
  handleNameRenewedEvent.parameters.push(
    new ethereum.EventParam("expires", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10098239)))
  )

  return handleNameRenewedEvent
}