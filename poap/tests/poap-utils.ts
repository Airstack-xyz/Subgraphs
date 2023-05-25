import { assert, createMockedFunction, log, newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { EventToken, Transfer } from "../generated/poap/poap"
import { TransferClass, EventTokenClass } from "./example"

export const MOCK_ENDPOINT_PREFIX = "http://www.poap.com/"

export function createEventTokenEvent(
    hash: string,
    address: string,
    event: EventTokenClass
): EventToken {
    let eventTokenEvent: EventToken = changetype<EventToken>(newMockEvent())

    eventTokenEvent.parameters = new Array()

    eventTokenEvent.parameters.push(
        new ethereum.EventParam(
            "eventId",
            ethereum.Value.fromUnsignedBigInt(BigInt.fromString(event.eventId))
        )
    )
    eventTokenEvent.parameters.push(
        new ethereum.EventParam(
            "tokenId",
            ethereum.Value.fromUnsignedBigInt(BigInt.fromString(event.tokenId))
        )
    )
    eventTokenEvent.transaction.hash = Bytes.fromHexString(hash)
    eventTokenEvent.logIndex = BigInt.fromString(event.logIndex)
    // mocking RPC call
    createMockedFunction(eventTokenEvent.address, "tokenURI", "tokenURI(uint256):(string)")
        .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(event.tokenId))])
        .returns([ethereum.Value.fromString(MOCK_ENDPOINT_PREFIX.concat(event.tokenId))])
    return eventTokenEvent
}

export function createTransferEvent(
    hash: string,
    address: string,
    transfer: TransferClass
): Transfer {
    let transferEvent: Transfer = changetype<Transfer>(newMockEvent())

    transferEvent.parameters = new Array()

    transferEvent.parameters.push(
        new ethereum.EventParam(
            "from",
            ethereum.Value.fromAddress(Address.fromString(transfer.from))
        )
    )
    transferEvent.parameters.push(
        new ethereum.EventParam("to", ethereum.Value.fromAddress(Address.fromString(transfer.to)))
    )
    transferEvent.parameters.push(
        new ethereum.EventParam(
            "tokenId",
            ethereum.Value.fromUnsignedBigInt(BigInt.fromString(transfer.tokenId))
        )
    )
    transferEvent.transaction.hash = Bytes.fromHexString(hash)
    transferEvent.logIndex = BigInt.fromString(transfer.logIndex)
    // transferEvent.address = Address.fromHexString(address)

    return transferEvent
}

export function assertAirPoapAttendee(
    address: string,
    eventAttendee: string[],
    tokensOwned: string,
    lastUpdatedIndex: string
): void {
    assert.fieldEquals("AirPoapAttendee", "1-" + address, "id", "1-" + address)
    assert.fieldEquals("AirPoapAttendee", "1-" + address, "tokensOwned", tokensOwned)
    assert.fieldEquals("AirPoapAttendee", "1-" + address, "lastUpdatedIndex", lastUpdatedIndex)
    let eventAttendeeStr = "["
    for (let i = 0; i < eventAttendee.length; i++) {
        const ea = eventAttendee[i]
        eventAttendeeStr = eventAttendeeStr.concat(ea)
        if (i < eventAttendee.length - 1) {
            eventAttendeeStr = eventAttendeeStr.concat(",")
        }
    }
    eventAttendeeStr = eventAttendeeStr.concat("]")
    assert.fieldEquals("AirPoapAttendee", "1-" + address, "eventAttendee", eventAttendeeStr)
}

export function assertAirPoapEvent(
    eventId: string,
    transferCount: string,
    tokenMints: string,
    lastUpdatedIndex: string
): void {
    assert.fieldEquals("AirPoapEvent", eventId, "id", eventId)
    assert.fieldEquals("AirPoapEvent", eventId, "transferCount", transferCount)
    assert.fieldEquals("AirPoapEvent", eventId, "tokenMints", tokenMints)
    assert.fieldEquals("AirPoapEvent", eventId, "lastUpdatedIndex", lastUpdatedIndex)
}
export function assertAirPoapEventAttendee(
    eventId: string,
    tokenId: string,
    owner: string,
    mintHash: string,
    mintLogIndex: string,
    transferCount: string,
    mintOrder: string,
    lastUpdatedIndex: string
): void {
    let id = eventId.concat("-").concat(tokenId)
    assert.fieldEquals("AirPoapEventAttendee", id, "id", id)
    assert.fieldEquals("AirPoapEventAttendee", id, "tokenId", tokenId)
    assert.fieldEquals("AirPoapEventAttendee", id, "owner", "1-".concat(owner))
    assert.fieldEquals(
        "AirPoapEventAttendee",
        id,
        "mint",
        "[1-"
            .concat(mintHash)
            .concat("-")
            .concat(mintLogIndex)
            .concat("]")
    )
    assert.fieldEquals("AirPoapEventAttendee", id, "transferCount", transferCount)
    assert.fieldEquals("AirPoapEventAttendee", id, "mintOrder", mintOrder)
    assert.fieldEquals("AirPoapEventAttendee", id, "lastUpdatedIndex", lastUpdatedIndex)
}

export function assertAirPoapMintTransaction(
    hash: string,
    logIndex: string,
    lastUpdatedIndex: string,
    protocolType: string,
    protocolActionType: string,
    attendee: string,
    eventId: string,
    tokenId: string
): void {
    let id = "1-"
        .concat(hash)
        .concat("-")
        .concat(logIndex)
    assert.fieldEquals("AirPoapMintTransaction", id, "id", id)
    assert.fieldEquals("AirPoapMintTransaction", id, "hash", hash)
    assert.fieldEquals("AirPoapMintTransaction", id, "lastUpdatedIndex", lastUpdatedIndex)
    assert.fieldEquals("AirPoapMintTransaction", id, "protocolType", protocolType)
    assert.fieldEquals("AirPoapMintTransaction", id, "protocolActionType", protocolActionType)
    assert.fieldEquals("AirPoapMintTransaction", id, "attendee", "1-".concat(attendee))
    assert.fieldEquals(
        "AirPoapMintTransaction",
        id,
        "eventAttendee",
        eventId.concat("-").concat(tokenId)
    )
}

export function assertAirPoapTransferTransaction(
    hash: string,
    logIndex: string,
    lastUpdatedIndex: string,
    protocolType: string,
    protocolActionType: string,
    from: string,
    to: string
): void {
    let id = "1-"
        .concat(hash)
        .concat("-")
        .concat(logIndex)
    assert.fieldEquals("AirPoapTransferTransaction", id, "id", id)
    assert.fieldEquals("AirPoapTransferTransaction", id, "hash", hash)
    assert.fieldEquals("AirPoapTransferTransaction", id, "lastUpdatedIndex", lastUpdatedIndex)
    assert.fieldEquals("AirPoapTransferTransaction", id, "protocolType", protocolType)
    assert.fieldEquals("AirPoapTransferTransaction", id, "protocolActionType", protocolActionType)
    assert.fieldEquals("AirPoapTransferTransaction", id, "from", "1-".concat(from))
    assert.fieldEquals("AirPoapTransferTransaction", id, "from", "1-".concat(from))
    assert.fieldEquals("AirPoapTransferTransaction", id, "to", "1-".concat(to))
}
