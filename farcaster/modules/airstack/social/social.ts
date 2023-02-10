import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  AirExtra,
  AirUser,
  AirProfile,
  AirBlock,
  AirUserRegisteredTransaction,
} from '../../../generated/schema';
import { getOrCreateAirAccount, getOrCreateAirBlock, getChainId, updateAirEntityCounter, getOrCreateAirToken, createAirExtra } from '../common/index';
import { AirProtocolType, AirProtocolActionType, AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER_ID } from './utils';

export namespace social {

  /**
   * @dev this function tracks a air user and profile registered transaction
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param fromAddress air transaction from which user token was transferred
   * @param toAddress air transaction to which user token was transferred
   * @param tokenId tokenId of the profile token that was transferred - ERC721
   * @param tokenAddress token address of the profile token that was transferred - ERC721
   * @param dappUserId dappUserId (eg: farcasterId)
   * @param profileName profile name
   * @param profileExtras extra data (eg: farcaster tokenUri)
   * @param userExtras extra data (eg: farcaster homeUrl and recoveryAddress)
   */
  export function trackUserAndProfileRegisteredTransaction(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    fromAddress: string,
    toAddress: string,
    tokenId: string,
    tokenAddress: string,
    dappUserId: string,
    profileName: string,
    profileExtras: AirExtraData[],
    userExtras: AirExtraData[],
  ): void {
    let chainId = getChainId();
    // creating air block
    let airBlock = getOrCreateAirBlock(chainId, block.number, block.hash.toHexString(), block.timestamp);
    airBlock.save();
    // creating air user
    let userId = chainId.concat('-').concat(dappUserId);
    // create air user extras
    let airUserExtras = new Array<AirExtra>();
    for (let i = 0; i < userExtras.length; i++) {
      let extra = userExtras[i];
      let extraId = userId.concat("-").concat(extra.name);
      let airUserExtraData = createAirExtra(
        extra.name,
        extra.value,
        extraId,
      );
      airUserExtraData.save();
      airUserExtras.push(airUserExtraData);
    }
    // create air profile extras
    let airProfileExtras = new Array<AirExtra>();
    for (let i = 0; i < profileExtras.length; i++) {
      let extra = profileExtras[i];
      let extraId = userId.concat("-").concat(extra.name);
      let airProfileExtraData = createAirExtra(
        extra.name,
        extra.value,
        extraId,
      );
      airProfileExtraData.save();
      airProfileExtras.push(airProfileExtraData);
    }
    // get air extra data ids
    let airUserExtraIds = getAirExtraDataEntityIds(airUserExtras);
    let airProfileExtraIds = getAirExtraDataEntityIds(airProfileExtras);
    // create air user
    let airUser = getOrCreateAirUser(chainId, airBlock, dappUserId, toAddress, airUserExtraIds);
    airUser.save();
    // create air profile
    let airProfile = createAirProfile(airBlock, chainId, airUser.id, profileName, tokenId, tokenAddress, airProfileExtraIds);
    airProfile.save();
    // create air user registered transaction
    let airUserRegisteredTransaction = createAirUserRegisteredTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      toAddress,
      airUser.id,
      airProfile.id,
      profileName,
      fromAddress,
      toAddress,
      tokenId,
      tokenAddress,
      airUserExtraIds,
      airProfileExtraIds,
    );
    airUserRegisteredTransaction.save();
  }

  /**
   * @dev this function does not create any entity, it just returns the air extra data entity ids
   * @param extras air extra data array
   * @returns air extra data entity ids
   */
  function getAirExtraDataEntityIds(
    extras: AirExtra[],
  ): string[] {
    let entityIds = new Array<string>();
    for (let i = 0; i < extras.length; i++) {
      let extra = extras[i];
      entityIds.push(extra.id);
    }
    return entityIds as string[];
  }

  /**
   * @dev this function does not save the returned entity
   * @dev this function gets or creates a AirUser entity
   * @param chainId chain id
   * @param block air block entity
   * @param dappUserId dapp user id
   * @param address air user address (owner of the dappUserId)
  */
  function getOrCreateAirUser(
    chainId: string,
    block: AirBlock,
    dappUserId: string,
    address: string,
    extras: string[]
  ): AirUser {
    let id = chainId.concat('-').concat(dappUserId);
    let entity = AirUser.load(id);
    if (entity == null) {
      entity = new AirUser(id);
      let airAccount = getOrCreateAirAccount(chainId, address, block);
      airAccount.save();
      entity.address = airAccount.id;
      entity.createdAt = block.id;
      if (extras.length > 0) entity.extras = extras;
      entity.lastUpdatedAt = block.id;
    }
    return entity as AirUser;
  }

  /**
   * @dev this function does not save the returned entity
   * @dev this function creates a AirProfile entity
   * @param block ethereum block
   * @param chainId chain id
   * @param userId air user id
   * @param name air profile name
   * @param tokenId air profile token id
   * @param tokenAddress air profile token address
   * @param extraIds air extra data entity ids
   * @returns air profile entity
   */
  function createAirProfile(
    block: AirBlock,
    chainId: string,
    userId: string,
    name: string,
    tokenId: string,
    tokenAddress: string,
    extraIds: string[],
  ): AirProfile {
    let id = userId.concat("-").concat(tokenAddress).concat("-").concat(tokenId);
    let entity = AirProfile.load(id);
    if (entity == null) {
      entity = new AirProfile(id);
      entity.name = name;
      entity.user = userId;
      entity.tokenId = tokenId;
      let airToken = getOrCreateAirToken(chainId, tokenAddress);
      airToken.save();
      entity.tokenAddress = airToken.id;
      if (extraIds.length > 0) entity.extras = extraIds;
      entity.createdAt = block.id;
      entity.lastUpdatedAt = block.id;
    }
    return entity as AirProfile;
  }

  /**
   * @dev this function does not save the returned entity
   * @dev this function creates a AirUserRegisteredTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param address user address (owner of the dappUserId)
   * @param userId air user entity id
   * @param profileId air profile entity id
   * @param name air profile name
   * @param from address from which user token was sent
   * @param to address to which user token was sent
   * @param tokenId token id of the user token
   * @param tokenAddress token address of the user token
   * @param userExtrasIds air user extra data entity ids
   * @param profileExtraIds air profile extra data entity ids
   * @returns air user registered transaction entity
   */
  function createAirUserRegisteredTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    address: string,
    userId: string,
    profileId: string,
    name: string,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    userExtrasIds: string[],
    profileExtraIds: string[],
  ): AirUserRegisteredTransaction {
    let id = userId.concat('-').concat(transactionHash).concat('-').concat(tokenAddress).concat('-').concat(tokenId);
    let entity = AirUserRegisteredTransaction.load(id);
    if (entity == null) {
      entity = new AirUserRegisteredTransaction(id);
      let airAccount = getOrCreateAirAccount(chainId, address, block);
      airAccount.save();
      let airAccountFrom = getOrCreateAirAccount(chainId, from, block);
      airAccountFrom.save();
      let airAccountTo = getOrCreateAirAccount(chainId, to, block);
      airAccountTo.save();
      entity.address = airAccount.id; //dappUserId owner address
      entity.user = userId;
      entity.profile = profileId;
      entity.name = name;
      if (userExtrasIds.length > 0 || profileExtraIds.length > 0) entity.extras = userExtrasIds.concat(profileExtraIds); //air user extra data entity ids
      entity.from = airAccountFrom.id;
      entity.to = airAccountTo.id;
      entity.tokenId = tokenId;
      let airToken = getOrCreateAirToken(chainId, tokenAddress);
      entity.tokenAddress = airToken.id;
      entity.logOrCallIndex = logOrCallIndex;
      entity.transactionHash = transactionHash;
      entity.block = block.id;
      entity.index = updateAirEntityCounter(AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER_ID, block);
      entity.protocolType = AirProtocolType.SOCIAL;
      entity.protocolActionType = AirProtocolActionType.REGISTRATION;
    }
    return entity as AirUserRegisteredTransaction;
  }

  /**
   * @dev this class is used to create air extra data
   * @param name name of the extra data (eg: tokenUri,homeUrl,recoveryAddress)
   * @param value value of the extra data
   */
  export class AirExtraData {
    constructor(
      public name: string,
      public value: string,
    ) { }
  }
}