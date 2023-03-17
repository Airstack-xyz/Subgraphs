import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts';
import { UserRegAndProfileFarcasterMapping } from '../generated/schema';
import { FarcasterNameRegistry, Renew, ChangeRecoveryAddress, Invite, BidCall } from '../generated/FarcasterNameRegistry/FarcasterNameRegistry';
import { FarcasterIdRegistry } from '../generated/FarcasterNameRegistry/FarcasterIdRegistry';
import { getChainId, getOrCreateAirBlock, updateAirEntityCounter } from '../modules/airstack/common';

export const FARCASTER_ID_REGISTRY_CONTRACT = Address.fromString('0xda107a1caf36d198b12c16c7b6a1d1c795978c42');
export const FARCASTER_NAME_REGISTRY_CONTRACT = Address.fromString('0xe3be01d99baa8db9905b33a3ca391238234b79d1');
export const zeroAddress = Address.fromString("0x0000000000000000000000000000000000000000");

/**
 * @dev this function is used to temporarily store farcaster user registration and profile token transfer data before sending to airstack
 * @param id user and profile mapping id <farcasterId>-<to/ownerAddress>
 * @param farcasterId farcaster id (fid)
 * @param transactionHash transaction hash of user reg txn
 * @param logOrCallIndex log index of user reg txn
 * @param fromAddress from address of token transfer txn
 * @param toAddress to address of token transfer txn, to address of user reg txn
 * @param tokenUri token uri of profile
 * @param homeUrl home url of farcasterId
 * @param recoveryAddress recovery address of farcasterId
 * @param farcasterProfileName farcaster profile name
 * @param tokenId farcaster profile token id
 * @returns UserRegAndProfileFarcasterMapping entity
 */
export function createOrUpdateUserRegAndProfileFarcasterMapping(
  id: string,
  farcasterId: string,
  transactionHash: string | null,
  logOrCallIndex: BigInt | null,
  fromAddress: string | null,
  toAddress: string,
  tokenUri: string | null,
  homeUrl: string | null,
  recoveryAddress: string | null,
  farcasterProfileName: string | null,
  tokenId: string | null,
): UserRegAndProfileFarcasterMapping {
  let entity = UserRegAndProfileFarcasterMapping.load(id);
  if (entity == null) {
    entity = new UserRegAndProfileFarcasterMapping(id);
  }
  if (transactionHash) entity.transactionHash = transactionHash;
  if (logOrCallIndex) entity.logOrCallIndex = logOrCallIndex;
  if (fromAddress) entity.fromAddress = fromAddress;
  if (toAddress) entity.toAddress = toAddress;
  if (farcasterProfileName) entity.farcasterProfileName = farcasterProfileName;
  if (farcasterId) entity.farcasterId = farcasterId;
  if (tokenUri) entity.tokenUri = tokenUri;
  if (homeUrl) entity.homeUrl = homeUrl;
  if (recoveryAddress) entity.recoveryAddress = recoveryAddress;
  if (tokenId) entity.tokenId = tokenId;
  entity.save();
  return entity as UserRegAndProfileFarcasterMapping;
}

/**
 * @dev this function is called to validate a farcaster mapping before sending to airstack
 * @param mapping user reg and profile farcaster mapping
 * @returns true if all fields are not null - so that we can send to airstack
 */
export function validateFarcasterMapping(
  mapping: UserRegAndProfileFarcasterMapping
): boolean {
  if (!mapping.transactionHash) { return false };
  if (!mapping.logOrCallIndex) { return false };
  if (!mapping.fromAddress) { return false };
  if (!mapping.toAddress) { return false };
  if (!mapping.tokenUri) { return false };
  if (!mapping.homeUrl) { return false };
  if (!mapping.recoveryAddress) { return false };
  if (!mapping.farcasterProfileName) { return false };
  if (!mapping.tokenId) { return false };
  return true;
}

