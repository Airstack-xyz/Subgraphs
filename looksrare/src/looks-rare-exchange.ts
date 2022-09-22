import {
  TakerAsk as TakerAskEvent,
  TakerBid as TakerBidEvent,
} from "../generated/LooksRareExchange/LooksRareExchange";
import * as airstack from "./modules/airstack";

export function handleTakerAsk(event: TakerAskEvent): void {
  // TakerAsk - sells the NFT for the ERC-20 token
  // MakerBid - user wishes to acquire a NFT using a specific ERC-20 token.

  airstack.nft.trackNFTSaleTransactions(
    event.transaction.hash.toHexString(),
    [event.params.taker], //from
    [event.params.maker], //to
    [event.params.collection],
    [event.params.tokenId],
    event.params.currency,
    event.params.price,
    event.block.timestamp,
    event.block.number
  );
}

export function handleTakerBid(event: TakerBidEvent): void {
  // MakerAsk — Wishes to sell a NFT for a ERC-20 token.
  // TakerBid — buys the NFT for the ERC-20 token specified.

  airstack.nft.trackNFTSaleTransactions(
    event.transaction.hash.toHexString(),
    [event.params.maker], //from
    [event.params.taker], //to
    [event.params.collection],
    [event.params.tokenId],
    event.params.currency,
    event.params.price,
    event.block.timestamp,
    event.block.number
  );
}
