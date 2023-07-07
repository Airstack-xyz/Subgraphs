import { newMockEvent } from "matchstick-as"
import { HashRegistered } from "../generated/RegistrarOld1/Registrar"
import { getAddressEventParam, getBigIntEventParam, getBytesEventParam } from "./utils"
import { Bytes } from "@graphprotocol/graph-ts"

export class HashRegisteredInput {
    hash: string
    ensHash: string
    owner: string
    value: string
    registrationDate: string
}
// (index_topic_1 bytes32 hash, index_topic_2 address owner, uint256 value, uint256 registrationDate)
export function createHashRegistered(hashRegistered: HashRegisteredInput): HashRegistered {
    let hashRegisteredEvent = changetype<HashRegistered>(newMockEvent())

    const ensHashParam = getBytesEventParam("hash", hashRegistered.ensHash)
    const ownerParam = getAddressEventParam("owner", hashRegistered.owner)
    const valueParam = getBigIntEventParam("value", hashRegistered.value)
    const registrationDateParam = getBigIntEventParam(
        "registrationDate",
        hashRegistered.registrationDate
    )
    hashRegisteredEvent.parameters = [ensHashParam, ownerParam, valueParam, registrationDateParam]
    hashRegisteredEvent.transaction.hash = Bytes.fromHexString(hashRegistered.hash)
    return hashRegisteredEvent
}
