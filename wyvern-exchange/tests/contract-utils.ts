import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ContractOrderApprovedPartOne,
  ContractOrderApprovedPartTwo,
  ContractOrderCancelled,
  ContractOrdersMatched,
  NonceIncremented,
  ContractOwnershipRenounced,
  ContractOwnershipTransferred
} from "../generated/Contract/Contract"

export function createContractOrderApprovedPartOneEvent(
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
): ContractOrderApprovedPartOne {
  let contractOrderApprovedPartOneEvent = changetype<
    ContractOrderApprovedPartOne
  >(newMockEvent())

  contractOrderApprovedPartOneEvent.parameters = new Array()

  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("exchange", ethereum.Value.fromAddress(exchange))
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "makerRelayerFee",
      ethereum.Value.fromUnsignedBigInt(makerRelayerFee)
    )
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "takerRelayerFee",
      ethereum.Value.fromUnsignedBigInt(takerRelayerFee)
    )
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "makerProtocolFee",
      ethereum.Value.fromUnsignedBigInt(makerProtocolFee)
    )
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "takerProtocolFee",
      ethereum.Value.fromUnsignedBigInt(takerProtocolFee)
    )
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "feeRecipient",
      ethereum.Value.fromAddress(feeRecipient)
    )
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "feeMethod",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(feeMethod))
    )
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "side",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(side))
    )
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam(
      "saleKind",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(saleKind))
    )
  )
  contractOrderApprovedPartOneEvent.parameters.push(
    new ethereum.EventParam("target", ethereum.Value.fromAddress(target))
  )

  return contractOrderApprovedPartOneEvent
}

export function createContractOrderApprovedPartTwoEvent(
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
): ContractOrderApprovedPartTwo {
  let contractOrderApprovedPartTwoEvent = changetype<
    ContractOrderApprovedPartTwo
  >(newMockEvent())

  contractOrderApprovedPartTwoEvent.parameters = new Array()

  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "howToCall",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(howToCall))
    )
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam("calldata", ethereum.Value.fromBytes(calldata))
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "replacementPattern",
      ethereum.Value.fromBytes(replacementPattern)
    )
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "staticTarget",
      ethereum.Value.fromAddress(staticTarget)
    )
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "staticExtradata",
      ethereum.Value.fromBytes(staticExtradata)
    )
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "paymentToken",
      ethereum.Value.fromAddress(paymentToken)
    )
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "basePrice",
      ethereum.Value.fromUnsignedBigInt(basePrice)
    )
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam("extra", ethereum.Value.fromUnsignedBigInt(extra))
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "listingTime",
      ethereum.Value.fromUnsignedBigInt(listingTime)
    )
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "expirationTime",
      ethereum.Value.fromUnsignedBigInt(expirationTime)
    )
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam("salt", ethereum.Value.fromUnsignedBigInt(salt))
  )
  contractOrderApprovedPartTwoEvent.parameters.push(
    new ethereum.EventParam(
      "orderbookInclusionDesired",
      ethereum.Value.fromBoolean(orderbookInclusionDesired)
    )
  )

  return contractOrderApprovedPartTwoEvent
}

export function createContractOrderCancelledEvent(
  hash: Bytes
): ContractOrderCancelled {
  let contractOrderCancelledEvent = changetype<ContractOrderCancelled>(
    newMockEvent()
  )

  contractOrderCancelledEvent.parameters = new Array()

  contractOrderCancelledEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )

  return contractOrderCancelledEvent
}

export function createContractOrdersMatchedEvent(
  buyHash: Bytes,
  sellHash: Bytes,
  maker: Address,
  taker: Address,
  price: BigInt,
  metadata: Bytes
): ContractOrdersMatched {
  let contractOrdersMatchedEvent = changetype<ContractOrdersMatched>(
    newMockEvent()
  )

  contractOrdersMatchedEvent.parameters = new Array()

  contractOrdersMatchedEvent.parameters.push(
    new ethereum.EventParam("buyHash", ethereum.Value.fromFixedBytes(buyHash))
  )
  contractOrdersMatchedEvent.parameters.push(
    new ethereum.EventParam("sellHash", ethereum.Value.fromFixedBytes(sellHash))
  )
  contractOrdersMatchedEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  contractOrdersMatchedEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  contractOrdersMatchedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  contractOrdersMatchedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromFixedBytes(metadata))
  )

  return contractOrdersMatchedEvent
}

export function createNonceIncrementedEvent(
  maker: Address,
  newNonce: BigInt
): NonceIncremented {
  let nonceIncrementedEvent = changetype<NonceIncremented>(newMockEvent())

  nonceIncrementedEvent.parameters = new Array()

  nonceIncrementedEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  nonceIncrementedEvent.parameters.push(
    new ethereum.EventParam(
      "newNonce",
      ethereum.Value.fromUnsignedBigInt(newNonce)
    )
  )

  return nonceIncrementedEvent
}

export function createContractOwnershipRenouncedEvent(
  previousOwner: Address
): ContractOwnershipRenounced {
  let contractOwnershipRenouncedEvent = changetype<ContractOwnershipRenounced>(
    newMockEvent()
  )

  contractOwnershipRenouncedEvent.parameters = new Array()

  contractOwnershipRenouncedEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )

  return contractOwnershipRenouncedEvent
}

export function createContractOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): ContractOwnershipTransferred {
  let contractOwnershipTransferredEvent = changetype<
    ContractOwnershipTransferred
  >(newMockEvent())

  contractOwnershipTransferredEvent.parameters = new Array()

  contractOwnershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  contractOwnershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return contractOwnershipTransferredEvent
}
