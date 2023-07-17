import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { newBlock } from "./utils"
import { _handleSetName } from "../src/reverse-registrar"
export class HandleSetNameInput {
    hash: string
    callIndex: string
    from: string
    name: string
}
export function mockSetName(input: HandleSetNameInput): void {
    const block = newBlock()
    const txHash = Bytes.fromHexString(input.hash)
    const from = Address.fromString(input.from)
    const name = input.name
    const callIndex = BigInt.fromString(input.callIndex)
    _handleSetName(txHash, block, from, name, callIndex)
}
