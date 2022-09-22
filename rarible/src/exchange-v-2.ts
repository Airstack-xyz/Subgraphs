import { MatchOrdersCall } from "../generated/ExchangeV2/ExchangeV2";
import {
  ETH,
  ERC20,
  getClass,
  decodeAsset,
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
    // rightAsset is NFT
    let paymentAmount = calculatedTotal(
      orderLeft.makeAsset.value,
      orderLeft.dataType,
      orderLeft.data
    );

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
    // leftAsset is NFT
    let paymentAmount = calculatedTotal(
      orderRight.makeAsset.value,
      orderRight.dataType,
      orderRight.data
    );

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
