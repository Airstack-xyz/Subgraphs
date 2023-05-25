import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts"

import {
    AirPoapMintTransaction,
    AirBlock,
    AirPoapEventAttendee,
    AirPoapAttendee,
    AirPoapEvent,
    AirPoapTransferTransaction,
    AirToken,
} from "../../../generated/schema"

import {
    AIR_POAP_ATTENDEE_UPDATED_INDEX_ID,
    AIR_POAP_EVENT_ATTENDEE_LAST_UPDATED_INDEX_ID,
    AIR_POAP_EVENT_LAST_UPDATED_INDEX_ID,
    AIR_POAP_MINT_TRANSACTION_LAST_UPDATED_INDEX_ID,
    AIR_POAP_TRANSFER_TRANSACTION_LAST_UPDATED_INDEX_ID,
    MINT,
    POAP,
    TRANSFER,
} from "./utils"
import {
    updateAirEntityCounter,
    getOrCreateAirBlock,
    getOrCreateAirAccount,
    getOrCreateAirToken,
    getChainId,
    BIG_INT_ZERO,
    BIGINT_ONE,
} from "../common"

export namespace poap {
    /**
     * @dev this function is used to track minting of POAPS
     * @param block, ethereum block
     * @param transactionHash, transaction hash
     * @param logOrCallIndex, transaction log or call index
     * @param tokenAddress, tokenAddress POAP
     * @param eventId, event Id of POAP
     * @param tokenid, token Id of POAP
     * @param owner, wallet this POAP minted to
     */
    export function trackPoapMintTransactions(
        block: ethereum.Block,
        transactionHash: string,
        logOrCallIndex: BigInt,
        tokenAddress: Bytes,
        eventId: BigInt,
        tokenId: BigInt,
        tokenURI: string,
        owner: Bytes
    ): void {
        const chainId = getChainId()
        let airBlock = getOrCreateAirBlock(
            chainId,
            block.number,
            block.hash.toHexString(),
            block.timestamp
        )
        airBlock.save()

        let token = getOrCreateAirToken(chainId, tokenAddress.toHexString())
        token.save()

        let ownerAttendee = getOrCreateAirPoapAttendee(chainId, owner.toHexString(), airBlock)
        ownerAttendee.tokensOwned = ownerAttendee.tokensOwned.plus(BIGINT_ONE)
        saveAirPoapAttendee(ownerAttendee, airBlock)

        let event = getOrCreateAirPoapEvent(eventId, airBlock)
        // tokenMints = number of tokens minted under particular event
        event.tokenMints = event.tokenMints.plus(BIGINT_ONE)
        saveAirPoapEvent(event, airBlock)

        let eventAttendee = getOrCreateAirPoapEventAttendee(
            chainId,
            tokenAddress,
            airBlock,
            tokenId,
            tokenURI,
            event,
            ownerAttendee,
            event.tokenMints // used as mintOrder
        )
        saveAirPoapEventAttendee(eventAttendee, airBlock)

        createAirPoapMintTransaction(
            chainId,
            airBlock,
            transactionHash,
            logOrCallIndex,
            token,
            tokenId,
            eventAttendee,
            ownerAttendee
        )
    }
    /**
     * @dev this function is used to track transfer transactions of POAPS
     * @param block, ethereum block
     * @param transactionHash, transaction hash
     * @param logOrCallIndex, transaction log or call index
     * @param eventId, event Id of POAP
     * @param tokenid, token Id of POAP
     * @param from, from address of token
     * @param to, to address of token
     */

    export function trackPoapTransferTransactions(
        block: ethereum.Block,
        transactionHash: string,
        logOrCallIndex: BigInt,
        eventId: BigInt,
        tokenId: BigInt,
        from: Bytes,
        to: Bytes
    ): void {
        const chainId = getChainId()

        let airBlock = getOrCreateAirBlock(
            chainId,
            block.number,
            block.hash.toHexString(),
            block.timestamp
        )
        airBlock.save()

        // creating / updating from attendee
        let fromAttendee = getOrCreateAirPoapAttendee(chainId, from.toHexString(), airBlock)
        fromAttendee.tokensOwned = fromAttendee.tokensOwned.minus(BIGINT_ONE)
        saveAirPoapAttendee(fromAttendee, airBlock)
        // creating / updating to attendee
        let toAttendee = getOrCreateAirPoapAttendee(chainId, to.toHexString(), airBlock)
        toAttendee.tokensOwned = toAttendee.tokensOwned.plus(BIGINT_ONE)
        saveAirPoapAttendee(toAttendee, airBlock)

        // updating event
        let event = getOrCreateAirPoapEvent(eventId, airBlock)
        event.transferCount = event.transferCount.plus(BIGINT_ONE)
        saveAirPoapEvent(event, airBlock)

        // updating eventAttendee
        let eventAttendeeId = getAirPoapEventAttendeeId(eventId.toString(), tokenId)
        let eventAttendee = AirPoapEventAttendee.load(eventAttendeeId)
        if (eventAttendee == null) {
            throw new Error("eventAttendee should not be null")
        }
        eventAttendee.transferCount = eventAttendee.transferCount.plus(BIGINT_ONE)
        eventAttendee.owner = toAttendee.id
        saveAirPoapEventAttendee(eventAttendee, airBlock)
        createAirPoapTransferTransaction(
            chainId,
            airBlock,
            transactionHash,
            logOrCallIndex,
            eventAttendee,
            fromAttendee,
            toAttendee
        )
    }
}
function createAirPoapTransferTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    eventAttendee: AirPoapEventAttendee,
    from: AirPoapAttendee,
    to: AirPoapAttendee
): void {
    const id = chainId
        .concat("-")
        .concat(transactionHash)
        .concat("-")
        .concat(logOrCallIndex.toString())
    let entity = AirPoapTransferTransaction.load(id)
    if (entity == null) {
        entity = new AirPoapTransferTransaction(id)
        // block
        entity.block = block.id
        // hash
        entity.hash = transactionHash
        // index
        entity.lastUpdatedIndex = updateAirEntityCounter(
            AIR_POAP_TRANSFER_TRANSACTION_LAST_UPDATED_INDEX_ID,
            block
        )
        // eventAttendee
        entity.eventAttendee = eventAttendee.id
        // from
        entity.from = from.id
        // to
        entity.to = to.id
        // protocolType & protocolActionType
        entity.protocolType = POAP
        entity.protocolActionType = TRANSFER
    }
    entity.save()
}

