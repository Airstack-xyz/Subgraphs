import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  AirExtraData,
  AirUser,
  AirProfile,
  AirBlock,
  AirUserRegisteredTransaction,
} from '../../../generated/schema';
import { getOrCreateAirAccount, getOrCreateAirBlock, processChainId, updateAirEntityCounter } from '../common/index';
import { AirProtocolType, AirProtocolActionType, AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER_ID } from './utils';

export namespace social {

  /**
   * @dev this function tracks a air user and profile registered transaction
   * @param blockNumber block number
   * @param blockHash block hash
   * @param blockTimestamp block timestamp
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param fromAddress air transaction from which user token was transferred
   * @param toAddress air transaction to which user token was transferred
   * @param dappUserId dappUserId (eg: farcasterId)
   * @param profileName profile name
   * @param profileExtras extra data (eg: farcaster tokenUri)
   * @param userExtras extra data (eg: farcaster homeUrl and recoveryAddress)
   */
  export function trackUserAndProfileRegisteredTransaction(
    blockNumber: BigInt,
    blockHash: string,
    blockTimestamp: BigInt,
    transactionHash: string,
    logOrCallIndex: BigInt,
    fromAddress: string,
    toAddress: string,
    dappUserId: string,
    profileName: string,
    profileExtras: AirExtraDataClass[],
    userExtras: AirExtraDataClass[],
  ): void {
    let chainId = processChainId();
    // creating air block
    let airBlock = getOrCreateAirBlock(chainId, blockNumber, blockHash, blockTimestamp);
    // creating air user
    let userId = chainId.concat('-').concat(dappUserId);
    let airUser = getOrCreateAirUser(chainId, airBlock, userId, toAddress);
    // create air user extras
    let airUserExtras = new Array<AirExtraData>();
    for (let i = 0; i < userExtras.length; i++) {
      let extra = userExtras[i];
      let extraId = userId.concat("-").concat(extra.name);
      let airUserExtraData = getOrCreateAirExtraData(
        extraId,
        extra.name,
        extra.value,
        userId,
      );
      airUserExtras.push(airUserExtraData);
    }
    // create air profile extras
    let airProfileExtras = new Array<AirExtraData>();
    for (let i = 0; i < profileExtras.length; i++) {
      let extra = profileExtras[i];
      let extraId = userId.concat("-").concat(extra.name);
      let airProfileExtraData = getOrCreateAirExtraData(
        extraId,
        extra.name,
        extra.value,
        userId,
      );
      airProfileExtras.push(airProfileExtraData);
    }
    // get air extra data ids
    let airUserExtraIds = getAirExtraDataEntityIds(airUserExtras);
    let airProfileExtraIds = getAirExtraDataEntityIds(airProfileExtras);
    // create air profile
    let airProfileId = userId.concat("-").concat(profileName);
    let airProfile = createAirProfile(airBlock, airProfileId, airUser.id, profileName, airProfileExtraIds);
    // creating and saving air user registered transaction
    let userRegisteredTxnId = chainId.concat('-').concat(dappUserId).concat('-').concat(toAddress).concat("-").concat(profileName);
    // create air user registered transaction
    createAirUserRegisteredTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      userRegisteredTxnId,
      toAddress,
      airUser.id,
      airProfile.id,
      profileName,
      fromAddress,
      toAddress,
      airUserExtraIds,
    )
  }

  /**
   * @dev this function gets or creates a AirExtraData entity
   * @param id air extra data entity id
   * @param name name of the extra data (eg: tokenUri,homeUrl,recoveryAddress)
   * @param value value of the extra data
   * @param userId user id - air user entity id
   * @returns air extra data entity
   */
  function getOrCreateAirExtraData(
    id: string,
    name: string,
    value: string,
    userId: string,
  ): AirExtraData {
    let entity = AirExtraData.load(id);
    if (entity == null) {
      entity = new AirExtraData(id);
      entity.name = name;
      entity.value = value;
      entity.user = userId;
      entity.save();
    }
    return entity as AirExtraData;
  }

  /**
   * @dev this function does not create any entity, it just returns the air extra data entity ids
   * @param extras air extra data array
   * @returns air extra data entity ids
   */
  function getAirExtraDataEntityIds(
    extras: AirExtraData[],
  ): string[] {
    let entityIds = new Array<string>();
    for (let i = 0; i < extras.length; i++) {
      let extra = extras[i];
      entityIds.push(extra.id);
    }
    return entityIds as string[];
  }

  /**
   * @dev this function gets or creates a AirUser entity
   * @param chainId chain id
   * @param block air block entity
   * @param id air user entity id
   * @param address air user address (owner of the dappUserId)
  */
  function getOrCreateAirUser(
    chainId: string,
    block: AirBlock,
    id: string,
    address: string,
  ): AirUser {
    let entity = AirUser.load(id);
    if (entity == null) {
      entity = new AirUser(id);
      let airAccount = getOrCreateAirAccount(chainId, address, block);
      airAccount.save();
      entity.address = airAccount.id;
      entity.createdAt = block.id;
      entity.save();
    }
    return entity as AirUser;
  }

  /**
   * @dev this function creates a AirProfile entity
   * @param block ethereum block
   * @param id air profile entity id
   * @param userId air user entity id
   * @param name air profile name
   * @param extraIds air extra data entity ids
   * @returns air profile entity
   */
  function createAirProfile(
    block: AirBlock,
    id: string,
    userId: string,
    name: string,
    extraIds: string[],
  ): AirProfile {
    let entity = AirProfile.load(id);
    if (entity == null) {
      entity = new AirProfile(id);
      entity.name = name;
      entity.user = userId;
      if (extraIds.length > 0) entity.extras = extraIds;
      entity.createdAt = block.id;
      entity.save();
    }
    return entity as AirProfile;
  }

  /**
   * @dev this function creates a AirUserRegisteredTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param id air user registered transaction entity id
   * @param address user address (owner of the dappUserId)
   * @param userId air user entity id
   * @param profileId air profile entity id
   * @param name air profile name
   * @param from address from which user token was sent
   * @param to address to which user token was sent
   * @param userExtrasIds air user extra data entity ids
   * @returns air user registered transaction entity
   */
  function createAirUserRegisteredTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    id: string,
    address: string,
    userId: string,
    profileId: string,
    name: string,
    from: string,
    to: string,
    userExtrasIds: string[],
  ): AirUserRegisteredTransaction {
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
      if (userExtrasIds.length > 0) entity.extras = userExtrasIds; //air user extra data entity ids
      entity.from = airAccountFrom.id;
      entity.to = airAccountTo.id;
      entity.logOrCallIndex = logOrCallIndex;
      entity.hash = transactionHash;
      entity.block = block.id;
      entity.index = updateAirEntityCounter(AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER_ID, block);
      entity.protocolType = AirProtocolType.SOCIAL;
      entity.protocolActionType = AirProtocolActionType.REGISTRATION;
      entity.save();
    }
    return entity as AirUserRegisteredTransaction;
  }

  /**
   * @dev this class is used to create air extra data
   * @param name name of the extra data (eg: tokenUri,homeUrl,recoveryAddress)
   * @param value value of the extra data
   */
  export class AirExtraDataClass {
    constructor(
      public name: string,
      public value: string,
    ) { }
  }
}