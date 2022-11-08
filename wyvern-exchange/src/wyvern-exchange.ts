import { BigInt, log } from "@graphprotocol/graph-ts"

import {
  AtomicMatch_Call
} from "../generated/WyvernExchange/WyvernExchange"

import { WYVERN_ATOMICIZER_ADDRESS } from "./utils";

export function handleAtomicMatch_(call: AtomicMatch_Call): void {
  log.info("txHash {}", [call.transaction.hash.toHexString()]);
  let timestamp = call.block.timestamp;
  let sellTakerAddress = call.inputs.addrs[9];
  let saleTarget = call.inputs.addrs[11];
  let isBundleSale =
    saleTarget.toHexString() === WYVERN_ATOMICIZER_ADDRESS; 
  
  let contractAddress = call.inputs.addrs[11];
}