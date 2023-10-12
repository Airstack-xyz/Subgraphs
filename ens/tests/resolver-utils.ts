import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { AddrChanged, VersionChanged } from "../generated/Resolver1/Resolver"
import { getTransactionHash } from "./common-utils"
import { AirDomain } from "../generated/schema"
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common/index"

export function getHandleAddrChangedEvent(): AddrChanged {
  return createHandleAddrChangedEvent(
    "0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff4",
    "0x084b1c3c81545d370f3634392de611caabff8148"
  )
}

export function getHandleVersionChangedEvent(): VersionChanged {
  return createHandleVersionChangedEvent(
    "0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff4"
  )
}

export function createHandleAddrChangedEvent(
  node: string,
  a: string,
): AddrChanged {
  let event = changetype<AddrChanged>(newMockEvent())

  event.parameters = new Array()
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.address = Address.fromString("0x314159265dd8dbb310642f98f50c066173c1259b")
  event.logIndex = BigInt.fromI32(76)
  event.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString(node) as Bytes))
  )
  event.parameters.push(
    new ethereum.EventParam("a", ethereum.Value.fromAddress(Address.fromString(a) as Address))
  )

  return event
}

export function createHandleVersionChangedEvent(
  node: string,
): VersionChanged {
  let event = changetype<VersionChanged>(newMockEvent())

  event.parameters = new Array()
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.address = Address.fromString("0x314159265dd8dbb310642f98f50c066173c1259b")
  event.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString(node) as Bytes))
  )

  return event
}

export function createAirDomain(domainId: string): AirDomain {
  let entity = new AirDomain(domainId);
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
  return entity as AirDomain;
}