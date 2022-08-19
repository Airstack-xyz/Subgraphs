import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  CancelAllOrders,
  CancelMultipleOrders,
  NewCurrencyManager,
  NewExecutionManager,
  NewProtocolFeeRecipient,
  NewRoyaltyFeeManager,
  NewTransferSelectorNFT,
  OwnershipTransferred,
  RoyaltyPayment,
  TakerAsk,
  TakerBid
} from "../generated/LooksRareExchange/LooksRareExchange"

export function createCancelAllOrdersEvent(
  user: Address,
  newMinNonce: BigInt
): CancelAllOrders {
  let cancelAllOrdersEvent = changetype<CancelAllOrders>(newMockEvent())

  cancelAllOrdersEvent.parameters = new Array()

  cancelAllOrdersEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  cancelAllOrdersEvent.parameters.push(
    new ethereum.EventParam(
      "newMinNonce",
      ethereum.Value.fromUnsignedBigInt(newMinNonce)
    )
  )

  return cancelAllOrdersEvent
}

export function createCancelMultipleOrdersEvent(
  user: Address,
  orderNonces: Array<BigInt>
): CancelMultipleOrders {
  let cancelMultipleOrdersEvent = changetype<CancelMultipleOrders>(
    newMockEvent()
  )

  cancelMultipleOrdersEvent.parameters = new Array()

  cancelMultipleOrdersEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  cancelMultipleOrdersEvent.parameters.push(
    new ethereum.EventParam(
      "orderNonces",
      ethereum.Value.fromUnsignedBigIntArray(orderNonces)
    )
  )

  return cancelMultipleOrdersEvent
}

export function createNewCurrencyManagerEvent(
  currencyManager: Address
): NewCurrencyManager {
  let newCurrencyManagerEvent = changetype<NewCurrencyManager>(newMockEvent())

  newCurrencyManagerEvent.parameters = new Array()

  newCurrencyManagerEvent.parameters.push(
    new ethereum.EventParam(
      "currencyManager",
      ethereum.Value.fromAddress(currencyManager)
    )
  )

  return newCurrencyManagerEvent
}

export function createNewExecutionManagerEvent(
  executionManager: Address
): NewExecutionManager {
  let newExecutionManagerEvent = changetype<NewExecutionManager>(newMockEvent())

  newExecutionManagerEvent.parameters = new Array()

  newExecutionManagerEvent.parameters.push(
    new ethereum.EventParam(
      "executionManager",
      ethereum.Value.fromAddress(executionManager)
    )
  )

  return newExecutionManagerEvent
}

export function createNewProtocolFeeRecipientEvent(
  protocolFeeRecipient: Address
): NewProtocolFeeRecipient {
  let newProtocolFeeRecipientEvent = changetype<NewProtocolFeeRecipient>(
    newMockEvent()
  )

  newProtocolFeeRecipientEvent.parameters = new Array()

  newProtocolFeeRecipientEvent.parameters.push(
    new ethereum.EventParam(
      "protocolFeeRecipient",
      ethereum.Value.fromAddress(protocolFeeRecipient)
    )
  )

  return newProtocolFeeRecipientEvent
}

export function createNewRoyaltyFeeManagerEvent(
  royaltyFeeManager: Address
): NewRoyaltyFeeManager {
  let newRoyaltyFeeManagerEvent = changetype<NewRoyaltyFeeManager>(
    newMockEvent()
  )

  newRoyaltyFeeManagerEvent.parameters = new Array()

  newRoyaltyFeeManagerEvent.parameters.push(
    new ethereum.EventParam(
      "royaltyFeeManager",
      ethereum.Value.fromAddress(royaltyFeeManager)
    )
  )

  return newRoyaltyFeeManagerEvent
}

export function createNewTransferSelectorNFTEvent(
  transferSelectorNFT: Address
): NewTransferSelectorNFT {
  let newTransferSelectorNftEvent = changetype<NewTransferSelectorNFT>(
    newMockEvent()
  )

  newTransferSelectorNftEvent.parameters = new Array()

  newTransferSelectorNftEvent.parameters.push(
    new ethereum.EventParam(
      "transferSelectorNFT",
      ethereum.Value.fromAddress(transferSelectorNFT)
    )
  )

  return newTransferSelectorNftEvent
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

export function createRoyaltyPaymentEvent(
  collection: Address,
  tokenId: BigInt,
  royaltyRecipient: Address,
  currency: Address,
  amount: BigInt
): RoyaltyPayment {
  let royaltyPaymentEvent = changetype<RoyaltyPayment>(newMockEvent())

  royaltyPaymentEvent.parameters = new Array()

  royaltyPaymentEvent.parameters.push(
    new ethereum.EventParam(
      "collection",
      ethereum.Value.fromAddress(collection)
    )
  )
  royaltyPaymentEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  royaltyPaymentEvent.parameters.push(
    new ethereum.EventParam(
      "royaltyRecipient",
      ethereum.Value.fromAddress(royaltyRecipient)
    )
  )
  royaltyPaymentEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  )
  royaltyPaymentEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return royaltyPaymentEvent
}

export function createTakerAskEvent(
  orderHash: Bytes,
  orderNonce: BigInt,
  taker: Address,
  maker: Address,
  strategy: Address,
  currency: Address,
  collection: Address,
  tokenId: BigInt,
  amount: BigInt,
  price: BigInt
): TakerAsk {
  let takerAskEvent = changetype<TakerAsk>(newMockEvent())

  takerAskEvent.parameters = new Array()

  takerAskEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )
  takerAskEvent.parameters.push(
    new ethereum.EventParam(
      "orderNonce",
      ethereum.Value.fromUnsignedBigInt(orderNonce)
    )
  )
  takerAskEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  takerAskEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  takerAskEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  takerAskEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  )
  takerAskEvent.parameters.push(
    new ethereum.EventParam(
      "collection",
      ethereum.Value.fromAddress(collection)
    )
  )
  takerAskEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  takerAskEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  takerAskEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return takerAskEvent
}

export function createTakerBidEvent(
  orderHash: Bytes,
  orderNonce: BigInt,
  taker: Address,
  maker: Address,
  strategy: Address,
  currency: Address,
  collection: Address,
  tokenId: BigInt,
  amount: BigInt,
  price: BigInt
): TakerBid {
  let takerBidEvent = changetype<TakerBid>(newMockEvent())

  takerBidEvent.parameters = new Array()

  takerBidEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )
  takerBidEvent.parameters.push(
    new ethereum.EventParam(
      "orderNonce",
      ethereum.Value.fromUnsignedBigInt(orderNonce)
    )
  )
  takerBidEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  takerBidEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  takerBidEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  takerBidEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  )
  takerBidEvent.parameters.push(
    new ethereum.EventParam(
      "collection",
      ethereum.Value.fromAddress(collection)
    )
  )
  takerBidEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  takerBidEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  takerBidEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return takerBidEvent
}
