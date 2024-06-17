import { BigInt, ethereum, log } from "@graphprotocol/graph-ts"
import {
  AirExtra,
  AirSocialUser,
  AirSocialProfile,
  AirBlock,
  AirSocialUserRegisteredTransaction,
  AirSocialProfileOwnershipChangeTransaction,
  AirSocialUserOwnershipChangeTransaction,
  AirSocialProfileRecoveryAddressChangeTransaction,
  AirSocialUserRecoveryAddressChangeTransaction,
  AirSocialUserHomeUrlChangeTransaction,
  AirSocialProfileRenewalTransaction,
  AirSocialUserDefaultProfileChangeTransaction,
  AirSocialProfileHandle,
} from "../../../generated/schema"
import {
  getOrCreateAirAccount,
  getOrCreateAirBlock,
  getChainId,
  updateAirEntityCounter,
  getOrCreateAirToken,
  EMPTY_STRING,
} from "../common/index"
import {
  zeroAddress,
  AirProtocolType,
  AirProtocolActionType,
  AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER_ID,
  createSocialUserEntityId,
  createAirExtra,
  AIR_PROFILE_OWNERSHIP_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
  AIR_USER_OWNERSHIP_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
  AIR_PROFILE_RECOVERY_ADDRESS_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
  profileRecoveryAddress,
  userRecoveryAddress,
  AIR_USER_RECOVERY_ADDRESS_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
  AIR_USER_HOME_URL_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
  userHomeUrl,
  AIR_PROFILE_NAME_RENEWAL_TRANSACTION_ENTITY_COUNTER_ID,
  AIR_SOCIAL_USER_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID,
  AIR_SOCIAL_PROFILE_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID,
  AIR_USER_DEFAULT_PROFILE_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
  AIR_SOCIAL_PROFILE_HANDLE_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID,
} from "./utils"
import { ZERO_ADDRESS } from "@protofire/subgraph-toolkit"

export namespace social {
  // start of track functions

