import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt, ens } from "@graphprotocol/graph-ts"
import { getTransactionHash } from "./common-utils"
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common/index"
import {
  NewOwner as NewOwnerEvent,
  NewResolver as NewResolverEvent,
  NewTTL as NewTTLEvent,
  Transfer as TransferEvent
} from "../generated/EnsRegistry/EnsRegistry"
import { AirDomain } from "../generated/schema"

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

export function getHandleNewTTLEvent1(): NewTTLEvent {
  let event = changetype<NewTTLEvent>(newMockEvent())
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(77)

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0xad3988d642ba25a8ca9d8889e0cfd6c550060e35455c55c936be87f9cfb97407") as Bytes))
  )
  event.parameters.push(
    new ethereum.EventParam("ttl", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(99)))
  )
  return event
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
    new ethereum.EventParam("label", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0x99726e0d8b407cf2176c79d70375d2c906063193e0a0951bf2aa26e62bfadaab") as Bytes))
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

const ROOT_NODE = '0x0000000000000000000000000000000000000000000000000000000000000000'

export function getNameByLabelHashAndNode(labelHash: Bytes, node: Bytes): string {
  let labelName = ens.nameByHash(labelHash.toHexString());
  if (labelName === null) {
    labelName = '[' + labelHash.toHexString().slice(2) + ']';
  }
  // creating name from labelName and parentName
  let name: string | null;
  let parentName: string | null;
  if (node.toHexString() == ROOT_NODE) {
    name = labelName;
  } else {
    let parent = AirDomain.load(node.toHexString());
    if (parent != null) {
      parentName = parent.name;
    } else {
      parentName = "";
    }
    name = labelName + "." + parentName!;
  }
  return name;
}

export function createParentDomain(parentDomainId: string): void {
  let entity = new AirDomain(parentDomainId);
  entity.subdomainCount = BIG_INT_ZERO;
  entity.name = "eth";
  entity.owner = "1-472668903";
  entity.tokenAddress = "1-472668903";
  entity.isPrimary = false;
  entity.expiryTimestamp = BIG_INT_ZERO;
  entity.registrationCost = BIG_INT_ZERO;
  entity.createdAt = "1-472668903";
  entity.lastUpdatedBlock = "1-472668903";
  entity.lastUpdatedIndex = BIGINT_ONE;
  entity.save();
}