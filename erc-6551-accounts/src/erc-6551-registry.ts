import { AccountCreated as AccountCreatedEvent } from "../generated/ERC6551Registry/ERC6551Registry"
import { getChainId, updateAirEntityCounter, getOrCreateAirBlock } from "./common";
import { AirBlock, AirERC6551Account } from "../generated/schema";


const AIR_ERC6551_ACCOUNT_LAST_UPDATED_INDEX = 'AIR_ERC6551_ACCOUNT_LAST_UPDATED_INDEX';
export function handleAccountCreated(event: AccountCreatedEvent): void {
  let entity = new AirERC6551Account(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account.toHexString()
  entity.implementation = event.params.implementation.toHexString()
  entity.chainId = event.params.chainId
  entity.tokenContract = event.params.tokenContract.toHexString()
  entity.tokenId = event.params.tokenId
  entity.salt = event.params.salt
  entity.registry = event.address.toHexString();
  entity.deployer = event.transaction.from.toHexString();

  let chainId = getChainId();
  let block = event.block;

  let airBlock = getOrCreateAirBlock(chainId, block.number, block.hash.toHexString(), block.timestamp);
  airBlock.save();;
  entity.createdAt = airBlock.id;

  entity.transactionHash = event.transaction.hash
  entity.logIndex = event.logIndex;

  saveERC6551Account(entity, airBlock);
}

function saveERC6551Account(account: AirERC6551Account, block: AirBlock): void {

  account.updatedAt = block.id;
  account.lastUpdatedIndex = updateAirEntityCounter(
    AIR_ERC6551_ACCOUNT_LAST_UPDATED_INDEX,
    block
  )
  
  account.save()
}