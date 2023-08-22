import { Bytes, dataSource, log } from "@graphprotocol/graph-ts";
import { DirectAcceptBidCall, DirectPurchaseCall, MatchOrdersCall } from "../generated/ExchangeV2/ExchangeV2";
import {
  ETH,
  ERC20,
  getClass,
  decodeAsset,
  AirProtocolActionType,
  AirProtocolType,
  zeroAddress,
  BIGINT_ZERO,
  matchAndTransfer,
  LibOrder,
  LibAsset,
  LibAssetType,
  getPaymentAssetType,
  getOtherOrderType,
  generateOrderData,
  BIGINT_MINUS_ONE,
  RANDOM_MINT_721,
} from "./utils";
import * as airstack from "../modules/airstack/nft-marketplace";
import { TxnHashVsTokenIdMapping } from "../generated/schema";

export function handleMatchOrders(call: MatchOrdersCall): void {
  let transactionHash = call.transaction.hash;
  let orderLeft = call.inputs.orderLeft;
  let orderRight = call.inputs.orderRight;
  let leftAssetType = getClass(orderLeft.makeAsset.assetType.assetClass);
  let rightAssetType = getClass(orderRight.makeAsset.assetType.assetClass);

  log.info("blockno {} blocktimestamp {} blockdifficulty {} txhash {}", [call.block.number.toString(), call.block.timestamp.toString(), call.block.difficulty.toString(), transactionHash.toHexString()]);
  let leftAsset = decodeAsset(
    orderLeft.makeAsset.assetType.data,
    orderLeft.makeAsset.assetType.assetClass,
    transactionHash,
  );
  log.info("leftasset data {} type {} hash {}", [orderLeft.makeAsset.assetType.data.toHexString(), orderLeft.makeAsset.assetType.assetClass.toHexString(), transactionHash.toHexString()]);

  let rightAsset = decodeAsset(
    orderRight.makeAsset.assetType.data,
    orderRight.makeAsset.assetType.assetClass,
    transactionHash,
  );
  // log.info("rightasset data {} type {} hash {}", [orderRight.makeAsset.assetType.data.toHexString(), orderRight.makeAsset.assetType.assetClass.toHexString(), transactionHash.toHexString()]);

  if (leftAssetType == ETH || leftAssetType == ERC20) {
    // rightAsset is NFT
    log.info("{} {} {} {} address id and type and hash rightAsset is nft", [rightAsset.address.toHexString(), rightAsset.id.toString(), rightAssetType, transactionHash.toHexString()]);

    let orderData = generateOrderData(orderLeft, orderRight, transactionHash);

    let matchAndTransferResult = matchAndTransfer(orderData.orderLeftInput, orderData.orderRightInput, call.from, dataSource.address(), transactionHash, true);
    log.info("{} {} match and transfer result for rightasset is nft transaction hash {}", [matchAndTransferResult.originFee.value.toString(), matchAndTransferResult.payment.toString(), transactionHash.toHexString()]);

    let nftTokenId = matchAndTransferResult.nftData.tokenId;

    if (nftTokenId == BIGINT_MINUS_ONE && getClass(Bytes.fromHexString(matchAndTransferResult.nftData.standard)) == RANDOM_MINT_721) {
      // assign tokenId from mapping
      const txnHashVsTokenIdMapping = TxnHashVsTokenIdMapping.load(call.transaction.hash.toHexString());
      if (txnHashVsTokenIdMapping != null) {
        nftTokenId = txnHashVsTokenIdMapping.tokenId;
        log.info("assigning tokenId from mapping {} txnhash {} nftcollection {}", [nftTokenId.toString(), call.transaction.hash.toHexString(), leftAsset.address.toHexString()]);
      }
    }

    let nft = new airstack.nft.NFT(
      rightAsset.address,
      nftTokenId,
      matchAndTransferResult.nftData.amount,
    )

    let royalties: airstack.nft.CreatorRoyalty[] = [];

    for (let i = 0; i < matchAndTransferResult.royalty.length; i++) {
      let royalty = new airstack.nft.CreatorRoyalty(
        matchAndTransferResult.royalty[i].value,
        matchAndTransferResult.royalty[i].address,
      );
      royalties.push(royalty);
    }

    let toAddress = orderLeft.maker;

    if (toAddress.toHexString() == zeroAddress.toHexString()) {
      // get to address from paymentside.payouts array
      if (matchAndTransferResult.paymentSidePayouts.length > 0) {
        toAddress = matchAndTransferResult.paymentSidePayouts[0].address;
        log.info("txhash {} to address from payment side {} payoutArrayLength {}", [transactionHash.toHexString(), toAddress.toHexString(), matchAndTransferResult.paymentSidePayouts.length.toString()]);
      }
    }

    let nftSales = new airstack.nft.Sale(
      toAddress,  //to
      orderRight.maker, //from
      [nft], //nft
      matchAndTransferResult.payment, //payment amount
      leftAsset.address, //payment token
      matchAndTransferResult.originFee.value,  //protocol fees
      matchAndTransferResult.originFee.address, //protocol beneficiary
      royalties, //royalties
    )

    airstack.nft.trackNFTSaleTransactions(
      call.block,
      transactionHash.toHexString(),
      call.transaction.index,
      nftSales,
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.SELL,
    );
  } else {
    // leftAsset is NFT
    log.info("{} {} {} {} address id and type and hash leftasset is nft", [leftAsset.address.toHexString(), leftAsset.id.toString(), leftAssetType, transactionHash.toHexString()]);

    let orderData = generateOrderData(orderLeft, orderRight, transactionHash);

    let matchAndTransferResult = matchAndTransfer(orderData.orderLeftInput, orderData.orderRightInput, call.from, dataSource.address(), transactionHash, true);
    log.info("{} {} match and transfer result for leftasset is nft transaction hash {}", [matchAndTransferResult.originFee.value.toString(), matchAndTransferResult.payment.toString(), transactionHash.toHexString()]);

    let nftTokenId = matchAndTransferResult.nftData.tokenId;

    if (nftTokenId == BIGINT_MINUS_ONE && getClass(Bytes.fromHexString(matchAndTransferResult.nftData.standard)) == RANDOM_MINT_721) {
      // assign tokenId from mapping
      const txnHashVsTokenIdMapping = TxnHashVsTokenIdMapping.load(call.transaction.hash.toHexString());
      if (txnHashVsTokenIdMapping != null) {
        nftTokenId = txnHashVsTokenIdMapping.tokenId;
        log.info("assigning tokenId from mapping {} txnhash {} nftcollection {}", [nftTokenId.toString(), call.transaction.hash.toHexString(), leftAsset.address.toHexString()]);
      }
    }

    let nft = new airstack.nft.NFT(
      leftAsset.address,
      nftTokenId,
      matchAndTransferResult.nftData.amount,
    );

    let royalties: airstack.nft.CreatorRoyalty[] = [];

    for (let i = 0; i < matchAndTransferResult.royalty.length; i++) {
      let royalty = new airstack.nft.CreatorRoyalty(
        matchAndTransferResult.royalty[i].value,
        matchAndTransferResult.royalty[i].address,
      );
      royalties.push(royalty);
    }

    let toAddress = orderRight.maker;

    if (toAddress.toHexString() == zeroAddress.toHexString()) {
      // get to address from paymentside.payouts array
      if (matchAndTransferResult.paymentSidePayouts.length > 0) {
        toAddress = matchAndTransferResult.paymentSidePayouts[0].address;
        log.info("txhash {} to address from payment side {} payoutArrayLength {}", [transactionHash.toHexString(), toAddress.toHexString(), matchAndTransferResult.paymentSidePayouts.length.toString()]);
      }
    }

    let nftSales = new airstack.nft.Sale(
      toAddress, //to
      orderLeft.maker,  //from
      [nft],
      matchAndTransferResult.payment, //payment amount
      rightAsset.address, //payment token
      matchAndTransferResult.originFee.value,  //protocol fees
      matchAndTransferResult.originFee.address, //protocol beneficiary
      royalties, //royalties
    )

    airstack.nft.trackNFTSaleTransactions(
      call.block,
      transactionHash.toHexString(),
      call.transaction.index,
      nftSales,
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.BUY,
    );
  }
}

