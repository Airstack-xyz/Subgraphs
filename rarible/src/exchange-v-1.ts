import { BigInt } from "@graphprotocol/graph-ts";
import { Buy } from "../generated/ExchangeV1/ExchangeV1";
import * as airstack from "./modules/airstack";
export function handleBuy(event: Buy): void {
  if (
    event.params.buyTokenId != BigInt.fromI32(0) &&
    event.params.sellTokenId == BigInt.fromI32(0)
  ) {
    // BID
    airstack.nft.trackNFTSaleTransactions(
      event.transaction.hash.toHexString(),
      [event.params.buyer], //from
      [event.params.owner], //to
      [event.params.buyToken], //nft address
      [event.params.buyTokenId], // nft id
      event.params.sellToken, // token address
      event.params.sellTokenId, // token price                      TODO: CHECK IT
      event.block.timestamp
    );
  } else {
    // ORDER
    airstack.nft.trackNFTSaleTransactions(
      event.transaction.hash.toHexString(),
      [event.params.owner], //from
      [event.params.buyer], //to
      [event.params.sellToken], //nft address
      [event.params.sellTokenId], // nft id
      event.params.buyToken, // token address
      event.params.buyValue, // token price                         TODO: CHECK IT
      event.block.timestamp
    );
  }
}
