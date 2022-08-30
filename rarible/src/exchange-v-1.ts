import { Address, BigInt, Bytes, TypedMap } from "@graphprotocol/graph-ts";
import { ExchangeCall } from "../generated/ExchangeV1/ExchangeV1";
import * as airstack from "./modules/airstack";
import { Transaction } from "../generated/schema";
// import { isNFT } from "./rarible-helper";

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
const assetTypeMap = new TypedMap<number, string>();
assetTypeMap.set(0, "ETH");
assetTypeMap.set(1, "ERC20");
assetTypeMap.set(2, "ERC1155");
assetTypeMap.set(3, "ERC721");
assetTypeMap.set(4, "ERC721Deprecated");

export function handleExchange(call: ExchangeCall): void {
  let paying = call.inputs.order.buying
    .times(call.inputs.amount)
    .div(call.inputs.order.selling);
  let fee = paying.times(call.inputs.buyerFee).div(BigInt.fromI32(10000));
  let paymentAmount = paying.plus(fee);
  let sellAsset = call.inputs.order.key.sellAsset;
  let buyAsset = call.inputs.order.key.buyAsset;
  if (sellAsset.assetType > 1) {
    // sellAsset is NFT,the owner has it & wants buy Asset
    let tx = getOrCreateTransaction(
      call.transaction.hash,
      sellAsset.token,
      sellAsset.tokenId
    );
    tx.nftAddress = sellAsset.token.toHexString();
    tx.nftId = sellAsset.tokenId;
    tx.paymentToken = buyAsset.token.toHexString();
    tx.paymentAmount = paymentAmount;
    tx.paymentTokenId = buyAsset.tokenId;
    tx.from = call.inputs.order.key.owner.toHexString();
    tx.to = call.from.toHexString();
    tx.blockHeight = call.block.number;
    tx.hash = call.transaction.hash.toHexString();
    tx.nft = "sellAsset";
    tx.nftTypeId = BigInt.fromI32(sellAsset.assetType);
    tx.nftType = assetTypeMap.get(sellAsset.assetType);
    tx.save();

    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      [call.inputs.order.key.owner], //from
      [call.from], //to
      [sellAsset.token], //nft address
      [sellAsset.tokenId], // nft id
      buyAsset.token, // token address
      paymentAmount, // token amount                      TODO: CHECK IT
      call.block.timestamp,
      call.block.number
    );
  } else {
    // buyAsset is NFT,the owner wants NFT & give token/ETH

    let tx = getOrCreateTransaction(
      call.transaction.hash,
      buyAsset.token,
      buyAsset.tokenId
    );
    tx.nftAddress = buyAsset.token.toHexString();
    tx.nftId = buyAsset.tokenId;
    tx.paymentToken = sellAsset.token.toHexString();
    tx.paymentAmount = paymentAmount;
    tx.paymentTokenId = sellAsset.tokenId;
    tx.to = call.inputs.order.key.owner.toHexString();
    tx.from = call.from.toHexString();
    tx.blockHeight = call.block.number;
    tx.hash = call.transaction.hash.toHexString();
    tx.nft = "buyAsset";
    tx.nftTypeId = BigInt.fromI32(buyAsset.assetType);
    tx.nftType = assetTypeMap.get(buyAsset.assetType);
    tx.save();

    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      [call.from], //from
      [call.inputs.order.key.owner], //to
      [buyAsset.token], //nft address
      [buyAsset.tokenId], // nft id
      sellAsset.token, // token address
      paymentAmount, // token amount                      TODO: CHECK IT
      call.block.timestamp,
      call.block.number
    );
  }
}
