import {
    ControllerChanged,
    ExpiryExtended,
    FusesSet,
    NameUnwrapped,
    NameWrapped,
    TransferBatch,
    TransferSingle,
} from "../generated/NameWrapper/NameWrapper"
import { ControllerNameWrapperRemoved, FusesSetTxn } from "../generated/schema"
import {
    createControllerNameWrapper,
    createEventID,
    decodeNameInBytes,
    getNameHashFromTokenId,
} from "./utils"
import * as airstack from "../modules/airstack/domain-name"
import { Bytes, ethereum } from "@graphprotocol/graph-ts"
import { BIGINT_ONE } from "../modules/airstack/common"

export function handleControllerChanged(event: ControllerChanged): void {
    let txHash = event.transaction.hash
    let active = event.params.active
    let controller = event.params.controller
    if (active) {
        createControllerNameWrapper(controller, txHash)
    } else {
        let controllerNameWrapperRemoved = new ControllerNameWrapperRemoved(
            controller.toHexString()
        )
        controllerNameWrapperRemoved.save()
    }
}

export function handleNameWrapped(event: NameWrapped): void {
    let txHash = event.transaction.hash
    let expiry = event.params.expiry
    let fuses = event.params.fuses
    let node = event.params.node
    let owner = event.params.owner
    let tokenAddress = event.address
    let decoded = decodeNameInBytes(event.params.name)
    let label = ""
    let name = ""
    if (decoded.length == 2) {
        label = decoded[0]
        name = decoded[1]
    }
    airstack.domain.trackNameWrapped(
        node.toHexString(),
        name,
        label,
        expiry,
        owner,
        txHash,
        event.block,
        event.logIndex,
        fuses
    )
}

export function handleNameUnwrapped(event: NameUnwrapped): void {
    let txHash = event.transaction.hash
    let node = event.params.node
    let owner = event.params.owner
    airstack.domain.trackNameUnwrapped(
        txHash,
        event.logIndex,
        owner,
        node.toHexString(),
        event.block
    )
}

export function handleFusesSet(event: FusesSet): void {
    const txHash = event.transaction.hash
    const node = event.params.node
    const fuses = event.params.fuses
    const block = event.block
    airstack.domain.trackAirDomainFusesSet(node.toHexString(), fuses, block)
    const logIndex = event.logIndex

    let fusesSet = new FusesSetTxn(createEventID(block, logIndex))
    fusesSet.txHash = txHash
    fusesSet.node = node
    fusesSet.fuses = fuses
    fusesSet.save()
}

export function handleExpiryExtended(event: ExpiryExtended): void {
    let txHash = event.transaction.hash
    let node = event.params.node
    let expiry = event.params.expiry
    const block = event.block
    const from = event.transaction.from
    airstack.domain.trackAirDomainExpiryExtended(txHash, from, node.toHexString(), expiry, block)
}

export function handleTransferSingle(event: TransferSingle): void {
    let txHash = event.transaction.hash
    let from = event.params.from
    let id = event.params.id
    let operator = event.params.operator
    let to = event.params.to
    let value = event.params.value
    let node = getNameHashFromTokenId(id)
    let block = event.block
    if (value != BIGINT_ONE) {
        throw new Error("Transfer single value gt 1 found")
    }
    airstack.domain.trackAirDomainTransfer(
        event.address,
        id,
        node,
        from,
        to,
        txHash,
        block,
        event.logIndex
    )
}
export function handleTransferBatch(event: TransferBatch): void {
    let txHash = event.transaction.hash
    let from = event.params.from
    let ids = event.params.ids
    let operator = event.params.operator
    let to = event.params.to
    let values = event.params.values
    let block = event.block
    for (let index = 0; index < ids.length; index++) {
        const id = ids[index]
        const value = values[index]
        if (value != BIGINT_ONE) {
            throw new Error("Transfer single value gt 1 found")
        }
        let node = getNameHashFromTokenId(id)
        airstack.domain.trackAirDomainTransfer(
            event.address,
            id,
            node,
            from,
            to,
            txHash,
            block,
            event.logIndex
        )
    }
}
