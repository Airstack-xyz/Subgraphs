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
} from '../generated/BaseRegistrar/BaseRegistrar'

const rootNode: ByteArray = byteArrayFromHex("93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae");

/**
 * @dev this function maps the NameRegistered event from the BaseRegistrar contract
 * @param event NameRegisteredEvent from BaseRegistrar contract
 */
export function handleNameRegistered(event: NameRegisteredEvent): void {
  // prep mapping data
  let registrantAddress = event.params.owner.toHexString();
  let label = uint256ToByteArray(event.params.id);
  let labelName = ens.nameByHash(label.toHexString());
  let cost = event.transaction.value;
  let paymentToken: string | null = ZERO_ADDRESS;
  if (cost <= BIG_INT_ZERO) {
    paymentToken = null;
  }
  let domainId = crypto.keccak256(rootNode.concat(label)).toHex();
  let block = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(
    domainId,
    ETHEREUM_MAINNET_ID,
    block,
  ));

  if (labelName != null) {
    domain.labelName = labelName
  }
  domain.expiryDate = event.params.expires;
  domain.save();

  // send to airstack
  airstack.domain.trackNameRegisteredTransaction(
    event.transaction.hash,
    event.block.number,
    event.block.hash.toHexString(),
    event.block.timestamp,
    event.logIndex,
    domain,
    ETHEREUM_MAINNET_ID,
    registrantAddress,
    event.params.expires,
    paymentToken,
    cost,
  );
}

export function handleNameRenewed(event: NameRenewedEvent): void {
  // prep mapping data
  let label = uint256ToByteArray(event.params.id);
  let renewer = event.transaction.from.toHexString();
  let cost = event.transaction.value;
  let paymentToken: string | null = ZERO_ADDRESS;
  if (cost <= BIG_INT_ZERO) {
    paymentToken = null;
  }
  let block = airstack.domain.getOrCreateAirBlock(ETHEREUM_MAINNET_ID, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  let domainId = crypto.keccak256(rootNode.concat(label)).toHex();
  let domain = airstack.domain.getOrCreateAirDomain(new airstack.domain.Domain(
    domainId,
    ETHEREUM_MAINNET_ID,
    block,
  ));
  domain.expiryDate = event.params.expires;
  domain.save();

  // send to airstack
  airstack.domain.trackNameRenewedTransaction(
    event.transaction.hash,
    ETHEREUM_MAINNET_ID,
    block,
    event.logIndex,
    domain,
    cost,
    paymentToken,
    renewer,
    event.params.expires,
  );
}
