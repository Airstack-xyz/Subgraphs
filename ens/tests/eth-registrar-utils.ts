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
  handleNameRegisteredEvent.block.number = new BigInt(10098239);
  handleNameRegisteredEvent.block.timestamp = new BigInt(2879823);
  handleNameRegisteredEvent.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  handleNameRegisteredEvent.transaction.hash = getTransactionHash()
  handleNameRegisteredEvent.logIndex = new BigInt(76)
  handleNameRegisteredEvent.transaction.value = BigInt.fromI32(3)

  handleNameRegisteredEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff4") as Bytes))
  )
  handleNameRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148") as Address))
  )
  handleNameRegisteredEvent.parameters.push(
    new ethereum.EventParam("expires", ethereum.Value.fromUnsignedBigInt(new BigInt(10098239)))
  )

  return handleNameRegisteredEvent
}

export function createHandleNameRenewedEvent(
): NameRenewedEvent {
  let handleNameRenewedEvent = changetype<NameRenewedEvent>(newMockEvent())
  handleNameRenewedEvent.transaction.value = BigInt.fromI32(3)

  return handleNameRenewedEvent
}