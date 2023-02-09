import * as airstack from "../modules/airstack/domain-name";
import { log } from "@graphprotocol/graph-ts";
import {
  SetNameCall,
} from "../generated/ReverseRegistrar/ReverseRegistrar";
import { TOKEN_ADDRESS_ENS } from "./utils";
/**
 * @dev this function maps the SetName call from the ReverseRegistrar contract
 * @param call SetNameCall from ReverseRegistrar contract
 */
export function handleSetName(call: SetNameCall): void {
  log.info("handleSetName: name {} txhash {}", [call.inputs.name, call.transaction.hash.toHexString()]);
  airstack.domain.trackSetPrimaryDomainTransaction(
    call.block,
    call.transaction.hash.toHexString(),
    call.inputs.name,
    call.from.toHexString(),
    TOKEN_ADDRESS_ENS,
  );
}