  /**
   * @dev this function tracks a air social user and profile registered transaction
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from erc721 profile token sender address
   * @param to erc721 profile token receiver address
   * @param tokenId erc721 profile token id
   * @param tokenAddress erc721 profile token address
   * @param socialUserId dapp user id (eg: farcasterId)
   * @param userExtras air extra data array (eg: farcaster homeUrl and recoveryAddress)
   * @param profileName air social profile name (eg: farcaster profile name)
   * @param profileExtras air extra data array (eg: farcaster profile tokenUri)
   * @param profileExpiryTimestamp air social profile expiry timestamp
   */
  export function trackSocialUserAndProfileRegisteredTransaction(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    socialUserId: string,
    userExtras: AirExtraData[],
    profileName: string,
    profileExtras: AirExtraData[],
    profileExpiryTimestamp: BigInt
  ): void {
    const chainId = getChainId()
    // creating air block
    const airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save()
    // creating air social user
    const userId = createSocialUserEntityId(chainId, socialUserId)
    // create air social user extras
    let airSocialUserExtraIds = new Array<string>()
    for (let i = 0; i < userExtras.length; i++) {
      const extra = userExtras[i]
      const airSocialUserExtraData = createAirExtra(extra.name, extra.value, userId)
      airSocialUserExtraIds.push(airSocialUserExtraData.id)
    }
    // create air social profile extras
    let airSocialProfileExtraIds = new Array<string>()
    const socialProfileEntityId = chainId
      .concat("-")
      .concat(tokenAddress)
      .concat("-")
      .concat(tokenId)
    for (let i = 0; i < profileExtras.length; i++) {
      const extra = profileExtras[i]
      const airSocialProfileExtraData = createAirExtra(
        extra.name,
        extra.value,
        socialProfileEntityId
      )
      airSocialProfileExtraIds.push(airSocialProfileExtraData.id)
    }
    // create air social user
    const airSocialUser = createAirSocialUser(
      chainId,
      airBlock,
      socialUserId,
      to,
      airSocialUserExtraIds
    )
    // create air social profile
    const airSocialProfile = createAirSocialProfile(
      airBlock,
      chainId,
      airSocialUser.id,
      profileName,
      tokenId,
      tokenAddress,
      airSocialProfileExtraIds,
      profileExpiryTimestamp
    )
    let userProfiles = airSocialUser.profiles
    if (userProfiles == null) {
      userProfiles = []
    }
    userProfiles.push(airSocialProfile.id)

    airSocialUser.profiles = userProfiles
    airSocialUser.save()
    // create air social user registered transaction
    createAirSocialUserRegisteredTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      to,
      airSocialUser,
      airSocialProfile,
      profileName,
      from,
      to,
      tokenId,
      tokenAddress,
      airSocialUserExtraIds,
      airSocialProfileExtraIds,
      profileExpiryTimestamp
    )
  }

  /**
   * @dev this function tracks a air social profile ownership change transaction
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from erc721 token sender addres
   * @param to erc721 token receiver address
   * @param tokenId erc721 token id
   * @param tokenAddress erc721 token address
   * @param oldSocialUserId old social user id (eg: farcasterId of from address)
   * @param newSocialUserId new social user id (eg: farcasterId of to address)
   */
  export function trackSocialProfileOwnershipChangeTransaction(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    oldSocialUserId: string,
    newSocialUserId: string
  ): void {
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save()
    const airSocialProfile = getAirSocialProfile(chainId, tokenAddress, tokenId)
    if (airSocialProfile == null) {
      throw new Error("air social profile not found")
    }
    const airSocialUser = createAirSocialUser(
      chainId,
      airBlock,
      newSocialUserId,
      to,
      new Array<string>()
    )
    airSocialProfile.user = airSocialUser.id
    // airSocialProfile.lastUpdatedAt = airBlock.id
    saveAirSocialProfile(airSocialProfile, airBlock)
    // removing profile (tokenId) from -  from user
    const airSocialUserOld = getAirSocialUser(chainId, oldSocialUserId)
    if (airSocialUserOld == null) {
      log.debug("air social user old not found, socialUserId {}, from {}, hash {}", [
        oldSocialUserId,
        from,
        transactionHash,
      ])
      throw new Error("air social user old not found")
    }
    let fromOldProfiles: string[] = []
    for (let i = 0; i < airSocialUserOld.profiles!.length; i++) {
      const profileId = airSocialUserOld.profiles![i]
      if (airSocialProfile.id == profileId) {
        continue
      }
      fromOldProfiles.push(profileId)
    }
    airSocialUserOld.profiles = fromOldProfiles
    saveAirSocialUser(airSocialUserOld, airBlock)

    // adding profile (tokenid) to - to user
    let toProfiles = airSocialUser.profiles
    if (toProfiles == null) {
      toProfiles = []
    }
    toProfiles.push(airSocialProfile.id)
    airSocialUser.profiles = toProfiles
    saveAirSocialUser(airSocialUser, airBlock)
    createAirSocialProfileOwnershipChangeTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      from,
      to,
      tokenId,
      tokenAddress,
      airSocialProfile
    )
  }
  /**
   * @dev this function tracks when user changes defaultProfile
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from intiator of the transaction
   * @param to protocol contract
   * @param tokenId erc721 token id,empty string if you've to remove defaultProfile
   * @param tokenAddress erc721 token address
   * @param socialUserId social user id (eg: farcasterId)
   */
  export function trackSocialUserDefaultProfileChange(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    socialUserId: string
  ): void {
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save()
    let newDefaultProfile: AirSocialProfile | null = null
    if (tokenId != "") {
      newDefaultProfile = getAirSocialProfile(chainId, tokenAddress, tokenId)
      if (newDefaultProfile == null) {
        log.error("air social profile not found,txHash {} tokenId {}", [transactionHash, tokenId])
        throw new Error("air social profile not found")
      }
    }
    let newDefaultProfileId = newDefaultProfile == null ? "" : newDefaultProfile.id
    const airSocialUser = getAirSocialUser(chainId, socialUserId)
    if (airSocialUser == null) {
      log.error("air social profile not found,txHash {} tokenId {}", [transactionHash, tokenId])
      throw new Error("air social user not found")
    }

    let currDefaultProfileId =
      airSocialUser.defaultProfile != null ? airSocialUser.defaultProfile! : ""

    airSocialUser.defaultProfile = newDefaultProfile != null ? newDefaultProfile.id : null
    // change isDefault flag
    if (airSocialUser.profiles == null) {
      log.error(
        "airSocialUser without profiles not expected in trackSocialUserDefaultProfileChange,txHash {}",
        [transactionHash]
      )
      throw new Error(
        "airSocialUser without profiles not expected in trackSocialUserDefaultProfileChange"
      )
    }
    for (let i = 0; i < airSocialUser.profiles!.length; i++) {
      const profId = airSocialUser.profiles![i]
      let profile = AirSocialProfile.load(profId)
      if (profile == null) {
        log.error("profile nil not expected in trackSocialUserDefaultProfileChange", [])
        throw new Error("profile nil not expected in trackSocialUserDefaultProfileChange")
      }
      if (newDefaultProfile != null && profId == newDefaultProfile.id) {
        profile.isDefault = true
        saveAirSocialProfile(profile, airBlock)
      } else if (profile.isDefault) {
        profile.isDefault = false
        saveAirSocialProfile(profile, airBlock)
      }
    }
    saveAirSocialUser(airSocialUser, airBlock)
    createAirSocialUserDefaultProfileChangeTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      from,
      to,
      airSocialUser,
      newDefaultProfileId,
      currDefaultProfileId
    )
  }
  /**
 * @dev This function updates the Profile MetadataURI
 * @param block EVM block at which transaction happend
 * @param profileTokenAddress  Profile NFT Token Address
 * @param profileTokenId Profile NFT TokenId
 * @param metadataURI Profile Metadata URI
 */
 export function trackSocialProfileMetadataURITransaction(
  block: ethereum.Block,
  profileTokenAddress: string,
  profileTokenId: string,
  metadataURI: string,
 ):void {

  const chainId = getChainId()
  const profileId = getProfileId(chainId, profileTokenAddress, profileTokenId);

  const profile = AirSocialProfile.load(profileId);

  if(profile == null) {
    throw new Error("air social profile not found")
  }

  const airBlock = getOrCreateAirBlock(
    chainId,
    block.number,
    block.hash.toHexString(),
    block.timestamp
  )
  airBlock.save();

  profile.metadataURI = metadataURI;

  saveAirSocialProfile(profile, airBlock);
 }


   /**
 * @dev This function updates the Profile ImageURI
 * @param block EVM block at which transaction happend
 * @param profileTokenAddress  Profile NFT Token Address
 * @param profileTokenId Profile NFT TokenId
 * @param imageURI Profile Image URI
 */
   export function trackSocialProfileImageURITransaction(
    block: ethereum.Block,
    profileTokenAddress: string,
    profileTokenId: string,
    imageURI: string,
   ):void {
  
    const chainId = getChainId()
    const profileId = getProfileId(chainId, profileTokenAddress, profileTokenId);
  
    const profile = AirSocialProfile.load(profileId);
  
    if(profile == null) {
      throw new Error("air social profile not found")
    }
  
    const airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save();
  
    profile.imageURI = imageURI;
  
    saveAirSocialProfile(profile, airBlock);
   }
  /**
   * @dev this function creates a AirSocialUserDefaultProfileChangeTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from intiator of the transaction
   * @param to protocol contract
   * @param airSocialUser airSocialUser who's default profile changed
   * @param newDefaultProfileId new default AirSocialProfile id
   * @param currentDefaultProfileId current default AirSocialProfile id
   */
  function createAirSocialUserDefaultProfileChangeTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    airSocialUser: AirSocialUser,
    newDefaultProfileId: string,
    currentDefaultProfileId: string
  ): void {
    const id = transactionHash
      .concat("-")
      .concat(logOrCallIndex.toString())
      .concat("-")
      .concat(airSocialUser.id)
    let entity = AirSocialUserDefaultProfileChangeTransaction.load(id)
    if (entity == null) {
      log.debug("changing default profile {} to {} of user {},txHash {}", [
        currentDefaultProfileId,
        newDefaultProfileId,
        airSocialUser.address,
        transactionHash,
      ])
      entity = new AirSocialUserDefaultProfileChangeTransaction(id)
      let oldDefaultProfile = AirSocialProfile.load(currentDefaultProfileId)
      if (oldDefaultProfile == null && currentDefaultProfileId != "") {
        log.error("currentDefaultProfileId profile missing:id {}", [currentDefaultProfileId])
        throw new Error("currentDefaultProfileId profile missing")
      }
      let newDefaultProfile = AirSocialProfile.load(newDefaultProfileId)
      if (newDefaultProfile == null && newDefaultProfileId != "") {
        log.error("newDefaultProfileId profile missing:id {}", [newDefaultProfileId])
        throw new Error("newDefaultProfileId profile missing")
      }
      entity.oldDefaultProfile = oldDefaultProfile == null ? "" : oldDefaultProfile.id
      entity.newDefaultProfile = newDefaultProfile == null ? "" : newDefaultProfile.id
      entity.user = airSocialUser.id
      const airAccountFrom = getOrCreateAirAccount(chainId, from, block)
      airAccountFrom.save()
      const airAccountTo = getOrCreateAirAccount(chainId, to, block)
      airAccountTo.save()
      entity.from = airAccountFrom.id
      entity.to = airAccountTo.id
      entity.transactionHash = transactionHash
      entity.logOrCallIndex = logOrCallIndex
      entity.block = block.id
      entity.index = updateAirEntityCounter(
        AIR_USER_DEFAULT_PROFILE_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
        block
      )
      entity.protocolType = AirProtocolType.SOCIAL
      entity.protocolActionType = AirProtocolActionType.SOCIAL_USER_DEFAULT_PROFILE_CHANGE
      entity.save()
    }
  }

  /**
   * @dev this function tracks a air social user ownership change transaction
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from erc721 token sender addres
   * @param to erc721 token receiver address
   * @param tokenId erc721 token id
   * @param tokenAddress erc721 token address
   * @param socialUserId social user id (eg: farcasterId)
   */
  export function trackSocialUserOwnershipChangeTransaction(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    socialUserId: string
  ): void {
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save()
    const airSocialUser = getAirSocialUser(chainId, socialUserId)
    if (airSocialUser == null) {
      throw new Error("air social user not found")
    }
    const airAccountTo = getOrCreateAirAccount(chainId, to, airBlock)
    airAccountTo.save()

    if (airSocialUser != null && airSocialUser.profiles != null) {
      // log.debug("Transfer: saving air social user profiles for {}", [airSocialUser.profiles!.toString()])
      
      for (let i = 0; i < airSocialUser.profiles!.length; i++) {
        // log.debug("saving air social user profiles for {}, block number {}", [airSocialUser.profiles!.toString(), block.number.toString()])
        const profileId = airSocialUser.profiles![i]
        const profile = AirSocialProfile.load(profileId)
        if (profile != null) {
          // log.debug("Profile not null, saving air social user profiles for {}, block number {}", [profile.id, block.number.toString()])
          saveAirSocialProfile(profile, airBlock)
        }
      }
    }

    airSocialUser.address = airAccountTo.id
    airSocialUser.lastUpdatedAt = airBlock.id
    saveAirSocialUser(airSocialUser, airBlock)
    createAirSocialUserOnwershipChangeTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      from,
      to,
      tokenId,
      tokenAddress,
      airSocialUser
    )
  }

  /**
   * @dev this function tracks a air social profile recovery address change transaction
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from call sender
   * @param to call receiver
   * @param tokenId air social profile token id (eg: uint256 representation of farcasterName)
   * @param tokenAddress air social profile token address
   * @param recoveryAddress air social profile new recovery address
   */
  export function trackSocialProfileRecoveryAddressChangeTransaction(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    recoveryAddress: string
  ): void {
    let oldRecoveryAddress: string
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save()
    const airSocialProfile = getAirSocialProfile(chainId, tokenAddress, tokenId)
    if (airSocialProfile == null) {
      throw new Error("air social profile not found")
    }
    // updating air social profile recovery address in extra entity
    let profileRecoveryAddressExtraId = airSocialProfile.id
      .concat("-")
      .concat(profileRecoveryAddress)
    let extraEntity = AirExtra.load(profileRecoveryAddressExtraId)
    if (extraEntity != null) {
      // of extra entity exists, update value
      oldRecoveryAddress = extraEntity.value
      extraEntity.value = recoveryAddress
      extraEntity.save()
    } else {
      // if extra entity does not exist, create new one and update air social profile extras
      oldRecoveryAddress = zeroAddress.toHexString()
      const extraEntity = createAirExtra(
        profileRecoveryAddress,
        recoveryAddress,
        airSocialProfile.id
      )
      let airExtras = airSocialProfile.extras
      if (airExtras == null) {
        airExtras = [extraEntity.id]
      } else {
        airExtras.push(extraEntity.id)
      }
      airSocialProfile.extras = airExtras
      // airSocialProfile.lastUpdatedAt = airBlock.id
    }
    saveAirSocialProfile(airSocialProfile, airBlock)
    createAirSocialProfileRecoveryAddressChangeTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      from,
      to,
      tokenId,
      tokenAddress,
      oldRecoveryAddress,
      recoveryAddress,
      airSocialProfile
    )
  }

  /**
   * @dev this function tracks a air social user recovery address change transaction
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from call sender
   * @param to call receiver
   * @param tokenId air social user token id (eg: farcasterId)
   * @param tokenAddress air social user token address
   * @param socialUserId air social user id (eg: farcasterId)
   * @param recoveryAddress air social user new recovery address
   */
  export function trackSocialUserRecoveryAddressChangeTransaction(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    socialUserId: string,
    recoveryAddress: string
  ): void {
    let oldRecoveryAddress: string
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save()
    const airSocialUser = getAirSocialUser(chainId, socialUserId)
    if (airSocialUser == null) {
      throw new Error("air social user not found")
    }
    // updating air social profile recovery address in extra entity
    let userRecoveryAddressExtraId = airSocialUser.id.concat("-").concat(userRecoveryAddress)
    let extraEntity = AirExtra.load(userRecoveryAddressExtraId)
    if (extraEntity != null) {
      // of extra entity exists, update value
      oldRecoveryAddress = extraEntity.value
      extraEntity.value = recoveryAddress
      extraEntity.save()
    } else {
      // if extra entity does not exist, create new one and update air social profile extras
      oldRecoveryAddress = zeroAddress.toHexString()
      const extraEntity = createAirExtra(userRecoveryAddress, recoveryAddress, airSocialUser.id)
      let airExtras = airSocialUser.extras
      if (airExtras == null) {
        airExtras = [extraEntity.id]
      } else {
        airExtras.push(extraEntity.id)
      }
      airSocialUser.extras = airExtras
      airSocialUser.lastUpdatedAt = airBlock.id
    }
    saveAirSocialUser(airSocialUser, airBlock)
    createAirSocialUserRecoveryAddressChangeTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      from,
      to,
      tokenId,
      tokenAddress,
      oldRecoveryAddress,
      recoveryAddress,
      airSocialUser
    )
  }

  /**
   * @dev this function tracks a air social user recovery address change transaction
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from call sender
   * @param to call receiver
   * @param tokenId air social user token id (eg: farcasterId)
   * @param tokenAddress air social user token address
   * @param socialUserId air social user id (eg: farcasterId)
   * @param homeUrl air social user new home url
   */
  export function trackSocialUserHomeUrlChangeTransaction(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    socialUserId: string,
    homeUrl: string
  ): void {
    let oldHomeUrl: string
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save()
    const airSocialUser = getAirSocialUser(chainId, socialUserId)
    if (airSocialUser == null) {
      throw new Error("air social user not found")
    }
    // updating air social profile recovery address in extra entity
    let userHomeUrlExtraId = airSocialUser.id.concat("-").concat(userHomeUrl)
    let extraEntity = AirExtra.load(userHomeUrlExtraId)
    if (extraEntity != null) {
      // of extra entity exists, update value
      oldHomeUrl = extraEntity.value
      extraEntity.value = homeUrl
      extraEntity.save()
    } else {
      // if extra entity does not exist, create new one and update air social profile extras
      oldHomeUrl = EMPTY_STRING
      const extraEntity = createAirExtra(userHomeUrl, homeUrl, airSocialUser.id)
      let airExtras = airSocialUser.extras
      if (airExtras == null) {
        airExtras = [extraEntity.id]
      } else {
        airExtras.push(extraEntity.id)
      }
      airSocialUser.extras = airExtras
      airSocialUser.lastUpdatedAt = airBlock.id
    }
    saveAirSocialUser(airSocialUser, airBlock)
    createAirSocialUserHomeUrlChangeTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      from,
      to,
      tokenId,
      tokenAddress,
      oldHomeUrl,
      homeUrl,
      airSocialUser
    )
  }

  /**
   * @dev this function tracks a air social user profile renewal transaction
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from profile renewer address
   * @param to call receiver address
   * @param tokenId air social profile token id (eg: uint256 representation of farcasterName)
   * @param tokenAddress air social profile token address
   * @param expiryTimestamp air social profile new expiry timestamp
   * @param renewalCost air social profile renewal cost
   */
  export function trackSocialProfileRenewalTransaction(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    expiryTimestamp: BigInt,
    renewalCost: BigInt
  ): void {
    const chainId = getChainId()
    const airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save()
    const airSocialProfile = getAirSocialProfile(chainId, tokenAddress, tokenId)
    if (airSocialProfile == null) {
      throw new Error("air social profile not found")
    }
    airSocialProfile.expiryTimestamp = expiryTimestamp
    airSocialProfile.renewalCost = renewalCost
    // airSocialProfile.lastUpdatedAt = airBlock.id
    saveAirSocialProfile(airSocialProfile, airBlock)
    createAirSocialProfileRenewalTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      from,
      to,
      tokenId,
      tokenAddress,
      expiryTimestamp,
      renewalCost,
      airSocialProfile
    )
  }

