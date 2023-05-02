import * as airstack from "../modules/airstack/domain-name";
import {
  NameWrapped as NameWrappedEvent,
} from "../generated/NameWrapper/NameWrapper";
import { decodeName } from "./utils";
import { getChainId, getOrCreateAirBlock, updateAirEntityCounter } from "../modules/airstack/common";
import { AIR_DOMAIN_LAST_UPDATED_INDEX_ENTITY_COUNTER_ID } from "../modules/airstack/domain-name/utils";
import { TOKEN_ADDRESS_ENS } from "./utils";

export function handleNameWrapped(event: NameWrappedEvent): void {
  let decoded = decodeName(event.params.name, event.transaction.hash.toHexString());
  let label: string | null = null;
  let name: string | null = null;
  if (decoded !== null) {
    label = decoded[0];
    name = decoded[1];
  }
  const chainId = getChainId();
  let airBlock = getOrCreateAirBlock(chainId, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  airBlock.save();
  const domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(event.params.node.toHexString(), chainId, airBlock, TOKEN_ADDRESS_ENS));
  if (!domain.labelName && label) {
    domain.labelName = label;
    domain.name = name;
    domain.lastUpdatedIndex = updateAirEntityCounter(AIR_DOMAIN_LAST_UPDATED_INDEX_ENTITY_COUNTER_ID, airBlock);
    domain.lastUpdatedBlock = airBlock.id;
    domain.save();
  }
}