import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  CounterIncremented,
  OrderCancelled,
  OrderFulfilled,
  OrderValidated
} from "../generated/Seaport/Seaport"

export function createCounterIncrementedEvent(
  newCounter: BigInt,
  offerer: Address
): CounterIncremented {
  let counterIncrementedEvent = changetype<CounterIncremented>(newMockEvent())

  counterIncrementedEvent.parameters = new Array()

  counterIncrementedEvent.parameters.push(
    new ethereum.EventParam(
      "newCounter",
      ethereum.Value.fromUnsignedBigInt(newCounter)
    )
  )
  counterIncrementedEvent.parameters.push(
    new ethereum.EventParam("offerer", ethereum.Value.fromAddress(offerer))
  )

  return counterIncrementedEvent
}

export function createOrderCancelledEvent(
  orderHash: Bytes,
  offerer: Address,
  zone: Address
): OrderCancelled {
  let orderCancelledEvent = changetype<OrderCancelled>(newMockEvent())

  orderCancelledEvent.parameters = new Array()

  orderCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )
  orderCancelledEvent.parameters.push(
    new ethereum.EventParam("offerer", ethereum.Value.fromAddress(offerer))
  )
  orderCancelledEvent.parameters.push(
    new ethereum.EventParam("zone", ethereum.Value.fromAddress(zone))
  )

  return orderCancelledEvent
}

export function createOrderFulfilledEvent(
  orderHash: Bytes,
  offerer: Address,
  zone: Address,
  recipient: Address,
  offer: Array<ethereum.Tuple>,
  consideration: Array<ethereum.Tuple>
): OrderFulfilled {
  let orderFulfilledEvent = changetype<OrderFulfilled>(newMockEvent())

  orderFulfilledEvent.parameters = new Array()

  orderFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )
  orderFulfilledEvent.parameters.push(
    new ethereum.EventParam("offerer", ethereum.Value.fromAddress(offerer))
  )
  orderFulfilledEvent.parameters.push(
    new ethereum.EventParam("zone", ethereum.Value.fromAddress(zone))
  )
  orderFulfilledEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  orderFulfilledEvent.parameters.push(
    new ethereum.EventParam("offer", ethereum.Value.fromTupleArray(offer))
  )
  orderFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "consideration",
      ethereum.Value.fromTupleArray(consideration)
    )
  )

  return orderFulfilledEvent
}

export function createOrderValidatedEvent(
  orderHash: Bytes,
  offerer: Address,
  zone: Address
): OrderValidated {
  let orderValidatedEvent = changetype<OrderValidated>(newMockEvent())

  orderValidatedEvent.parameters = new Array()

  orderValidatedEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )
  orderValidatedEvent.parameters.push(
    new ethereum.EventParam("offerer", ethereum.Value.fromAddress(offerer))
  )
  orderValidatedEvent.parameters.push(
    new ethereum.EventParam("zone", ethereum.Value.fromAddress(zone))
  )

  return orderValidatedEvent
}
