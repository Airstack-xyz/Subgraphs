import { MatchOrdersCall } from "../generated/ExchangeV2/ExchangeV2";
import { Transaction } from "../generated/schema";
import {
  BigInt,
  ByteArray,
  Bytes,
  ethereum,
  log,
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
  getExchange,
  calculatedTotal,
} from "./rarible-helper";
import * as airstack from "./modules/airstack";

export function handleMatchOrders(call: MatchOrdersCall): void {
  let orderLeft = call.inputs.orderLeft;
  let orderRight = call.inputs.orderRight;
  let leftAssetType = getClass(orderLeft.makeAsset.assetType.assetClass);
  let rightAssetType = getClass(orderRight.makeAsset.assetType.assetClass);
  let leftAsset = decodeAsset(
    orderLeft.makeAsset.assetType.data,
    leftAssetType
  );
  let rightAsset = decodeAsset(
    orderRight.makeAsset.assetType.data,
    rightAssetType
  );
  if (leftAssetType == ETH || leftAssetType == ERC20) {
    let tx = getOrCreateTransaction(
      call.transaction.hash,
      rightAsset.address,
      rightAsset.id
    );
    tx.hash = call.transaction.hash.toHexString();
    tx.from = orderRight.maker.toHexString();
    tx.to = orderLeft.maker.toHexString();
    tx.nft = "RIGHT";
    tx.nftAddress = rightAsset.address.toHexString();
    tx.nftId = rightAsset.id;
    tx.paymentToken = leftAsset.address.toHexString();
    let paymentAmount = calculatedTotal(
      orderLeft.makeAsset.value,
      orderLeft.dataType,
      orderLeft.data
    );
    tx.paymentAmount = paymentAmount;
    tx.blockHeight = call.block.number;
    tx.exchange = getExchange(orderLeft.dataType);
    tx.save();
    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      [orderRight.maker], //from
      [orderLeft.maker], //to
      [rightAsset.address], //nft address
      [rightAsset.id], // nft id
      leftAsset.address, // token address
      paymentAmount, // token amount
      call.block.timestamp,
      call.block.number
    );
  } else {
    let tx = getOrCreateTransaction(
      call.transaction.hash,
      leftAsset.address,
      leftAsset.id
    );
    tx.hash = call.transaction.hash.toHexString();
    tx.from = orderLeft.maker.toHexString();
    tx.to = orderRight.maker.toHexString();
    tx.nft = "LEFT";
    tx.nftAddress = leftAsset.address.toHexString();
    tx.nftId = leftAsset.id;
    tx.paymentToken = rightAsset.address.toHexString();
    let paymentAmount = calculatedTotal(
      orderRight.makeAsset.value,
      orderRight.dataType,
      orderRight.data
    );
    tx.paymentAmount = paymentAmount;

    tx.exchange = getExchange(orderRight.dataType);
    tx.blockHeight = call.block.number;
    tx.save();
    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      [orderLeft.maker], //from
      [orderRight.maker], //to
      [leftAsset.address], //nft address
      [leftAsset.id], // nft id
      rightAsset.address, // token address
      paymentAmount, // token amount
      call.block.timestamp,
      call.block.number
    );
  }
}

export function getOrCreateTransaction(
  hash: Bytes,
  nftAddress: Bytes,
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
