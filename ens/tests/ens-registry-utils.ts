import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  ApprovalForAll,
  NewOwner,
  NewResolver,
  NewTTL,
  Transfer
} from "../generated/EnsRegistry/EnsRegistry"

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createNewOwnerEvent(
  node: Bytes,
  label: Bytes,
  owner: Address
): NewOwner {
  let newOwnerEvent = changetype<NewOwner>(newMockEvent())

  newOwnerEvent.parameters = new Array()

  newOwnerEvent.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(node))
  )
  newOwnerEvent.parameters.push(
    new ethereum.EventParam("label", ethereum.Value.fromFixedBytes(label))
  )
  newOwnerEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return newOwnerEvent
}

export function createNewResolverEvent(
  node: Bytes,
  resolver: Address
): NewResolver {
  let newResolverEvent = changetype<NewResolver>(newMockEvent())

  newResolverEvent.parameters = new Array()

  newResolverEvent.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(node))
  )
  newResolverEvent.parameters.push(
    new ethereum.EventParam("resolver", ethereum.Value.fromAddress(resolver))
  )

  return newResolverEvent
}

export function createNewTTLEvent(node: Bytes, ttl: BigInt): NewTTL {
  let newTtlEvent = changetype<NewTTL>(newMockEvent())

  newTtlEvent.parameters = new Array()

  newTtlEvent.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(node))
  )
  newTtlEvent.parameters.push(
    new ethereum.EventParam("ttl", ethereum.Value.fromUnsignedBigInt(ttl))
  )

  return newTtlEvent
}

export function createTransferEvent(node: Bytes, owner: Address): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(node))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return transferEvent
}
