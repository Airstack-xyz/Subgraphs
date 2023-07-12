import { Address, BigInt, Bytes, ens, ethereum, log } from "@graphprotocol/graph-ts"
import { HashRegistered as HashRegisteredEventOld1 } from "../generated/RegistrarOld1/Registrar"
import { HashRegistered as HashRegisteredEventOld2 } from "../generated/RegistrarOld2/Registrar"
import {
    getOrCreateAirDomainAccount,
    getOrCreateAirDomainRegistration,
    saveAirDomainRegistration,
} from "./module-utils"
import { AirDomain, NewOwnerHashLabelMap } from "../generated/schema"

export function handleHashRegistered1(event: HashRegisteredEventOld1): void {
    const hash = event.transaction.hash
    const ensHash = event.params.hash
    const owner = event.params.owner
    const value = event.params.value
    const registrationDate = event.params.registrationDate
    handleHashRegistered(hash, ensHash, owner, value, registrationDate, event.block)
}

export function handleHashRegistered2(event: HashRegisteredEventOld2): void {
    const hash = event.transaction.hash
    const ensHash = event.params.hash
    const owner = event.params.owner
    const value = event.params.value
    const registrationDate = event.params.registrationDate
    handleHashRegistered(hash, ensHash, owner, value, registrationDate, event.block)
}

function handleHashRegistered(
    hash: Bytes,
    ensHash: Bytes,
    owner: Address,
    value: BigInt,
    registrationDate: BigInt,
    block: ethereum.Block
): void {
    const hashStr = hash.toHexString()
    const ensHashStr = ensHash.toHexString()
    const hashlabelMap = NewOwnerHashLabelMap.load(hashStr + "-" + ensHashStr)
    if (!hashlabelMap) {
        log.error("hashlabelmap not found,hash {} label {}", [hashStr, ensHashStr])
        return
    }
    let domain = AirDomain.load(hashlabelMap.domainId)
    if (!domain) {
        throw new Error("domain not found during registration ,hash: " + hash.toHexString())
    }
    let account = getOrCreateAirDomainAccount(owner, block)
    let registration = getOrCreateAirDomainRegistration(ensHash.toHexString(), block)
    registration.domain = domain.id
    registration.registrationDate = registrationDate
    registration.cost = value
    registration.owner = account.id
    saveAirDomainRegistration(registration, block)
}
