import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import {
  FarcasterNameRegistry,
  Transfer,
  ChangeRecoveryAddress as FnameChangeRecoveryAddress,
  Renew,
  Invite,
  BidCall
} from "../generated/FarcasterNameRegistry/FarcasterNameRegistry";
import { Transfer as FidTransfer, Register, FarcasterIdRegistry, ChangeHome, ChangeRecoveryAddress as FidChangeRecoveryAddress } from "../generated/FarcasterIdRegistry/FarcasterIdRegistry";
import * as airstack from "../modules/airstack/social/social";
import { FARCASTER_ID_REGISTRY_CONTRACT, FARCASTER_NAME_REGISTRY_CONTRACT, createOrUpdateUserRegAndProfileFarcasterMapping, validateFarcasterMapping, getExpiryTimestampFromFnameRegistry, upsertFidForAddress, getFidForAddress } from "./utils";
import { userRecoveryAddress, userHomeUrl, profileTokenUri, zeroAddress } from "../modules/airstack/social/utils";

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
  // set fid of to address as farcasterId
  if (!farcasterId.reverted) {
    upsertFidForAddress(toAdress.toHexString(), farcasterId.value.toString());
  }
  // check if event is a transfer txn, then update the user for the profile
  if (fromAdress.toHexString() != zeroAddress.toHexString()) {
    // get fid of from address
    const fromAddressFid = getFidForAddress(fromAdress.toHexString());
    if (fromAddressFid == null) {
      log.error("handleFarcasterNameTransfer: fromAddressFid is null for address {} txHash {}", [fromAdress.toHexString(), event.transaction.hash.toHexString()]);
      throw new Error("handleFarcasterNameTransfer: fromAddressFid is null")
    }
    // track profile ownership change, not user registration
    airstack.social.trackSocialProfileOwnershipChangeTransaction(
      event.block,
      event.transaction.hash.toHexString(),
      event.transaction.index,
      event.params.from.toHexString(),
      event.params.to.toHexString(),
      event.params.tokenId.toString(),
      FARCASTER_NAME_REGISTRY_CONTRACT.toHexString(),
      fromAddressFid!,
      farcasterId.value.toString(),
    )
    return;
  }

  // get token uri from name registry
  const nameRegistry = FarcasterNameRegistry.bind(event.address);
  const tokenURI = nameRegistry.try_tokenURI(tokenId);
  // store all data in UserRegAndProfileFarcasterMapping
  let mappingId = farcasterId.value.toString().concat("-").concat(toAdress.toHexString()).concat("-").concat(event.transaction.hash.toHexString());
  let mapping = createOrUpdateUserRegAndProfileFarcasterMapping(
    mappingId,
    farcasterId.value.toString(),
    null,
    null,
    fromAdress.toHexString(),
    toAdress.toHexString(),
    tokenURI.value,
    null,
    null,
    farcasterName,
    tokenId.toString(),
  );
  // validate all data before sending to airstack
  log.info("handleFarcasterNameTransfer from {} to {} tokenId {} contractAddress {} farcasterId {} farcasterName {} tokenUri {}", [event.params.from.toHexString(), event.params.to.toHexString(), event.params.tokenId.toString(), event.address.toHexString(), farcasterId.value.toString(), farcasterName, tokenURI.value]);
  let validationPassed = validateFarcasterMapping(mapping);
  if (validationPassed) {
    log.info("handleFarcasterNameTransfer validation passed, sending data to airstack", []);
    // create profile extras data
    let profileExtras = new Array<airstack.social.AirExtraData>();
    profileExtras.push(
      new airstack.social.AirExtraData(
        profileTokenUri,
        mapping.tokenUri!,
      )
    );
    // create user extras data
    let userExtras = new Array<airstack.social.AirExtraData>();
    userExtras.push(
      new airstack.social.AirExtraData(
        userRecoveryAddress,
        mapping.recoveryAddress!,
      )
    );
    userExtras.push(
      new airstack.social.AirExtraData(
        userHomeUrl,
        mapping.homeUrl!,
      )
    );
    // get expiry timestamp of profile name from farcaster name registry
    const expiryTimestamp = getExpiryTimestampFromFnameRegistry(BigInt.fromString(mapping.tokenId!));
    // send transaction to airstack
    airstack.social.trackSocialUserAndProfileRegisteredTransaction(
      event.block,
      mapping.transactionHash!,
      mapping.logOrCallIndex!,
      mapping.fromAddress!,
      mapping.toAddress!,
      mapping.tokenId!,
      FARCASTER_NAME_REGISTRY_CONTRACT.toHexString(),
      mapping.farcasterId,
      userExtras,
      mapping.farcasterProfileName!,
      profileExtras,
      expiryTimestamp
    );
  }
}

/**
 * @dev this function is called when a farcaster id is registered
 * @param event register event from farcaster id registry
 */