/**
 * @dev This function tracks profile Handle registration transaction
 * @param block ethereum block
 * @param handleId Id of handle
 * @param to Owner of handle
 * @param tokenId TokenId of Handle
 * @param tokenAddress  TokenAddress of Handle
 * @param name  Name of Handle
 * @param nameSpace Name space of Handle
 */
export function trackSocialProfileHandleRegistrationTransaction(
  block: ethereum.Block,
  to: string,
  tokenId: string,
  tokenAddress: string,
  name: string,
  nameSpace: string,
): void {

  const chainId = getChainId()
  const id = getProfileHandleId(chainId,tokenAddress, tokenId);
  let entity = AirSocialProfileHandle.load(id);

  if(entity == null) {
    entity = new AirSocialProfileHandle(id);
  }

  const airBlock = getOrCreateAirBlock(
    chainId,
    block.number,
    block.hash.toHexString(),
    block.timestamp
  )
  airBlock.save();
  const airAccount = getOrCreateAirAccount(chainId, to, airBlock)
  airAccount.save();

  const token = getOrCreateAirToken(chainId, tokenAddress);
  token.save();

  entity.createdAt = airBlock.id;
  entity.owner = airAccount.id;
  entity.name = name;
  entity.namespace = nameSpace;
  entity.tokenAddress = token.id;
  entity.tokenId = tokenId;
  saveProfileHandle(entity, airBlock)
}

