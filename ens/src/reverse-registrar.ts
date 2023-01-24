import * as airstack from "../modules/airstack";
import { log } from "@graphprotocol/graph-ts";
import {
  SetNameCall,
} from "../generated/ReverseRegistrar/ReverseRegistrar";
import { ETHEREUM_MAINNET_ID } from "../modules/airstack/utils";

export function handleSetName(call: SetNameCall): void {
  log.info("handleSetName: name {} node {} txhash {}", [call.inputs.name, call.outputs.value0.toHexString(), call.transaction.hash.toHexString()]);
  airstack.domain.trackSetPrimaryDomainTransaction(
    call.inputs.name,
    ETHEREUM_MAINNET_ID,
    call.outputs.value0,
    call.from.toHexString(),
    call.block.number,
    call.block.hash.toHexString(),
    call.block.timestamp
  );
}