export function handleRegister(event: Register): void {
  log.info("handleRegister to {} id {} contractAddress {} recovery {} url {}", [event.params.to.toHexString(), event.params.id.toString(), event.address.toHexString(), event.params.recovery.toHexString(), event.params.url]);
  // store all data in UserRegAndProfileFarcasterMapping
  let mappingId = event.params.id.toString().concat("-").concat(event.params.to.toHexString()).concat("-").concat(event.transaction.hash.toHexString());
  let mapping = createOrUpdateUserRegAndProfileFarcasterMapping(
    mappingId,
    event.params.id.toString(),
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
    log.info("handleRegister validation passed, sending data to airstack", []);
    // create profile extras data
    let profileExtras = new Array<airstack.social.AirExtraData>();
    profileExtras.push(
      new airstack.social.AirExtraData(
        profileTokenUri,
        mapping.tokenUri!,
      )
    );
    // create user extras data
    let userExtras = new Array<airstack.social.AirExtraData>();
    userExtras.push(
      new airstack.social.AirExtraData(
        userRecoveryAddress,
        mapping.recoveryAddress!,
      )
    );
    userExtras.push(
      new airstack.social.AirExtraData(
        userHomeUrl,
        mapping.homeUrl!,
      )
    );
    // get expiry timestamp of profile name from farcaster name registry
    const expiryTimestamp = getExpiryTimestampFromFnameRegistry(BigInt.fromString(mapping.tokenId!));
    // send transaction to airstack
    airstack.social.trackSocialUserAndProfileRegisteredTransaction(
      event.block,
      mapping.transactionHash!,
      mapping.logOrCallIndex!,
      mapping.fromAddress!,
      mapping.toAddress!,
      mapping.tokenId!,
      FARCASTER_NAME_REGISTRY_CONTRACT.toHexString(),
      mapping.farcasterId,
      userExtras,
      mapping.farcasterProfileName!,
      profileExtras,
      expiryTimestamp
    );
  }
}

/**
 * @dev this function is called when a farcaster id home url is changed
 * @param event ChangeHome event from farcaster id registry
 */
export function handleChangeHomeUrlFid(event: ChangeHome): void {
  log.info("handleChangeHome id {} contractAddress {} url {}", [event.params.id.toString(), event.address.toHexString(), event.params.url]);
  airstack.social.trackSocialUserHomeUrlChangeTransaction(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.transaction.from.toHexString(),
    event.address.toHexString(),
    event.params.id.toString(),
    FARCASTER_ID_REGISTRY_CONTRACT.toHexString(),
    event.params.id.toString(),
    event.params.url,
  );
}

/**
 * @dev this function is called when a farcaster id recovery address is changed
 * @param event ChangeRecoveryAddress event from farcaster id registry
 */
export function handleChangeRecoveryAddressFid(event: FidChangeRecoveryAddress): void {
  log.info("handleChangeRecoveryAddress id {} contractAddress {} recovery {}", [event.params.id.toString(), event.address.toHexString(), event.params.recovery.toHexString()]);
  airstack.social.trackSocialUserRecoveryAddressChangeTransaction(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.transaction.from.toHexString(),
    event.address.toHexString(),
    event.params.id.toString(),
    FARCASTER_ID_REGISTRY_CONTRACT.toHexString(),
    event.params.id.toString(),
    event.params.recovery.toHexString(),
  )
}

/**
 * @dev this function is called when a farcaster name recovery address is changed
 * @param event ChangeRecoveryAddress event from farcaster name registry
*/
export function handleChangeRecoveryAddressFname(event: FnameChangeRecoveryAddress): void {
  log.info("handleRecoveryAddressFname id {} contractAddress {} recovery {}", [event.params.tokenId.toString(), event.address.toHexString(), event.params.recovery.toHexString()]);
  airstack.social.trackSocialProfileRecoveryAddressChangeTransaction(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.transaction.from.toHexString(),
    event.address.toHexString(),
    event.params.tokenId.toString(),
    event.address.toHexString(),
    event.params.recovery.toHexString(),
  )
}

/**
 * @dev this function is called when a farcaster id is transferred
 * @param event Transfer event from farcaster id registry
 */
export function handleFarcasterIdTransfer(event: FidTransfer): void {
  log.info("handleFarcasterIdTransfer from {} to {} id {} contractAddress {} txhash {}", [event.params.from.toHexString(), event.params.to.toHexString(), event.params.id.toString(), event.address.toHexString(), event.transaction.hash.toHexString()]);
  if (event.params.from != zeroAddress) {
    // update farcaster id for to address
    upsertFidForAddress(event.params.to.toHexString(), event.params.id.toString());
    log.info("handleFarcasterIdTransfer from is not zero address hash {}", [event.transaction.hash.toHexString()]);
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

export function handleRenewFname(event: Renew): void {
  log.info("handleRenewFname tokenId {} renewalCost {} expiryTs {} contractAddress {} txhash {}", [event.params.tokenId.toString(), event.transaction.value.toString(), event.params.expiry.toString(), event.address.toHexString(), event.transaction.hash.toHexString()]);
  airstack.social.trackSocialProfileRenewalTransaction(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.transaction.from.toHexString(),
    event.address.toHexString(),
    event.params.tokenId.toString(),
    event.address.toHexString(),
    event.params.expiry,
    event.transaction.value,
  );
}