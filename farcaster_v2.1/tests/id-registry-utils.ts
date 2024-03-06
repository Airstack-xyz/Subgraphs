import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ChangeRecoveryAddress,
  DisableTrustedOnly,
  EIP712DomainChanged,
  OwnershipTransferStarted,
  OwnershipTransferred,
  Paused,
  Recover,
  Register,
  SetTrustedCaller,
  Transfer,
  Unpaused
} from "../generated/IdRegistry/IdRegistry"

export function createChangeRecoveryAddressEvent(
  id: BigInt,
  recovery: Address
): ChangeRecoveryAddress {
  let changeRecoveryAddressEvent = changetype<ChangeRecoveryAddress>(
    newMockEvent()
  )

  changeRecoveryAddressEvent.parameters = new Array()

  changeRecoveryAddressEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  changeRecoveryAddressEvent.parameters.push(
    new ethereum.EventParam("recovery", ethereum.Value.fromAddress(recovery))
  )

  return changeRecoveryAddressEvent
}

export function createDisableTrustedOnlyEvent(): DisableTrustedOnly {
  let disableTrustedOnlyEvent = changetype<DisableTrustedOnly>(newMockEvent())

  disableTrustedOnlyEvent.parameters = new Array()

  return disableTrustedOnlyEvent
}

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createOwnershipTransferStartedEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferStarted {
  let ownershipTransferStartedEvent = changetype<OwnershipTransferStarted>(
    newMockEvent()
  )

  ownershipTransferStartedEvent.parameters = new Array()

  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferStartedEvent
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

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createRecoverEvent(
  from: Address,
  to: Address,
  id: BigInt
): Recover {
  let recoverEvent = changetype<Recover>(newMockEvent())

  recoverEvent.parameters = new Array()

  recoverEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  recoverEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  recoverEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return recoverEvent
}

export function createRegisterEvent(
  to: Address,
  id: BigInt,
  recovery: Address
): Register {
  let registerEvent = changetype<Register>(newMockEvent())

  registerEvent.parameters = new Array()

  registerEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  registerEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  registerEvent.parameters.push(
    new ethereum.EventParam("recovery", ethereum.Value.fromAddress(recovery))
  )

  return registerEvent
}

export function createSetTrustedCallerEvent(
  oldCaller: Address,
  newCaller: Address,
  owner: Address
): SetTrustedCaller {
  let setTrustedCallerEvent = changetype<SetTrustedCaller>(newMockEvent())

  setTrustedCallerEvent.parameters = new Array()

  setTrustedCallerEvent.parameters.push(
    new ethereum.EventParam("oldCaller", ethereum.Value.fromAddress(oldCaller))
  )
  setTrustedCallerEvent.parameters.push(
    new ethereum.EventParam("newCaller", ethereum.Value.fromAddress(newCaller))
  )
  setTrustedCallerEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return setTrustedCallerEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  id: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return transferEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
