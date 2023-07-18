import { newMockEvent } from "matchstick-as"
import { ControllerChanged, NameWrapped, NameUnwrapped } from "../generated/NameWrapper/NameWrapper"
import {
    getAddressEventParam,
    getBigIntEventParam,
    getBoolEventParam,
    getBytesEventParam,
} from "./utils"
import { Bytes } from "@graphprotocol/graph-ts"

//  ---------- ControllerChanged (index_topic_1 address controller, bool active) -----
export class ControllerChangedInput {
    hash: string
    controller: string
    bool: boolean
}

// (index_topic_1 bytes32 hash, index_topic_2 address owner, uint256 value, uint256 registrationDate)
export function createControllerChangedEvent(input: ControllerChangedInput): ControllerChanged {
    let controllerChanged = changetype<ControllerChanged>(newMockEvent())

    const controllerParam = getAddressEventParam("controller", input.controller)
    const boolParam = getBoolEventParam("bool", input.bool)

    controllerChanged.parameters = [controllerParam, boolParam]
    controllerChanged.transaction.hash = Bytes.fromHexString(input.hash)
    return controllerChanged
}
// NameWrapped (index_topic_1 bytes32 node, bytes name, address owner, uint32 fuses, uint64 expiry)
export class NameWrappedInput {
    hash: string
    node: string
    name: string
    owner: string
    fuses: string
    expiry: string
}
export function createNameWrappedEvent(input: NameWrappedInput): NameWrapped {
    let nameWrappedEvent = changetype<NameWrapped>(newMockEvent())

    const nodeParam = getBytesEventParam("node", input.node)
    const nameParam = getBytesEventParam("name", input.name)
    const ownerParam = getAddressEventParam("owner", input.owner)
    const fusesParam = getBigIntEventParam("fuses", input.fuses)
    const expiryParam = getBigIntEventParam("expiry", input.expiry)

    nameWrappedEvent.parameters = [nodeParam, nameParam, ownerParam, fusesParam, expiryParam]
    nameWrappedEvent.transaction.hash = Bytes.fromHexString(input.hash)
    return nameWrappedEvent
}

/// NameUnwrapped (index_topic_1 bytes32 node, address owner)
export class NameUnwrappedInput {
    hash: string
    node: string
    owner: string
}
export function createNameUnwrappedEvent(input: NameUnwrappedInput): NameUnwrapped {
    let nameUnwrappedEvent = changetype<NameUnwrapped>(newMockEvent())

    const nodeParam = getBytesEventParam("node", input.node)
    const ownerParam = getAddressEventParam("owner", input.owner)

    nameUnwrappedEvent.parameters = [nodeParam, ownerParam]
    nameUnwrappedEvent.transaction.hash = Bytes.fromHexString(input.hash)
    return nameUnwrappedEvent
}
