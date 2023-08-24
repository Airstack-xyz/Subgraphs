import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"

import {
  ChangeRecoveryAddress as ChangeRecoveryAddressEvent,
  DisableTrustedOnly as DisableTrustedOnlyEvent,
  EIP712DomainChanged as EIP712DomainChangedEvent,
  OwnershipTransferStarted as OwnershipTransferStartedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  Recover as RecoverEvent,
  Register as RegisterEvent,
  SetTrustedCaller as SetTrustedCallerEvent,
  Transfer as TransferEvent,
  Unpaused as UnpausedEvent
} from "../generated/IdRegistry/IdRegistry"

import { BIG_INT_ZERO } from "../modules/airstack/common";

import * as airstack from "../modules/airstack/social/social";
import { zeroAddress } from "../modules/airstack/social/utils";


// export const SUBGRAPH_NAME = "farcaster-optimism";
// export const SUBGRAPH_VERSION = "v2";
// export const SUBGRAPH_SLUG = "farcaster-optimism";

const  FARCASTER_ID_REGISTRY_CONTRACT= "0x189E66031E1D47BB3c5F9b99ee029F2a0D1b8593"

export function handleRegister(event: RegisterEvent): void {
  log.info("handleRegister to {} id {} contractAddress {} recovery {}", [event.params.to.toHexString(), event.params.id.toString(), event.address.toHexString(), event.params.recovery.toHexString()]);


  airstack.social.trackSocialUserAndProfileRegisteredTransaction(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    zeroAddress.toHexString(),
    event.params.to.toHexString(),
    event.params.id.toString(),
    FARCASTER_ID_REGISTRY_CONTRACT,
    event.params.id.toString(),
    new Array<airstack.social.AirExtraData>(),
    "",
    new Array<airstack.social.AirExtraData>(),
    BIG_INT_ZERO,
  );
  
}

export function handleTransfer(event: TransferEvent): void {

  log.info("handleFarcasterIdTransfer from {} to {} id {} contractAddress {} txhash {}", [event.params.from.toHexString(), event.params.to.toHexString(), event.params.id.toString(), event.address.toHexString(), event.transaction.hash.toHexString()]);

  if (event.params.from != zeroAddress) {
  airstack.social.trackSocialUserOwnershipChangeTransaction(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.id.toString(),
    event.address.toHexString(),
    event.params.id.toString(),
  );
  }
}

export function handleChangeRecoveryAddress(
  event: ChangeRecoveryAddressEvent
): void {

  airstack.social.trackSocialUserRecoveryAddressChangeTransaction(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.transaction.from.toHexString(),
    event.address.toHexString(),
    event.params.id.toString(),
    FARCASTER_ID_REGISTRY_CONTRACT,
    event.params.id.toString(),
    event.params.recovery.toHexString(),
  )
}


