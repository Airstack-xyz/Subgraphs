import { Bytes, log } from "@graphprotocol/graph-ts"
import {
  FarcasterNameRegistry,
  Transfer
} from "../generated/FarcasterNameRegistry/FarcasterNameRegistry";
import * as airstack from "../modules/airstack/social/social";

import { Register, FarcasterIdRegistry, ChangeHome, ChangeRecoveryAddress } from "../generated/FarcasterNameRegistry/FarcasterIdRegistry";
import { FARCASTER_ID_REGISTRY_CONTRACT } from "./utils";
import { AirExtraData } from "../generated/schema";
import { processChainId } from "../modules/airstack/common";

/**
 * @dev this function is called when a farcaster name is transfered
 * @param event transfer event from farcaster name registry
 */
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

/**
 * @dev this function is called when a farcaster id is registered
 * @param event register event from farcaster id registry
 */
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

/**
 * @dev this function is called when a farcaster id home url is changed
 * @param event ChangeHome event from farcaster id registry
 */
export function handleChangeHome(event: ChangeHome): void {
  log.info("handleChangeHome id {} contractAddress {} url {}", [event.params.id.toString(), event.address.toHexString(), event.params.url]);
  // load extra data for farcaster id
  let chainId = processChainId();
  let id = chainId.concat("-").concat(event.params.id.toString()).concat("-").concat("homeUrl");
  let extraData = AirExtraData.load(id);
  if (extraData != null) {
    extraData.value = event.params.url;
    extraData.save();
  }
}

/**
 * @dev this function is called when a farcaster id recovery address is changed
 * @param event ChangeRecoveryAddress event from farcaster id registry
 */
export function handleChangeRecoveryAddress(event: ChangeRecoveryAddress): void {
  log.info("handleChangeRecoveryAddress id {} contractAddress {} recovery {}", [event.params.id.toString(), event.address.toHexString(), event.params.recovery.toHexString()]);
  // load extra data for farcaster id
  let chainId = processChainId();
  let id = chainId.concat("-").concat(event.params.id.toString()).concat("-").concat("recoveryAddress");
  let extraData = AirExtraData.load(id);
  if (extraData != null) {
    extraData.value = event.params.recovery.toHexString();
    extraData.save();
  }
}