// debug functions
// export function createProfileTokenTransfer(
//   tokenId: BigInt,
//   profileName: string,
//   transactionHash: string,
//   logOrCallIndex: BigInt,
//   fromAddress: string,
//   toAddress: string,
//   contractAddress: Address,
//   block: ethereum.Block,
// ): void {
//   // create profile token transfer
//   const id = tokenId.toString().concat("-").concat(toAddress).concat("-").concat(transactionHash).concat("-").concat(logOrCallIndex.toString());
//   let profileTokenTransfer = new ProfileTokenTransfer(id);
//   profileTokenTransfer.tokenId = tokenId.toString();
//   profileTokenTransfer.profileName = profileName;
//   profileTokenTransfer.transactionHash = transactionHash;
//   profileTokenTransfer.fromAddress = fromAddress;
//   profileTokenTransfer.toAddress = toAddress;
//   profileTokenTransfer.createdAtBlock = block.number;
//   // call contract ownerOf and get owner by tokenId
//   let nameRegistryContract = FarcasterNameRegistry.bind(contractAddress);
//   let owner = nameRegistryContract.try_ownerOf(tokenId);
//   if (!owner.reverted) {
//     profileTokenTransfer.ownerByContract = owner.value.toHexString();
//   }
//   const airBlock = getOrCreateAirBlock(getChainId(), block.number, block.hash.toHexString(), block.timestamp);
//   airBlock.save();
//   profileTokenTransfer.index = updateAirEntityCounter("PROFILE_TOKEN_TRANSFER", airBlock);
//   profileTokenTransfer.save();
// }

// export function createUserTokenTransfer(
//   tokenId: BigInt,
//   transactionHash: string,
//   logOrCallIndex: BigInt,
//   fromAddress: string,
//   toAddress: string,
//   contractAddress: Address,
//   block: ethereum.Block,
// ): void {
//   // create fid token transfer
//   const id = tokenId.toString().concat("-").concat(toAddress).concat("-").concat(transactionHash).concat("-").concat(logOrCallIndex.toString());
//   let userTokenTransfer = new UserTokenTransfer(id);
//   userTokenTransfer.farcasterId = tokenId.toString();
//   userTokenTransfer.transactionHash = transactionHash;
//   userTokenTransfer.fromAddress = fromAddress;
//   userTokenTransfer.toAddress = toAddress;
//   userTokenTransfer.createdAtBlock = block.number;
//   const airBlock = getOrCreateAirBlock(getChainId(), block.number, block.hash.toHexString(), block.timestamp);
//   airBlock.save();
//   userTokenTransfer.index = updateAirEntityCounter("USER_TOKEN_TRANSFER", airBlock);
//   // call contract ownerOf and get owner by tokenId
//   let idRegistryContract = FarcasterIdRegistry.bind(contractAddress);
//   let idOfOwner = idRegistryContract.try_idOf(Address.fromString(toAddress));
//   if (!idOfOwner.reverted && idOfOwner.value.equals(tokenId)) {
//     userTokenTransfer.ownerByContract = toAddress;
//   }
//   userTokenTransfer.save();
// }

// export function createRecoveryAddressFname(event: ChangeRecoveryAddress): void {
//   log.info("createRecoveryAddressFname: tokenId {} txhash {}", [event.params.tokenId.toString(), event.transaction.hash.toHexString()]);
//   const id = event.params.tokenId.toString().concat("-").concat(event.params.recovery.toHexString());
//   let recoveryAddressFname = new RecoveryAddressFname(id);
//   recoveryAddressFname.tokenId = event.params.tokenId;
//   recoveryAddressFname.recoveryAddress = event.params.recovery.toHexString();
//   recoveryAddressFname.transactionHash = event.transaction.hash.toHexString();
//   const farcasterName = Bytes.fromHexString(event.params.tokenId.toHexString()).toString();
//   recoveryAddressFname.fname = farcasterName;
//   const airBlock = getOrCreateAirBlock(getChainId(), event.block.number, event.block.hash.toHexString(), event.block.timestamp);
//   airBlock.save();
//   recoveryAddressFname.index = updateAirEntityCounter("RECOVERY_ADDRESS_FNAME", airBlock);
//   recoveryAddressFname.save();
// }

