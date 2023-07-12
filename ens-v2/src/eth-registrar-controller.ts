import { BigInt, log } from "@graphprotocol/graph-ts"
import {
    NameRegistered as NameRegisteredEvent,
    NameRenewed as NameRenewedEvent,
} from "../generated/templates/ETHRegistrarController/ETHRegistrarController"
import { AirDomain, AirDomainRegistration, RemovedController } from "../generated/schema"
import { rootNode, saveAirDomainRegistration, saveAirDomain } from "./module-utils"
import { getNameHashFromBytesArr } from "./ens-utils"

export function handleNameRegistered(event: NameRegisteredEvent): void {
    let shouldRemove = RemovedController.load(event.address.toHexString())
    if (!shouldRemove) {
        const hash = event.transaction.hash

        const name = event.params.name
        const label = event.params.label
        const owner = event.params.owner
        const cost = event.params.cost
        const expires = event.params.expires

        const nameHash = getNameHashFromBytesArr(rootNode, label)
        let domain = AirDomain.load(nameHash)
        if (!domain) {
            log.error("domain not found, label {} txHash {}", [
                label.toHexString(),
                hash.toHexString(),
            ])
        }
        domain!.name = name
        saveAirDomain(domain!, event.block)

        let registration = AirDomainRegistration.load(label.toHexString())
        if (!registration) {
            log.error("airDomainRegistration not found, label {} txHash {}", [
                label.toHexString(),
                hash.toHexString(),
            ])
        }
        registration!.cost = cost
        registration!.expiryDate = expires
        saveAirDomainRegistration(registration!, event.block)
    }
}

export function handleNameRenewed(event: NameRenewedEvent): void {
    let shouldRemove = RemovedController.load(event.address.toHexString())
    if (!shouldRemove) {
        const hash = event.transaction.hash

        const name = event.params.name
        const label = event.params.label
        const cost = event.params.cost
        const expires = event.params.expires

        const nameHash = getNameHashFromBytesArr(rootNode, label)
        let domain = AirDomain.load(nameHash)
        if (!domain) {
            log.error("domain not found, label {} txHash {}", [
                label.toHexString(),
                hash.toHexString(),
            ])
        }
        domain!.name = name
        saveAirDomain(domain!, event.block)

        let registration = AirDomainRegistration.load(label.toHexString())
        if (!registration) {
            log.error("airDomainRegistration not found, label {} txHash {}", [
                label.toHexString(),
                hash.toHexString(),
            ])
        }
        registration!.cost = cost
        registration!.expiryDate = expires
        saveAirDomainRegistration(registration!, event.block)
    }
}
