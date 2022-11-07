import { BigInt, dataSource } from "@graphprotocol/graph-ts";
import { MatchOrdersCall } from "../generated/ExchangeV2/ExchangeV2";
import {
  ETH,
  ERC20,
  getClass,
  decodeAsset,
  calculatedTotal,
  getOriginFees,
  AirProtocolActionType,
  AirProtocolType,
  zeroAddress,
  getRoyaltyDetailsForExchangeV2,
} from "./utils";
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

    let nft = new airstack.nft.NFT(
      rightAsset.address,
      rightAssetType,
      rightAsset.id,
      orderRight.makeAsset.value,
    )

    let originFeeData = getOriginFees(orderLeft.dataType, orderLeft.data);

    let royaltyDetails = getRoyaltyDetailsForExchangeV2(
      orderRight.makeAsset.assetType.assetClass,
      orderRight.makeAsset.assetType.data,
      dataSource.address(),
    );

    let nftSales = new airstack.nft.Sale(
      orderLeft.maker,  //to
      orderRight.maker, //from
      nft,
      paymentAmount,
      leftAsset.address,
      originFeeData.originFee,
      originFeeData.originFeeAddress,
      royaltyDetails.royaltyAmounts.length > 0 ? royaltyDetails.royaltyAmounts[0] : BigInt.fromI32(0),
      royaltyDetails.royaltyRecipients.length > 0 ? royaltyDetails.royaltyRecipients[0] : zeroAddress,
    )

    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      call.transaction.index,
      [nftSales],
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.SELL,
      // [orderRight.maker], //from
      // [orderLeft.maker], //to
      // [rightAsset.address], //nft address
      // [rightAsset.id], // nft id
      // leftAsset.address, // token address
      // paymentAmount, // token amount
      call.block.timestamp,
      call.block.number,
      call.block.hash.toHexString()
    );
  } else {
    // leftAsset is NFT
    let paymentAmount = calculatedTotal(
      orderRight.makeAsset.value,
      orderRight.dataType,
      orderRight.data
    );

    let nft = new airstack.nft.NFT(
      leftAsset.address,
      leftAssetType,
      leftAsset.id,
      orderLeft.makeAsset.value,
    )

    let originFeeData = getOriginFees(orderRight.dataType, orderRight.data);

    let royaltyDetails = getRoyaltyDetailsForExchangeV2(
      orderRight.makeAsset.assetType.assetClass,
      orderRight.makeAsset.assetType.data,
      dataSource.address(),
    );

    let nftSales = new airstack.nft.Sale(
      orderRight.maker, //to
      orderLeft.maker,  //from
      nft,
      paymentAmount,
      rightAsset.address,
      originFeeData.originFee,
      originFeeData.originFeeAddress,
      royaltyDetails.royaltyAmounts.length > 0 ? royaltyDetails.royaltyAmounts[0] : BigInt.fromI32(0),
      royaltyDetails.royaltyRecipients.length > 0 ? royaltyDetails.royaltyRecipients[0] : zeroAddress,
    )

    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      call.transaction.index,
      [nftSales],
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.BUY,
      // [orderLeft.maker], //from
      // [orderRight.maker], //to
      // [leftAsset.address], //nft address
      // [leftAsset.id], // nft id
      // rightAsset.address, // token address
      // paymentAmount, // token amount
      call.block.timestamp,
      call.block.number,
      call.block.hash.toHexString()
    );
  }
}
