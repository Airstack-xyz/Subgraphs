import { log } from "@graphprotocol/graph-ts"
import {
  HandleLinked as HandleLinkedEvent,
  HandleUnlinked as HandleUnlinkedEvent
} from "../generated/TokenHandleRegistry/TokenHandleRegistry"
import { HandleLinked, HandleUnlinked } from "../generated/schema"
import * as airstack from "../modules/airstack/social/social"

export function handleHandleLinked(event: HandleLinkedEvent): void {
  let entity = new HandleLinked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.handle_id = event.params.handle.id
  entity.handle_collection = event.params.handle.collection
  entity.token_id = event.params.token.id
  entity.token_collection = event.params.token.collection
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  airstack.social.trackSocialProfileHandleLinkTransaction(
    event.block,
    event.params.handle.collection.toHexString(),
    event.params.handle.id.toString(),
    event.params.token.collection.toHexString(),
    event.params.token.id.toString(),
  )
}

export function handleHandleUnlinked(event: HandleUnlinkedEvent): void {
  let entity = new HandleUnlinked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.handle_id = event.params.handle.id
  entity.handle_collection = event.params.handle.collection
  entity.token_id = event.params.token.id
  entity.token_collection = event.params.token.collection
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  airstack.social.trackSocialProfileHandleUnlinkTransaction(
    event.block,
    event.params.handle.collection.toHexString(),
    event.params.handle.id.toString(),
    event.params.token.collection.toHexString(),
    event.params.token.id.toString(),
  )
}
