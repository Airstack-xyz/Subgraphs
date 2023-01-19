import {
  ApprovalForAll as ApprovalForAllEvent,
  NewOwner as NewOwnerEvent,
  NewResolver as NewResolverEvent,
  NewTTL as NewTTLEvent,
  Transfer as TransferEvent
} from "../generated/EnsRegistry/EnsRegistry"
import * as airstack from "../modules/airstack";
import {
} from "../generated/schema"
import { ETHEREUM_MAINNET_ID } from "./utils";
import { BIG_INT_ZERO, ZERO_ADDRESS } from "../modules/airstack/utils";

/**
 * @dev this functions maps the NewOwner event to airstack trackDomainOwnerChangedTransaction
 * @param event NewOwnerEvent from ENS Registry
 */
export function handleNewOwner(event: NewOwnerEvent): void {
  // do data mapping
  let domainId = airstack.domain.createAirDomainEntityId(event.params.node, event.params.label);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(
    domainId,
  ))
  // send to airstack
  airstack.domain.trackDomainOwnerChangedTransaction(
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    ETHEREUM_MAINNET_ID,
    domain.owner,
    event.params.owner.toHexString(),
    event.transaction.hash,
    BIG_INT_ZERO.toString(),
    domain,
  )
}

export function handleTransfer(event: TransferEvent): void {
  // do data mapping
  let node = event.params.node.toHexString();
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(node));
  let previousOwner = domain.owner;
  if (previousOwner == null) {
    previousOwner = ZERO_ADDRESS;
  }
  // send to airstack
  airstack.domain.trackDomainTransferTransaction(
    previousOwner,
    event.params.owner.toHexString(),
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    event.logIndex,
    event.transaction.hash,
    domain,
  )
}

// export function handleNewResolver(event: NewResolverEvent): void {
//   let entity = new NewResolver(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.node = event.params.node
//   entity.resolver = event.params.resolver

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleNewTTL(event: NewTTLEvent): void {
//   let entity = new NewTTL(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.node = event.params.node
//   entity.ttl = event.params.ttl

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }


