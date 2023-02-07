import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import {
  FarcasterNameRegistry,
  Transfer
} from "../generated/FarcasterNameRegistry/FarcasterNameRegistry";
import * as airstack from "../modules/airstack/social/social";

import { Register, FarcasterIdRegistry } from "../generated/FarcasterNameRegistry/FarcasterIdRegistry";
import { FARCASTER_ID_REGISTRY_CONTRACT } from "./utils";

export function handleFarcasterNameTransfer(event: Transfer): void {
  let fromAdress = event.params.from;
  let toAdress = event.params.to;
  let tokenId = event.params.tokenId;

  const farcasterTokenIdRegistry = FarcasterIdRegistry.bind(FARCASTER_ID_REGISTRY_CONTRACT)
  const farcasterId = farcasterTokenIdRegistry.try_idOf(toAdress);
  const farcasterName = Bytes.fromHexString(event.params.tokenId.toHexString()).toString();

  // get token uri from name registry
  const nameRegistry = FarcasterNameRegistry.bind(event.address);
  const tokenURI = nameRegistry.try_tokenURI(tokenId);
  // create air extra data for token uri
  let airExtrasData = new Array<airstack.social.AirExtraDataClass>();
  airExtrasData.push(
    new airstack.social.AirExtraDataClass(
      "tokenUri",
      tokenURI.value,
    )
  );
  // send transaction to airstack
  log.info("handleFarcasterNameTransfer from {} to {} tokenId {} contractAddress {} farcasterId {} farcasterName {} tokenUri {}", [event.params.from.toHexString(), event.params.to.toHexString(), event.params.tokenId.toHexString(), event.address.toHexString(), farcasterId.value.toString(), farcasterName, tokenURI.value]);
  airstack.social.trackAirProfileTransferTransaction(
    event.block,
    fromAdress.toHexString(),
    toAdress.toHexString(),
    farcasterId.value.toString(),
    farcasterName,
    airExtrasData,
  );
}

export function handleRegister(event: Register): void {
  log.info("handleRegister to {} id {} contractAddress {} recovery {} url {}", [event.params.to.toHexString(), event.params.id.toHexString(), event.address.toHexString(), event.params.recovery.toHexString(), event.params.url]);
  // create air extra data for recovery address and home url
  let airExtrasData = new Array<airstack.social.AirExtraDataClass>();
  airExtrasData.push(
    new airstack.social.AirExtraDataClass(
      "recoveryAddress",
      event.params.recovery.toHexString(),
    )
  );
  airExtrasData.push(
    new airstack.social.AirExtraDataClass(
      "homeUrl",
      event.params.url,
    ),
  );
  // send transaction to airstack
  airstack.social.trackUserRegisteredTransaction(
    event.block,
    event.params.to.toHexString(), //owner of farcaster id
    event.address.toHexString(), //contract address
    event.params.id.toString(), //farcaster id
    airExtrasData,
    event.logIndex,
    event.transaction.hash.toHexString(),
  );
}