function createAirPoapMintTransaction(
    chainId: string,
    block: AirBlock,
    transactionHash: string,
    logOrCallIndex: BigInt,
    token: AirToken,
    tokenId: BigInt,
    eventAttendee: AirPoapEventAttendee,
    attendee: AirPoapAttendee
): void {
    const id = chainId
        .concat("-")
        .concat(transactionHash)
        .concat("-")
        .concat(logOrCallIndex.toString())
    let entity = AirPoapMintTransaction.load(id)
    if (entity == null) {
        entity = new AirPoapMintTransaction(id)
        // block
        entity.block = block.id
        // hash
        entity.hash = transactionHash
        // index
        entity.lastUpdatedIndex = updateAirEntityCounter(
            AIR_POAP_MINT_TRANSACTION_LAST_UPDATED_INDEX_ID,
            block
        )
        // protocolType & protocolActionType
        entity.protocolType = POAP
        entity.protocolActionType = MINT
        // eventAttendee
        entity.eventAttendee = eventAttendee.id
        // attendee
        entity.attendee = attendee.id
        entity.save()
    }
}

function getOrCreateAirPoapAttendee(
    chainId: string,
    address: string,
    block: AirBlock
): AirPoapAttendee {
    const airAccount = getOrCreateAirAccount(chainId, address, block)
    airAccount.save()
    const id = chainId.concat("-").concat(address)
    let entity = AirPoapAttendee.load(id)
    if (entity == null) {
        entity = new AirPoapAttendee(id)
        entity.address = airAccount.id
        entity.createdAt = block.id
        entity.updatedAt = block.id
        entity.tokensOwned = BIG_INT_ZERO
        entity.lastUpdatedIndex = BIG_INT_ZERO
    }
    return entity as AirPoapAttendee
}

function saveAirPoapAttendee(attendee: AirPoapAttendee, block: AirBlock): void {
    attendee.lastUpdatedIndex = updateAirEntityCounter(AIR_POAP_ATTENDEE_UPDATED_INDEX_ID, block)
    attendee.updatedAt = block.id
    attendee.save()
}

function getOrCreateAirPoapEvent(eventId: BigInt, block: AirBlock): AirPoapEvent {
    let entity = AirPoapEvent.load(eventId.toString())
    if (entity == null) {
        entity = new AirPoapEvent(eventId.toString())
        entity.createdAt = block.id
        // entity.tokenCount = BIG_INT_ZERO
        entity.transferCount = BIG_INT_ZERO
        entity.tokenMints = BIG_INT_ZERO
        entity.updatedAt = block.id
        entity.lastUpdatedIndex = BIG_INT_ZERO
    }
    return entity
}
function saveAirPoapEvent(event: AirPoapEvent, block: AirBlock): void {
    event.lastUpdatedIndex = updateAirEntityCounter(AIR_POAP_EVENT_LAST_UPDATED_INDEX_ID, block)
    event.updatedAt = block.id
    event.save()
}

function getAirPoapEventAttendeeId(eventId: string, tokenId: BigInt): string {
    const id = eventId.concat("-").concat(tokenId.toString())
    return id
}

function getOrCreateAirPoapEventAttendee(
    chainId: string,
    tokenAddress: Bytes,
    block: AirBlock,
    tokenId: BigInt,
    tokenUri: string,
    event: AirPoapEvent,
    owner: AirPoapAttendee,
    mintOrder: BigInt
): AirPoapEventAttendee {
    const id = getAirPoapEventAttendeeId(event.id, tokenId)
    let entity = AirPoapEventAttendee.load(id)
    if (entity == null) {
        entity = new AirPoapEventAttendee(id)
        entity.event = event.id
        entity.tokenId = tokenId.toString()
        let token = getOrCreateAirToken(chainId, tokenAddress.toHexString())
        entity.tokenAddress = token.id
        entity.transferCount = BIG_INT_ZERO
        entity.createdAt = block.id
        entity.mintOrder = mintOrder
        entity.owner = owner.id
        entity.updatedAt = block.id
        entity.tokenUri = tokenUri
        entity.lastUpdatedIndex = BIG_INT_ZERO
    }
    return entity
}

function saveAirPoapEventAttendee(eventAttendee: AirPoapEventAttendee, block: AirBlock): void {
    eventAttendee.updatedAt = block.id
    eventAttendee.lastUpdatedIndex = updateAirEntityCounter(
        AIR_POAP_EVENT_ATTENDEE_LAST_UPDATED_INDEX_ID,
        block
    )
    eventAttendee.save()
}
