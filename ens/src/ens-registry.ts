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
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/utils";

/**
 * @dev this functions maps the NewOwner event to airstack trackDomainOwnerChangedTransaction
 * @param event NewOwnerEvent from ENS Registry
 */
export function handleNewOwner(event: NewOwnerEvent): void {
  // do data mapping
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(
    event.params.node,
    event.params.label,
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

// export function handleTransfer(event: TransferEvent): void {
//   let entity = new Transfer(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.node = event.params.node
//   entity.owner = event.params.owner

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }
