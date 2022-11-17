import { BigInt, dataSource, log } from "@graphprotocol/graph-ts";
import { DirectAcceptBidCall, MatchOrdersCall } from "../generated/ExchangeV2/ExchangeV2";
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
  LibAssetType,
  decodeAssetDirectAcceptBid,
  getPaymentAssetType,
  getOtherOrderType,
  matchAndTransferDAB,
} from "./utils";
import * as airstack from "./modules/airstack";

export function handleMatchOrders(call: MatchOrdersCall): void {
  let transactionHash = call.transaction.hash;
  let orderLeft = call.inputs.orderLeft;
  let orderRight = call.inputs.orderRight;
  let leftAssetType = getClass(orderLeft.makeAsset.assetType.assetClass);
  let rightAssetType = getClass(orderRight.makeAsset.assetType.assetClass);

  let leftAsset = decodeAsset(
    orderLeft.makeAsset.assetType.data,
    leftAssetType,
    transactionHash,
  );
  log.info("leftasset data {} type {} hash {}", [orderLeft.makeAsset.assetType.data.toHexString(), orderLeft.makeAsset.assetType.assetClass.toHexString(), transactionHash.toHexString()]);

  let rightAsset = decodeAsset(
    orderRight.makeAsset.assetType.data,
    rightAssetType,
    transactionHash,
  );
  log.info("rightasset data {} type {} hash {}", [orderRight.makeAsset.assetType.data.toHexString(), orderRight.makeAsset.assetType.assetClass.toHexString(), transactionHash.toHexString()]);

  if (leftAssetType == ETH || leftAssetType == ERC20) {
    // rightAsset is NFT
    log.info("{} {} {} {} address id and data and hash leftasset is nft", [rightAsset.address.toHexString(), rightAsset.id.toString(), orderRight.makeAsset.assetType.data.toHexString(), transactionHash.toHexString()]);

    // let payment = calculatedTotal(
    //   orderLeft.makeAsset.value,
    //   orderLeft.dataType,
    //   orderLeft.data
    // );

    let nft = new airstack.nft.NFT(
      rightAsset.address,
      rightAssetType,
      rightAsset.id,
      orderRight.makeAsset.value,
    )

    // let royaltyDetails = getRoyaltyDetailsForExchangeV2(
    //   orderRight.makeAsset.assetType.assetClass,
    //   orderRight.makeAsset.assetType.data,
    //   dataSource.address(),
    //   payment,
    //   payment,
    // );
    // log.info("{} royalty fee for transaction hash {}", [royaltyDetails.royalty.value.toString(), transactionHash.toHexString()]);

    // let originFeeData = getOriginFeesWithRestValue(orderLeft.dataType, orderLeft.data, royaltyDetails.restValue, payment);
    // log.info("{} origin fee for transaction hash {}", [originFeeData.originFee.toString(), transactionHash.toHexString()]);

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
      getOriginFeeArray(orderLeft.dataType, orderLeft.data, transactionHash).payoutFeeArray,
      getOriginFeeArray(orderLeft.dataType, orderLeft.data, transactionHash).originFeeArray,
      zeroAddress,
      orderLeft.maker,
    );

    let nftSide = new LibDealSide(
      convertAssetToLibAsset(orderRight.makeAsset),
      getOriginFeeArray(orderRight.dataType, orderRight.data, transactionHash).payoutFeeArray,
      getOriginFeeArray(orderRight.dataType, orderRight.data, transactionHash).originFeeArray,
      zeroAddress,
      orderRight.maker,
    );

    let matchAndTransferResult = matchAndTransfer(paymentSide, nftSide, orderLeftInput, orderRightInput, call.from, dataSource.address(), transactionHash);
    log.info("{} {} {} match and transfer result for rightasset transaction hash {}", [matchAndTransferResult.originFee.value.toString(), matchAndTransferResult.royalty.value.toString(), matchAndTransferResult.payment.toString(), transactionHash.toHexString()]);

    let nftSales = new airstack.nft.Sale(
      orderLeft.maker,  //to
      orderRight.maker, //from
      nft, //nft
      matchAndTransferResult.payment, //payment amount
      leftAsset.address, //payment token
      matchAndTransferResult.originFee.value,  //protocol fees
      matchAndTransferResult.originFee.address, //protocol beneficiary
      matchAndTransferResult.royalty.value, //royalty fee
      matchAndTransferResult.royalty.address, //royalty beneficiary
    )

    airstack.nft.trackNFTSaleTransactions(
      transactionHash.toHexString(),
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
    log.info("{} {} {} {} address id and data and hash leftasset is nft", [leftAsset.address.toHexString(), leftAsset.id.toString(), orderLeft.makeAsset.assetType.data.toHexString(), transactionHash.toHexString()]);

    // let payment = calculatedTotal(
    //   orderRight.makeAsset.value,
    //   orderRight.dataType,
    //   orderRight.data
    // );

    // log.info("{} payment amount for transaction hash {}", [payment.toString(), transactionHash.toHexString()]);
    let nft = new airstack.nft.NFT(
      leftAsset.address,
      leftAssetType,
      leftAsset.id,
      orderRight.takeAsset.value,
    )

    // let royaltyDetails = getRoyaltyDetailsForExchangeV2(
    //   orderLeft.makeAsset.assetType.assetClass,
    //   orderLeft.makeAsset.assetType.data,
    //   dataSource.address(),
    //   payment,
    //   payment,
    // );
    // log.info("{} royalty fee for transaction hash {}", [royaltyDetails.royalty.value.toString(), transactionHash.toHexString()]);

    // let originFeeData = getOriginFeesWithRestValue(orderRight.dataType, orderRight.data, royaltyDetails.restValue, payment);
    // log.info("{} origin fee for transaction hash {}", [originFeeData.originFee.toString(), transactionHash.toHexString()]);

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
      getOriginFeeArray(orderRight.dataType, orderRight.data, transactionHash).payoutFeeArray,
      getOriginFeeArray(orderRight.dataType, orderRight.data, transactionHash).originFeeArray,
      zeroAddress,
      orderRight.maker,
    );

    let nftSide = new LibDealSide(
      convertAssetToLibAsset(orderLeft.makeAsset),
      getOriginFeeArray(orderLeft.dataType, orderLeft.data, transactionHash).payoutFeeArray,
      getOriginFeeArray(orderLeft.dataType, orderLeft.data, transactionHash).originFeeArray,
      zeroAddress,
      orderLeft.maker,
    );

    let matchAndTransferResult = matchAndTransfer(paymentSide, nftSide, orderLeftInput, orderRightInput, call.from, dataSource.address(), transactionHash);
    log.info("{} {} {} match and transfer result for leftasset transaction hash {}", [matchAndTransferResult.originFee.value.toString(), matchAndTransferResult.royalty.value.toString(), matchAndTransferResult.payment.toString(), transactionHash.toHexString()]);

    let nftSales = new airstack.nft.Sale(
      orderRight.maker, //to
      orderLeft.maker,  //from
      nft,
      matchAndTransferResult.payment, //payment amount
      rightAsset.address, //payment token
      matchAndTransferResult.originFee.value,  //protocol fees
      matchAndTransferResult.originFee.address, //protocol beneficiary
      matchAndTransferResult.royalty.value, //royalty fee
      matchAndTransferResult.royalty.address, //royalty beneficiary
    )

    airstack.nft.trackNFTSaleTransactions(
      transactionHash.toHexString(),
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


export function handleDirectAcceptBid(call: DirectAcceptBidCall): void {
  let transactionHash = call.transaction.hash;
  let direct = call.inputs.direct;
  let nftClass = getClass(direct.nftAssetClass);
  let decodedNFT = decodeAssetDirectAcceptBid(direct.nftData, nftClass, transactionHash);

  // entity.nftAddress = decodedNFT.address;
  // entity.nftId = decodedNFT.id;
  // entity.blockNumber = call.block.number;
  // entity.sellOrderMaker = direct.sellOrderMaker;
  // entity.sellOrderNftAmount = direct.sellOrderNftAmount;
  // entity.nftAssetClass = direct.nftAssetClass;
  // entity.nftData = direct.nftData;
  // entity.sellOrderPaymentAmount = direct.sellOrderPaymentAmount;
  // entity.paymentToken = direct.paymentToken;
  // entity.sellOrderSalt = direct.sellOrderSalt;
  // entity.sellOrderStart = direct.sellOrderStart;
  // entity.sellOrderEnd = direct.sellOrderEnd;
  // entity.sellOrderDataType = direct.sellOrderDataType;
  // entity.sellOrderData = direct.sellOrderData;
  // entity.sellOrderSignature = direct.sellOrderSignature;
  // entity.buyOrderPaymentAmount = direct.buyOrderPaymentAmount;
  // entity.buyOrderNftAmount = direct.buyOrderNftAmount;
  // entity.buyOrderData = direct.buyOrderData;

  let paymentAssetType = getPaymentAssetType(direct.paymentToken);

  let buyOrder = new LibOrder(
    direct.bidMaker,
    new LibAsset(
      paymentAssetType,
      direct.bidPaymentAmount,
    ),
    zeroAddress,
    new LibAsset(
      new LibAssetType(
        direct.nftAssetClass,
        direct.nftData,
      ),
      direct.bidNftAmount,
    ),
    direct.bidSalt,
    direct.bidStart,
    direct.bidEnd,
    direct.bidDataType,
    direct.bidData,
  );

  let sellOrder = new LibOrder(
    zeroAddress,
    new LibAsset(
      new LibAssetType(
        direct.nftAssetClass,
        direct.nftData,
      ),
      direct.sellOrderNftAmount,
    ),
    zeroAddress,
    new LibAsset(
      paymentAssetType,
      direct.sellOrderPaymentAmount,
    ),
    BIGINT_ZERO,
    BIGINT_ZERO,
    BIGINT_ZERO,
    getOtherOrderType(direct.bidDataType),
    direct.sellOrderData,
  );

  let paymentSide = new LibDealSide(
    convertAssetToLibAsset(orderRight.makeAsset),
    getOriginFeeArray(orderRight.dataType, orderRight.data, transactionHash).payoutFeeArray,
    getOriginFeeArray(orderRight.dataType, orderRight.data, transactionHash).originFeeArray,
    zeroAddress,
    orderRight.maker,
  );

  let nftSide = new LibDealSide(
    convertAssetToLibAsset(direct.nftData),
    getOriginFeeArray(orderLeft.dataType, orderLeft.data, transactionHash).payoutFeeArray,
    getOriginFeeArray(orderLeft.dataType, orderLeft.data, transactionHash).originFeeArray,
    zeroAddress,
    orderLeft.maker,
  );

  let matchAndTransferResult = matchAndTransferDAB(paymentSide, nftSide, sellOrder, buyOrder, call.from, dataSource.address(), transactionHash);
  log.info("{} {} {} match and transfer result for rightasset transaction hash {}", [matchAndTransferResult.originFee.value.toString(), matchAndTransferResult.royalty.value.toString(), matchAndTransferResult.payment.toString(), transactionHash.toHexString()]);

  let nft = new airstack.nft.NFT(
    decodedNFT.address,
    nftClass,
    decodedNFT.id,
    direct.sellOrderNftAmount,
  )

  let nftSales = new airstack.nft.Sale(
    orderRight.maker, //to
    orderLeft.maker,  //from
    nft,
    matchAndTransferResult.payment, //payment amount
    direct.paymentToken, //payment token
    matchAndTransferResult.originFee.value,  //protocol fees
    matchAndTransferResult.originFee.address, //protocol beneficiary
    matchAndTransferResult.royalty.value, //royalty fee
    matchAndTransferResult.royalty.address, //royalty beneficiary
  )

  airstack.nft.trackNFTSaleTransactions(
    transactionHash.toHexString(),
    call.transaction.index,
    [nftSales],
    AirProtocolType.NFT_MARKET_PLACE,
    AirProtocolActionType.BUY,
    call.block.timestamp,
    call.block.number,
    call.block.hash.toHexString()
  );
}
