import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  NameWrapped,
} from "../generated/NameWrapper/NameWrapper";
import { newMockEvent } from "matchstick-as"
import { getTransactionHash } from "./common-utils"

export function createNameWrappedEvent(): NameWrapped {
  let event = changetype<NameWrapped>(newMockEvent())

  event.parameters = new Array()
  event.block.number = BigInt.fromI32(10098239);
  event.block.timestamp = BigInt.fromI32(2879823);
  event.block.hash = Bytes.fromHexString("0x701633854b23364112e8528a85254a039abf8d1d81d629f88426196819e0b0b5")
  event.transaction.hash = getTransactionHash()
  event.logIndex = BigInt.fromI32(78)
  event.transaction.from = Address.fromString("0x084b1c3c81545d370f3634392de611caabff8148")
  event.transaction.value = BigInt.fromString("1000000000000000000")

  event.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(Bytes.fromHexString("0xc44eec7fb870ae46d4ef4392d33fbbbdc164e7817a86289a1fe30e5f4d98ae85") as Bytes))
  )
  event.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromFixedBytes(Bytes.fromHexString("106669727374777261707065646E616D650365746800") as Bytes))
  )
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString("0x29a82E07B96c405aC99a8023F767D2971546DE70") as Address))
  )
  event.parameters.push(
    new ethereum.EventParam("fuses", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("196608")))
  )
  event.parameters.push(
    new ethereum.EventParam("expiry", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1719447755")))
  )
  return event
}