export function handleDirectAcceptBid(call: DirectAcceptBidCall): void {
  let transactionHash = call.transaction.hash;
  let direct = call.inputs.direct;
  let nftClass = direct.nftAssetClass;
  let decodedNFT = decodeAsset(direct.nftData, nftClass, transactionHash);

  let paymentAssetType = getPaymentAssetType(direct.paymentToken, call.transaction.hash);

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

  let matchAndTransferResult = matchAndTransfer(sellOrder, buyOrder, call.from, dataSource.address(), transactionHash, false);
  // log.info("{} {} match and transfer result for handleDirectAcceptBid transaction hash {}", [matchAndTransferResult.originFee.value.toString(), matchAndTransferResult.payment.toString(), transactionHash.toHexString()]);

  let nft = new airstack.nft.NFT(
    decodedNFT.address,
    decodedNFT.id,
    direct.sellOrderNftAmount,
  )

  let royalties: airstack.nft.CreatorRoyalty[] = [];

  for (let i = 0; i < matchAndTransferResult.royalty.length; i++) {
    let royalty = new airstack.nft.CreatorRoyalty(
      matchAndTransferResult.royalty[i].value,
      matchAndTransferResult.royalty[i].address,
    );
    royalties.push(royalty);
  }

  let nftSales = new airstack.nft.Sale(
    direct.bidMaker, //to
    call.from,  //from
    [nft],
    matchAndTransferResult.payment, //payment amount
    direct.paymentToken, //payment token
    matchAndTransferResult.originFee.value,  //protocol fees
    matchAndTransferResult.originFee.address, //protocol beneficiary
    royalties, //royalties
  )

  airstack.nft.trackNFTSaleTransactions(
    call.block,
    transactionHash.toHexString(),
    call.transaction.index,
    nftSales,
    AirProtocolType.NFT_MARKET_PLACE,
    AirProtocolActionType.BUY,
  );
}

