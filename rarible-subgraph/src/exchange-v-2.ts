import { BigInt, dataSource, log } from "@graphprotocol/graph-ts";
import { MatchOrdersCall } from "../generated/ExchangeV2/ExchangeV2";
import {
  ETH,
  ERC20,
  getClass,
  decodeAsset,
  calculatedTotal,
  getOriginFees,
  getOriginFeesWithRestValue,
  AirProtocolActionType,
  AirProtocolType,
  zeroAddress,
  getRoyaltyDetailsForExchangeV2,
  subFeeInBp,
  BIGINT_ZERO,
  getOriginFeeArray,
  matchAndTransfer,
  LibOrder,
  convertAssetToLibAsset,
  doTransfers,
  LibDealSide,
  LibAsset,
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
    log.info("{} {} {} {} address id and data and hash leftasset is nft", [rightAsset.address.toHexString(), rightAsset.id.toString(), orderRight.makeAsset.assetType.data.toHexString(), call.transaction.hash.toHexString()]);

    let paymentAmount = calculatedTotal(
      orderLeft.makeAsset.value,
      orderLeft.dataType,
      orderLeft.data
    );

    let nft = new airstack.nft.NFT(
      orderLeft.maker,
      rightAssetType,
      rightAsset.id,
      orderRight.makeAsset.value,
    )

    let royaltyDetails = getRoyaltyDetailsForExchangeV2(
      orderRight.makeAsset.assetType.assetClass,
      orderRight.makeAsset.assetType.data,
      dataSource.address(),
      paymentAmount,
      paymentAmount,
    );
    log.info("{} royalty fee for transaction hash {}", [royaltyDetails.royaltyAmount.toString(), call.transaction.hash.toHexString()]);

    let originFeeData = getOriginFeesWithRestValue(orderLeft.dataType, orderLeft.data, royaltyDetails.restValue, paymentAmount);
    log.info("{} origin fee for transaction hash {}", [originFeeData.originFee.toString(), call.transaction.hash.toHexString()]);

    let orderLeftInput = new LibOrder(
      orderLeft.maker,
      convertAssetToLibAsset(orderLeft.makeAsset),
      orderLeft.taker,
      convertAssetToLibAsset(orderLeft.takeAsset),
      orderLeft.salt,
      orderLeft.start,
      orderLeft.end,
      orderLeft.dataType,
      orderLeft.data,
    );

    let orderRightInput = new LibOrder(
      orderRight.maker,
      convertAssetToLibAsset(orderRight.makeAsset),
      orderRight.taker,
      convertAssetToLibAsset(orderRight.takeAsset),
      orderRight.salt,
      orderRight.start,
      orderRight.end,
      orderRight.dataType,
      orderRight.data,
    );

    let paymentSide = new LibDealSide(
      convertAssetToLibAsset(orderLeft.makeAsset),
      getOriginFeeArray(orderLeft.dataType, orderLeft.data, call).payoutFeeArray,
      getOriginFeeArray(orderLeft.dataType, orderLeft.data, call).originFeeArray,
      zeroAddress,
      orderLeft.maker,
    );

    let nftSide = new LibDealSide(
      convertAssetToLibAsset(orderRight.makeAsset),
      getOriginFeeArray(orderRight.dataType, orderRight.data, call).payoutFeeArray,
      getOriginFeeArray(orderRight.dataType, orderRight.data, call).originFeeArray,
      zeroAddress,
      orderRight.maker,
    );

    let matchAndTransferResult = matchAndTransfer(paymentSide, nftSide, orderLeftInput, orderRightInput, call.from, dataSource.address(), call);
    log.info("{} {} {} match and transfer result for rightasset transaction hash {}", [matchAndTransferResult.originFeeAmount.toString(), matchAndTransferResult.royaltyAmount.toString(), matchAndTransferResult.paymentAmount.toString(), call.transaction.hash.toHexString()]);

    let nftSales = new airstack.nft.Sale(
      orderLeft.maker,  //to
      orderRight.maker, //from
      nft,
      // paymentAmount,
      matchAndTransferResult.paymentAmount,
      leftAsset.address,
      // originFeeData.originFee,'
      matchAndTransferResult.originFeeAmount,
      originFeeData.originFeeAddress,
      // royaltyDetails.royaltyAmount,
      matchAndTransferResult.royaltyAmount,
      royaltyDetails.royaltyRecipient,
    )

    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      call.transaction.index,
      [nftSales],
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.SELL,
      call.block.timestamp,
      call.block.number,
      call.block.hash.toHexString()
    );
  } else {
    // leftAsset is NFT
    log.info("{} {} {} {} address id and data and hash leftasset is nft", [leftAsset.address.toHexString(), leftAsset.id.toString(), orderLeft.makeAsset.assetType.data.toHexString(), call.transaction.hash.toHexString()]);

    let paymentAmount = calculatedTotal(
      orderRight.makeAsset.value,
      orderRight.dataType,
      orderRight.data
    );

    log.info("{} payment amount for transaction hash {}", [paymentAmount.toString(), call.transaction.hash.toHexString()]);
    let nft = new airstack.nft.NFT(
      orderRight.maker,
      leftAssetType,
      leftAsset.id,
      orderLeft.makeAsset.value,
    )

    let royaltyDetails = getRoyaltyDetailsForExchangeV2(
      orderLeft.makeAsset.assetType.assetClass,
      orderLeft.makeAsset.assetType.data,
      dataSource.address(),
      paymentAmount,
      paymentAmount,
    );
    log.info("{} royalty fee for transaction hash {}", [royaltyDetails.royaltyAmount.toString(), call.transaction.hash.toHexString()]);

    let originFeeData = getOriginFeesWithRestValue(orderRight.dataType, orderRight.data, royaltyDetails.restValue, paymentAmount);
    log.info("{} origin fee for transaction hash {}", [originFeeData.originFee.toString(), call.transaction.hash.toHexString()]);

    let orderLeftInput = new LibOrder(
      orderRight.maker,
      convertAssetToLibAsset(orderRight.makeAsset),
      orderRight.taker,
      convertAssetToLibAsset(orderRight.takeAsset),
      orderRight.salt,
      orderRight.start,
      orderRight.end,
      orderRight.dataType,
      orderRight.data,
    );

    let orderRightInput = new LibOrder(
      orderLeft.maker,
      convertAssetToLibAsset(orderLeft.makeAsset),
      orderLeft.taker,
      convertAssetToLibAsset(orderLeft.takeAsset),
      orderLeft.salt,
      orderLeft.start,
      orderLeft.end,
      orderLeft.dataType,
      orderLeft.data,
    );

    let paymentSide = new LibDealSide(
      convertAssetToLibAsset(orderRight.makeAsset),
      getOriginFeeArray(orderRight.dataType, orderRight.data, call).payoutFeeArray,
      getOriginFeeArray(orderRight.dataType, orderRight.data, call).originFeeArray,
      zeroAddress,
      orderRight.maker,
    );

    let nftSide = new LibDealSide(
      convertAssetToLibAsset(orderLeft.makeAsset),
      getOriginFeeArray(orderLeft.dataType, orderLeft.data, call).payoutFeeArray,
      getOriginFeeArray(orderLeft.dataType, orderLeft.data, call).originFeeArray,
      zeroAddress,
      orderLeft.maker,
    );

    let matchAndTransferResult = matchAndTransfer(paymentSide, nftSide, orderLeftInput, orderRightInput, call.from, dataSource.address(), call);
    log.info("{} {} {} match and transfer result for leftasset transaction hash {}", [matchAndTransferResult.originFeeAmount.toString(), matchAndTransferResult.royaltyAmount.toString(), matchAndTransferResult.paymentAmount.toString(), call.transaction.hash.toHexString()]);

    let nftSales = new airstack.nft.Sale(
      orderRight.maker, //to
      orderLeft.maker,  //from
      nft,
      // paymentAmount,
      matchAndTransferResult.paymentAmount,
      rightAsset.address,
      // originFeeData.originFee,'
      matchAndTransferResult.originFeeAmount,
      originFeeData.originFeeAddress,
      // royaltyDetails.royaltyAmount,
      matchAndTransferResult.royaltyAmount,
      royaltyDetails.royaltyRecipient,
    )

    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      call.transaction.index,
      [nftSales],
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.BUY,
      call.block.timestamp,
      call.block.number,
      call.block.hash.toHexString()
    );
  }
}
