import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { UserRegAndProfileFarcasterMapping, } from '../generated/schema';

export const FARCASTER_ID_REGISTRY_CONTRACT = Address.fromString('0xda107a1caf36d198b12c16c7b6a1d1c795978c42');
export const FARCASTER_NAME_REGISTRY_CONTRACT = Address.fromString('0xe3be01d99baa8db9905b33a3ca391238234b79d1');

/**
 * @dev this function is used to temporarily store farcaster user registration and profile token transfer data before sending to airstack
 * @param id user and profile mapping id <farcasterId>-<to/ownerAddress>
 * @param farcasterId farcaster id (fid)
 * @param blockNumber block number of user reg txn
 * @param blockTimestamp block timestamp of user reg txn
 * @param blockHash block hash of user reg txn
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
  blockNumber: BigInt | null,
  blockTimestamp: BigInt | null,
  blockHash: string | null,
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
  if (blockNumber) entity.blockNumber = blockNumber;
  if (blockTimestamp) entity.blockTimestamp = blockTimestamp;
  if (blockHash) entity.blockHash = blockHash;
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
  if (!mapping.blockNumber) { return false };
  if (!mapping.blockTimestamp) { return false };
  if (!mapping.blockHash) { return false };
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