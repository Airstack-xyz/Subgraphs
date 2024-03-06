import {
  Address,
  BigInt,
  Bytes,
  ens,
  ethereum,
  log,
} from "@graphprotocol/graph-ts"
import {
  Transfer as TransferOld,
  NewOwner as NewOwnerOld,
  NewResolver as NewResolverOld,
  NewTTL as NewTTLOld,
} from "../generated/ENSRegistry/ENSRegistry"
import {
  Transfer,
  NewOwner,
  NewResolver,
  NewTTL,
} from "../generated/ENSRegistryWithFallback/ENSRegistry"
import * as airstack from "../modules/airstack/domain-name"
import { NewOwnerHashLabelMap } from "../generated/schema"
import {
  getNameHashFromBytes,
  createReverse,
  ADDR_REVERSE_NODE,
  tryFindNamebyHash,
} from "./utils"
const ROOT_NODE_INITIAL_TRANSFER_HASH =
  "0xe120d656744084c3906a59013ec2bcaf35bda6b3cc770f2001acd4c15efbd353"

/**
 * Transfers ownership of a node to a new address. May only be called by the current owner of the node.
 * @param txHash
 * @param node
 * @param owner
 * @param block
 */

export const _handleTransfer = (
  txHash: Bytes,
  block: ethereum.Block,
  logIndex: BigInt,
  from: Address,
  node: Bytes,
  migrate: bool,
  owner: Address
): void => {
  // owner & manager will get transferred
  // create account for newOwner

  if (txHash.toHexString().toLowerCase() == ROOT_NODE_INITIAL_TRANSFER_HASH) {
    // added here because root node transfer happens before NewOwner
    // https://etherscan.io/tx/0xe120d656744084c3906a59013ec2bcaf35bda6b3cc770f2001acd4c15efbd353
    airstack.domain.createAirDomainWithManager(
      txHash,
      logIndex,
      node.toHexString(),
      owner,
      block
    )
  }
  airstack.domain.trackAirDomainManagerTransfer(
    txHash,
    logIndex,
    from,
    owner,
    node.toHexString(),
    migrate,
    block
  )
}

/**
 * Transfers ownership of a subnode keccak256(node, label) to a new address. May only be called by the owner of the parent node.
 * @param txHash
 * @param node
 * @param label
 * @param owner
 * @param block
 */
export const _handleNewOwner = (
  txHash: Bytes,
  logIndex: BigInt,
  node: Bytes,
  label: Bytes,
  owner: Address,
  migrate: bool,
  block: ethereum.Block
): void => {
  let parentDomainId = node.toHexString()
  let childDomainId = getNameHashFromBytes(node, label)
  if (childDomainId.toLowerCase() == ADDR_REVERSE_NODE.toLowerCase()) {
    createReverse(owner, txHash)
  }
  // attempt to build child name
  let labelName = tryFindNamebyHash(label)
  airstack.domain.trackSubDomainNewManager(
    txHash,
    logIndex,
    parentDomainId,
    childDomainId,
    label.toHexString(),
    labelName,
    owner,
    migrate,
    block
  )

  let hashlabelMap = new NewOwnerHashLabelMap(
    txHash.toHexString() + "-" + label.toHexString()
  )
  hashlabelMap.domainId = childDomainId
  hashlabelMap.save()
}

/**
 * Sets the resolver address for the specified node
 * @param txHash
 * @param node
 * @param label
 * @param block
 */
export const _handleNewResolver = (
  txHash: Bytes,
  logIndex: BigInt,
  node: Bytes,
  resolver: Address,
  migrate: bool,
  block: ethereum.Block
): void => {
  airstack.domain.trackDomainNewResolver(
    txHash,
    logIndex,
    node.toHexString(),
    resolver,
    migrate,
    block
  )
}

/**
 * Sets the TTL for the specified node.
 * @param txHash
 * @param node
 * @param ttl
 * @param block
 */
export const _handleNewTTL = (
  txHash: Bytes,
  logIndex: BigInt,
  node: Bytes,
  ttl: BigInt,
  migrate: bool,
  block: ethereum.Block
): void => {
  airstack.domain.trackDomainNewTTL(
    txHash,
    logIndex,
    node.toHexString(),
    ttl,
    migrate,
    block
  )
}

export function handleTransferOld(event: TransferOld): void {
  const txHash = event.transaction.hash
  const from = event.transaction.from
  const node = event.params.node
  const owner = event.params.owner
  const block = event.block
  const logIndex = event.logIndex

  _handleTransfer(txHash, block, logIndex, from, node, false, owner)
}
export function handleTransfer(event: Transfer): void {
  const txHash = event.transaction.hash
  const from = event.transaction.from
  const node = event.params.node
  const owner = event.params.owner
  const block = event.block
  const logIndex = event.logIndex

  _handleTransfer(txHash, block, logIndex, from, node, true, owner)
}

export function handleNewOwnerOld(event: NewOwnerOld): void {
  const txHash = event.transaction.hash
  const logIndex = event.logIndex
  const node = event.params.node
  const label = event.params.label
  const owner = event.params.owner
  const block = event.block
  _handleNewOwner(txHash, logIndex, node, label, owner, false, block)
}
export function handleNewOwner(event: NewOwner): void {
  const txHash = event.transaction.hash
  const logIndex = event.logIndex

  const node = event.params.node
  const label = event.params.label
  const owner = event.params.owner
  const block = event.block
  _handleNewOwner(txHash, logIndex, node, label, owner, true, block)
}
export function handleNewResolverOld(event: NewResolverOld): void {
  const txHash = event.transaction.hash
  const logIndex = event.logIndex

  const node = event.params.node
  const resolver = event.params.resolver
  const block = event.block
  _handleNewResolver(txHash, logIndex, node, resolver, false, block)
}
export function handleNewResolver(event: NewResolver): void {
  const txHash = event.transaction.hash
  const logIndex = event.logIndex

  const node = event.params.node
  const resolver = event.params.resolver
  const block = event.block
  _handleNewResolver(txHash, logIndex, node, resolver, true, block)
}
export function handleNewTTLOld(event: NewTTLOld): void {
  const txHash = event.transaction.hash
  const logIndex = event.logIndex

  const node = event.params.node
  const ttl = event.params.ttl
  const block = event.block
  _handleNewTTL(txHash, logIndex, node, ttl, false, block)
}
export function handleNewTTL(event: NewTTL): void {
  const txHash = event.transaction.hash
  const logIndex = event.logIndex

  const node = event.params.node
  const ttl = event.params.ttl
  const block = event.block
  _handleNewTTL(txHash, logIndex, node, ttl, true, block)
}
