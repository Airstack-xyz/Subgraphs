import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  Transfer as TransferEvent,
  HandleMinted as HandleMintedEvent,
  TokenGuardianStateChanged as TokenGuardianStateChangedEvent
} from "../generated/LensHandle/LensHandle"
import * as airstack from "../modules/airstack/social/social"
import {
  Transfer,
  HandleMinted,

} from "../generated/schema"
import { LENSHANDLE_ADDRESS } from "./constants"
import { ZERO_ADDRESS } from "@protofire/subgraph-toolkit"

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  //mint is handle by Handle Minted event
  if (event.params.from.toHexString() != ZERO_ADDRESS) {
    airstack.social.trackSocialProfileHandleTransferTransaction(
      event.block,
      event.params.from.toHexString(),
      event.params.to.toHexString(),
      event.params.tokenId.toString(),
      LENSHANDLE_ADDRESS.toHexString(),
    )
  }
// if handle is burned, make sure to un-link it.
if(event.params.to.toHexString() == ZERO_ADDRESS) {


}
}

export function handleHandleMinted(event: HandleMintedEvent): void {
  let entity = new HandleMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.handle = event.params.handle
  entity.namespace = event.params.namespace
  entity.handleId = event.params.handleId
  entity.to = event.params.to
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  airstack.social.trackSocialProfileHandleRegistrationTransaction(
    event.block,
    event.params.to.toHexString(),
    event.params.handleId.toString(),
    LENSHANDLE_ADDRESS.toHexString(),
    event.params.handle,
    event.params.namespace,
  )
}

// export function handleTokenGuardianStateChanged(
//   event: TokenGuardianStateChangedEvent
// ): void {
//   let entity = new TokenGuardianStateChanged(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.wallet = event.params.wallet
//   entity.enabled = event.params.enabled
//   entity.tokenGuardianDisablingTimestamp =
//     event.params.tokenGuardianDisablingTimestamp
//   entity.timestamp = event.params.timestamp

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }
