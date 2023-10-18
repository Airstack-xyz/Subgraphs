import { ADDRESS_ZERO, integer, ZERO_ADDRESS } from "@protofire/subgraph-toolkit"
import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { DefaultProfileSet, ProfileCreated, ProfileImageURISet, Transfer, ProfileMetadataSet as ProfileMetadataSetV1 } from "../../generated/LensHub/LensHub"
import {  ProfileMetadataSet as ProfileMetadataSetV2 } from "../../generated/LensPeriphery/LensPeriphery"
import * as airstack from "../../modules/airstack/social/social"
import { LENSHUB_ADDRESS, LENSPERIPHERY_ADDRESS } from "../constants"
import { BIG_INT_ZERO, BIGINT_ONE } from "../../modules/airstack/common"
import {
  TransferEntity,
  UserToProfileMap,
  DefaultProfileSet as DefaultProfileSetEntity,
} from "../../generated/schema"
import { createOrUpdateUserToDefaultProfileIdMap, getDefaultProfileIdfromUser } from "./utils"

export function handleProfileCreated(event: ProfileCreated): void {
  let txHash = event.transaction.hash.toHexString()
  let to = event.params.to
  let profileId = event.params.profileId

  let userToProfileMap = UserToProfileMap.load(to.toHexString())
  if (userToProfileMap == null) {
    userToProfileMap = new UserToProfileMap(to.toHexString())
    userToProfileMap.user = to
    userToProfileMap.profile = [profileId]
    userToProfileMap.lensNames = [event.params.handle]
    userToProfileMap.count = BIGINT_ONE
    userToProfileMap.hashes = [txHash]
  } else {
    let profileArr = userToProfileMap.profile
    if (profileArr == null) {
      throw new Error("userToProfileMap profileArr should not be empty")
    } else {
      profileArr.push(profileId)
    }
    userToProfileMap.profile = profileArr
    let lensNameArr = userToProfileMap.lensNames
    if (lensNameArr == null) {
      throw new Error("userToProfileMap lensNameArr should not be empty")
    } else {
      lensNameArr.push(event.params.handle)
    }
    userToProfileMap.lensNames = lensNameArr
    let hashArr = userToProfileMap.hashes
    if (hashArr == null) {
      throw new Error("userToProfileMap hashArr should not be empty")
    } else {
      hashArr.push(txHash)
    }
    userToProfileMap.hashes = hashArr
    userToProfileMap.count = userToProfileMap.count.plus(BIGINT_ONE)
  }
  userToProfileMap.save()
  airstack.social.trackSocialUserAndProfileRegisteredTransaction(
    event.block,
    txHash,
    event.logIndex,
    ADDRESS_ZERO,
    to.toHexString(),
    profileId.toString(),
    LENSHUB_ADDRESS.toHexString(),
    to.toHexString(),
    new Array<airstack.social.AirExtraData>(),
    event.params.handle,
    new Array<airstack.social.AirExtraData>(),
    BIG_INT_ZERO
  )
}


//v2 



