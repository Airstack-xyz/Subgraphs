// Import types and APIs from graph-ts
import {
  BigInt,
  ByteArray,
  Bytes,
  crypto,
  ens,
  log
} from '@graphprotocol/graph-ts'
// 
import { byteArrayFromHex, uint256ToByteArray, ETHEREUM_MAINNET_ID, BIG_INT_ZERO, ZERO_ADDRESS } from '../modules/airstack/utils'
import * as airstack from "../modules/airstack";

// Import event types from the registry contract ABI
import {
  NameRegistered as NameRegisteredEvent,
  NameRenewed as NameRenewedEvent,
  Transfer as TransferEvent
} from '../generated/BaseRegistrar/BaseRegistrar';
import {
  NameRegistered as ControllerNameRegisteredEventOld,
} from '../generated/EthRegistrarControllerOld/EthRegistrarControllerOld';
import {
  NameRegistered as ControllerNameRegisteredEvent,
  NameRenewed as ControllerNameRenewedEvent
} from '../generated/EthRegistrarController/EthRegistrarController';
import { AirBlock } from '../generated/schema';
const rootNode: ByteArray = byteArrayFromHex("93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae");

/**
 * @dev this function maps the NameRegistered event from the BaseRegistrar contract
 * @param event NameRegisteredEvent from BaseRegistrar contract
 */
export function handleNameRegistered(event: NameRegisteredEvent): void {
  log.info("handleNameRegistered: registrant {} label {} expiry {} txhash {}", [event.params.owner.toHexString(), event.params.id.toHexString(), event.params.expires.toString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackNameRegisteredTransaction(
    event.transaction.hash,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    ETHEREUM_MAINNET_ID,
    event.params.owner.toHexString(),
    event.params.expires,
    event.transaction.value,
    event.params.id,
    rootNode,
  );
}

export function handleNameRenewed(event: NameRenewedEvent): void {
  log.info("handleNameRenewed: renewer {} label {} expiry {} txhash {}", [event.transaction.from.toHexString(), event.params.id.toHexString(), event.params.expires.toString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackNameRenewedTransaction(
    event.transaction.hash,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    event.logIndex,
    event.transaction.value,
    event.transaction.from.toHexString(),
    event.params.id,
    rootNode,
    event.params.expires,
  );
}

export function handleNameRegisteredByControllerOld(event: ControllerNameRegisteredEventOld): void {
  log.info("handleNameRegisteredByControllerOld: name {} label {} cost {} txhash {}", [event.params.name, event.params.label.toHexString(), event.params.cost.toString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackSetNamePreImage(
    event.params.name,
    event.params.label,
    event.params.cost,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    rootNode,
  )
}

export function handleNameRegisteredByController(event: ControllerNameRegisteredEvent): void {
  log.info("handleNameRegisteredByController: name {} label {} cost {} txhash {}", [event.params.name, event.params.label.toHexString(), event.params.cost.toString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackSetNamePreImage(
    event.params.name,
    event.params.label,
    event.params.cost,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    rootNode,
  )
}

export function handleNameRenewedByController(event: ControllerNameRenewedEvent): void {
  log.info("handleNameRenewedByController: name {} label {} cost {} txhash {}", [event.params.name, event.params.label.toHexString(), event.params.cost.toString(), event.transaction.hash.toHexString()]);
  airstack.domain.trackSetNamePreImage(
    event.params.name,
    event.params.label,
    event.params.cost,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    ETHEREUM_MAINNET_ID,
    rootNode,
  )
}