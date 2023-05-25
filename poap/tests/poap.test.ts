import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
    beforeEach,
    createMockedFunction,
} from "matchstick-as/assembly/index"
import { BigInt, Address, ethereum } from "@graphprotocol/graph-ts"
import { handleEventToken, handleTransfer } from "../src/poap"
import {
    assertAirPoapAttendee,
    assertAirPoapEvent,
    assertAirPoapEventAttendee,
    assertAirPoapMintTransaction,
    assertAirPoapTransferTransaction,
    createEventTokenEvent,
    createTransferEvent,
} from "./poap-utils"
import { mint, mintEventToManyUsers, transfer } from "./example"
// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
    beforeEach(() => {
        clearStore()
    })

    // For more test scenarios, see:
    // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

    test("mint and transfer case", () => {
        // minting
        let mintEvent = createTransferEvent(mint.hash, mint.address, mint.transfer[0])
        handleTransfer(mintEvent)
        let eventToken = createEventTokenEvent(mint.hash, mint.address, mint.eventToken[0])
        handleEventToken(eventToken)

        assertAirPoapAttendee(
            mint.transfer[0].to,
            [mint.eventToken[0].eventId.concat("-").concat(mint.eventToken[0].tokenId)],
            "1",
            "1"
        )

        assertAirPoapEvent(mint.eventToken[0].eventId, "0", "1", "1")

        assertAirPoapEventAttendee(
            mint.eventToken[0].eventId,
            mint.eventToken[0].tokenId,
            mint.transfer[0].to,
            mint.hash,
            mint.eventToken[0].logIndex,
            "0",
            "1",
            "1"
        )

        assertAirPoapMintTransaction(
            mint.hash,
            mint.eventToken[0].logIndex,
            "1",
            "POAP",
            "MINT",
            mint.transfer[0].to,
            mint.eventToken[0].eventId,
            mint.eventToken[0].tokenId
        )

        // transferring
        let transferEvent = createTransferEvent(
            transfer.hash,
            transfer.address,
            transfer.transfer[0]
        )
        handleTransfer(transferEvent)
        // old attendee
        assertAirPoapAttendee(
            transfer.transfer[0].from,
            [mint.eventToken[0].eventId.concat("-").concat(mint.eventToken[0].tokenId)],
            "0",
            "2"
        )
        // new attendee
        assertAirPoapAttendee(
            transfer.transfer[0].to,
            [mint.eventToken[0].eventId.concat("-").concat(mint.eventToken[0].tokenId)],
            "1",
            "3"
        )
        // POAP EVENT
        assertAirPoapEvent(mint.eventToken[0].eventId, "1", "1", "2")
        // event attendee
        assertAirPoapEventAttendee(
            mint.eventToken[0].eventId,
            mint.eventToken[0].tokenId,
            transfer.transfer[0].to,
            mint.hash,
            mint.eventToken[0].logIndex,
            "1",
            "1",
            "2"
        )
        // transfer
        assertAirPoapTransferTransaction(
            transfer.hash,
            transfer.transfer[0].logIndex,
            "1",
            "POAP",
            "TRANSFER",
            transfer.transfer[0].from,
            transfer.transfer[0].to
        )
    })
    test("mintEventToManyUsers case", () => {
        for (let i = 0; i < mintEventToManyUsers.transfer.length; i++) {
            let mintEvent = createTransferEvent(
                mintEventToManyUsers.hash,
                mintEventToManyUsers.address,
                mintEventToManyUsers.transfer[i]
            )
            handleTransfer(mintEvent)
            let eventToken = createEventTokenEvent(
                mintEventToManyUsers.hash,
                mintEventToManyUsers.address,
                mintEventToManyUsers.eventToken[i]
            )
            handleEventToken(eventToken)
        }
        assertAirPoapEvent("1", "0", "10", "10")
        assertAirPoapEventAttendee(
            mintEventToManyUsers.eventToken[mintEventToManyUsers.eventToken.length - 1].eventId,
            mintEventToManyUsers.eventToken[mintEventToManyUsers.eventToken.length - 1].tokenId,
            mintEventToManyUsers.transfer[mintEventToManyUsers.transfer.length - 1].to,
            mintEventToManyUsers.hash,
            mintEventToManyUsers.eventToken[mintEventToManyUsers.eventToken.length - 1].logIndex,
            "0",
            "10",
            "10"
        )
    })
})
