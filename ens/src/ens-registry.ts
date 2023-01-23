import {
  NewOwner as NewOwnerEvent,
  NewResolver as NewResolverEvent,
  NewTTL as NewTTLEvent,
  Transfer as TransferEvent
} from "../generated/EnsRegistry/EnsRegistry"
import * as airstack from "../modules/airstack";
import {
  BigInt,
  ens,
  log,
} from "@graphprotocol/graph-ts";
import { BIGINT_ONE, BIG_INT_ZERO, ZERO_ADDRESS, ETHEREUM_MAINNET_ID, ROOT_NODE } from "../modules/airstack/utils";

/**
 * @dev this functions maps the NewOwner event to airstack trackDomainOwnerChangedTransaction
 * @param event NewOwnerEvent from ENS Registry
 */
export function handleNewOwner(event: NewOwnerEvent): void {
  _handleNewOwner(event, true);
}

/**
 * @dev this functions maps the NewTransfer event to airstack trackDomainTransferTransaction
 * @param event NewTransferEvent from ENS Registry
 */
export function handleTransfer(event: TransferEvent): void {
  // send to airstack
  airstack.domain.trackDomainTransferTransaction(
    event.params.node.toHexString(),
    ETHEREUM_MAINNET_ID,
    event.params.owner.toHexString(),
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    event.transaction.hash,
  )
}

/**
 * @dev this functions maps the NewResolver event to airstack trackDomainNewResolverTransaction
 * @param event NewResolverEvent from ENS Registry
 */
export function handleNewResolver(event: NewResolverEvent): void {
  airstack.domain.trackDomainNewResolverTransaction(
    event.params.resolver.toHexString(),
    event.params.node.toHexString(),
    ETHEREUM_MAINNET_ID,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
  )
}

/**
 * @dev this functions maps the NewTTL event to airstack trackDomainNewTTLTransaction
 * @param event NewTTLEvent from ENS Registry
 */
export function handleNewTTL(event: NewTTLEvent): void {
  log.info("handleNewTTL: {} {} {} ", [event.params.ttl.toString(), event.params.node.toHexString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackDomainNewTTLTransaction(
    event.params.node.toHexString(),
    event.params.ttl,
    ETHEREUM_MAINNET_ID,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    event.transaction.hash,
  )
}

/**
 * @dev this functions maps the NewOwner event for old registry to airstack trackDomainOwnerChangedTransaction
 * @param event NewOwnerEvent from ENS Registry
 */
export function handleNewOwnerOldRegistry(event: NewOwnerEvent): void {
  let block = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(event.params.node.toHexString(), ETHEREUM_MAINNET_ID, block));
  if (domain == null || domain.isMigrated == false) {
    _handleNewOwner(event, false);
  }
}

/**
 * @dev this functions maps the NewResolver event for old registry to airstack trackDomainNewResolverTransaction
 * @param event NewResolverEvent from ENS Registry
 */
export function handleNewResolverOldRegistry(event: NewResolverEvent): void {
  let node = event.params.node.toHexString();
  let block = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(node, ETHEREUM_MAINNET_ID, block));
  if (node == ROOT_NODE || domain.isMigrated == false) {
    handleNewResolver(event)
  }
}

/**
 * @dev this functions maps the NewTTL event for old registry to airstack trackDomainNewTTLTransaction
 * @param event NewTTLEvent from ENS Registry
 */
export function handleNewTTLOldRegistry(event: NewTTLEvent): void {
  let block = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(event.params.node.toHexString(), ETHEREUM_MAINNET_ID, block));

  log.info("handleNewTTLOldRegistry: {} {} {}", [event.params.ttl.toString(), event.params.node.toHexString(), event.transaction.hash.toHexString(), domain.isMigrated.toString()]);
  if (domain.isMigrated == false) {
    handleNewTTL(event);
  }
}

/**
 * @dev this functions maps the NewTransfer event for old registry to airstack trackDomainTransferTransaction
 * @param event NewTransferEvent from ENS Registry
 */
export function handleTransferOldRegistry(event: TransferEvent): void {
  let block = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(event.params.node.toHexString(), ETHEREUM_MAINNET_ID, block));
  if (domain.isMigrated == false) {
    handleTransfer(event);
  }
}

/**
 * @dev this functions maps the NewOwner event for new registry to airstack trackDomainOwnerChangedTransaction
 * @param event NewOwnerEvent from ENS Registry
 * @param isMigrated true if the domain is migrated to new registry
 */
function _handleNewOwner(event: NewOwnerEvent, isMigrated: boolean): void {
  // do data mapping
  let node = event.params.node;
  let airBlock = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domainId = airstack.domain.createAirDomainEntityId(node, event.params.label);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(
    domainId,
    ETHEREUM_MAINNET_ID,
    airBlock,
  ));
  let oldOwnerId = domain.owner;
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
    if (node.toHexString() == ROOT_NODE) {
      domain.name = label;
    } else {
      let name = parent.name;
      if (label && name) {
        domain.name = label + '.' + name;
      }
    }
  }
  domain.owner = airstack.domain.getOrCreateAirAccount(ETHEREUM_MAINNET_ID, event.params.owner.toHexString()).id;
  domain.parent = parent.id;
  domain.labelhash = event.params.label;
  domain.isMigrated = isMigrated;
  domain.tokenId = BigInt.fromUnsignedBytes(event.params.label).toString();
  domain.lastBlock = airBlock.id;
  airstack.domain.recurseDomainDelete(domain, ETHEREUM_MAINNET_ID);
  domain.save();

  // send to airstack
  airstack.domain.trackDomainOwnerChangedTransaction(
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    ETHEREUM_MAINNET_ID,
    oldOwnerId,
    event.params.owner.toHexString(),
    event.transaction.hash,
    BIG_INT_ZERO.toString(),
    domain,
  )
}