import {
  ApprovalForAll as ApprovalForAllEvent,
  NewOwner as NewOwnerEvent,
  NewResolver as NewResolverEvent,
  NewTTL as NewTTLEvent,
  Transfer as TransferEvent
} from "../generated/EnsRegistry/EnsRegistry"
import * as airstack from "../modules/airstack";
import {
  ens
} from "@graphprotocol/graph-ts";
import { ETHEREUM_MAINNET_ID, ZERO_NODE } from "./utils";
import { BIGINT_ONE, BIG_INT_ZERO, ZERO_ADDRESS } from "../modules/airstack/utils";

/**
 * @dev this functions maps the NewOwner event to airstack trackDomainOwnerChangedTransaction
 * @param event NewOwnerEvent from ENS Registry
 */
export function handleNewOwner(event: NewOwnerEvent): void {
  // do data mapping
  let node = event.params.node;
  let airBlock = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domainId = airstack.domain.createAirDomainEntityId(node, event.params.label);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(
    domainId,
    ETHEREUM_MAINNET_ID,
    airBlock,
  ));
  let parent = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(
    event.params.node.toHexString(),
    ETHEREUM_MAINNET_ID,
    airBlock,
  ));
  if (domain.parent == null && parent != null) {
    parent.subdomainCount = parent.subdomainCount.plus(BIGINT_ONE);
  }
  if (domain.name == null) {
    let label = ens.nameByHash(event.params.label.toHexString());
    if (label != null) {
      domain.labelName = label;
    }
    if (label === null) {
      label = '[' + event.params.label.toHexString().slice(2) + ']';
    }
    if (node.toHexString() == ZERO_NODE) {
      domain.name = label;
    } else {
      parent = parent!
      let name = parent.name;
      if (label && name) {
        domain.name = label + '.' + name;
      }
    }
  }
  domain.owner = airstack.domain.getOrCreateAirAccount(ETHEREUM_MAINNET_ID, event.params.owner.toHexString()).id;
  domain.parent = parent.id;
  domain.labelhash = event.params.label;
  // below conversion is going into overflow
  // domain.tokenId = event.params.label.toU32().toString();
  airstack.domain.recurseDomainDelete(domain, ETHEREUM_MAINNET_ID);
  domain.save();

  // send to airstack
  airstack.domain.trackDomainOwnerChangedTransaction(
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    ETHEREUM_MAINNET_ID,
    domain.owner,
    event.params.owner.toHexString(),
    event.transaction.hash,
    BIG_INT_ZERO.toString(),
    domain,
  )
}

export function handleTransfer(event: TransferEvent): void {
  // do data mapping
  let node = event.params.node.toHexString();
  let airBlock = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(node, ETHEREUM_MAINNET_ID, airBlock));
  let previousOwnerId = domain.owner;
  if (previousOwnerId == null) {
    previousOwnerId = airstack.domain.getOrCreateAirAccount(ETHEREUM_MAINNET_ID, ZERO_ADDRESS).id;
  }
  // send to airstack
  airstack.domain.trackDomainTransferTransaction(
    previousOwnerId,
    event.params.owner.toHexString(),
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    event.logIndex,
    event.transaction.hash,
    domain,
  )
}

// export function handleNewResolver(event: NewResolverEvent): void {
//   let entity = new NewResolver(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.node = event.params.node
//   entity.resolver = event.params.resolver

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleNewTTL(event: NewTTLEvent): void {
//   let entity = new NewTTL(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.node = event.params.node
//   entity.ttl = event.params.ttl

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }


