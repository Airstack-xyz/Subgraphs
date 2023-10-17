import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  Transfer,
  HandleMinted,
  TokenGuardianStateChanged
} from "../generated/LensHandle/LensHandle"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

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

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
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
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createHandleMintedEvent(
  handle: string,
  namespace: string,
  handleId: BigInt,
  to: Address,
  timestamp: BigInt
): HandleMinted {
  let handleMintedEvent = changetype<HandleMinted>(newMockEvent())

  handleMintedEvent.parameters = new Array()

  handleMintedEvent.parameters.push(
    new ethereum.EventParam("handle", ethereum.Value.fromString(handle))
  )
  handleMintedEvent.parameters.push(
    new ethereum.EventParam("namespace", ethereum.Value.fromString(namespace))
  )
  handleMintedEvent.parameters.push(
    new ethereum.EventParam(
      "handleId",
      ethereum.Value.fromUnsignedBigInt(handleId)
    )
  )
  handleMintedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  handleMintedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return handleMintedEvent
}

export function createTokenGuardianStateChangedEvent(
  wallet: Address,
  enabled: boolean,
  tokenGuardianDisablingTimestamp: BigInt,
  timestamp: BigInt
): TokenGuardianStateChanged {
  let tokenGuardianStateChangedEvent = changetype<TokenGuardianStateChanged>(
    newMockEvent()
  )

  tokenGuardianStateChangedEvent.parameters = new Array()

  tokenGuardianStateChangedEvent.parameters.push(
    new ethereum.EventParam("wallet", ethereum.Value.fromAddress(wallet))
  )
  tokenGuardianStateChangedEvent.parameters.push(
    new ethereum.EventParam("enabled", ethereum.Value.fromBoolean(enabled))
  )
  tokenGuardianStateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenGuardianDisablingTimestamp",
      ethereum.Value.fromUnsignedBigInt(tokenGuardianDisablingTimestamp)
    )
  )
  tokenGuardianStateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return tokenGuardianStateChangedEvent
}
