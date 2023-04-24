import { Bytes, log } from "@graphprotocol/graph-ts"
import { assert, beforeEach, clearStore, describe, test } from "matchstick-as/assembly/index"
import { getDefaultProfileSet, getProfileCreatedEvent, getTransferEvent } from "./utils"
import { createProfile1, createProfile2, profileCreated1, setDefault2, transfer3 } from "./sample"
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
        assert.fieldEquals(
            "AirSocialProfile",
            profile1id,
            "user",
            chainIdPrefix + createProfile1.to
        )
        assert.fieldEquals(
            "AirSocialProfile",
            profile2id,
            "user",
            chainIdPrefix + createProfile2.to
        )
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
        let profileCreatedEvent = getProfileCreatedEvent(profileCreated1)
        handleProfileCreated(profileCreatedEvent)
        // checking AirSocialUser
        assert.entityCount("AirSocialUser", 1)
        assert.fieldEquals(
            "AirSocialUser",
            chainIdPrefix + profileCreated1.to,
            "address",
            chainIdPrefix + profileCreated1.to
        )
        // checking AirSocialProfile
        assert.entityCount("AirSocialProfile", 1)
        let profile1id =
            chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + profileCreated1.profileId
        assert.fieldEquals("AirSocialProfile", profile1id, "name", profileCreated1.handle)
        assert.fieldEquals(
            "AirSocialProfile",
            profile1id,
            "user",
            chainIdPrefix + profileCreated1.to
        )
        assert.fieldEquals("AirSocialProfile", profile1id, "tokenId", profileCreated1.profileId)
        assert.fieldEquals(
            "AirSocialProfile",
            profile1id,
            "tokenAddress",
            chainIdPrefix + LENSHUB_ADDRESS.toHexString()
        )
        let defaultProfileSetEvent = getDefaultProfileSet(setDefault2)
        handleDefaultProfileSet(defaultProfileSetEvent)
        // checking DefaultProfileSetEntity
        let defaultProfileSetId = setDefault2.txHash
            .concat("-")
            .concat(defaultProfileSetEvent.logIndex.toString())
        assert.entityCount("DefaultProfileSet", 1)
        assert.fieldEquals("DefaultProfileSet", defaultProfileSetId, "wallet", setDefault2.wallet)
        assert.fieldEquals("DefaultProfileSet", defaultProfileSetId, "hash", setDefault2.txHash)
        assert.fieldEquals(
            "DefaultProfileSet",
            defaultProfileSetId,
            "profileId",
            setDefault2.profileId
        )
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
            chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + setDefault2.profileId
        )
        let transferEvent = getTransferEvent(transfer3)
        handleTransfer(transferEvent)
        // checking defaultProfile in AirSocialUser (cleared to null)
        assert.fieldEquals(
            "AirSocialUser",
            chainIdPrefix + profileCreated1.to,
            "defaultProfile",
            "null"
        )
        // checking AirSocialUserDefaultProfileChangeTransaction
        assert.fieldEquals(
            "AirSocialUserDefaultProfileChangeTransaction",
            transfer3.txHash + joiner + chainIdPrefix + chainIdPrefix + profileCreated1.to,
            "oldDefaultProfile",
            chainIdPrefix + LENSHUB_ADDRESS.toHexString() + joiner + setDefault2.profileId
        )
        assert.fieldEquals(
            "AirSocialUserDefaultProfileChangeTransaction",
            transfer3.txHash + joiner + chainIdPrefix + chainIdPrefix + profileCreated1.to,
            "newDefaultProfile",
            "null"
        )
    })
})
