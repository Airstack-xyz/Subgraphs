import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Buy } from "../generated/ExchangeV1/ExchangeV1";
import * as airstack from "./modules/airstack";
import { Transaction } from "../generated/schema";
import { isNFT, NFTStatus } from "./rarible-helper";

export function getOrCreateTransaction(
  hash: Bytes,
  nftAddress: Address,
  nftId: BigInt
): Transaction {
  let entity = Transaction.load(
    hash.toHexString() +
      "-" +
      nftAddress.toHexString() +
      "-" +
      nftId.toHexString()
  );
  if (!entity) {
    entity = new Transaction(
      hash.toHexString() +
        "-" +
        nftAddress.toHexString() +
        "-" +
        nftId.toHexString()
    );
  }
  return entity;
}
export function handleBuy(event: Buy): void {
  if (isNFT(event.params.buyToken)) {
    // BID ,gives ERC20 or Eth to get NFT
    // buyToken = NFT
    // sellToken = ERC20 or Eth
    let transaction = getOrCreateTransaction(
      event.transaction.hash,
      event.params.sellToken,
      event.params.sellTokenId
    );
    transaction.hash = event.transaction.hash.toHexString();
    transaction.from = event.params.buyer.toHexString();
    transaction.to = event.params.owner.toHexString();
    transaction.nftAddress = event.params.buyToken.toHexString();
    transaction.nftId = event.params.buyTokenId; //0
    transaction.nftAmount = event.params.buyValue;
    transaction.paymentToken = event.params.sellToken.toHexString();
    transaction.paymentTokenId = event.params.sellTokenId;
    transaction.paymentAmount = event.params.sellValue;
    transaction.blockHeight = event.block.number;
    transaction.nftStatus = NFTStatus(event.params.buyToken);
    transaction.save();

    airstack.nft.trackNFTSaleTransactions(
      event.transaction.hash.toHexString(),
      [event.params.buyer], //from
      [event.params.owner], //to
      [event.params.buyToken], //nft address
      [event.params.buyTokenId], // nft id
      event.params.sellToken, // token address
      event.params.sellValue, // token amount                      TODO: CHECK IT
      event.block.timestamp,
      event.block.number
    );
  } else {
    // ORDER, takes in ERC20 or Eth to give NFT
    // buyToken = ERC20 or Eth
    // sellToken = NFT

    let transaction = getOrCreateTransaction(
      event.transaction.hash,
      event.params.sellToken,
      event.params.sellTokenId
    );
    // cases are correct NFTamount/sellValue = 1
    transaction.hash = event.transaction.hash.toHexString();
    transaction.from = event.params.owner.toHexString();
    transaction.to = event.params.buyer.toHexString();
    transaction.nftAddress = event.params.sellToken.toHexString();
    transaction.nftId = event.params.sellTokenId; //0
    transaction.nftAmount = event.params.sellValue;
    transaction.paymentToken = event.params.buyToken.toHexString();
    transaction.paymentTokenId = event.params.buyTokenId;
    transaction.paymentAmount = event.params.buyValue;
    transaction.nftStatus = NFTStatus(event.params.sellToken);
    transaction.blockHeight = event.block.number;
    transaction.save();

    airstack.nft.trackNFTSaleTransactions(
      event.transaction.hash.toHexString(),
      [event.params.owner], //from
      [event.params.buyer], //to
      [event.params.sellToken], //nft address
      [event.params.sellTokenId], // nft id
      event.params.buyToken, // token address
      event.params.buyValue, // token amount                         TODO: CHECK IT
      event.block.timestamp,
      event.block.number
    );
  }
}
