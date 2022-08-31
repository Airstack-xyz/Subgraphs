import { Match as MatchEvent } from "../generated/ExchangeV2/ExchangeV2";
import { Transaction } from "../generated/schema";
import {
  BigInt,
  ByteArray,
  Bytes,
  ethereum,
  TypedMap,
} from "@graphprotocol/graph-ts";
import {
  classMap,
  ETH,
  ERC20,
  ERC721,
  ERC1155,
  getClass,
  decodeAsset,
  SPECIAL,
  Asset,
  getNFTType,
} from "./rarible-helper";
import * as airstack from "./modules/airstack";

export function handleMatch(event: MatchEvent): void {
  let leftAsset = decodeAsset(
    event.params.leftAsset.data,
    event.params.leftAsset.assetClass
  );
  let rightAsset = decodeAsset(
    event.params.rightAsset.data,
    event.params.rightAsset.assetClass
  );

  if (leftAsset.assetClass == ERC20 || leftAsset.assetClass == ETH) {
    // right is NFT
    let tx = getOrCreateTransaction(event.transaction.hash, rightAsset);

    tx.hash = event.transaction.hash.toHexString();
    tx.nft = "RIGHT";
    tx.from = event.params.rightMaker.toHexString();
    tx.to = event.params.leftMaker.toHexString();
    tx.nftAddress = rightAsset.address.toHexString();
    tx.nftId = rightAsset.id;
    tx.paymentToken = leftAsset.address.toHexString();
    // tx.paymentAmount = event.params.newRightFill;
    tx.paymentAmount = event.params.newRightFill.plus(
      event.params.newRightFill
        .times(BigInt.fromI32(250))
        .div(BigInt.fromI32(10000))
    );
    tx.nftType = rightAsset.assetClass;

    tx.blockHeight = event.block.number;
    tx.save();

    airstack.nft.trackNFTSaleTransactions(
      event.transaction.hash.toHexString(),
      [event.params.rightMaker], //from
      [event.params.leftMaker], //to
      [rightAsset.address], //nft address
      [rightAsset.id], // nft id
      leftAsset.address, // token address
      event.params.newRightFill.plus(
        event.params.newRightFill
          .times(BigInt.fromI32(250))
          .div(BigInt.fromI32(10000))
      ), // token amount
      event.block.timestamp,
      event.block.number
    );
  } else {
    // left is NFT
    let tx = getOrCreateTransaction(event.transaction.hash, leftAsset);
    tx.nft = "LEFT";
    tx.hash = event.transaction.hash.toHexString();
    tx.from = event.params.leftMaker.toHexString();
    tx.to = event.params.rightMaker.toHexString();
    tx.nftAddress = leftAsset.address.toHexString();
    tx.nftId = leftAsset.id;
    tx.paymentToken = rightAsset.address.toHexString();
    tx.paymentAmount = event.params.newLeftFill.plus(
      event.params.newLeftFill
        .times(BigInt.fromI32(250))
        .div(BigInt.fromI32(10000))
    );
    tx.nftType = leftAsset.assetClass;
    tx.blockHeight = event.block.number;
    tx.save();

    airstack.nft.trackNFTSaleTransactions(
      event.transaction.hash.toHexString(),
      [event.params.leftMaker], //from
      [event.params.rightMaker], //to
      [leftAsset.address], //nft address
      [leftAsset.id], // nft id
      rightAsset.address, // token address
      event.params.newLeftFill.plus(
        event.params.newLeftFill
          .times(BigInt.fromI32(250))
          .div(BigInt.fromI32(10000))
      ), // token amount
      event.block.timestamp,
      event.block.number
    );
  }
}

export function getOrCreateTransaction(hash: Bytes, asset: Asset): Transaction {
  let tx = Transaction.load(
    hash.toHexString() +
      "-" +
      asset.address.toHexString() +
      "-" +
      asset.id.toHexString()
  );
  if (!tx) {
    tx = new Transaction(
      hash.toHexString() +
        "-" +
        asset.address.toHexString() +
        "-" +
        asset.id.toHexString()
    );
  }
  tx.exchange = "v2";
  return tx;
}
