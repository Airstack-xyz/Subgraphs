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
    log.info("{} {} {} {} address id and data and hash", [rightAsset.address.toHexString(), rightAsset.id.toString(), orderRight.makeAsset.assetType.data.toHexString(), call.transaction.hash.toHexString()]);

    let paymentAmount = calculatedTotal(
      orderLeft.makeAsset.value,
      orderLeft.dataType,
      orderLeft.data
    );
    log.info("{} payment amount for transaction hash {}", [paymentAmount.toString(), call.transaction.hash.toHexString()]);
    let nft = new airstack.nft.NFT(
      orderLeft.maker,
      rightAssetType,
      rightAsset.id,
      orderRight.makeAsset.value,
    )

    let LibOrderData = getOriginFeeArray(orderLeft.dataType,
      orderLeft.data);

    for (let i = 0; i < LibOrderData.originFeeArray.length; i++) {
      log.info("{} {} address and value originfeearray index {} transactionhash {} data {} exchangetype {} makeassetvalue {} makeassetclass {}",
        [
          LibOrderData.originFeeArray[i].address.toHexString(),
          LibOrderData.originFeeArray[i].value.toString(),
          i.toString(),
          call.transaction.hash.toHexString(),
          orderLeft.data.toHexString(),
          orderLeft.dataType.toHexString(),
          orderLeft.makeAsset.value.toString(),
          orderLeft.makeAsset.assetType.assetClass.toHexString()
        ]
      );
    }

    for (let i = 0; i < LibOrderData.payoutFeeArray.length; i++) {
      log.info("{} {} address and value payoutFeeArray index {} transactionhash {}", [LibOrderData.payoutFeeArray[i].address.toHexString(), LibOrderData.payoutFeeArray[i].value.toString(), i.toString(), call.transaction.hash.toHexString()]);
    }

    log.info("{} ismakefill transactionhash {}", [LibOrderData.isMakeFill.toString(), call.transaction.hash.toHexString()]);

    log.info("{} nftassetvalue for transaction hash {}", [orderRight.makeAsset.value.toString(), call.transaction.hash.toHexString()]);
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

    let nftSales = new airstack.nft.Sale(
      orderLeft.maker,  //to
      orderRight.maker, //from
      nft,
      paymentAmount,
      leftAsset.address,
      originFeeData.originFee,
      originFeeData.originFeeAddress,
      royaltyDetails.royaltyAmount,
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
    log.info("{} {} {} {} address id and data and hash", [leftAsset.address.toHexString(), leftAsset.id.toString(), orderLeft.makeAsset.assetType.data.toHexString(), call.transaction.hash.toHexString()]);

    let paymentAmount = calculatedTotal(
      orderRight.makeAsset.value,
      orderRight.dataType,
      orderRight.data
    );

    log.info("{} payment amount for transaction hash {}", [paymentAmount.toString(), call.transaction.hash.toHexString()]);
    let nft = new airstack.nft.NFT(
      leftAsset.address,
      leftAssetType,
      leftAsset.id,
      orderRight.takeAsset.value,
    )

    let LibOrderData = getOriginFeeArray(orderRight.dataType,
      orderRight.data);

    for (let i = 0; i < LibOrderData.originFeeArray.length; i++) {
      log.info("{} {} address and value originfeearray index {} transactionhash {} data {} exchangetype {} makeassetvalue {}",
        [
          LibOrderData.originFeeArray[i].address.toHexString(),
          LibOrderData.originFeeArray[i].value.toString(),
          i.toString(),
          call.transaction.hash.toHexString(),
          orderRight.data.toHexString(),
          orderRight.dataType.toHexString(),
          orderRight.makeAsset.value.toString(),
          orderRight.makeAsset.assetType.assetClass.toHexString()
        ]);
    }

    for (let i = 0; i < LibOrderData.payoutFeeArray.length; i++) {
      log.info("{} {} address and value payoutFeeArray index {} transactionhash {}", [LibOrderData.payoutFeeArray[i].address.toHexString(), LibOrderData.payoutFeeArray[i].value.toString(), i.toString(), call.transaction.hash.toHexString()]);
    }

    log.info("{} ismakefill transactionhash {}", [LibOrderData.isMakeFill.toString(), call.transaction.hash.toHexString()]);

    log.info("{} nftassetvalue for transaction hash {}", [orderRight.takeAsset.value.toString(), call.transaction.hash.toHexString()]);
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

    let nftSales = new airstack.nft.Sale(
      orderRight.maker, //to
      orderLeft.maker,  //from
      nft,
      paymentAmount,
      rightAsset.address,
      originFeeData.originFee,
      originFeeData.originFeeAddress,
      royaltyDetails.royaltyAmount,
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
