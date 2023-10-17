import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import {
  HandleLinked,
  HandleUnlinked
} from "../generated/TokenHandleRegistry/TokenHandleRegistry"

export function createHandleLinkedEvent(
  handle: ethereum.Tuple,
  token: ethereum.Tuple,
  timestamp: BigInt
): HandleLinked {
  let handleLinkedEvent = changetype<HandleLinked>(newMockEvent())

  handleLinkedEvent.parameters = new Array()

  handleLinkedEvent.parameters.push(
    new ethereum.EventParam("handle", ethereum.Value.fromTuple(handle))
  )
  handleLinkedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromTuple(token))
  )
  handleLinkedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return handleLinkedEvent
}

export function createHandleUnlinkedEvent(
  handle: ethereum.Tuple,
  token: ethereum.Tuple,
  timestamp: BigInt
): HandleUnlinked {
  let handleUnlinkedEvent = changetype<HandleUnlinked>(newMockEvent())

  handleUnlinkedEvent.parameters = new Array()

  handleUnlinkedEvent.parameters.push(
    new ethereum.EventParam("handle", ethereum.Value.fromTuple(handle))
  )
  handleUnlinkedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromTuple(token))
  )
  handleUnlinkedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return handleUnlinkedEvent
}
