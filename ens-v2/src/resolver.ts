import { log } from "@graphprotocol/graph-ts"
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
  const logIndex = event.logIndex

  const block = event.block
  const resolvedAddress = event.params.a
  const resolverAddress = event.address
  const node = event.params.node
  airstack.domain.trackResolvedAddress(
    txHash,
    logIndex,
    node.toHexString(),
    resolverAddress,
    resolvedAddress,
    block
  )
}

export function handleAddressChanged(event: AddressChanged): void {
  const txHash = event.transaction.hash
  const logIndex = event.logIndex
  const block = event.block
  const coinType = event.params.coinType
  const newAddress = event.params.newAddress
  const node = event.params.node
  const resolverAddress = event.address

  airstack.domain.trackMultiCoinAddress(
    txHash,
    logIndex,
    node.toHexString(),
    resolverAddress,
    coinType,
    newAddress,
    block
  )
}

export function handleTextChanged(event: TextChanged): void {
  const txHash = event.transaction.hash
  const logIndex = event.logIndex
  const block = event.block
  const key = event.params.key
  const node = event.params.node
  const resolverAddress = event.address
  airstack.domain.trackAirTextChange(
    txHash,
    logIndex,
    node.toHexString(),
    resolverAddress,
    key,
    "",
    block
  )
}

export function handleTextChangedWithValue(event: TextChangedWithValue): void {
  const txHash = event.transaction.hash
  const logIndex = event.logIndex
  const block = event.block
  const key = event.params.key
  const value = event.params.value
  const node = event.params.node
  const resolverAddress = event.address
  airstack.domain.trackAirTextChange(
    txHash,
    logIndex,
    node.toHexString(),
    resolverAddress,
    key,
    "",
    block
  )
}
