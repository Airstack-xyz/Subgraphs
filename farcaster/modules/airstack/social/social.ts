import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  AirExtraData,
  AirUser,
  AirProfile,
  AirBlock,
  AirUserRegisteredTransaction,
} from '../../../generated/schema';
import { EMPTY_STRING, getOrCreateAirAccount, getOrCreateAirBlock, processChainId, updateAirEntityCounter } from '../common/index';
import { AirProtocolType, AirProtocolActionType, AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER } from './utils';

export namespace social {
  export function trackAirProfileTransferTransaction(
    block: ethereum.Block,
    fromAddress: string, //not sure if this is supposed to be used in current schema
    userAddress: string,
    dappUserId: string,
    profileName: string,
    extras: AirExtraDataClass[],
  ): void {
    let chainId = processChainId();
    // creating air block
    let airBlock = getOrCreateAirBlock(chainId, block.number, block.hash.toHexString(), block.timestamp);
    // creating air user
    let userId = chainId.concat('-').concat(dappUserId);
    let airUser = getOrCreateAirUser(chainId, airBlock, userId, userAddress);
    // create air profile id for the transfered name
    let profileId = userId.concat(profileName);
    // create air extras
    let airExtras = new Array<AirExtraData>();
    for (let i = 0; i < extras.length; i++) {
      let extra = extras[i];
      let extraId = userId.concat("-").concat(extra.name);
      let airExtraData = getOrCreateAirExtraData(
        extraId,
        extra.name,
        extra.value,
        userId,
      );
      airExtras.push(airExtraData);
    }
    let airExtraIds = getAirExtraDataEntityIds(airExtras);
    // create air profile for the transfered name
    createAirProfile(airBlock, profileId, airUser.id, profileName, airExtraIds);
    // update txn profile name - not sure if this is a good idea, as name is not part of the user registered txn
    let airUserRegisteredTxnId = chainId.concat('-').concat(dappUserId).concat('-').concat(userAddress);
    let airUserRegisteredTxn = AirUserRegisteredTransaction.load(airUserRegisteredTxnId);
    if (airUserRegisteredTxn != null) {
      airUserRegisteredTxn.name = profileName;
      airUserRegisteredTxn.save();
    }
  };

  export function trackUserRegisteredTransaction(
    block: ethereum.Block,
    userAddress: string,
    contractAddress: string,
    dappUserId: string,
    extras: AirExtraDataClass[],
    logOrCallIndex: BigInt,
    transactionHash: string,
  ): void {
    let chainId = processChainId();
    // creating air block
    let airBlock = getOrCreateAirBlock(chainId, block.number, block.hash.toHexString(), block.timestamp);
    // creating air user
    let userId = chainId.concat('-').concat(dappUserId);
    let airUser = getOrCreateAirUser(chainId, airBlock, userId, userAddress);
    // create air extras
    let airExtras = new Array<AirExtraData>();
    for (let i = 0; i < extras.length; i++) {
      let extra = extras[i];
      let extraId = userId.concat("-").concat(extra.name);
      let airExtraData = getOrCreateAirExtraData(
        extraId,
        extra.name,
        extra.value,
        userId,
      );
      airExtras.push(airExtraData);
    }
    let airExtraIds = getAirExtraDataEntityIds(airExtras);
    // creating and saving air user registered transaction
    let userRegisteredTxnId = chainId.concat('-').concat(dappUserId).concat('-').concat(userAddress);
    // .concat(transactionHash).concat("-").concat(logOrCallIndex.toString());
    let airUserRegisteredTxn = createAirUserRegisteredTransaction(
      chainId,
      airBlock,
      userRegisteredTxnId,
      userAddress,
      airUser.id,
      userAddress,
      contractAddress,
      logOrCallIndex,
      transactionHash,
      airExtraIds,
    )
    airUserRegisteredTxn.save();
  }

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
      entity.extras = extraIds;
      entity.createdAt = block.id;
      entity.save();
    }
    return entity as AirProfile;
  }

  function createAirUserRegisteredTransaction(
    chainId: string,
    block: AirBlock,
    id: string,
    address: string,
    userId: string,
    from: string,
    to: string,
    logOrCallIndex: BigInt,
    transactionHash: string,
    extras: string[],
  ): AirUserRegisteredTransaction {
    let entity = AirUserRegisteredTransaction.load(id);
    if (entity == null) {
      entity = new AirUserRegisteredTransaction(id);
      let airAccount = getOrCreateAirAccount(chainId, address, block);
      airAccount.save();
      entity.address = airAccount.id; //user address
      entity.user = userId;
      // entity.name = name;
      entity.extras = extras;
      let airAccountFrom = getOrCreateAirAccount(chainId, from, block);
      airAccountFrom.save();
      let airAccountTo = getOrCreateAirAccount(chainId, to, block);
      airAccountTo.save();
      entity.from = airAccountFrom.id;
      entity.to = airAccountTo.id;
      entity.logOrCallIndex = logOrCallIndex;
      entity.hash = transactionHash;
      entity.block = block.id;
      entity.index = updateAirEntityCounter(AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER, block);
      entity.protocolType = AirProtocolType.SOCIAL;
      entity.protocolActionType = AirProtocolActionType.REGISTRATION;
      // store name outside this function and save it there
    }
    return entity as AirUserRegisteredTransaction;
  }

  export class AirExtraDataClass {
    constructor(
      public name: string,
      public value: string,
    ) { }
  }
}