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
import { byteArrayFromHex, uint256ToByteArray, ETHEREUM_MAINNET_ID } from '../modules/airstack/utils'
import * as airstack from "../modules/airstack";

// Import event types from the registry contract ABI
import {
  NameRegistered as NameRegisteredEvent,
  NameRenewed as NameRenewedEvent,
  Transfer as TransferEvent
} from '../generated/BaseRegistrar/BaseRegistrar'

const rootNode: ByteArray = byteArrayFromHex("93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae");

// Import entity types generated from the GraphQL schema
// import { Account, Domain, NameRegistered, NameRenewed, NameTransferred, Registration } from '../generated/schema'

/**
 * @dev this function maps the NameRegistered event from the BaseRegistrar contract
 * @param event NameRegisteredEvent from BaseRegistrar contract
 */
export function handleNameRegistered(event: NameRegisteredEvent): void {
  // prep mapping data
  let registrantAddress = event.params.owner.toHexString();
  let label = uint256ToByteArray(event.params.id);
  let labelName = ens.nameByHash(label.toHexString());
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
  domain.save()

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
    labelName,
  );
}

// export function handleNameRenewed(event: NameRenewedEvent): void {
//   let label = uint256ToByteArray(event.params.id)
//   let registration = Registration.load(label.toHex())!
//   registration.expiryDate = event.params.expires
//   registration.save()

//   let registrationEvent = new NameRenewed(createEntityId(event))
//   registrationEvent.registration = registration.id
//   registrationEvent.blockNumber = event.block.number.toI32()
//   registrationEvent.transactionID = event.transaction.hash
//   registrationEvent.expiryDate = event.params.expires
//   registrationEvent.save()
// }
