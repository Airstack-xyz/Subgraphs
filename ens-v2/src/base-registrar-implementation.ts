import { BigInt, ens, log, ByteArray, Address } from "@graphprotocol/graph-ts"
import {
    ControllerAdded,
    ControllerRemoved,
    NameMigrated as NameMigratedEvent,
    NameRegistered as NameRegisteredEvent,
    NameRenewed as NameRenewedEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
    Transfer as TransferEvent,
} from "../generated/BaseRegistrarImplementation/BaseRegistrarImplementation"
import {
    AirDomain,
    AirDomainRegistration,
    ControllerAddedEvent,
    ControllerRemovedEvent,
    NewOwnerHashLabelMap,
    RemovedController,
} from "../generated/schema"
import { ETHRegistrarController } from "../generated/templates"
import {
    createEventID,
    getOrCreateAirDomainAccount,
    getOrCreateAirDomainRegistration,
    rootNode,
    saveAirDomainRegistration,
    saveAirDomain,
    uint256ToByteArray,
} from "./module-utils"
import { BIG_INT_ZERO } from "./common"
import { getNameHashFromBytesArr } from "./ens-utils"

export function handleControllerAdded(event: ControllerAdded): void {
    const controller = event.params.controller

    let entity = new ControllerAddedEvent(createEventID(event))
    entity.controller = controller
    entity.baseRegistrar = event.address
    entity.blockNumber = event.block.number.toI32()
    entity.txHash = event.transaction.hash
    entity.save()

    // creating Controller
    ETHRegistrarController.create(controller)
}

export function handleControllerRemoved(event: ControllerRemoved): void {
    const controller = event.params.controller

    let entity = new ControllerRemovedEvent(createEventID(event))
    entity.controller = controller
    entity.baseRegistrar = event.address
    entity.blockNumber = event.block.number.toI32()
    entity.txHash = event.transaction.hash
    entity.save()

    //tracking removed controller
    let removedController = new RemovedController(controller.toHexString())
    removedController.save()
}

// export function handleNameMigrated(event: NameMigratedEvent): void {
//     let counter = getCounter("NameMigrated")

//     let nameMigrated = new NameMigrated(counter.count.toString())
//     nameMigrated.index = counter.count
//     nameMigrated.hash = event.transaction.hash
//     nameMigrated.ensId = event.params.id
//     nameMigrated.owner = event.params.owner
//     nameMigrated.expires = event.params.expires
//     nameMigrated.save()

//     counter.save()
// }

export function handleNameRegistered(event: NameRegisteredEvent): void {
    const txHash = event.transaction.hash
    const tokenId = event.params.id
    const owner = event.params.owner
    const expires = event.params.expires
    const label = uint256ToByteArray(tokenId)
    // get Domain
    const hashlabelMap = NewOwnerHashLabelMap.load(txHash.toHexString() + "-" + label.toHexString())
    if (!hashlabelMap) {
        log.error("hashlabelmap not found,hash {} label {}", [
            txHash.toHexString(),
            label.toHexString(),
        ])
        return
    }
    let domain = AirDomain.load(hashlabelMap.domainId)
    if (!domain) {
        throw new Error(
            "domain not found base registrar name registrered,hash: " + txHash.toHexString()
        )
    }
    let account = getOrCreateAirDomainAccount(owner, event.block)
    let registration = getOrCreateAirDomainRegistration(label.toHexString(), event.block)
    registration.domain = domain.id
    registration.registrationDate = event.block.timestamp
    registration.cost = BIG_INT_ZERO
    registration.owner = account.id
    registration.expiryDate = expires
    saveAirDomainRegistration(registration, event.block)
}

export function handleNameRenewed(event: NameRenewedEvent): void {
    const txHash = event.transaction.hash
    const tokenId = event.params.id
    const expires = event.params.expires
    const label = uint256ToByteArray(tokenId)
    let registration = AirDomainRegistration.load(label.toHexString())
    if (!registration) {
        log.error("airDomainRegistration not found, label {} txHash {}", [
            label.toHexString(),
            txHash.toHexString(),
        ])
    }
    registration!.expiryDate = expires
    saveAirDomainRegistration(registration!, event.block)
}

// export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
//     let counter = getCounter("OwnershipTransferred")

//     let ownershipTransferred = new OwnershipTransferred(counter.count.toString())
//     ownershipTransferred.index = counter.count
//     ownershipTransferred.hash = event.transaction.hash

//     ownershipTransferred.previousOwner = event.params.previousOwner
//     ownershipTransferred.newOwner = event.params.newOwner
//     ownershipTransferred.save()

//     counter.save()
// }

export function handleTransfer(event: TransferEvent): void {
    const txHash = event.transaction.hash
    const from = event.params.from
    const to = event.params.to
    const tokenId = event.params.tokenId
    if (from != Address.zero()) {
        const label = uint256ToByteArray(tokenId)
        const nameHash = getNameHashFromBytesArr(rootNode, label)
        let domain = AirDomain.load(nameHash)
        if (!domain) {
            log.error("domain not found, label {} txHash {}", [
                label.toHexString(),
                txHash.toHexString(),
            ])
        }
        let toAddress = getOrCreateAirDomainAccount(to, event.block)
        toAddress.save()
        domain!.owner = toAddress.id
        saveAirDomain(domain!, event.block)
    }
}
