import * as airstack from "../modules/airstack/domain-name";
import { log } from "@graphprotocol/graph-ts";
import {
  SetNameCall,
} from "../generated/ReverseRegistrar/ReverseRegistrar";
import { ETHEREUM_MAINNET_ID } from "../modules/airstack/domain-name/utils";
import { TOKEN_ADDRESS_ENS } from "./utils";
/**
 * @dev this function maps the SetName call from the ReverseRegistrar contract
 * @param call SetNameCall from ReverseRegistrar contract
 */
export function handleSetName(call: SetNameCall): void {
  log.info("handleSetName: name {} reverse node {} txhash {}", [call.inputs.name, call.outputs.value0.toHexString(), call.transaction.hash.toHexString()]);
  airstack.domain.trackSetPrimaryDomainTransaction(
    call.inputs.name,
    ETHEREUM_MAINNET_ID,
    call.from.toHexString(),
    call.block.number,
    call.block.hash.toHexString(),
    call.block.timestamp,
    call.transaction.hash.toHexString(),
    TOKEN_ADDRESS_ENS,
  );
}