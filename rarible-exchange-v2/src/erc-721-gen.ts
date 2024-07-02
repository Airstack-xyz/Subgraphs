import { GenArtMint } from '../generated/templates/ERC721Gen/ERC721Gen'
import { CollectionCreated } from '../generated/ERC721GenFactory/ERC721GenFactory'
import { GenArtMintEvent, Erc721GenCollection } from '../generated/schema'
import { ERC721Gen } from '../generated/templates'
import { createTxnHashVsTokenIdMapping } from './utils';

export function handleGenArtMint(event: GenArtMint): void {
  const id = event.address.toHexString().concat("-").concat(event.params.tokenId.toString());
  let genArtEvent = new GenArtMintEvent(id);
  genArtEvent.tokenId = event.params.tokenId.toString();
  genArtEvent.contractAddress = event.address.toHexString();
  genArtEvent.transactionHash = event.transaction.hash.toHexString();
  genArtEvent.createdAtBlock = event.block.number;
  genArtEvent.save();

  // create the txn hash vs token id mapping
  createTxnHashVsTokenIdMapping(
    event.transaction.hash,
    event.params.tokenId,
    event.block,
  )
}

export function handleCollectionCreated(event: CollectionCreated): void {
  let collection = new Erc721GenCollection(event.transaction.hash.toHexString());
  collection.contractAddress = event.params.collection.toHexString();
  collection.transactionHash = event.transaction.hash.toHexString();
  collection.createdAtBlock = event.block.number;
  collection.save();

  // dynamically create a new datasource for the newly created collection
  // this is done so that we can listen to the events of the newly created collection
  ERC721Gen.create(event.params.collection);
}