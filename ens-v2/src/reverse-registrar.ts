import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts"
import {
  SetNameCall as SetNameCall1,
  SetNameForAddrCall as SetNameForAddrCall1,
} from "../generated/ReverseRegistrar1/ReverseRegistrar"
import {
  SetNameCall as SetNameCall2,
  SetNameForAddrCall as SetNameForAddrCall2,
} from "../generated/ReverseRegistrar2/ReverseRegistrar"
import {
  SetNameCall as SetNameCall3,
  SetNameForAddrCall as SetNameForAddrCall3,
} from "../generated/ReverseRegistrar3/ReverseRegistrar"
import {
  SetNameCall as SetNameCall4,
  SetNameForAddrCall as SetNameForAddrCall4,
} from "../generated/ReverseRegistrar4/ReverseRegistrar"
import {
  SetNameCall as SetNameCall5,
  SetNameForAddrCall as SetNameForAddrCall5,
} from "../generated/templates/ReverseRegistrarTemplate/ReverseRegistrar"
import * as airstack from "../modules/airstack/domain-name"
import { getLabelHash, getNameHashFromName } from "./utils"

export const _handleSetName = (
  txHash: Bytes,
  block: ethereum.Block,
  from: Address,
  name: string,
  callIndex: BigInt
): void => {
  // fixing labelNames
  let labelNamesArr = name.split(".")
  for (let index = 0; index < labelNamesArr.length; index++) {
    const labelName = labelNamesArr[index]
    const labelHash = getLabelHash(labelName)
    airstack.domain.trackAirLabelName(txHash, labelName, labelHash, block)
  }

  // verify https://etherscan.io/tx/0x7b599aa8fce32b580c7af99e45ce29c1c69621618a7f54ad0a518e67f5c58481
  let domainId = getNameHashFromName(name)
  airstack.domain.trackSetName(txHash, callIndex, name, domainId, from, block)
}

export function handleSetName1(call: SetNameCall1): void {
  const txHash = call.transaction.hash
  const block = call.block
  const from = call.from
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, from, name, callIndex)
}

export function handleSetNameForAddrCall1(call: SetNameForAddrCall1): void {
  const txHash = call.transaction.hash
  const block = call.block
  const addr = call.inputs.addr
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, addr, name, callIndex)
}

export function handleSetName2(call: SetNameCall2): void {
  const txHash = call.transaction.hash
  const block = call.block
  const from = call.from
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, from, name, callIndex)
}

export function handleSetNameForAddrCall2(call: SetNameForAddrCall2): void {
  const txHash = call.transaction.hash
  const block = call.block
  const addr = call.inputs.addr
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, addr, name, callIndex)
}

export function handleSetName3(call: SetNameCall3): void {
  const txHash = call.transaction.hash
  const block = call.block
  const from = call.from
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, from, name, callIndex)
}

export function handleSetNameForAddrCall3(call: SetNameForAddrCall3): void {
  const txHash = call.transaction.hash
  const block = call.block
  const addr = call.inputs.addr
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, addr, name, callIndex)
}

export function handleSetName4(call: SetNameCall4): void {
  const txHash = call.transaction.hash
  const block = call.block
  const from = call.from
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, from, name, callIndex)
}

export function handleSetNameForAddrCall4(call: SetNameForAddrCall4): void {
  const txHash = call.transaction.hash
  const block = call.block
  const addr = call.inputs.addr
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, addr, name, callIndex)
}

export function handleSetNameTemplate(call: SetNameCall5): void {
  const txHash = call.transaction.hash
  const block = call.block
  const from = call.from
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, from, name, callIndex)
}

export function handleSetNameForAddrCallTemplate(
  call: SetNameForAddrCall5
): void {
  const txHash = call.transaction.hash
  const block = call.block
  const addr = call.inputs.addr
  const name = call.inputs.name
  const callIndex = call.transaction.index
  _handleSetName(txHash, block, addr, name, callIndex)
}
