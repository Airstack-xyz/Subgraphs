import { MatchOrdersCall } from "../generated/ExchangeV2/ExchangeV2";
import {
  ETH,
  ERC20,
  getClass,
  decodeAsset,
  calculatedTotal,
} from "./utils";
import * as airstack from "./modules/airstack";
import { AirProtocolActionType, AirProtocolType } from "./utils";

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
      rightAsset.assetClass,
      rightAsset.id,
      orderRight.makeAsset.value,
    )

    let nftSales = new airstack.nft.Sale(
      orderLeft.maker,
      orderRight.maker,
      nft,
      paymentAmount,
      leftAsset.address,
      beneficiaryDetails.beneficiaryFee,
      beneficiaryDetails.beneficiary,
      royaltyDetails.royaltyAmounts.length > 0 ? royaltyDetails.royaltyAmounts[0] : BigInt.fromI32(0),
      royaltyDetails.royaltyRecipients.length > 0 ? royaltyDetails.royaltyRecipients[0] : utils.zeroAddress,
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
      leftAsset.assetClass,
      leftAsset.id,
      orderLeft.makeAsset.value,
    )

    let nftSales = new airstack.nft.Sale(
      orderRight.maker,
      orderLeft.maker,
      nft,
      paymentAmount,
      rightAsset.address,
      beneficiaryDetails.beneficiaryFee,
      beneficiaryDetails.beneficiary,
      royaltyDetails.royaltyAmounts.length > 0 ? royaltyDetails.royaltyAmounts[0] : BigInt.fromI32(0),
      royaltyDetails.royaltyRecipients.length > 0 ? royaltyDetails.royaltyRecipients[0] : utils.zeroAddress,
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
