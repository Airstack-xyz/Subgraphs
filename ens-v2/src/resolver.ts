import { MultiCoinTxn, ResolvedAddressTxn, TextChangedTxn } from "../generated/schema"
import {
    AddrChanged,
    TextChanged,
    TextChanged1 as TextChangedWithValue,
    AddressChanged,
} from "../generated/templates/ResolverTemplate/Resolver"
import * as airstack from "../modules/airstack/domain-name"
import { createEventID } from "./utils"

export function handleAddrChanged(event: AddrChanged): void {
    const txHash = event.transaction.hash
    const block = event.block
    const resolvedAddress = event.params.a
    const resolverAddress = event.address
    const node = event.params.node
    airstack.domain.trackResolvedAddress(
        node.toHexString(),
        resolverAddress,
        resolvedAddress,
        block
    )
    let resolvedAddressEvent = new ResolvedAddressTxn(createEventID(block, event.logIndex))
    resolvedAddressEvent.txHash = txHash
    resolvedAddressEvent.node = node
    resolvedAddressEvent.resolvedAddress = resolvedAddress
    resolvedAddressEvent.resolverAddress = resolverAddress
    resolvedAddressEvent.save()
}

export function handleAddressChanged(event: AddressChanged): void {
    const txHash = event.transaction.hash
    const block = event.block
    const coinType = event.params.coinType
    const newAddress = event.params.newAddress
    const node = event.params.node
    const resolverAddress = event.address
    airstack.domain.trackMultiCoinAddress(node.toHexString(), resolverAddress, coinType, newAddress)
    let multiCoinTxn = new MultiCoinTxn(createEventID(block, event.logIndex))
    multiCoinTxn.txHash = txHash
    multiCoinTxn.node = node
    multiCoinTxn.resolverAddress = resolverAddress
    multiCoinTxn.newAddress = newAddress
    multiCoinTxn.coinType = coinType
    multiCoinTxn.save()
}

export function handleTextChanged(event: TextChanged): void {
    const txHash = event.transaction.hash
    const block = event.block
    const key = event.params.key
    const node = event.params.node
    const resolverAddress = event.address
    airstack.domain.trackAirExtra(node.toHexString(), resolverAddress, key, "", block)
    let textChangedTxn = new TextChangedTxn(createEventID(block, event.logIndex))
    textChangedTxn.txHash = txHash
    textChangedTxn.node = node
    textChangedTxn.resolverAddress = resolverAddress
    textChangedTxn.key = key
    textChangedTxn.value = ""
    textChangedTxn.save()
}

export function handleTextChangedWithValue(event: TextChangedWithValue): void {
    const txHash = event.transaction.hash
    const block = event.block
    const key = event.params.key
    const value = event.params.value
    const node = event.params.node
    const resolverAddress = event.address
    airstack.domain.trackAirExtra(node.toHexString(), resolverAddress, key, value, block)
    let textChangedTxn = new TextChangedTxn(createEventID(block, event.logIndex))
    textChangedTxn.txHash = txHash
    textChangedTxn.node = node
    textChangedTxn.resolverAddress = resolverAddress
    textChangedTxn.key = key
    textChangedTxn.value = value
    textChangedTxn.save()
}
