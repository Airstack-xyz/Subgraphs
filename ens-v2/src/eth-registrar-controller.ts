import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import {
    NameRegistered as NameRegistered1,
    NameRenewed as NameRenewed1,
} from "../generated/ETHRegistrarController1/ETHRegistrarController"

import {
    NameRegistered as NameRegistered2,
    NameRenewed as NameRenewed2,
} from "../generated/ETHRegistrarController2/ETHRegistrarController"

import {
    NameRegistered as NameRegistered3,
    NameRenewed as NameRenewed3,
} from "../generated/ETHRegistrarController3/ETHRegistrarController"
import {
    NameRegistered as NameRegisteredTemplate,
    NameRenewed as NameRenewedTemplate,
} from "../generated/templates/ETHRegistrarControllerTemplate/ETHRegistrarController"
import * as airstack from "../modules/airstack/domain-name"
import { checkValidLabel, getNameHashFromByteArray, rootNode } from "./utils"
import { ControllerRemoved, InvalidName } from "../generated/schema"

export const _handleNameRegistered = (
    controller: Address,
    txHash: Bytes,
    block: ethereum.Block,
    name: string,
    label: Bytes,
    owner: Address,
    cost: BigInt,
    expires: BigInt,
    logIndex: BigInt
): void => {
    if (ControllerRemoved.load(controller.toHexString())) {
        return
    }
    if (!checkValidLabel(name)) {
        let invalidName = new InvalidName(name + "-" + txHash.toHexString())
        invalidName.name = name
        invalidName.label = label
        invalidName.txHash = txHash
        invalidName.save()
        return
    }
    const domainId = getNameHashFromByteArray(rootNode, label)
    airstack.domain.trackAirDomainRegistrationNameCostExpiry(
        domainId,
        name,
        label,
        cost,
        expires,
        owner,
        txHash,
        block
    )
}

export const _handleNameRenewed = (
    controller: Address,
    txHash: Bytes,
    block: ethereum.Block,
    name: string,
    label: Bytes,
    cost: BigInt,
    from: Address,
    expires: BigInt,
    logIndex: BigInt
): void => {
    if (ControllerRemoved.load(controller.toHexString())) {
        return
    }
    if (!checkValidLabel(name)) {
        let invalidName = new InvalidName(name + "-" + txHash.toHexString())
        invalidName.name = name
        invalidName.label = label
        invalidName.txHash = txHash
        invalidName.save()
        return
    }
    const domainId = getNameHashFromByteArray(rootNode, label)
    airstack.domain.trackAirDomainRenewalNameCostExpiry(
        domainId,
        name,
        label,
        cost,
        expires,
        from,
        txHash,
        block
    )
}

export function handleNameRegistered1(event: NameRegistered1): void {
    const txHash = event.transaction.hash
    const block = event.block

    const name = event.params.name
    const label = event.params.label
    const owner = event.params.owner
    const cost = event.params.cost
    const expires = event.params.expires
    _handleNameRegistered(
        event.address,
        txHash,
        block,
        name,
        label,
        owner,
        cost,
        expires,
        event.logIndex
    )
}
export function handleNameRegistered2(event: NameRegistered2): void {
    const txHash = event.transaction.hash
    const block = event.block

    const name = event.params.name
    const label = event.params.label
    const owner = event.params.owner
    const cost = event.params.cost
    const expires = event.params.expires
    _handleNameRegistered(
        event.address,
        txHash,
        block,
        name,
        label,
        owner,
        cost,
        expires,
        event.logIndex
    )
}
export function handleNameRegistered3(event: NameRegistered3): void {
    const txHash = event.transaction.hash
    const block = event.block

    const name = event.params.name
    const label = event.params.label
    const owner = event.params.owner
    const cost = event.params.cost
    const expires = event.params.expires
    _handleNameRegistered(
        event.address,
        txHash,
        block,
        name,
        label,
        owner,
        cost,
        expires,
        event.logIndex
    )
}
export function handleNameRegisteredTemplate(event: NameRegisteredTemplate): void {
    const txHash = event.transaction.hash
    const block = event.block

    const name = event.params.name
    const label = event.params.label
    const owner = event.params.owner
    const cost = event.params.cost
    const expires = event.params.expires
    _handleNameRegistered(
        event.address,
        txHash,
        block,
        name,
        label,
        owner,
        cost,
        expires,
        event.logIndex
    )
}

export function handleNameRenewed1(event: NameRenewed1): void {
    const txHash = event.transaction.hash
    const block = event.block

    const name = event.params.name
    const label = event.params.label
    const cost = event.params.cost
    const expires = event.params.expires
    const from = event.transaction.from
    _handleNameRenewed(
        event.address,
        txHash,
        block,
        name,
        label,
        cost,
        from,
        expires,
        event.logIndex
    )
}
export function handleNameRenewed2(event: NameRenewed2): void {
    const txHash = event.transaction.hash
    const block = event.block

    const name = event.params.name
    const label = event.params.label
    const cost = event.params.cost
    const expires = event.params.expires
    const from = event.transaction.from
    _handleNameRenewed(
        event.address,
        txHash,
        block,
        name,
        label,
        cost,
        from,
        expires,
        event.logIndex
    )
}
export function handleNameRenewed3(event: NameRenewed3): void {
    const txHash = event.transaction.hash
    const block = event.block

    const name = event.params.name
    const label = event.params.label
    const cost = event.params.cost
    const expires = event.params.expires
    const from = event.transaction.from
    _handleNameRenewed(
        event.address,
        txHash,
        block,
        name,
        label,
        cost,
        from,
        expires,
        event.logIndex
    )
}
export function handleNameRenewedTemplate(event: NameRenewedTemplate): void {
    const txHash = event.transaction.hash
    const block = event.block

    const name = event.params.name
    const label = event.params.label
    const cost = event.params.cost
    const expires = event.params.expires
    const from = event.transaction.from
    _handleNameRenewed(
        event.address,
        txHash,
        block,
        name,
        label,
        cost,
        from,
        expires,
        event.logIndex
    )
}
