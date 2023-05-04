import { Bytes, BigInt } from "@graphprotocol/graph-ts"
import { UserToDefaultProfileIdMap } from "../../generated/schema"
import { BIG_INT_ZERO } from "../../modules/airstack/common"

export function createOrUpdateUserToDefaultProfileIdMap(wallet: Bytes, profileId: BigInt): void {
    let userToDefault = UserToDefaultProfileIdMap.load(wallet.toHexString())
    if (userToDefault == null) {
        userToDefault = new UserToDefaultProfileIdMap(wallet.toHexString())
    }
    userToDefault.profileId = profileId
    userToDefault.save()
}
export function getDefaultProfileIdfromUser(wallet: Bytes): BigInt {
    let userToDefault = UserToDefaultProfileIdMap.load(wallet.toHexString())
    if (userToDefault == null) {
        return BIG_INT_ZERO
    }
    return userToDefault.profileId
}
