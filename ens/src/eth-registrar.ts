// Import types and APIs from graph-ts
import {
  ByteArray,
  log,
  ens,
  crypto,
} from '@graphprotocol/graph-ts'
import { TOKEN_ADDRESS_ENS, createLabelhashToNameMapping, getNameByLabelHash } from "./utils";
import { ZERO_ADDRESS } from '../modules/airstack/domain-name/utils';
import * as airstack from "../modules/airstack/domain-name";
import { checkValidLabel } from "../modules/airstack/domain-name/utils";
// Import event types from the registry contract ABI
import {
  NameRegistered as NameRegisteredEvent,
  NameRenewed as NameRenewedEvent,
  Transfer as NameRegisteredTransferEvent,
} from '../generated/BaseRegistrar/BaseRegistrar';
import {
  NameRegistered as ControllerNameRegisteredEventOld,
} from '../generated/EthRegistrarControllerOld/EthRegistrarControllerOld';
import {
  NameRegistered as ControllerNameRegisteredEventNew,
} from '../generated/EthRegistrarControllerNew/EthRegistrarControllerNew';
import {
  NameRegistered as ControllerNameRegisteredEvent,
  NameRenewed as ControllerNameRenewedEvent
} from '../generated/EthRegistrarController/EthRegistrarController';
import { uint256ToByteArray, byteArrayFromHex, createNameRegisteredTransactionVsRegistrant } from './utils';
import { AirNameRegisteredTransaction } from '../generated/schema';
import { getChainId, getOrCreateAirAccount, getOrCreateAirBlock } from '../modules/airstack/common';

const rootNode: ByteArray = byteArrayFromHex("93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae");

/**
 * @dev this function maps the NameRegistered event from the BaseRegistrar contract
 * @param event NameRegisteredEvent from BaseRegistrar contract
 */
export function handleNameRegistered(event: NameRegisteredEvent): void {
  let label = uint256ToByteArray(event.params.id);
  log.info("handleNameRegistered: registrant {} label {} expiry {} txhash {} logIndex {}", [event.params.owner.toHexString(), label.toHexString(), event.params.expires.toString(), event.transaction.hash.toHexString(), event.logIndex.toString()]);
  let labelName = ens.nameByHash(label.toHexString());
  let domainId = crypto.keccak256(rootNode.concat(label)).toHex();
  if (labelName == null) {
    // try to get the name from the labelhash to name mapping
    labelName = getNameByLabelHash(label.toHexString());
    if (labelName == null) {
      log.info("handleNameRegistered: labelName is null from getNameByLabelHash label {} txhash {}, converting to brackets", [label.toHexString(), event.transaction.hash.toHexString()]);
      labelName = '[' + label.toHexString().slice(2) + ']';
    } else {
      log.info("handleNameRegistered: labelName {} exists from getNameByLabelHash label {} txhash {}", [labelName!, label.toHexString(), event.transaction.hash.toHexString()]);
    }
  } else if (labelName && !checkValidLabel(labelName, event.transaction.hash.toHexString())) {
    log.info("handleNameRegistered: labelName is invalid for label {} txhash {}", [label.toHexString(), event.transaction.hash.toHexString()]);
    labelName = '[' + label.toHexString().slice(2) + ']';
  }
  airstack.domain.trackNameRegisteredTransaction(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    domainId,
    event.params.owner.toHexString(),
    event.params.expires,
    null,
    ZERO_ADDRESS,
    labelName,
    TOKEN_ADDRESS_ENS,
  );
}

/**
 * @dev this function maps the NameRenewed event from the BaseRegistrar contract
 * @param event NameRenewedEvent from BaseRegistrar contract
 */
