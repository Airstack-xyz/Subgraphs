import * as airstack from "../modules/airstack";
import { log } from "@graphprotocol/graph-ts";
import {
  SetNameCall,
} from "../generated/ReverseRegistrar/ReverseRegistrar";
import { ETHEREUM_MAINNET_ID } from "../modules/airstack/utils";

export function handleSetName(call: SetNameCall): void {
  let ensName = call.inputs.name;
  let node = call.outputs.value0;
  let from = airstack.domain.getOrCreateAirAccount(ETHEREUM_MAINNET_ID, call.from.toHexString());
  airstack.domain.trackSetPrimaryDomainTransaction(
    ensName,
    ETHEREUM_MAINNET_ID,
    node,
    from,
    call.block.number,
    call.block.hash.toHexString(),
    call.block.timestamp
  );
}