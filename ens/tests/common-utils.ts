import { Bytes } from "@graphprotocol/graph-ts"

export function getTransactionHash(): Bytes {
  return Bytes.fromHexString("0xafb6d7ac92f6beb3f3df6a9bbfaeb2f99b9db020ee69199af95f2e8ea5253467") as Bytes
}