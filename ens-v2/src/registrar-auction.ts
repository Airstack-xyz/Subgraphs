import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts"
import { HashRegistered as HashRegistered1 } from "../generated/RegistrarAuction1/Registrar"
import { HashRegistered as HashRegistered2 } from "../generated/RegistrarAuction2/Registrar"
import { NewOwnerHashLabelMap } from "../generated/schema"
import * as airstack from "../modules/airstack/domain-name"

const _handleHashRegistered = (
    txHash: Bytes,
    block: ethereum.Block,
    label: Bytes,
    owner: Address,
    registrationDate: BigInt,
    value: BigInt,
    logIndex: BigInt
): void => {
    const hashlabelMap = NewOwnerHashLabelMap.load(txHash.toHexString() + "-" + label.toHexString())
    if (!hashlabelMap) {
        log.error("hashlabelmap not found,hash {} label {}", [
            txHash.toHexString(),
            label.toHexString(),
        ])
        return
    }
    airstack.domain.trackAirDomainRegistrationDateAndCost(
        txHash,
        hashlabelMap.domainId,
        registrationDate,
        value,
        owner,
        block
    )
}

export function handleHashRegistered1(event: HashRegistered1): void {
    const txHash = event.transaction.hash
    const block = event.block

    const label = event.params.hash
    const owner = event.params.owner
    const registrationDate = event.params.registrationDate
    const value = event.params.value

    _handleHashRegistered(txHash, block, label, owner, registrationDate, value, event.logIndex)
}

export function handleHashRegistered2(event: HashRegistered2): void {
    const txHash = event.transaction.hash
    const block = event.block

    const hash = event.params.hash
    const owner = event.params.owner
    const registrationDate = event.params.registrationDate
    const value = event.params.value
    _handleHashRegistered(txHash, block, hash, owner, registrationDate, value, event.logIndex)
}