// v1 +  v2
export function handleTransfer(event: Transfer): void {

  let txHash = event.transaction.hash
  let transferEntity = TransferEntity.load(event.params.tokenId.toString())
  if (transferEntity == null) {
    transferEntity = new TransferEntity(event.params.tokenId.toString())
    transferEntity.hashes = [txHash.toHexString()]
    transferEntity.fromTo = [
      event.params.from
        .toHexString()
        .concat("-")
        .concat(event.params.to.toHexString()),
    ]
    transferEntity.tokenId = event.params.tokenId
    transferEntity.count = BIGINT_ONE
  } else {
    let hashArr = transferEntity.hashes
    if (hashArr == null) {
      throw new Error("")
    } else {
      hashArr.push(txHash.toHexString())
    }
    transferEntity.hashes = hashArr
    let fromTo = transferEntity.fromTo
    if (fromTo == null) {
      throw new Error("")
    } else {
      fromTo.push(
        event.params.from
          .toHexString()
          .concat("-")
          .concat(event.params.to.toHexString())
      )
    }
    transferEntity.fromTo = fromTo
    transferEntity.count = transferEntity.count.plus(BIGINT_ONE)
  }
  transferEntity.save()
  if (event.params.from.toHexString() != ADDRESS_ZERO) {
    // changing default Profile if this profileId is previous default
    let profileId = getDefaultProfileIdfromUser(event.params.from)
    if (profileId == event.params.tokenId) {
      log.debug("default profile reset ,hash {}", [txHash.toHexString()])
      airstack.social.trackSocialUserDefaultProfileChange(
        event.block,
        txHash.toHexString(),
        event.logIndex,
        event.transaction.from.toHexString(),
        event.address.toHexString(),
        "",
        LENSHUB_ADDRESS.toHexString(),
        event.params.from.toHexString()
      )
      // removing from mapping
      createOrUpdateUserToDefaultProfileIdMap(event.params.from, BIG_INT_ZERO)
    }
    
    airstack.social.trackSocialProfileOwnershipChangeTransaction(
      event.block,
      txHash.toHexString(),
      event.logIndex,
      event.params.from.toHexString(),
      event.params.to.toHexString(),
      event.params.tokenId.toString(),
      LENSHUB_ADDRESS.toHexString(),
      event.params.from.toHexString(),
      event.params.to.toHexString()
    )
  } else {
   //create profile as per V2, Mint from 0x00..00 address is triggered first. 
   //https://dashboard.tenderly.co/tx/polygon-mumbai/0x01a4f0b701152305eda043940bdd0e9947c9e931e7fae39a473a6b865d9af664/logs
   let to = event.params.to.toHexString()
   airstack.social.trackSocialUserAndProfileRegisteredTransaction(
    event.block,
    txHash.toHexString(),
    event.logIndex,
    ADDRESS_ZERO,
    to,
    event.params.tokenId.toString(),
    event.address.toHexString(),
    to,
    new Array<airstack.social.AirExtraData>(),
    "", //lens v2 doesn't have handle 
    new Array<airstack.social.AirExtraData>(),
    BIG_INT_ZERO
  )
  }
}
export function handleDefaultProfileSet(event: DefaultProfileSet): void {
  let txHash = event.transaction.hash
  let defaultProfileSet = DefaultProfileSetEntity.load(
    txHash
      .toHexString()
      .concat("-")
      .concat(event.logIndex.toString())
  )
  if (defaultProfileSet != null) {
    log.error("defaultProfileSet already exists,hash {}", [txHash.toHexString()])
    throw new Error("defaultProfileSet already exists")
  } else {
    defaultProfileSet = new DefaultProfileSetEntity(
      txHash
        .toHexString()
        .concat("-")
        .concat(event.logIndex.toString())
    )
    defaultProfileSet.wallet = event.params.wallet
    defaultProfileSet.hash = txHash.toHexString()
    defaultProfileSet.profileId = event.params.profileId
  }
  defaultProfileSet.save()
  createOrUpdateUserToDefaultProfileIdMap(event.params.wallet, event.params.profileId)
  airstack.social.trackSocialUserDefaultProfileChange(
    event.block,
    txHash.toHexString(),
    event.logIndex,
    event.transaction.from.toHexString(),
    event.address.toHexString(),
    event.params.profileId.toString(),
    LENSHUB_ADDRESS.toHexString(),
    event.params.wallet.toHexString()
  )
}

export function handleProfileImageURISet(event: ProfileImageURISet): void {
  airstack.social.trackSocialProfileImageURITransaction(
    event.block,
    event.address.toHexString(),
    event.params.profileId.toString(),
    event.params.imageURI,
  )
}

export function handleProfileMetadataSetV2(event: ProfileMetadataSetV2): void {
  airstack.social.trackSocialProfileMetadataURITransaction(
    event.block,
    event.address.toHexString(),
    event.params.profileId.toString(),
    event.params.metadata,
  )
}

export function handleProfileMetadataSetV1(event: ProfileMetadataSetV1): void {
  airstack.social.trackSocialProfileMetadataURITransaction(
    event.block,
    LENSHUB_ADDRESS.toHexString(),
    event.params.profileId.toString(),
    event.params.metadata,
  )
}