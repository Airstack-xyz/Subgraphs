// Import types and APIs from graph-ts
import {
  ByteArray,
  log
} from '@graphprotocol/graph-ts'

import { TOKEN_ADDRESS_ENS } from "./utils";
import { byteArrayFromHex, ETHEREUM_MAINNET_ID, ZERO_ADDRESS } from '../modules/airstack/domain-name/utils';
import { BIG_INT_ZERO } from '../modules/airstack/common';
import * as airstack from "../modules/airstack/domain-name";

// Import event types from the registry contract ABI
import {
  NameRegistered as NameRegisteredEvent,
  NameRenewed as NameRenewedEvent,
} from '../generated/BaseRegistrar/BaseRegistrar';
import {
  NameRegistered as ControllerNameRegisteredEventOld,
} from '../generated/EthRegistrarControllerOld/EthRegistrarControllerOld';
import {
  NameRegistered as ControllerNameRegisteredEvent,
  NameRenewed as ControllerNameRenewedEvent
} from '../generated/EthRegistrarController/EthRegistrarController';

const rootNode: ByteArray = byteArrayFromHex("93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae");

/**
 * @dev this function maps the NameRegistered event from the BaseRegistrar contract
 * @param event NameRegisteredEvent from BaseRegistrar contract
 */
export function handleNameRegistered(event: NameRegisteredEvent): void {
  log.info("handleNameRegistered: registrant {} label {} expiry {} txhash {}", [event.params.owner.toHexString(), event.params.id.toHexString(), event.params.expires.toString(), event.transaction.hash.toHexString()]);

  airstack.domain.trackNameRegisteredTransaction(
    event.transaction.hash.toHexString(),
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    ETHEREUM_MAINNET_ID,
    event.params.owner.toHexString(),
    event.params.expires,
    event.transaction.value,
    ZERO_ADDRESS,
    event.params.id,
    rootNode,
    TOKEN_ADDRESS_ENS,
  );
}

/**
 * @dev this function maps the NameRenewed event from the BaseRegistrar contract
 * @param event NameRenewedEvent from BaseRegistrar contract
 */
export function handleNameRenewed(event: NameRenewedEvent): void {
  log.info("handleNameRenewed: renewer {} label {} expiry {} txhash {}", [event.transaction.from.toHexString(), event.params.id.toHexString(), event.params.expires.toString(), event.transaction.hash.toHexString()]);

  airstack.domain.trackNameRenewedTransaction(
    event.transaction.hash.toHexString(),
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    null,
    ZERO_ADDRESS,
    event.transaction.from.toHexString(),
    event.params.id,
    rootNode,
    event.params.expires,
    TOKEN_ADDRESS_ENS,
  );
}

/**
 * @dev this function maps the NameRegistered from the EthRegistrarControllerOld contract 
 * @param event ControllerNameRegisteredEventOld from EthRegistrarControllerOld contract
 */
export function handleNameRegisteredByControllerOld(event: ControllerNameRegisteredEventOld): void {
  log.info("handleNameRegisteredByControllerOld: name {} label {} cost {} txhash {}", [event.params.name, event.params.label.toHexString(), event.params.cost.toString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackSetNamePreImage(
    event.params.name,
    event.params.label,
    event.params.cost,
    ZERO_ADDRESS,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    rootNode,
    TOKEN_ADDRESS_ENS,
    event.transaction.hash.toHexString(),
    null,
    null,
    true,
  )
}

/**
 * @dev this function maps the NameRegistered event from the EthRegistrarController contract
 * @param event ControllerNameRegisteredEvent from EthRegistrarController contract
 */
export function handleNameRegisteredByController(event: ControllerNameRegisteredEvent): void {
  log.info("handleNameRegisteredByController: name {} label {} cost {} txhash {}", [event.params.name, event.params.label.toHexString(), event.params.cost.toString(), event.transaction.hash.toHexString()]);

  airstack.domain.trackSetNamePreImage(
    event.params.name,
    event.params.label,
    event.params.cost,
    ZERO_ADDRESS,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    rootNode,
    TOKEN_ADDRESS_ENS,
    event.transaction.hash.toHexString(),
    null,
    null,
    true,
  )
}

/**
 * @dev this function maps the NameRenewed event from the EthRegistrarController and EthRegistrarControllerOld contract
 * @param event ControllerNameRenewedEvent from EthRegistrarController and EthRegistrarControllerOld contract
 */
export function handleNameRenewedByController(event: ControllerNameRenewedEvent): void {
  log.info("handleNameRenewedByController: name {} label {} cost {} txhash {}", [event.params.name, event.params.label.toHexString(), event.params.cost.toString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackSetNamePreImage(
    event.params.name,
    event.params.label,
    event.params.cost,
    ZERO_ADDRESS,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    rootNode,
    TOKEN_ADDRESS_ENS,
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
    event.params.expires,
    false,
  )
}