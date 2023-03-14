import { GenArtMint } from '../generated/ERC721GenProxy/ERC721Gen'
import { log } from "@graphprotocol/graph-ts";
import { GenArtMintEvent } from '../generated/schema'
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
    event.params.tokenId
  )
}