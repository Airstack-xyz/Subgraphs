import { Bytes, log } from "@graphprotocol/graph-ts"
import { assert, beforeEach, clearStore, describe, test } from "matchstick-as/assembly/index"
import { getDefaultProfileSet, getProfileCreatedEvent, getTransferEvent } from "./utils"
import {
  createProfile1,
  createProfile2,
  mint1,
  mint2,
  minting,
  profileCreated1,
  setDefault2,
  settingDefault,
  transfer3,
  transferring,
  transferringAgain,
} from "./sample"
import { handleDefaultProfileSet, handleProfileCreated, handleTransfer } from "../src/mappings"
import { LENSHUB_ADDRESS } from "../src/constants"

export const chainIdPrefix = "1-"
export const joiner = "-"

describe("Testing Lens Subgraph", () => {
  beforeEach(() => {
    clearStore() // <-- clear the store before each test in the file
  })
  test("testing handleProfileCreated", () => {
    let createProfile1Event = getProfileCreatedEvent(createProfile1)
    handleProfileCreated(createProfile1Event)
    let createProfile2Event = getProfileCreatedEvent(createProfile2)
    handleProfileCreated(createProfile2Event)
    assert.entityCount("UserToProfileMap", 1)
    assert.fieldEquals("UserToProfileMap", createProfile1.to, "user", createProfile2.to)
    assert.fieldEquals(
      "UserToProfileMap",
      createProfile1.to,
      "profile",
      `[${createProfile1.profileId}, ${createProfile2.profileId}]`
    )
    assert.fieldEquals(
      "UserToProfileMap",
      createProfile1.to,
      "lensNames",
      `[${createProfile1.handle}, ${createProfile2.handle}]`
    )
    assert.fieldEquals("UserToProfileMap", createProfile1.to, "count", "2")
    assert.fieldEquals(
      "UserToProfileMap",
      createProfile1.to,
      "hashes",
      `[${createProfile1.txHash}, ${createProfile2.txHash}]`
    )
    // checking AirSocialUser
    assert.entityCount("AirSocialUser", 1)
    assert.fieldEquals(
      "AirSocialUser",
      chainIdPrefix + createProfile1.to,
      "address",
      chainIdPrefix + createProfile1.to
    )
    // checking AirSocialProfile
    assert.entityCount("AirSocialProfile", 2)
    let profile1id =
      chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + createProfile1.profileId
    let profile2id =
      chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + createProfile2.profileId
    assert.fieldEquals("AirSocialProfile", profile1id, "name", createProfile1.handle)
    assert.fieldEquals("AirSocialProfile", profile2id, "name", createProfile2.handle)
    assert.fieldEquals("AirSocialProfile", profile1id, "user", chainIdPrefix + createProfile1.to)
    assert.fieldEquals("AirSocialProfile", profile2id, "user", chainIdPrefix + createProfile2.to)
    assert.fieldEquals("AirSocialProfile", profile1id, "tokenId", createProfile1.profileId)
    assert.fieldEquals("AirSocialProfile", profile2id, "tokenId", createProfile2.profileId)
    assert.fieldEquals(
      "AirSocialProfile",
      profile1id,
      "tokenAddress",
      chainIdPrefix + LENSHUB_ADDRESS.toHexString()
    )
    assert.fieldEquals(
      "AirSocialProfile",
      profile2id,
      "tokenAddress",
      chainIdPrefix + LENSHUB_ADDRESS.toHexString()
    )
  })
  test("Testing minting,setting default profile,transferring & automatic unsetting", () => {
    let profileId =
      chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + profileCreated1.profileId
    log.debug("profileId from test {}", [profileId])
    let profileCreatedEvent = getProfileCreatedEvent(profileCreated1)
    handleProfileCreated(profileCreatedEvent)

    log.info("Profile created!", [])
    // checking AirSocialUser
    assert.entityCount("AirSocialUser", 1)
    assert.fieldEquals(
      "AirSocialUser",
      chainIdPrefix + profileCreated1.to,
      "address",
      chainIdPrefix + profileCreated1.to
    )
    assert.fieldEquals("AirSocialUser", chainIdPrefix + profileCreated1.to, "lastUpdatedIndex", "1")

    // checking AirSocialProfile
    assert.entityCount("AirSocialProfile", 1)

    assert.fieldEquals("AirSocialProfile", profileId, "name", profileCreated1.handle)
    assert.fieldEquals("AirSocialProfile", profileId, "user", chainIdPrefix + profileCreated1.to)
    assert.fieldEquals("AirSocialProfile", profileId, "tokenId", profileCreated1.profileId)
    assert.fieldEquals(
      "AirSocialProfile",
      profileId,
      "tokenAddress",
      chainIdPrefix + LENSHUB_ADDRESS.toHexString()
    )
    assert.fieldEquals("AirSocialProfile", profileId, "isDefault", "false")
    assert.fieldEquals("AirSocialProfile", profileId, "lastUpdatedIndex", "1")
    assert.fieldEquals("AirSocialProfile", profileId, "user", chainIdPrefix + profileCreated1.to)
    log.info("setting defaultProfile", [])

    let defaultProfileSetEvent = getDefaultProfileSet(setDefault2)
    handleDefaultProfileSet(defaultProfileSetEvent)
    assert.fieldEquals("AirSocialProfile", profileId, "lastUpdatedIndex", "2")

    // checking DefaultProfileSetEntity
    let defaultProfileSetId = setDefault2.txHash
      .concat("-")
      .concat(defaultProfileSetEvent.logIndex.toString())
    assert.entityCount("DefaultProfileSet", 1)
    assert.fieldEquals("DefaultProfileSet", defaultProfileSetId, "wallet", setDefault2.wallet)
    assert.fieldEquals("DefaultProfileSet", defaultProfileSetId, "hash", setDefault2.txHash)
    assert.fieldEquals("DefaultProfileSet", defaultProfileSetId, "profileId", setDefault2.profileId)

    // checking UserToDefaultProfileIdMap
    assert.entityCount("UserToDefaultProfileIdMap", 1)
    assert.fieldEquals(
      "UserToDefaultProfileIdMap",
      setDefault2.wallet,
      "profileId",
      setDefault2.profileId
    )
    // checking defaultProfile in AirSocialUser
    assert.fieldEquals(
      "AirSocialUser",
      chainIdPrefix + profileCreated1.to,
      "defaultProfile",
      chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + setDefault2.profileId
    )

    // checking isDefault in AirSocialProfile
    assert.fieldEquals("AirSocialProfile", profileId, "isDefault", "true")
    assert.fieldEquals("AirSocialProfile", profileId, "lastUpdatedIndex", "2")
    // checking AirSocialUserDefaultProfileChangeTransaction
    assert.fieldEquals(
      "AirSocialUserDefaultProfileChangeTransaction",
      setDefault2.txHash + joiner + chainIdPrefix + chainIdPrefix + profileCreated1.to,
      "oldDefaultProfile",
      "null"
    )
    assert.fieldEquals(
      "AirSocialUserDefaultProfileChangeTransaction",
      setDefault2.txHash + joiner + chainIdPrefix + chainIdPrefix + profileCreated1.to,
      "newDefaultProfile",
      profileId
    )
    log.info("transferring", [])

    let transferEvent = getTransferEvent(transfer3)
    handleTransfer(transferEvent)

    assert.fieldEquals("AirSocialProfile", profileId, "lastUpdatedIndex", "4")

    // checking defaultProfile in AirSocialUser (cleared to null)
    assert.fieldEquals(
      "AirSocialUser",
      chainIdPrefix + profileCreated1.to,
      "defaultProfile",
      "null"
    )
    // check ownerOf old profile
    assert.fieldEquals("AirSocialProfile", profileId, "user", chainIdPrefix + transfer3.to)

    // checking isDefault in AirSocialProfile
    assert.fieldEquals("AirSocialProfile", profileId, "isDefault", "false")
    // checking AirSocialUserDefaultProfileChangeTransaction
    assert.fieldEquals(
      "AirSocialUserDefaultProfileChangeTransaction",
      transfer3.txHash + joiner + chainIdPrefix + chainIdPrefix + profileCreated1.to,
      "oldDefaultProfile",
      profileId
    )
    assert.fieldEquals(
      "AirSocialUserDefaultProfileChangeTransaction",
      transfer3.txHash + joiner + chainIdPrefix + chainIdPrefix + profileCreated1.to,
      "newDefaultProfile",
      "null"
    )
  })
  test("Testing minting transferring ,setting default & transferringAgain", () => {
    let mintingEvent = getProfileCreatedEvent(minting)
    let profileId = chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + minting.profileId
    handleProfileCreated(mintingEvent)
    let mintedUserId = chainIdPrefix + minting.to
    // -- profiles of minted user
    assert.fieldEquals(
      "AirSocialUser",
      mintedUserId,
      "profiles",
      `[${chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + minting.profileId}]`
    )
    assert.fieldEquals("AirSocialUser", mintedUserId, "lastUpdatedIndex", "1")
    // --- profile owner
    assert.fieldEquals("AirSocialProfile", profileId, "user", chainIdPrefix + minting.to)
    assert.fieldEquals("AirSocialProfile", profileId, "lastUpdatedIndex", "1")

    // transferring
    let transferringEvent = getTransferEvent(transferring)
    handleTransfer(transferringEvent)

    // --- profile owner
    assert.fieldEquals("AirSocialProfile", profileId, "user", chainIdPrefix + transferring.to)
    // --- profile default status
    assert.fieldEquals("AirSocialProfile", profileId, "isDefault", "false")
    assert.fieldEquals("AirSocialProfile", profileId, "lastUpdatedIndex", "2")

    // --- profiles of minted user
    assert.fieldEquals("AirSocialUser", mintedUserId, "profiles", `[]`)

    // --- profiles of new user
    let transferredToUserId = chainIdPrefix + transferring.to
    assert.fieldEquals("AirSocialUser", transferredToUserId, "id", transferredToUserId)
    assert.fieldEquals(
      "AirSocialUser",
      transferredToUserId,
      "profiles",
      `[${chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + transferring.tokenId}]`
    )
    assert.fieldEquals("AirSocialUser", transferredToUserId, "lastUpdatedIndex", "2")
    // setting default
    let setDetaultEvent = getDefaultProfileSet(settingDefault)
    handleDefaultProfileSet(setDetaultEvent)
    // -- check current user's defaultProfile
    assert.fieldEquals(
      "AirSocialUser",
      transferredToUserId,
      "defaultProfile",
      chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + minting.profileId
    )
    assert.fieldEquals("AirSocialUser", transferredToUserId, "lastUpdatedIndex", "3")
    //  -- checking default status
    assert.fieldEquals("AirSocialProfile", profileId, "isDefault", "true")

    // transferring Again
    let transferAgainEvent = getTransferEvent(transferringAgain)
    handleTransfer(transferAgainEvent)
    let transferringAgainUserId = chainIdPrefix + transferringAgain.to
    //  -- checking default status
    assert.fieldEquals("AirSocialProfile", profileId, "isDefault", "false")
    //  -- checking current user
    assert.fieldEquals("AirSocialProfile", profileId, "user", transferringAgainUserId)
    // -- checking profiles of current user
    assert.fieldEquals("AirSocialUser", transferringAgainUserId, "profiles", `[${profileId}]`)

    // -- checking profiles of old user
    assert.fieldEquals("AirSocialUser", transferredToUserId, "profiles", `[]`)
  })
  test("Testing minting multiple profile to same user", () => {
    let userId = chainIdPrefix + mint1.to
    let mint1Event = getProfileCreatedEvent(mint1)
    let mint1profileId = chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + mint1.profileId
    handleProfileCreated(mint1Event)
    //  -- see user's profiles
    assert.fieldEquals("AirSocialUser", userId, "profiles", `[${mint1profileId}]`)

    let mint2profileId = chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + mint2.profileId
    let mint2Event = getProfileCreatedEvent(mint2)
    handleProfileCreated(mint2Event)
    //  -- see user's profiles
    assert.fieldEquals(
      "AirSocialUser",
      userId,
      "profiles",
      `[${mint1profileId}, ${mint2profileId}]`
    )
  })
})