/**
 * @dev This function tracks profile Handle transfer transaction
 * @param block ethereum block
 * @param handleId Id of handle
 * @param from current Owner of handle
 * @param to New owner of handle
 * @param tokenId TokenId of Handle
 * @param tokenAddress  TokenAddress of Handle
 
 */
export function trackSocialProfileHandleTransferTransaction(
  block: ethereum.Block,
  from: string,
  to: string,
  tokenId: string,
  tokenAddress: string,
  
): void {

  const chainId = getChainId()
  const id = getProfileHandleId(chainId, tokenAddress, tokenId);
  let entity = AirSocialProfileHandle.load(id);

  if(entity == null) {
    throw new Error("air social profile handle not found")
  }

  const airBlock = getOrCreateAirBlock(
    chainId,
    block.number,
    block.hash.toHexString(),
    block.timestamp
  )
  airBlock.save();
  const airAccount = getOrCreateAirAccount(chainId, to, airBlock)
  airAccount.save();

  entity.owner = airAccount.id;  

  if (entity.profile) {

    const profile = AirSocialProfile.load(entity.profile!);
    // if handle is burned, unlink it with profile if already linked
    if (to == ZERO_ADDRESS && entity.profile != null) {

      if (profile != null) {
        trackSocialProfileHandleUnlinkTransaction(
          block,
          tokenAddress,
          tokenId,
          profile.tokenAddress,
          profile.tokenId
        )
      }
    }
  }
  saveProfileHandle(entity, airBlock)

}


