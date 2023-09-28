import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts"
import {
  ControllerAdded as ControllerAdded1,
  ControllerRemoved as ControllerRemoved1,
  NameRegistered as NameRegistered1,
  NameRenewed as NameRenewed1,
  Transfer as Transfer1,
} from "../generated/EnsToken1/BaseRegistrarImplementation"
import {
  ControllerAdded as ControllerAdded2,
  ControllerRemoved as ControllerRemoved2,
  NameRegistered as NameRegistered2,
  NameRenewed as NameRenewed2,
  Transfer as Transfer2,
} from "../generated/EnsToken2/BaseRegistrarImplementation"
import {
  createController,
  uint256ToByteArray,
  getNameHashFromByteArray,
  ethNode,
} from "./utils"
import { ControllerRemoved, NewOwnerHashLabelMap } from "../generated/schema"
import * as airstack from "../modules/airstack/domain-name"

export function _handleControllerAdded(
  txHash: Bytes,
  controller: Address
): void {
  createController(controller, txHash)
}

const _handleControllerRemoved = (controller: Address): void => {
  let controllerRemoved = new ControllerRemoved(controller.toHexString())
  controllerRemoved.save()
}

export const _handleNameRegistered = (
  tokenAddress: Address,
  txHash: Bytes,
  block: ethereum.Block,
  id: BigInt,
  expires: BigInt,
  owner: Address,
  logIndex: BigInt
): void => {
  const label = uint256ToByteArray(id)
  const hashlabelMap = NewOwnerHashLabelMap.load(
    txHash.toHexString() + "-" + label.toHexString()
  )
  if (!hashlabelMap) {
    log.error("hashlabelmap not found,hash {} label {}", [
      txHash.toHexString(),
      label.toHexString(),
    ])
    throw new Error("hashlabelmap not found")
  }
  airstack.domain.trackAirDomainOwnershipRegistrationAndExpiry(
    tokenAddress,
    id,
    hashlabelMap.domainId,
    expires,
    txHash,
    owner,
    block,
    logIndex
  )
}

export const _handleNameRenewed = (
  tokenAddress: Address,
  txHash: Bytes,
  from: Address,
  block: ethereum.Block,
  id: BigInt,
  expires: BigInt,
  logIndex: BigInt
): void => {
  const label = uint256ToByteArray(id)
  const domainId = getNameHashFromByteArray(ethNode, label)
  airstack.domain.trackAirDomainRegistrationNameRenewed(
    tokenAddress,
    id,
    domainId,
    expires,
    txHash,
    from,
    block,
    logIndex
  )
}

export const _handleTransfer = (
  tokenAddress: Address,
  txHash: Bytes,
  block: ethereum.Block,
  from: Address,
  to: Address,
  tokenId: BigInt,
  logIndex: BigInt
): void => {
  const label = uint256ToByteArray(tokenId)
  const domainId = getNameHashFromByteArray(ethNode, label)

  let hashlabelMap = new NewOwnerHashLabelMap(
    txHash.toHexString() + "-" + label.toHexString()
  )
  hashlabelMap.domainId = domainId
  hashlabelMap.save()

  airstack.domain.trackAirDomainOwnershipTransfer(
    tokenAddress,
    tokenId,
    domainId,
    from,
    to,
    txHash,
    block,
    logIndex
  )
}

export function handleControllerAdded1(event: ControllerAdded1): void {
  const txHash = event.transaction.hash
  const controller = event.params.controller
  _handleControllerAdded(txHash, controller)
}
export function handleControllerAdded2(event: ControllerAdded2): void {
  const txHash = event.transaction.hash
  const controller = event.params.controller
  _handleControllerAdded(txHash, controller)
}

export function handleControllerRemoved1(event: ControllerRemoved1): void {
  const controller = event.params.controller
  _handleControllerRemoved(controller)
}
export function handleControllerRemoved2(event: ControllerRemoved2): void {
  const controller = event.params.controller
  _handleControllerRemoved(controller)
}

export function handleNameRegistered1(event: NameRegistered1): void {
  const txHash = event.transaction.hash
  const block = event.block
  const id = event.params.id
  const expires = event.params.expires
  const owner = event.params.owner
  const tokenAddress = event.address
  _handleNameRegistered(
    tokenAddress,
    txHash,
    block,
    id,
    expires,
    owner,
    event.logIndex
  )
}
export function handleNameRegistered2(event: NameRegistered2): void {
  const txHash = event.transaction.hash
  const block = event.block
  const id = event.params.id
  const expires = event.params.expires
  const owner = event.params.owner
  const tokenAddress = event.address
  _handleNameRegistered(
    tokenAddress,
    txHash,
    block,
    id,
    expires,
    owner,
    event.logIndex
  )
}

export function handleNameRenewed1(event: NameRenewed1): void {
  const txHash = event.transaction.hash
  const block = event.block
  const id = event.params.id
  const expires = event.params.expires
  const from = event.transaction.from
  const tokenAddress = event.address
  _handleNameRenewed(
    tokenAddress,
    txHash,
    from,
    block,
    id,
    expires,
    event.logIndex
  )
}
export function handleNameRenewed2(event: NameRenewed2): void {
  const txHash = event.transaction.hash
  const block = event.block
  const id = event.params.id
  const expires = event.params.expires
  const from = event.transaction.from
  const tokenAddress = event.address
  _handleNameRenewed(
    tokenAddress,
    txHash,
    from,
    block,
    id,
    expires,
    event.logIndex
  )
}

export function handleTransfer1(event: Transfer1): void {
  const txHash = event.transaction.hash
  const block = event.block
  const from = event.params.from
  const to = event.params.to
  const tokenId = event.params.tokenId
  const tokenAddress = event.address
  _handleTransfer(
    tokenAddress,
    txHash,
    block,
    from,
    to,
    tokenId,
    event.logIndex
  )
}
export function handleTransfer2(event: Transfer2): void {
  const txHash = event.transaction.hash
  const block = event.block
  const from = event.params.from
  const to = event.params.to
  const tokenId = event.params.tokenId
  const tokenAddress = event.address
  _handleTransfer(
    tokenAddress,
    txHash,
    block,
    from,
    to,
    tokenId,
    event.logIndex
  )
}
