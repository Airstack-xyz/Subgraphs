import {
  NewOwner as NewOwnerEvent,
  NewResolver as NewResolverEvent,
  NewTTL as NewTTLEvent,
  Transfer as TransferEvent
} from "../generated/EnsRegistry/EnsRegistry"
import * as airstack from "../modules/airstack/domain-name";
import {
  log,
  BigInt,
  ens,
} from "@graphprotocol/graph-ts";
import { ETHEREUM_MAINNET_ID, ROOT_NODE } from "../modules/airstack/domain-name/utils";
import {
  TOKEN_ADDRESS_ENS,
  getOrCreateIsMigratedMapping,
  createAirDomainEntityId,
  createReverseRegistrar,
} from "./utils";
/**
 * @dev this functions maps the NewOwner event to airstack trackDomainOwnerChangedTransaction
 * @param event NewOwnerEvent from ENS Registry
 */
export function handleNewOwner(event: NewOwnerEvent): void {
  log.info("handleNewOwner: owner {} node {} label {} txhash {}", [event.params.owner.toHexString(), event.params.node.toHexString(), event.params.label.toHexString(), event.transaction.hash.toHexString()]);
  let domainId = createAirDomainEntityId(event.params.node, event.params.label);
  let tokenId = BigInt.fromUnsignedBytes(event.params.label).toString();
  // marking the domain as migrated
  getOrCreateIsMigratedMapping(
    domainId,
    ETHEREUM_MAINNET_ID,
    event.block.number.toString(),
    true,
  );
  // creating labelName from label
  let labelName = ens.nameByHash(event.params.label.toHexString());
  if (labelName === null) {
    labelName = '[' + event.params.label.toHexString().slice(2) + ']';
  }
  // creating name from labelName and parentName
  let name: string | null;
  let parentName: string | null;
  if (event.params.node.toHexString() == ROOT_NODE) {
    name = labelName;
  } else {
    let parent = airstack.domain.getAirDomain(event.params.node.toHexString());
    if (parent != null) {
      parentName = parent.name;
    } else {
      parentName = "";
    }
    name = labelName + "." + parentName!;
  }
  if (name) {
    createReverseRegistrar(name, domainId, ETHEREUM_MAINNET_ID, event.block);
  }
  // sending transaction to airstack
  airstack.domain.trackDomainOwnerChangedTransaction(
    ETHEREUM_MAINNET_ID,
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    domainId,
    event.params.node.toHexString(),
    TOKEN_ADDRESS_ENS,
    tokenId,
    event.params.label.toHexString(),
    labelName,
    name,
    event.params.owner.toHexString()
  )
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
    event.transaction.hash.toHexString(),
    TOKEN_ADDRESS_ENS,
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
    event.transaction.hash.toHexString(),
    event.logIndex,
    TOKEN_ADDRESS_ENS,
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
    event.transaction.hash.toHexString(),
    TOKEN_ADDRESS_ENS,
    false,
  )
}

/**
 * @dev this functions maps the NewOwner event for old registry to airstack trackDomainOwnerChangedTransaction
 * @param event NewOwnerEvent from ENS Registry
 */
export function handleNewOwnerOldRegistry(event: NewOwnerEvent): void {
  log.info("handleNewOwnerOldRegistry: owner {} node {} label {} txhash {}", [event.params.owner.toHexString(), event.params.node.toHexString(), event.params.label.toHexString(), event.transaction.hash.toHexString()]);
  let domainId = createAirDomainEntityId(event.params.node, event.params.label);
  let tokenId = BigInt.fromUnsignedBytes(event.params.label).toString();
  // marking the domain as migrated
  let isMigratedMapping = getOrCreateIsMigratedMapping(
    domainId,
    ETHEREUM_MAINNET_ID,
    event.block.number.toString(),
    false,
  );
  // this domain was migrated from the old registry, so we don't need to hanlde old registry event now
  // this check needs to be done only in old registry event
  if (isMigratedMapping.isMigrated == true) {
    return;
  }
  // creating labelName from label
  let labelName = ens.nameByHash(event.params.label.toHexString());
  if (labelName === null) {
    labelName = '[' + event.params.label.toHexString().slice(2) + ']';
  }
  // creating name from labelName and parentName
  let name: string | null;
  let parentName: string | null;
  if (event.params.node.toHexString() == ROOT_NODE) {
    name = labelName;
  } else {
    let parent = airstack.domain.getAirDomain(event.params.node.toHexString());
    if (parent != null) {
      parentName = parent.name;
    } else {
      parentName = "";
    }
    name = labelName + "." + parentName!;
  }
  if (name) {
    createReverseRegistrar(name, domainId, ETHEREUM_MAINNET_ID, event.block);
  }
  // sending transaction to airstack
  airstack.domain.trackDomainOwnerChangedTransaction(
    ETHEREUM_MAINNET_ID,
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    domainId,
    event.params.node.toHexString(),
    TOKEN_ADDRESS_ENS,
    tokenId,
    event.params.label.toHexString(),
    labelName,
    name,
    event.params.owner.toHexString()
  )
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
    event.transaction.hash.toHexString(),
    event.logIndex,
    TOKEN_ADDRESS_ENS,
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
    event.transaction.hash.toHexString(),
    TOKEN_ADDRESS_ENS,
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
    event.transaction.hash.toHexString(),
    TOKEN_ADDRESS_ENS,
    true,
  )
}