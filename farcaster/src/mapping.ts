import { Bytes, log } from "@graphprotocol/graph-ts"
import {
  FarcasterNameRegistry,
  Transfer
} from "../generated/FarcasterNameRegistry/FarcasterNameRegistry";
import { Register, FarcasterIdRegistry, ChangeHome, ChangeRecoveryAddress } from "../generated/FarcasterNameRegistry/FarcasterIdRegistry";
import * as airstack from "../modules/airstack/social/social";
import { FARCASTER_ID_REGISTRY_CONTRACT, createOrUpdateUserRegAndProfileFarcasterMapping, validateFarcasterMapping } from "./utils";
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
  // store all data in UserRegAndProfileFarcasterMapping
  let mappingId = farcasterId.value.toString().concat("-").concat(toAdress.toHexString());
  let mapping = createOrUpdateUserRegAndProfileFarcasterMapping(
    mappingId,
    farcasterId.value.toString(),
    null,
    null,
    null,
    null,
    null,
    fromAdress.toHexString(),
    toAdress.toHexString(),
    tokenURI.value,
    null,
    null,
    farcasterName,
    tokenId.toHexString(),
  );
  // validate all data before sending to airstack
  log.info("handleFarcasterNameTransfer from {} to {} tokenId {} contractAddress {} farcasterId {} farcasterName {} tokenUri {}", [event.params.from.toHexString(), event.params.to.toHexString(), event.params.tokenId.toHexString(), event.address.toHexString(), farcasterId.value.toString(), farcasterName, tokenURI.value]);
  let validationPassed = validateFarcasterMapping(mapping);
  if (validationPassed) {
    // create profile extras data
    let profileExtras = new Array<airstack.social.AirExtraDataClass>();
    profileExtras.push(
      new airstack.social.AirExtraDataClass(
        "tokenUri",
        mapping.tokenUri!,
      )
    );
    // create user extras data
    let userExtras = new Array<airstack.social.AirExtraDataClass>();
    userExtras.push(
      new airstack.social.AirExtraDataClass(
        "recoveryAddress",
        mapping.recoveryAddress!,
      )
    );
    userExtras.push(
      new airstack.social.AirExtraDataClass(
        "homeUrl",
        mapping.homeUrl!,
      )
    );
    // send transaction to airstack
    airstack.social.trackUserAndProfileRegisteredTransaction(
      mapping.blockNumber!,
      mapping.blockHash!,
      mapping.blockTimestamp!,
      mapping.transactionHash!,
      mapping.logOrCallIndex!,
      mapping.fromAddress!,
      mapping.toAddress!,
      mapping.farcasterId,
      mapping.farcasterProfileName!,
      profileExtras,
      userExtras,
    );
  }
}

/**
 * @dev this function is called when a farcaster id is registered
 * @param event register event from farcaster id registry
 */
export function handleRegister(event: Register): void {
  log.info("handleRegister to {} id {} contractAddress {} recovery {} url {}", [event.params.to.toHexString(), event.params.id.toHexString(), event.address.toHexString(), event.params.recovery.toHexString(), event.params.url]);
  // store all data in UserRegAndProfileFarcasterMapping
  let mappingId = event.params.id.toString().concat("-").concat(event.params.to.toHexString());
  let mapping = createOrUpdateUserRegAndProfileFarcasterMapping(
    mappingId,
    event.params.id.toString(),
    event.block.number,
    event.block.timestamp,
    event.block.hash.toHexString(),
    event.transaction.hash.toHexString(),
    event.logIndex,
    null,
    event.params.to.toHexString(),
    null,
    event.params.url,
    event.params.recovery.toHexString(),
    null,
    null,
  );
  // validate all data before sending to airstack
  let validationPassed = validateFarcasterMapping(mapping);
  if (validationPassed) {
    // create profile extras data
    let profileExtras = new Array<airstack.social.AirExtraDataClass>();
    profileExtras.push(
      new airstack.social.AirExtraDataClass(
        "tokenUri",
        mapping.tokenUri!,
      )
    );
    // create user extras data
    let userExtras = new Array<airstack.social.AirExtraDataClass>();
    userExtras.push(
      new airstack.social.AirExtraDataClass(
        "recoveryAddress",
        mapping.recoveryAddress!,
      )
    );
    userExtras.push(
      new airstack.social.AirExtraDataClass(
        "homeUrl",
        mapping.homeUrl!,
      )
    );
    // send transaction to airstack
    airstack.social.trackUserAndProfileRegisteredTransaction(
      mapping.blockNumber!,
      mapping.blockHash!,
      mapping.blockTimestamp!,
      mapping.transactionHash!,
      mapping.logOrCallIndex!,
      mapping.fromAddress!,
      mapping.toAddress!,
      mapping.farcasterId,
      mapping.farcasterProfileName!,
      profileExtras,
      userExtras,
    );
  }
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
    log.info("handleChangeHome extraDataId {} name {} value {}", [extraData.id, extraData.name, extraData.value])
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