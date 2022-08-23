import { BigInt } from "@graphprotocol/graph-ts";
import { Buy } from "../generated/ExchangeV1/ExchangeV1";
import * as airstack from "./modules/airstack";
import { Transaction } from "../generated/schema";
export function handleBuy(event: Buy): void {
  if (
    event.params.buyTokenId != BigInt.fromI32(0) &&
    event.params.sellTokenId == BigInt.fromI32(0)
  ) {
    // BID
    let sellAmount: BigInt;
    if (event.params.amount == BigInt.fromI32(0)) {
      sellAmount = event.params.amount;
    } else {
      sellAmount = event.params.buyValue
        .times(event.params.amount)
        .div(event.params.sellValue);
      let transaction = Transaction.load(event.transaction.hash.toHexString());
      if (!transaction) {
        transaction = new Transaction(event.transaction.hash.toHexString());
      }
      transaction.type = "BID";
      transaction.sellTokenId = event.params.sellTokenId;
      transaction.sellValue = event.params.sellValue;
      transaction.owner = event.params.owner;
      transaction.buyToken = event.params.buyToken;
      transaction.buyTokenId = event.params.buyTokenId;
      transaction.buyValue = event.params.buyValue;
      transaction.buyer = event.params.buyer;
      transaction.amount = event.params.amount;
      transaction.salt = event.params.salt;
      transaction.sellAmount = sellAmount;
      transaction.buyAmount = event.params.amount;
      transaction.save();
    }

    airstack.nft.trackNFTSaleTransactions(
      event.transaction.hash.toHexString(),
      [event.params.buyer], //from
      [event.params.owner], //to
      [event.params.buyToken], //nft address
      [event.params.buyTokenId], // nft id
      event.params.sellToken, // token address
      sellAmount, // token amount                      TODO: CHECK IT
      event.block.timestamp
    );
  } else {
    // ORDER
    let buyAmount: BigInt;
    if (event.params.amount == BigInt.fromI32(0)) {
      buyAmount = event.params.amount;
    } else {
      buyAmount = event.params.buyValue
        .times(event.params.amount)
        .div(event.params.sellValue);
      let transaction = Transaction.load(event.transaction.hash.toHexString());
      if (!transaction) {
        transaction = new Transaction(event.transaction.hash.toHexString());
      }
      transaction.type = "ORDER";
      transaction.sellTokenId = event.params.sellTokenId;
      transaction.sellValue = event.params.sellValue;
      transaction.owner = event.params.owner;
      transaction.buyToken = event.params.buyToken;
      transaction.buyTokenId = event.params.buyTokenId;
      transaction.buyValue = event.params.buyValue;
      transaction.buyer = event.params.buyer;
      transaction.amount = event.params.amount; // amount of token bought
      transaction.salt = event.params.salt;
      transaction.sellAmount = event.params.amount;
      transaction.buyAmount = event.params.amount;
      transaction.save();
    }
    airstack.nft.trackNFTSaleTransactions(
      event.transaction.hash.toHexString(),
      [event.params.owner], //from
      [event.params.buyer], //to
      [event.params.sellToken], //nft address
      [event.params.sellTokenId], // nft id
      event.params.buyToken, // token address
      event.params.buyValue, // token amount                         TODO: CHECK IT
      event.block.timestamp
    );
  }
}