export function handleDirectPurchase(call: DirectPurchaseCall): void {
  let transactionHash = call.transaction.hash;
  let direct = call.inputs.direct;
  let nftClass = direct.nftAssetClass;
  let decodedNFT = decodeAsset(direct.nftData, nftClass, transactionHash);

  // log.info("getpaymentassetype input token {} transaction hash {}", [direct.paymentToken.toHexString(), transactionHash.toHexString()]);
  let paymentAssetType = getPaymentAssetType(direct.paymentToken, call.transaction.hash);
  // log.info("getpaymentassetype output assetclass {} data {} transaction hash {}", [paymentAssetType.assetClass.toHexString(), paymentAssetType.data.toHexString(), transactionHash.toHexString()]);

  let sellOrder = new LibOrder(
    direct.sellOrderMaker,
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
    direct.sellOrderSalt,
    direct.sellOrderStart,
    direct.sellOrderEnd,
    direct.sellOrderDataType,
    direct.sellOrderData
  );


  let buyOrder = new LibOrder(
    zeroAddress,
    new LibAsset(
      paymentAssetType,
      direct.buyOrderPaymentAmount,
    ),
    zeroAddress,
    new LibAsset(
      new LibAssetType(
        direct.nftAssetClass,
        direct.nftData,
      ),
      direct.buyOrderNftAmount,
    ),
    BIGINT_ZERO,
    BIGINT_ZERO,
    BIGINT_ZERO,
    getOtherOrderType(direct.sellOrderDataType),
    direct.buyOrderData
  );

  let matchAndTransferResult = matchAndTransfer(sellOrder, buyOrder, call.from, dataSource.address(), transactionHash, false);
  // log.info("{} {} match and transfer result for handleDirectPurchase transaction hash {}", [matchAndTransferResult.originFee.value.toString(), matchAndTransferResult.payment.toString(), transactionHash.toHexString()]);

  let nft = new airstack.nft.NFT(
    decodedNFT.address,
    decodedNFT.id,
    direct.buyOrderNftAmount,
  )

  let royalties: airstack.nft.CreatorRoyalty[] = [];

  for (let i = 0; i < matchAndTransferResult.royalty.length; i++) {
    let royalty = new airstack.nft.CreatorRoyalty(
      matchAndTransferResult.royalty[i].value,
      matchAndTransferResult.royalty[i].address,
    );
    royalties.push(royalty);
  }

  let nftSales = new airstack.nft.Sale(
    call.from, //to
    direct.sellOrderMaker,  //from
    [nft],
    matchAndTransferResult.payment, //payment amount
    direct.paymentToken, //payment token
    matchAndTransferResult.originFee.value,  //protocol fees
    matchAndTransferResult.originFee.address, //protocol beneficiary
    royalties, //royalties
  )

  airstack.nft.trackNFTSaleTransactions(
    call.block,
    transactionHash.toHexString(),
    call.transaction.index,
    nftSales,
    AirProtocolType.NFT_MARKET_PLACE,
    AirProtocolActionType.BUY,
  );
}