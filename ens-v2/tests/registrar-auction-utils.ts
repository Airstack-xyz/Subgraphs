import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { newBlock } from "./utils"
import { _handleHashRegistered } from "../src/registrar-auction"
export class HashRegisteredInput {
    hash: string
    logIndex: string
    label: string
    owner: string
    registrationDate: string
    value: string
}
export function mockHandleRegistered(input: HashRegisteredInput): void {
    const block = newBlock()
    const txHash = Bytes.fromHexString(input.hash)
    const label = Bytes.fromHexString(input.label)
    const owner = Address.fromString(input.owner)
    const registrationDate = BigInt.fromString(input.registrationDate)
    const value = BigInt.fromString(input.value)
    const logIndex = BigInt.fromString(input.value)
    _handleHashRegistered(txHash, block, label, owner, registrationDate, value, logIndex)
}
