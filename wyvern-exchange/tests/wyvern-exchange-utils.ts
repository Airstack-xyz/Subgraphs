import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OrderApprovedPartOne,
  OrderApprovedPartTwo,
  OrderCancelled,
  OrdersMatched,
  OwnershipRenounced,
  OwnershipTransferred
} from "../generated/WyvernExchange/WyvernExchange"

export function createOrderApprovedPartOneEvent(
  hash: Bytes,
  exchange: Address,
  maker: Address,
  taker: Address,
  makerRelayerFee: BigInt,
  takerRelayerFee: BigInt,
  makerProtocolFee: BigInt,
  takerProtocolFee: BigInt,
  feeRecipient: Address,
  feeMethod: i32,
  side: i32,
  saleKind: i32,
  target: Address
): OrderApprovedPartOne {
  let orderApprovedPartOneEvent = changetype<OrderApprovedPartOne>(
    newMockEvent()
  )

  orderApprovedPartOneEvent.parameters = new Array()

  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("exchange", ethereum.Value.fromAddress(exchange))
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "makerRelayerFee",
      ethereum.Value.fromUnsignedBigInt(makerRelayerFee)
    )
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "takerRelayerFee",
      ethereum.Value.fromUnsignedBigInt(takerRelayerFee)
    )
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "makerProtocolFee",
      ethereum.Value.fromUnsignedBigInt(makerProtocolFee)
    )
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "takerProtocolFee",
      ethereum.Value.fromUnsignedBigInt(takerProtocolFee)
    )
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "feeRecipient",
      ethereum.Value.fromAddress(feeRecipient)
    )
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "feeMethod",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(feeMethod))
    )
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "side",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(side))
    )
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "saleKind",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(saleKind))
    )
  )
  orderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("target", ethereum.Value.fromAddress(target))
  )

  return orderApprovedPartOneEvent
}

export function createOrderApprovedPartTwoEvent(
  hash: Bytes,
  howToCall: i32,
  calldata: Bytes,
  replacementPattern: Bytes,
  staticTarget: Address,
  staticExtradata: Bytes,
  paymentToken: Address,
  basePrice: BigInt,
  extra: BigInt,
  listingTime: BigInt,
  expirationTime: BigInt,
  salt: BigInt,
  orderbookInclusionDesired: boolean
): OrderApprovedPartTwo {
  let orderApprovedPartTwoEvent = changetype<OrderApprovedPartTwo>(
    newMockEvent()
  )

  orderApprovedPartTwoEvent.parameters = new Array()

  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "howToCall",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(howToCall))
    )
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam("calldata", ethereum.Value.fromBytes(calldata))
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "replacementPattern",
      ethereum.Value.fromBytes(replacementPattern)
    )
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "staticTarget",
      ethereum.Value.fromAddress(staticTarget)
    )
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "staticExtradata",
      ethereum.Value.fromBytes(staticExtradata)
    )
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "paymentToken",
      ethereum.Value.fromAddress(paymentToken)
    )
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "basePrice",
      ethereum.Value.fromUnsignedBigInt(basePrice)
    )
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam("extra", ethereum.Value.fromUnsignedBigInt(extra))
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "listingTime",
      ethereum.Value.fromUnsignedBigInt(listingTime)
    )
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "expirationTime",
      ethereum.Value.fromUnsignedBigInt(expirationTime)
    )
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam("salt", ethereum.Value.fromUnsignedBigInt(salt))
  )
  orderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "orderbookInclusionDesired",
      ethereum.Value.fromBoolean(orderbookInclusionDesired)
    )
  )

  return orderApprovedPartTwoEvent
}

export function createOrderCancelledEvent(hash: Bytes): OrderCancelled {
  let orderCancelledEvent = changetype<OrderCancelled>(newMockEvent())

  orderCancelledEvent.parameters = new Array()

  orderCancelledEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )

  return orderCancelledEvent
}

export function createOrdersMatchedEvent(
  buyHash: Bytes,
  sellHash: Bytes,
  maker: Address,
  taker: Address,
  price: BigInt,
  metadata: Bytes
): OrdersMatched {
  let ordersMatchedEvent = changetype<OrdersMatched>(newMockEvent())

  ordersMatchedEvent.parameters = new Array()

  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("buyHash", ethereum.Value.fromFixedBytes(buyHash))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("sellHash", ethereum.Value.fromFixedBytes(sellHash))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromFixedBytes(metadata))
  )

  return ordersMatchedEvent
}

export function createOwnershipRenouncedEvent(
  previousOwner: Address
): OwnershipRenounced {
  let ownershipRenouncedEvent = changetype<OwnershipRenounced>(newMockEvent())

  ownershipRenouncedEvent.parameters = new Array()

  ownershipRenouncedEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )

  return ownershipRenouncedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