// export function createRenewFname(event: Renew): void {
//   log.info("createRenewFname: tokenId {} txhash {}", [event.params.tokenId.toString(), event.transaction.hash.toHexString()]);
//   const id = event.params.tokenId.toString().concat("-").concat(event.params.expiry.toHexString());
//   let renewFname = new RenewFname(id);
//   renewFname.tokenId = event.params.tokenId;
//   renewFname.expiryTimestamp = event.params.expiry;
//   renewFname.transactionHash = event.transaction.hash.toHexString();
//   renewFname.renewalCost = event.transaction.value;
//   const airBlock = getOrCreateAirBlock(getChainId(), event.block.number, event.block.hash.toHexString(), event.block.timestamp);
//   airBlock.save();
//   renewFname.index = updateAirEntityCounter("RENEW_FNAME", airBlock);
//   renewFname.save();
// }

// export function createFnameInvite(event: Invite): void {
//   log.info("createFnameInvite: inviterId {} inviteeId {} fname {} txhash {}", [event.params.inviterId.toString(), event.params.inviteeId.toHexString(), event.params.fname.toString(), event.transaction.hash.toHexString()]);
//   const id = event.params.inviterId.toString().concat("-").concat(event.params.inviteeId.toHexString()).concat("-").concat(event.params.fname.toString());
//   let fnameInvite = new FnameInvite(id);
//   // fnameInvite.tokenId = event.params.tokenId;
//   fnameInvite.inviterFid = event.params.inviterId.toHexString();
//   fnameInvite.inviteeFid = event.params.inviteeId.toHexString();
//   fnameInvite.inviteeFname = event.params.fname.toString();
//   fnameInvite.transactionHash = event.transaction.hash.toHexString();
//   const airBlock = getOrCreateAirBlock(getChainId(), event.block.number, event.block.hash.toHexString(), event.block.timestamp);
//   airBlock.save();
//   fnameInvite.index = updateAirEntityCounter("FNAME_INVITE", airBlock);
//   fnameInvite.save();
// }

// export function createFnameBid(call: BidCall): void {
//   log.info("createFnameBid: tokenId {} to {} recovery {} txhash {}", [call.inputs.tokenId.toString(), call.inputs.to.toHexString(), call.inputs.recovery.toHexString(), call.transaction.hash.toHexString()]);
//   const id = call.inputs.tokenId.toString().concat("-").concat(call.inputs.to.toHexString()).concat("-").concat(call.transaction.value.toString());
//   let fnameBid = new FnameBid(id);
//   const farcasterName = Bytes.fromHexString(call.inputs.tokenId.toHexString()).toString();
//   fnameBid.fname = farcasterName;
//   fnameBid.fnameTokenId = call.inputs.tokenId;
//   fnameBid.newOwner = call.inputs.to.toHexString();
//   fnameBid.bidder = call.from.toHexString();
//   fnameBid.bidAmount = call.transaction.value;
//   fnameBid.recoveryAddress = call.inputs.recovery.toHexString();
//   let nameRegistryContract = FarcasterNameRegistry.bind(FARCASTER_NAME_REGISTRY_CONTRACT);
//   let expiryTs = nameRegistryContract.try_expiryOf(call.inputs.tokenId);
//   if (!expiryTs.reverted) {
//     fnameBid.expiryTimestamp = expiryTs.value;
//   }
//   fnameBid.expiryTimestamp = expiryTs.value;
//   fnameBid.transactionHash = call.transaction.hash.toHexString();
//   const airBlock = getOrCreateAirBlock(getChainId(), call.block.number, call.block.hash.toHexString(), call.block.timestamp);
//   airBlock.save();
//   fnameBid.index = updateAirEntityCounter("FNAME_BID", airBlock);
//   fnameBid.save();
// }

export function getExpiryTimestampFromFnameRegistry(tokenId: BigInt): BigInt {
  let nameRegistryContract = FarcasterNameRegistry.bind(FARCASTER_NAME_REGISTRY_CONTRACT);
  let expiryTs = nameRegistryContract.try_expiryOf(tokenId);
  if (!expiryTs.reverted) {
    return expiryTs.value;
  }
  return BigInt.fromI32(0);
}