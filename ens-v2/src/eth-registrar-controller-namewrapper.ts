import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import {
  NameRegistered,
  NameRenewed,
} from "../generated/ETHRegistrarControllerNameWrapper/ETHRegistrarControllerNew"
import {
  NameRegistered as NameRegisteredTemplate,
  NameRenewed as NameRenewedTemplate,
} from "../generated/templates/ETHRegistrarControllerNameWrapperTemplate/ETHRegistrarControllerNew"
import { ControllerNameWrapperRemoved, InvalidName } from "../generated/schema"
import {
  checkValidLabel,
  getNameHashFromByteArray,
  ethNode,
  GRACE_PERIOD_SECONDS,
} from "./utils"
import * as airstack from "../modules/airstack/domain-name"

export const _handleNameRegistered = (
  controller: Address,
  txhash: Bytes,
  block: ethereum.Block,
  name: string,
  label: Bytes,
  owner: Address,
  baseCost: BigInt,
  premium: BigInt,
  expires: BigInt,
  logIndex: BigInt
): void => {
  if (ControllerNameWrapperRemoved.load(controller.toHexString())) {
    return
  }
  if (!checkValidLabel(name)) {
    let invalidName = new InvalidName(name + "-" + txhash.toHexString())
    invalidName.name = name
    invalidName.label = label
    invalidName.txHash = txhash
    invalidName.save()
    return
  }
  // saving airLabelName  fixing
  airstack.domain.trackAirLabelName(name, label.toHexString(), block)
  const domainId = getNameHashFromByteArray(ethNode, label)

  airstack.domain.trackAirDomainCost(
    domainId,
    baseCost.plus(premium),
    txhash,
    logIndex,
    block
  )
}

export const _handleNameRenewed = (
  controller: Address,
  txhash: Bytes,
  block: ethereum.Block,
  name: string,
  label: Bytes,
  cost: BigInt,
  expires: BigInt,
  logIndex: BigInt,
  from: Address
): void => {
  if (ControllerNameWrapperRemoved.load(controller.toHexString())) {
    return
  }
  if (!checkValidLabel(name)) {
    let invalidName = new InvalidName(name + "-" + txhash.toHexString())
    invalidName.name = name
    invalidName.label = label
    invalidName.txHash = txhash
    invalidName.save()
    return
  }
  // saving airLabelName  fixing
  airstack.domain.trackAirLabelName(name, label.toHexString(), block)
  const domainId = getNameHashFromByteArray(ethNode, label)
  airstack.domain.trackAirDomainCost(domainId, cost, txhash, logIndex, block)
}

export function handleNameRegistered(event: NameRegistered): void {
  const txHash = event.transaction.hash
  const block = event.block
  const name = event.params.name
  const label = event.params.label
  const owner = event.params.owner
  const baseCost = event.params.baseCost
  const premium = event.params.premium
  const expires = event.params.expires
  _handleNameRegistered(
    event.address,
    txHash,
    block,
    name,
    label,
    owner,
    baseCost,
    premium,
    expires,
    event.logIndex
  )
}
export function handleNameRegisteredTemplate(
  event: NameRegisteredTemplate
): void {
  const txHash = event.transaction.hash
  const block = event.block
  const name = event.params.name
  const label = event.params.label
  const owner = event.params.owner
  const baseCost = event.params.baseCost
  const premium = event.params.premium
  const expires = event.params.expires
  _handleNameRegistered(
    event.address,
    txHash,
    block,
    name,
    label,
    owner,
    baseCost,
    premium,
    expires,
    event.logIndex
  )
}

export function handleNameRenewed(event: NameRenewed): void {
  const txHash = event.transaction.hash
  const block = event.block
  const name = event.params.name
  const label = event.params.label
  const cost = event.params.cost
  const expires = event.params.expires
  _handleNameRenewed(
    event.address,
    txHash,
    block,
    name,
    label,
    cost,
    expires,
    event.logIndex,
    event.transaction.from
  )
}
export function handleNameRenewedTemplate(event: NameRenewedTemplate): void {
  const txHash = event.transaction.hash
  const block = event.block
  const name = event.params.name
  const label = event.params.label
  const cost = event.params.cost
  const expires = event.params.expires
  _handleNameRenewed(
    event.address,
    txHash,
    block,
    name,
    label,
    cost,
    expires,
    event.logIndex,
    event.transaction.from
  )
}
