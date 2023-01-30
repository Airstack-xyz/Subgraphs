import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { AddrChanged, VersionChanged } from "../generated/Resolver1/Resolver"
import { getTransactionHash } from "./common-utils"

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
  let handleAddrChangedEvent = changetype<AddrChanged>(newMockEvent())

  handleAddrChangedEvent.parameters = new Array()
  handleAddrChangedEvent.block.number = BigInt.fromI32(10098239);
  handleAddrChangedEvent.block.timestamp = BigInt.fromI32(2879823);
  handleAddrChangedEvent.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  handleAddrChangedEvent.transaction.hash = getTransactionHash()
  handleAddrChangedEvent.address = Address.fromString("0x314159265dd8dbb310642f98f50c066173c1259b")
  handleAddrChangedEvent.logIndex = BigInt.fromI32(76)
  handleAddrChangedEvent.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString(node) as Bytes))
  )
  handleAddrChangedEvent.parameters.push(
    new ethereum.EventParam("a", ethereum.Value.fromAddress(Address.fromString(a) as Address))
  )

  return handleAddrChangedEvent
}

export function createHandleVersionChangedEvent(
  node: string,
): VersionChanged {
  let handleVersionChangedEvent = changetype<VersionChanged>(newMockEvent())

  handleVersionChangedEvent.parameters = new Array()
  handleVersionChangedEvent.block.number = BigInt.fromI32(10098239);
  handleVersionChangedEvent.block.timestamp = BigInt.fromI32(2879823);
  handleVersionChangedEvent.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  handleVersionChangedEvent.transaction.hash = getTransactionHash()
  handleVersionChangedEvent.address = Address.fromString("0x314159265dd8dbb310642f98f50c066173c1259b")
  handleVersionChangedEvent.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString(node) as Bytes))
  )

  return handleVersionChangedEvent
}

