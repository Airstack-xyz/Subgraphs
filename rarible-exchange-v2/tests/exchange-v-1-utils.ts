import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Buy,
  Cancel,
  OwnershipTransferred
} from "../generated/ExchangeV1/ExchangeV1"

export function createBuyEvent(
  sellToken: Address,
  sellTokenId: BigInt,
  sellValue: BigInt,
  owner: Address,
  buyToken: Address,
  buyTokenId: BigInt,
  buyValue: BigInt,
  buyer: Address,
  amount: BigInt,
  salt: BigInt
): Buy {
  let buyEvent = changetype<Buy>(newMockEvent())

  buyEvent.parameters = new Array()

  buyEvent.parameters.push(
    new ethereum.EventParam("sellToken", ethereum.Value.fromAddress(sellToken))
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "sellTokenId",
      ethereum.Value.fromUnsignedBigInt(sellTokenId)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "sellValue",
      ethereum.Value.fromUnsignedBigInt(sellValue)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("buyToken", ethereum.Value.fromAddress(buyToken))
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "buyTokenId",
      ethereum.Value.fromUnsignedBigInt(buyTokenId)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "buyValue",
      ethereum.Value.fromUnsignedBigInt(buyValue)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  buyEvent.parameters.push(
    new ethereum.EventParam("salt", ethereum.Value.fromUnsignedBigInt(salt))
  )

  return buyEvent
}

export function createCancelEvent(
  sellToken: Address,
  sellTokenId: BigInt,
  owner: Address,
  buyToken: Address,
  buyTokenId: BigInt,
  salt: BigInt
): Cancel {
  let cancelEvent = changetype<Cancel>(newMockEvent())

  cancelEvent.parameters = new Array()

  cancelEvent.parameters.push(
    new ethereum.EventParam("sellToken", ethereum.Value.fromAddress(sellToken))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam(
      "sellTokenId",
      ethereum.Value.fromUnsignedBigInt(sellTokenId)
    )
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("buyToken", ethereum.Value.fromAddress(buyToken))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam(
      "buyTokenId",
      ethereum.Value.fromUnsignedBigInt(buyTokenId)
    )
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("salt", ethereum.Value.fromUnsignedBigInt(salt))
  )

  return cancelEvent
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
