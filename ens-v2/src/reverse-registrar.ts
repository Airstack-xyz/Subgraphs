import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { SetNameCall as SetNameCall1 } from "../generated/ReverseRegistrar1/ReverseRegistrar"
import { SetNameCall as SetNameCall2 } from "../generated/ReverseRegistrar2/ReverseRegistrar"
import { SetNameCall as SetNameCall3 } from "../generated/ReverseRegistrar3/ReverseRegistrar"
import { SetNameCall as SetNameCall4 } from "../generated/ReverseRegistrar4/ReverseRegistrar"
import { SetNameCall as SetNameCall5 } from "../generated/templates/ReverseRegistrarTemplate/ReverseRegistrar"
import * as airstack from "../modules/airstack/domain-name"
import { PrimarySet } from "../generated/schema"
import { createEventID } from "./utils"
const _handleSetName = (
    txHash: Bytes,
    block: ethereum.Block,
    from: Address,
    name: string,
    callIndex: BigInt
): void => {
    airstack.domain.trackSetPrimaryDomain(name, from, block)
    // book keeping
    let primarySet = new PrimarySet(createEventID(block, callIndex))
    primarySet.hash = txHash
    primarySet.from = from
    primarySet.name = name
    primarySet.save()
}

export function handleSetName1(call: SetNameCall1): void {
    const txHash = call.transaction.hash
    const block = call.block
    const from = call.from
    const name = call.inputs.name
    const callIndex = call.transaction.index
    _handleSetName(txHash, block, from, name, callIndex)
}

export function handleSetName2(call: SetNameCall2): void {
    const txHash = call.transaction.hash
    const block = call.block
    const from = call.from
    const name = call.inputs.name
    const callIndex = call.transaction.index
    _handleSetName(txHash, block, from, name, callIndex)
}

export function handleSetName3(call: SetNameCall3): void {
    const txHash = call.transaction.hash
    const block = call.block
    const from = call.from
    const name = call.inputs.name
    const callIndex = call.transaction.index
    _handleSetName(txHash, block, from, name, callIndex)
}

export function handleSetName4(call: SetNameCall4): void {
    const txHash = call.transaction.hash
    const block = call.block
    const from = call.from
    const name = call.inputs.name
    const callIndex = call.transaction.index
    _handleSetName(txHash, block, from, name, callIndex)
}

export function handleSetNameTemplate(call: SetNameCall5): void {
    const txHash = call.transaction.hash
    const block = call.block
    const from = call.from
    const name = call.inputs.name
    const callIndex = call.transaction.index
    _handleSetName(txHash, block, from, name, callIndex)
}