/**
 * @dev This function links a handle with profile
 * @param block EVM block at which transaction happend
 * @param handleTokenAddress  Handle NFT Token address
 * @param handleTokenId  Handle NFT Token If
 * @param profileTokenAddress  Profile NFT Token Address
 * @param profileTokenId Profile NFT TokenId
 */
 export function trackSocialProfileHandleLinkTransaction(
  block: ethereum.Block,
  handleTokenAddress: string,
  handleTokenId: string,
  profileTokenAddress: string,
  profileTokenId: string
 ):void {

  const chainId = getChainId()
  const handleId = getProfileHandleId(chainId, handleTokenAddress, handleTokenId);
  const profileId = getProfileId(chainId, profileTokenAddress, profileTokenId);

  const profile = AirSocialProfile.load(profileId);
  const handle = AirSocialProfileHandle.load(handleId);

  if(profile == null) {
    throw new Error("air social profile not found")
  }

  if(handle == null) {
    throw new Error("air social profile handle not found")
  }

  const airBlock = getOrCreateAirBlock(
    chainId,
    block.number,
    block.hash.toHexString(),
    block.timestamp
  )
  airBlock.save();

  profile.handle = handle.id;
  handle.profile = profile.id;

  saveProfileHandle(handle, airBlock);
  saveAirSocialProfile(profile, airBlock);
 }

 /**
 * @dev This function Unlinks a handle with profile
 * @param block EVM block at which transaction happend
 * @param handleTokenAddress  Handle NFT Token address
 * @param handleTokenId  Handle NFT Token If
 * @param profileTokenAddress  Profile NFT Token Address
 * @param profileTokenId Profile NFT TokenId
 */
 export function trackSocialProfileHandleUnlinkTransaction(
  block: ethereum.Block,
  handleTokenAddress: string,
  handleTokenId: string,
  profileTokenAddress: string,
  profileTokenId: string
 ):void {

  const chainId = getChainId()
  const handleId = getProfileHandleId(chainId, handleTokenAddress, handleTokenId);
  const profileId = getProfileId(chainId, profileTokenAddress, profileTokenId);

  const profile = AirSocialProfile.load(profileId);
  const handle = AirSocialProfileHandle.load(handleId);

  if(profile == null) {
    throw new Error("air social profile not found")
  }

  if(handle == null) {
    throw new Error("air social profile handle not found")
  }

  const airBlock = getOrCreateAirBlock(
    chainId,
    block.number,
    block.hash.toHexString(),
    block.timestamp
  )
  airBlock.save();

  profile.handle = null;
  handle.profile = null;

  saveProfileHandle(handle, airBlock);
  saveAirSocialProfile(profile, airBlock);
 }
 

  //end of track functions

  function saveProfileHandle(profileHandle: AirSocialProfileHandle, airBlock: AirBlock):void {
    profileHandle.lastUpdatedAt = airBlock.id;
    profileHandle.lastUpdatedIndex = updateAirEntityCounter(
      AIR_SOCIAL_PROFILE_HANDLE_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID,
      airBlock
    )
    profileHandle.save()
  }

  function getProfileHandleId(chainId: string, tokenAddress: string, tokenId: string):string {
    return chainId
    .concat("-")
    .concat(tokenAddress)
    .concat("-")
    .concat(tokenId)
  }
  /**
   * @dev this function gets or creates a AirSocialUser entity
   * @param chainId chain id
   * @param block air block entity
   * @param socialUserId social user id (eg: farcasterId)
   * @param address air social user owner address (custody address of farcasterId)
   * @param extrasIds air extra data entity ids
   * @returns air social user entity
   */
  function createAirSocialUser(
    chainId: string,
    block: AirBlock,
    socialUserId: string,
    address: string,
    extrasIds: string[]
  ): AirSocialUser {
    const id = createSocialUserEntityId(chainId, socialUserId)
    let entity = AirSocialUser.load(id)
    if (entity == null) {
      entity = new AirSocialUser(id)
    }
    const airAccount = getOrCreateAirAccount(chainId, address, block)
    airAccount.save()
    entity.socialUserId = socialUserId
    entity.address = airAccount.id
    entity.createdAt = block.id
    if (extrasIds.length > 0) {
      entity.extras = extrasIds
    }
    if (entity.profiles == null) {
      entity.profiles = []
    }
    entity.lastUpdatedIndex = updateAirEntityCounter(
      AIR_SOCIAL_USER_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID,
      block
    )
    entity.lastUpdatedAt = block.id
    entity.save()
    return entity as AirSocialUser
  }

  function getProfileId(chainId: string, tokenAddress: string, tokenId: string): string {
    return chainId
    .concat("-")
    .concat(tokenAddress)
    .concat("-")
    .concat(tokenId);
  }
  /**
   * @dev this function creates a AirSocialProfile entity
   * @param block ethereum block
   * @param chainId chain id
   * @param name air social profile name
   * @param tokenId air social profile token id
   * @param tokenAddress air social profile token address
   * @param extraIds air extra data entity ids
   * @param profileExpiryTimestamp timestamp when the profile expires
   * @returns air social profile entity
   */
  function createAirSocialProfile(
    block: AirBlock,
    chainId: string,
    userId: string,
    name: string,
    tokenId: string,
    tokenAddress: string,
    extraIds: string[],
    profileExpiryTimestamp: BigInt
  ): AirSocialProfile {
    const id = getProfileId(chainId, tokenAddress, tokenId);
    let entity = AirSocialProfile.load(id)
    if (entity == null) {
      entity = new AirSocialProfile(id)
      entity.name = name
      entity.user = userId
      entity.tokenId = tokenId
      entity.expiryTimestamp = profileExpiryTimestamp
      entity.isDefault = false
      const airToken = getOrCreateAirToken(chainId, tokenAddress)
      airToken.save()
      entity.tokenAddress = airToken.id
      if (extraIds.length > 0) {
        entity.extras = extraIds
      }
      entity.lastUpdatedIndex = updateAirEntityCounter(
        AIR_SOCIAL_PROFILE_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID,
        block
      )
      entity.createdAt = block.id
      entity.lastUpdatedAt = block.id
    }
    entity.save()
    return entity as AirSocialProfile
  }

  /**
   * @dev this functions gets an air social profile entity
   * @param chainid chain id
   * @param tokenAddress air social profile token address
   * @param tokenId air social profile token id
   * @returns air social profile entity | null
   */
  function getAirSocialProfile(
    chainId: string,
    tokenAddress: string,
    tokenId: string
  ): AirSocialProfile | null {
    const id = chainId
      .concat("-")
      .concat(tokenAddress)
      .concat("-")
      .concat(tokenId)
    return AirSocialProfile.load(id)
  }

  /**
   * @dev this function gets an AirSocialUser entity
   * @param chainId chain id
   * @param socialUserId social user id (eg: farcasterId)
   * @returns air social user entity | null
   */
  function getAirSocialUser(chainId: string, socialUserId: string): AirSocialUser | null {
    const id = createSocialUserEntityId(chainId, socialUserId)
    return AirSocialUser.load(id)
  }

  /**
   * @dev this function creates a AirSocialUserRegisteredTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param address user address (owner of the socialUserId)
   * @param socialUser air social user entity
   * @param socialProfile air social profile entity
   * @param name air social profile name
   * @param from address from which user token was sent
   * @param to address to which user token was sent
   * @param tokenId token id of the user token
   * @param tokenAddress token address of the user token
   * @param userExtrasIds air social user extra data entity ids
   * @param profileExtraIds air social profile extra data entity ids
   * @param profileExpiryTimestamp timestamp when the profile expires
   */
  function createAirSocialUserRegisteredTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    address: string,
    socialUser: AirSocialUser,
    socialProfile: AirSocialProfile,
    name: string,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    userExtrasIds: string[],
    profileExtraIds: string[],
    profileExpiryTimestamp: BigInt
  ): void {
    const userId = socialUser.id
    const profileId = socialProfile.id
    const id = userId
      .concat("-")
      .concat(transactionHash)
      .concat("-")
      .concat(tokenAddress)
      .concat("-")
      .concat(tokenId)
    let entity = AirSocialUserRegisteredTransaction.load(id)
    if (entity == null) {
      entity = new AirSocialUserRegisteredTransaction(id)
      const airAccount = getOrCreateAirAccount(chainId, address, block)
      airAccount.save()
      const airAccountFrom = getOrCreateAirAccount(chainId, from, block)
      airAccountFrom.save()
      const airAccountTo = getOrCreateAirAccount(chainId, to, block)
      airAccountTo.save()
      entity.address = airAccount.id //socialUserId owner address
      entity.user = userId
      entity.profile = profileId
      entity.name = name
      entity.profileExpiryTimestamp = profileExpiryTimestamp
      if (userExtrasIds.length > 0 || profileExtraIds.length > 0) {
        entity.extras = userExtrasIds.concat(profileExtraIds) //air social user extra data entity ids
      }
      entity.from = airAccountFrom.id
      entity.to = airAccountTo.id
      entity.tokenId = tokenId
      const airToken = getOrCreateAirToken(chainId, tokenAddress)
      airToken.save()
      entity.tokenAddress = airToken.id
      entity.logOrCallIndex = logOrCallIndex
      entity.transactionHash = transactionHash
      entity.block = block.id
      entity.index = updateAirEntityCounter(
        AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER_ID,
        block
      )
      entity.protocolType = AirProtocolType.SOCIAL
      entity.protocolActionType = AirProtocolActionType.SOCIAL_REGISTRATION
      entity.save()
    }
  }

  /**
   * @dev this function creates a AirSocialProfileOnwershipChangeTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from erc721 token sender address
   * @param to erc721 token receiver address
   * @param tokenId erc721 token id
   * @param tokenAddress erc721 token address
   * @param airSocialProfile air social profile entity
   */
  function createAirSocialProfileOwnershipChangeTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    airSocialProfile: AirSocialProfile
  ): void {
    const id = transactionHash
      .concat("-")
      .concat(logOrCallIndex.toString())
      .concat("-")
      .concat(tokenId)
    let entity = AirSocialProfileOwnershipChangeTransaction.load(id)
    if (entity == null) {
      entity = new AirSocialProfileOwnershipChangeTransaction(id)
      entity.profileName = airSocialProfile.name
      entity.profile = airSocialProfile.id
      entity.tokenId = tokenId
      const airToken = getOrCreateAirToken(chainId, tokenAddress)
      airToken.save()
      entity.tokenAddress = airToken.id
      const airAccountFrom = getOrCreateAirAccount(chainId, from, block)
      airAccountFrom.save()
      const airAccountTo = getOrCreateAirAccount(chainId, to, block)
      airAccountTo.save()
      entity.from = airAccountFrom.id
      entity.to = airAccountTo.id
      entity.transactionHash = transactionHash
      entity.logOrCallIndex = logOrCallIndex
      entity.block = block.id
      entity.index = updateAirEntityCounter(
        AIR_PROFILE_OWNERSHIP_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
        block
      )
      entity.protocolType = AirProtocolType.SOCIAL
      entity.protocolActionType = AirProtocolActionType.SOCIAL_PROFILE_OWNERSHIP_CHANGE
      entity.save()
    }
  }

  /**
   * @dev this function creates a AirSocialUserOnwershipChangeTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from erc721 token sender address
   * @param to erc721 token receiver address
   * @param tokenId erc721 token id
   * @param tokenAddress erc721 token address
   * @param airSocialUser air social user entity
   */
  function createAirSocialUserOnwershipChangeTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    airSocialUser: AirSocialUser
  ): void {
    const id = transactionHash
      .concat("-")
      .concat(logOrCallIndex.toString())
      .concat("-")
      .concat(tokenId)
    let entity = AirSocialUserOwnershipChangeTransaction.load(id)
    if (entity == null) {
      entity = new AirSocialUserOwnershipChangeTransaction(id)
      entity.socialUserId = airSocialUser.socialUserId
      entity.tokenId = tokenId
      const airToken = getOrCreateAirToken(chainId, tokenAddress)
      airToken.save()
      entity.tokenAddress = airToken.id
      entity.user = airSocialUser.id
      const airAccountFrom = getOrCreateAirAccount(chainId, from, block)
      airAccountFrom.save()
      const airAccountTo = getOrCreateAirAccount(chainId, to, block)
      airAccountTo.save()
      entity.from = airAccountFrom.id
      entity.to = airAccountTo.id
      entity.transactionHash = transactionHash
      entity.logOrCallIndex = logOrCallIndex
      entity.block = block.id
      entity.index = updateAirEntityCounter(
        AIR_USER_OWNERSHIP_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
        block
      )
      entity.protocolType = AirProtocolType.SOCIAL
      entity.protocolActionType = AirProtocolActionType.SOCIAL_USER_OWNERSHIP_CHANGE
      entity.save()
    }
  }

  /**
   * @dev this function creates a AirSocialProfileRecoveryAddressChangeTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from erc721 token sender address
   * @param to erc721 token receiver address
   * @param tokenId erc721 token id
   * @param tokenAddress erc721 token address
   * @param oldRecoveryAddress old recovery address
   * @param newRecoveryAddress new recovery address
   * @param airSocialProfile air social profile entity
   */
  function createAirSocialProfileRecoveryAddressChangeTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    oldRecoveryAddress: string | null,
    newRecoveryAddress: string,
    airSocialProfile: AirSocialProfile
  ): void {
    const id = transactionHash
      .concat("-")
      .concat(logOrCallIndex.toString())
      .concat("-")
      .concat(tokenId)
    let entity = AirSocialProfileRecoveryAddressChangeTransaction.load(id)
    if (entity == null) {
      entity = new AirSocialProfileRecoveryAddressChangeTransaction(id)
      if (oldRecoveryAddress) {
        const airAccountOldRecoveryAddress = getOrCreateAirAccount(
          chainId,
          oldRecoveryAddress,
          block
        )
        airAccountOldRecoveryAddress.save()
        entity.oldRecoveryAddress = airAccountOldRecoveryAddress.id
      }
      const airAccountNewRecoveryAddress = getOrCreateAirAccount(chainId, newRecoveryAddress, block)
      airAccountNewRecoveryAddress.save()
      entity.newRecoveryAddress = airAccountNewRecoveryAddress.id
      entity.profile = airSocialProfile.id
      entity.tokenId = tokenId
      const airToken = getOrCreateAirToken(chainId, tokenAddress)
      airToken.save()
      entity.tokenAddress = airToken.id
      const airAccountFrom = getOrCreateAirAccount(chainId, from, block)
      airAccountFrom.save()
      entity.from = airAccountFrom.id
      const airAccountTo = getOrCreateAirAccount(chainId, to, block)
      airAccountTo.save()
      entity.to = airAccountTo.id
      entity.transactionHash = transactionHash
      entity.logOrCallIndex = logOrCallIndex
      entity.block = block.id
      entity.index = updateAirEntityCounter(
        AIR_PROFILE_RECOVERY_ADDRESS_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
        block
      )
      entity.protocolType = AirProtocolType.SOCIAL
      entity.protocolActionType = AirProtocolActionType.SOCIAL_PROFILE_RECOVERY_ADDRESS_CHANGE
      entity.save()
    }
  }

  /**
   * @dev this function creates a AirSocialUserRecoveryAddressChangeTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from erc721 token sender address
   * @param to erc721 token receiver address
   * @param tokenId erc721 token id
   * @param tokenAddress erc721 token address
   * @param oldRecoveryAddress old recovery address
   * @param newRecoveryAddress new recovery address
   * @param airSocialUser air social user entity
   */
  function createAirSocialUserRecoveryAddressChangeTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    oldRecoveryAddress: string | null,
    newRecoveryAddress: string,
    airSocialUser: AirSocialUser
  ): void {
    const id = transactionHash
      .concat("-")
      .concat(logOrCallIndex.toString())
      .concat("-")
      .concat(tokenId)
    let entity = AirSocialUserRecoveryAddressChangeTransaction.load(id)
    if (entity == null) {
      entity = new AirSocialUserRecoveryAddressChangeTransaction(id)
      if (oldRecoveryAddress) {
        const airAccountOldRecoveryAddress = getOrCreateAirAccount(
          chainId,
          oldRecoveryAddress,
          block
        )
        airAccountOldRecoveryAddress.save()
        entity.oldRecoveryAddress = airAccountOldRecoveryAddress.id
      }
      const airAccountNewRecoveryAddress = getOrCreateAirAccount(chainId, newRecoveryAddress, block)
      airAccountNewRecoveryAddress.save()
      entity.newRecoveryAddress = airAccountNewRecoveryAddress.id
      entity.user = airSocialUser.id
      entity.tokenId = tokenId
      const airToken = getOrCreateAirToken(chainId, tokenAddress)
      airToken.save()
      entity.tokenAddress = airToken.id
      const airAccountFrom = getOrCreateAirAccount(chainId, from, block)
      airAccountFrom.save()
      entity.from = airAccountFrom.id
      const airAccountTo = getOrCreateAirAccount(chainId, to, block)
      airAccountTo.save()
      entity.to = airAccountTo.id
      entity.transactionHash = transactionHash
      entity.logOrCallIndex = logOrCallIndex
      entity.block = block.id
      entity.index = updateAirEntityCounter(
        AIR_USER_RECOVERY_ADDRESS_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
        block
      )
      entity.protocolType = AirProtocolType.SOCIAL
      entity.protocolActionType = AirProtocolActionType.SOCIAL_USER_RECOVERY_ADDRESS_CHANGE
      entity.save()
    }
  }

  /**
   * @dev this function creates a AirSocialUserHomeUrlChangeTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from erc721 token sender address
   * @param to erc721 token receiver address
   * @param tokenId erc721 token id
   * @param tokenAddress erc721 token address
   * @param oldHomeUrl old home url
   * @param newHomeUrl new home url
   * @param airSocialUser air social user entity
   */
  function createAirSocialUserHomeUrlChangeTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    oldHomeUrl: string | null,
    newHomeUrl: string,
    airSocialUser: AirSocialUser
  ): void {
    const id = transactionHash
      .concat("-")
      .concat(logOrCallIndex.toString())
      .concat("-")
      .concat(tokenId)
    let entity = AirSocialUserHomeUrlChangeTransaction.load(id)
    if (entity == null) {
      entity = new AirSocialUserHomeUrlChangeTransaction(id)
      entity.oldHomeUrl = oldHomeUrl
      entity.newHomeUrl = newHomeUrl
      entity.user = airSocialUser.id
      entity.tokenId = tokenId
      const airToken = getOrCreateAirToken(chainId, tokenAddress)
      airToken.save()
      entity.tokenAddress = airToken.id
      const airAccountFrom = getOrCreateAirAccount(chainId, from, block)
      airAccountFrom.save()
      entity.from = airAccountFrom.id
      const airAccountTo = getOrCreateAirAccount(chainId, to, block)
      airAccountTo.save()
      entity.to = airAccountTo.id
      entity.transactionHash = transactionHash
      entity.logOrCallIndex = logOrCallIndex
      entity.block = block.id
      entity.index = updateAirEntityCounter(
        AIR_USER_HOME_URL_CHANGE_TRANSACTION_ENTITY_COUNTER_ID,
        block
      )
      entity.protocolType = AirProtocolType.SOCIAL
      entity.protocolActionType = AirProtocolActionType.SOCIAL_USER_HOME_URL_CHANGE
      entity.save()
    }
  }

  /**
   * @dev this function creates a AirSocialUserHomeUrlChangeTransaction entity
   * @param chainId chain id
   * @param block air block entity
   * @param transactionHash transaction hash
   * @param logOrCallIndex log or call index
   * @param from erc721 token sender address
   * @param to erc721 token receiver address
   * @param tokenId erc721 token id
   * @param tokenAddress erc721 token address
   * @param expiryTimestamp profile expiry timestamp
   * @param renewalCost profile renewal cost
   * @param airSocialProfile air social profile entity
   */
  function createAirSocialProfileRenewalTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    from: string,
    to: string,
    tokenId: string,
    tokenAddress: string,
    expiryTimestamp: BigInt,
    renewalCost: BigInt,
    airSocialProfile: AirSocialProfile
  ): void {
    const id = transactionHash
      .concat("-")
      .concat(logOrCallIndex.toString())
      .concat("-")
      .concat(tokenId)
    let entity = AirSocialProfileRenewalTransaction.load(id)
    if (entity == null) {
      entity = new AirSocialProfileRenewalTransaction(id)
      entity.expiryTimestamp = expiryTimestamp
      entity.renewalCost = renewalCost
      entity.profile = airSocialProfile.id
      entity.tokenId = tokenId
      const airToken = getOrCreateAirToken(chainId, tokenAddress)
      airToken.save()
      entity.tokenAddress = airToken.id
      const airAccountFrom = getOrCreateAirAccount(chainId, from, block)
      airAccountFrom.save()
      entity.from = airAccountFrom.id
      const airAccountTo = getOrCreateAirAccount(chainId, to, block)
      airAccountTo.save()
      entity.to = airAccountTo.id
      entity.transactionHash = transactionHash
      entity.logOrCallIndex = logOrCallIndex
      entity.block = block.id
      entity.index = updateAirEntityCounter(
        AIR_PROFILE_NAME_RENEWAL_TRANSACTION_ENTITY_COUNTER_ID,
        block
      )
      entity.protocolType = AirProtocolType.SOCIAL
      entity.protocolActionType = AirProtocolActionType.SOCIAL_PROFILE_NAME_RENEWAL
      entity.save()
    }
  }

  /**
   * @dev this class is used to create air extra data
   * @param name name of the extra data (eg: tokenUri,userHomeUrl,userRecoveryAddress,profileRecoveryAddress)
   * @param value value of the extra data
   */
  export class AirExtraData {
    constructor(public name: string, public value: string) {}
  }
  function saveAirSocialProfile(airSocialProfile: AirSocialProfile, airBlock: AirBlock): void {
    airSocialProfile.lastUpdatedAt = airBlock.id
    airSocialProfile.lastUpdatedIndex = updateAirEntityCounter(
      AIR_SOCIAL_PROFILE_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID,
      airBlock
    )
    airSocialProfile.lastUpdatedAt = airBlock.id
    airSocialProfile.save()
  }
  function saveAirSocialUser(airSocialUser: AirSocialUser, airBlock: AirBlock): void {
    airSocialUser.lastUpdatedAt = airBlock.id
    airSocialUser.lastUpdatedIndex = updateAirEntityCounter(
      AIR_SOCIAL_USER_ENTITY_LAST_UPDATED_INDEX_COUNTER_ID,
      airBlock
    )
    airSocialUser.save()
  }
}