export function handleNameRenewed(event: NameRenewedEvent): void {
  log.info("handleNameRenewed: renewer {} label {} expiry {} txhash {}", [event.transaction.from.toHexString(), event.params.id.toHexString(), event.params.expires.toString(), event.transaction.hash.toHexString()]);
  let label = uint256ToByteArray(event.params.id);
  let domainId = crypto.keccak256(rootNode.concat(label)).toHex();
  airstack.domain.trackNameRenewedTransaction(
    event.block,
    event.transaction.hash.toHexString(),
    domainId,
    null,
    ZERO_ADDRESS,
    event.transaction.from.toHexString(),
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
  let domainId = crypto.keccak256(rootNode.concat(event.params.label)).toHex();
  let labelName = event.params.name;
  // create Labelhash to Name mapping
  createLabelhashToNameMapping(event.params.label.toHexString(), labelName, event.block.number.toString());
  airstack.domain.trackNameRenewedOrRegistrationByController(
    event.block,
    event.transaction.hash.toHexString(),
    domainId,
    labelName,
    event.params.cost,
    ZERO_ADDRESS,
    event.params.owner.toHexString(),
    event.params.expires,
    true,
    TOKEN_ADDRESS_ENS,
  )
}

/**
 * @dev this function maps the NameRegistered from the EthRegistrarControllerNew contract 
 * @param event ControllerNameRegisteredEventNew from EthRegistrarControllerNew contract
 */
export function handleNameRegisteredByControllerNew(event: ControllerNameRegisteredEventNew): void {
  log.info("handleNameRegisteredByControllerNew: name {} label {} baseCost {} premium {} txhash {}", [event.params.name, event.params.label.toHexString(), event.params.baseCost.toString(), event.params.premium.toString(), event.transaction.hash.toHexString()]);
  let domainId = crypto.keccak256(rootNode.concat(event.params.label)).toHex();
  let labelName = event.params.name;
  // create Labelhash to Name mapping
  createLabelhashToNameMapping(event.params.label.toHexString(), labelName, event.block.number.toString());
  airstack.domain.trackNameRenewedOrRegistrationByController(
    event.block,
    event.transaction.hash.toHexString(),
    domainId,
    labelName,
    event.params.baseCost.plus(event.params.premium),
    ZERO_ADDRESS,
    event.params.owner.toHexString(),
    event.params.expires,
    true,
    TOKEN_ADDRESS_ENS,
  )
}

/**
 * @dev this function maps the NameRegistered event from the EthRegistrarController contract
 * @param event ControllerNameRegisteredEvent from EthRegistrarController contract
 */
export function handleNameRegisteredByController(event: ControllerNameRegisteredEvent): void {
  log.info("handleNameRegisteredByController: name {} label {} cost {} txhash {}", [event.params.name, event.params.label.toHexString(), event.params.cost.toString(), event.transaction.hash.toHexString()]);
  let domainId = crypto.keccak256(rootNode.concat(event.params.label)).toHex();
  let labelName = event.params.name;
  // create Labelhash to Name mapping
  createLabelhashToNameMapping(event.params.label.toHexString(), labelName, event.block.number.toString());
  airstack.domain.trackNameRenewedOrRegistrationByController(
    event.block,
    event.transaction.hash.toHexString(),
    domainId,
    labelName,
    event.params.cost,
    ZERO_ADDRESS,
    event.params.owner.toHexString(),
    event.params.expires,
    true,
    TOKEN_ADDRESS_ENS,
  )
}

/**
 * @dev this function maps the NameRenewed event from the EthRegistrarController and EthRegistrarControllerOld contract
 * @param event ControllerNameRenewedEvent from EthRegistrarController and EthRegistrarControllerOld contract
 */
export function handleNameRenewedByController(event: ControllerNameRenewedEvent): void {
  log.info("handleNameRenewedByController: name {} label {} cost {} txhash {}", [event.params.name, event.params.label.toHexString(), event.params.cost.toString(), event.transaction.hash.toHexString()]);
  let domainId = crypto.keccak256(rootNode.concat(event.params.label)).toHex();
  let labelName = event.params.name;
  // create Labelhash to Name mapping
  createLabelhashToNameMapping(event.params.label.toHexString(), labelName, event.block.number.toString());
  airstack.domain.trackNameRenewedOrRegistrationByController(
    event.block,
    event.transaction.hash.toHexString(),
    domainId,
    labelName,
    event.params.cost,
    ZERO_ADDRESS,
    event.transaction.from.toHexString(),
    event.params.expires,
    false,
    TOKEN_ADDRESS_ENS,
  )
}

/**
 * @dev this function updates the registrant of a name registered transaction
 * @param event NameTransferredEvent from BaseRegistrar contract (token transfer event)
 */
export function handleNameTransferred(event: NameRegisteredTransferEvent): void {
  log.info("handleNameTransferred: from {} to {} tokenId {} txhash {} logIndex {}", [event.params.from.toHexString(), event.params.to.toHexString(), event.params.tokenId.toString(), event.transaction.hash.toHexString(), event.logIndex.toString()]);
  let chainId = getChainId();
  let label = uint256ToByteArray(event.params.tokenId);
  let domainId = crypto.keccak256(rootNode.concat(label)).toHex();
  const nameRegistrationTransactionEntityId = domainId.concat("-").concat(event.transaction.hash.toHexString());
  let nameRegistrationTransaction = AirNameRegisteredTransaction.load(nameRegistrationTransactionEntityId);
  if (nameRegistrationTransaction == null) {
    log.debug("handleNameTransferred: name registration transaction not found for id {} txhash {}", [label.toHexString(), event.transaction.hash.toHexString()]);
    return;
  }
  let oldRegistrantId = nameRegistrationTransaction.registrant;
  let airBlock = getOrCreateAirBlock(chainId, event.block.number, event.block.hash.toHexString(), event.block.timestamp);
  airBlock.save();
  let airAccount = getOrCreateAirAccount(chainId, event.params.to.toHexString(), airBlock);
  airAccount.save();
  // override the registrant as the new owner (helps in case of ens migrations)
  nameRegistrationTransaction.registrant = airAccount.id;
  nameRegistrationTransaction.save();
  // create a mapping for tracking the transaction and registrants
  createNameRegisteredTransactionVsRegistrant(
    event.transaction.hash.toHexString(),
    airBlock,
    nameRegistrationTransactionEntityId,
    event.params.tokenId.toString(),
    oldRegistrantId,
    nameRegistrationTransaction.registrant,
  );
  log.info("handleNameTransferred: nameRegistrationTransactionEntityId {} txhash {} logIndex {} registrantOld {} registrantNew {}", [nameRegistrationTransactionEntityId, event.transaction.hash.toHexString(), event.logIndex.toString(), oldRegistrantId, nameRegistrationTransaction.registrant]);
}