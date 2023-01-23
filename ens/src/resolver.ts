import * as airstack from "../modules/airstack";
import {
  AddrChanged as AddrChangedEvent,
  VersionChanged as VersionChangedEvent,
} from "../generated/Resolver/Resolver";
import { ETHEREUM_MAINNET_ID } from "../modules/airstack/utils";

export function handleAddrChanged(event: AddrChangedEvent): void {
  let addr = airstack.domain.getOrCreateAirAccount(ETHEREUM_MAINNET_ID, event.params.a.toHexString());
  let block = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(event.params.node.toHexString(), ETHEREUM_MAINNET_ID, block));

  let resolver = airstack.domain.getOrCreateAirResolver(domain, ETHEREUM_MAINNET_ID, event.address.toHexString(), addr.address);
  resolver.domain = domain.id;
  resolver.address = airstack.domain.getOrCreateAirAccount(ETHEREUM_MAINNET_ID, event.address.toHexString()).id;
  resolver.save()

  if (domain.resolver == resolver.id) {
    domain.resolvedAddress = addr.id;
  }
  if (domain.owner == addr.id) {
    domain.isPrimary = true;
  }
  domain.save()

  airstack.domain.trackAddrChangedTransaction(
    ETHEREUM_MAINNET_ID,
    event.logIndex,
    resolver,
    block,
    event.transaction.hash,
    addr.address,
  );
}

export function handleVersionChanged(event: VersionChangedEvent): void {
  let block = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(event.params.node.toHexString(), ETHEREUM_MAINNET_ID, block));
  let resolver = airstack.domain.getOrCreateAirResolver(domain, ETHEREUM_MAINNET_ID, event.address.toHexString(), null);
  if (domain && domain.resolver === resolver.id) {
    domain.resolvedAddress = null
    domain.save()
  }
}
