import { Address, log } from "@graphprotocol/graph-ts"
import { EventToken, Transfer, SetBaseURICall } from "../generated/poap/poap"
import * as airstack from "../modules/airstack/poap"
import { ValidateEntity } from "../generated/schema"
import { BIG_INT_ZERO } from "../modules/airstack/common"

export function handleEventToken(event: EventToken): void {
    const eventId = event.params.eventId
    const tokenId = event.params.tokenId
    let validateEntity = ValidateEntity.load(tokenId.toString())
    if (validateEntity == null) {
        // this means minting of this token is not tracked properly
        throw new Error("mint logic failed - entity should not be null")
    }
    if (validateEntity.from != Address.zero()) {
        // this means minting of this token is not tracked properly
        throw new Error("mint logic failed - from should be zero address")
    }
    validateEntity.mintHash = event.transaction.hash.toHexString()
    validateEntity.eventId = eventId
    validateEntity.save()
    airstack.poap.trackPoapMintTransactions(
        event.block,
        event.transaction.hash.toHexString(),
        event.logIndex,
        event.address,
        eventId,
        tokenId,
        validateEntity.to
    )
}

export function handleTransfer(event: Transfer): void {
    const tokenId = event.params.tokenId
    const from = event.params.from
    const to = event.params.to
    let validateEntity = ValidateEntity.load(tokenId.toString())
    if (validateEntity == null) {
        if (from != Address.zero()) {
            // this means given token is already minted but not captured by our logic
            log.error("Non mint case - validate Entity should not be null,hash:{}", [
                event.transaction.hash.toHexString(),
            ])
            throw new Error(
                "Non mint case - validate Entity should not be null,hash:" +
                    event.transaction.hash.toHexString()
            )
        }
        validateEntity = new ValidateEntity(tokenId.toString())
        validateEntity.eventId = BIG_INT_ZERO
        validateEntity.from = from
        validateEntity.to = to
        validateEntity.mintHash = ""
        validateEntity.save()
    } else {
        airstack.poap.trackPoapTransferTransactions(
            event.block,
            event.transaction.hash.toHexString(),
            event.logIndex,
            validateEntity.eventId,
            tokenId,
            from,
            to
        )
    }
}

export function handleSetBaseURI(call: SetBaseURICall): void {
    const baseURI = call.inputs.baseURI
    airstack.poap.trackPoapBaseURI(call.block, call.to, baseURI)
}
