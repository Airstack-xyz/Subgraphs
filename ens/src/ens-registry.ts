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
  log.info("handleNewOwner: owner {} node {} label {} txhash {}", [event.params.owner.toHexString(), event.params.node.toHexString(), event.params.label.toHexString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackDomainOwnerChangedTransaction(
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    ETHEREUM_MAINNET_ID,
    event.params.owner.toHexString(),
    event.transaction.hash,
    true,
    event.params.node,
    event.params.label,
    false,
  );
}

/**
 * @dev this functions maps the NewTransfer event to airstack trackDomainTransferTransaction
 * @param event NewTransferEvent from ENS Registry
 */
export function handleTransfer(event: TransferEvent): void {
  log.info("handleTransfer: owner {} node {} txhash {}", [event.params.owner.toHexString(), event.params.node.toHexString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackDomainTransferTransaction(
    event.params.node.toHexString(),
    ETHEREUM_MAINNET_ID,
    event.params.owner.toHexString(),
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    event.transaction.hash,
    false,
  )
}

/**
 * @dev this functions maps the NewResolver event to airstack trackDomainNewResolverTransaction
 * @param event NewResolverEvent from ENS Registry
 */
export function handleNewResolver(event: NewResolverEvent): void {
  log.info("handleNewResolver: resolver {} node {} txhash {}", [event.params.resolver.toHexString(), event.params.node.toHexString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackDomainNewResolverTransaction(
    event.params.resolver.toHexString(),
    event.params.node.toHexString(),
    ETHEREUM_MAINNET_ID,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    false,
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
    false,
  )
}

/**
 * @dev this functions maps the NewOwner event for old registry to airstack trackDomainOwnerChangedTransaction
 * @param event NewOwnerEvent from ENS Registry
 */
export function handleNewOwnerOldRegistry(event: NewOwnerEvent): void {
  log.info("handleNewOwnerOldRegistry: owner {} node {} label {} txhash {}", [event.params.owner.toHexString(), event.params.node.toHexString(), event.params.label.toHexString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackDomainOwnerChangedTransaction(
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    ETHEREUM_MAINNET_ID,
    event.params.owner.toHexString(),
    event.transaction.hash,
    false,
    event.params.node,
    event.params.label,
    true,
  );
}

/**
 * @dev this functions maps the NewResolver event for old registry to airstack trackDomainNewResolverTransaction
 * @param event NewResolverEvent from ENS Registry
 */
export function handleNewResolverOldRegistry(event: NewResolverEvent): void {
  log.info("handleNewResolverOldRegistry: resolver {} node {} txhash {}", [event.params.resolver.toHexString(), event.params.node.toHexString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackDomainNewResolverTransaction(
    event.params.resolver.toHexString(),
    event.params.node.toHexString(),
    ETHEREUM_MAINNET_ID,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    true,
  )
}

/**
 * @dev this functions maps the NewTTL event for old registry to airstack trackDomainNewTTLTransaction
 * @param event NewTTLEvent from ENS Registry
 */
export function handleNewTTLOldRegistry(event: NewTTLEvent): void {
  log.info("handleNewTTLOldRegistry: {} {} {}", [event.params.ttl.toString(), event.params.node.toHexString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackDomainNewTTLTransaction(
    event.params.node.toHexString(),
    event.params.ttl,
    ETHEREUM_MAINNET_ID,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    event.transaction.hash,
    true,
  )
}

/**
 * @dev this functions maps the NewTransfer event for old registry to airstack trackDomainTransferTransaction
 * @param event NewTransferEvent from ENS Registry
 */
export function handleTransferOldRegistry(event: TransferEvent): void {
  log.info("handleTransferOldRegistry: owner {} node {} txhash {}", [event.params.owner.toHexString(), event.params.node.toHexString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackDomainTransferTransaction(
    event.params.node.toHexString(),
    ETHEREUM_MAINNET_ID,
    event.params.owner.toHexString(),
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    event.transaction.hash,
    true,
  )
}