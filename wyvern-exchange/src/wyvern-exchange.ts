import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts"

import {
  AtomicMatch_Call
} from "../generated/WyvernExchange/WyvernExchange"

import { orders } from "./orders";

import * as airstack from "../modules/airstack";
import { abi } from "./abi";
import { BIGINT_HUNDRED, EXCHANGE_MARKETPLACE_FEE, INVERSE_BASIS_POINT } from "./shared";
import { ETHEREUM_MAINNET_ID, TRANSACTION_TYPE_SALE, MARKET_PLACE_TYPE, PROTOCOL_SELL_ACTION_TYPE } from "./utils";

export function handleAtomicMatch_(call: AtomicMatch_Call): void {
  log.info("txHash {}", [call.transaction.hash.toHexString()]);
  let txHash = call.transaction.hash;
  let timestamp = call.block.timestamp;
  let sellTakerAddress = call.inputs.addrs[9];
  let paymentToken = call.inputs.addrs[6];

  let saleTarget = call.inputs.addrs[11];
  let isBundleSale =
    saleTarget.toHexString() === orders.constants.WYVERN_ATOMICIZER_ADDRESS; 
  
  let contractAddress = call.inputs.addrs[11];

  // buy Order
  let buyOrder: orders.Order = new orders.Order(
    call.inputs.addrs[0], //exchange:
    call.inputs.addrs[1].toHexString(), //maker:
    call.inputs.addrs[2].toHexString(), // taker:
    call.inputs.uints[0], //makerRelayerFee:
    call.inputs.uints[1], //takerRelayerFee:
    call.inputs.uints[2], //makerProtocolFee:
    call.inputs.uints[3], //takerProtocolFee:
    call.inputs.addrs[3].toHex(), //feeRecipient:
    orders.helpers.getFeeMethod(call.inputs.feeMethodsSidesKindsHowToCalls[0]), //feeMethod:
    orders.helpers.getOrderSide(call.inputs.feeMethodsSidesKindsHowToCalls[1]), //side:
    orders.helpers.getSaleKind(call.inputs.feeMethodsSidesKindsHowToCalls[2]), //saleKind:
    call.inputs.addrs[4].toHexString(), //target:
    orders.helpers.getHowToCall(call.inputs.feeMethodsSidesKindsHowToCalls[3]), //howToCall:
    call.inputs.calldataBuy, //callData:
    call.inputs.replacementPatternBuy, //replacementPattern:
    call.inputs.addrs[5], //staticTarget:
    call.inputs.staticExtradataBuy, //staticExtradata:
    paymentToken.toHexString(), //paymentToken:
    call.inputs.uints[4], //basePrice:
    call.inputs.uints[5], //extra:
    call.inputs.uints[6], //listingTime:
    call.inputs.uints[7], //expirationTIme:
    call.inputs.uints[8] // salt:
  );

  log.info("txHash {} buyOrder maker {} taker {} makerProtocolFee {} takerProtocolFee {} makerRelayerFee {} takerRelayerFee {} feeRecipient {} feeMethod {} side {} saleKind {} exchange {} target{}", 
    [
      txHash.toHexString(),
      buyOrder.maker,
      buyOrder.taker,
      buyOrder.makerProtocolFee.toString(),
      buyOrder.takerProtocolFee.toString(),
      buyOrder.makerRelayerFee.toString(),
      buyOrder.takerRelayerFee.toString(),
      buyOrder.feeRecipient,
      buyOrder.feeMethod,
      buyOrder.side,
      buyOrder.saleKind,
      buyOrder.exchange.toHexString(),
      buyOrder.target
    ]
  )

  let sellOrder: orders.Order = new orders.Order(
    call.inputs.addrs[7], //exchange:
    call.inputs.addrs[8].toHexString(), //maker:
    sellTakerAddress.toHexString(), //taker:
    call.inputs.uints[9], //makerRelayerFee:
    call.inputs.uints[10], // takerRelayerFee:
    call.inputs.uints[11], //makerProtocolFee:
    call.inputs.uints[12], //takerProtocolFee:
    call.inputs.addrs[10].toHexString(), // feeRecipient:
    orders.helpers.getFeeMethod(call.inputs.feeMethodsSidesKindsHowToCalls[4]), //feeMethod:
    orders.helpers.getOrderSide(call.inputs.feeMethodsSidesKindsHowToCalls[5]), //side:
    orders.helpers.getSaleKind(call.inputs.feeMethodsSidesKindsHowToCalls[6]), //saleKind:
    call.inputs.addrs[11].toHexString(), //target:
    orders.helpers.getHowToCall(call.inputs.feeMethodsSidesKindsHowToCalls[7]), //howToCall:
    call.inputs.calldataSell, // callData:
    call.inputs.replacementPatternSell, //replacementPattern:
    call.inputs.addrs[12], //staticTarget:
    call.inputs.staticExtradataSell, //staticExtradata:
    paymentToken.toHexString(), //paymentToken:
    call.inputs.uints[13], //basePrice:
    call.inputs.uints[14], //extra:
    call.inputs.uints[15], //listingTime:
    call.inputs.uints[16], //expirationTIme:
    call.inputs.uints[17] //salt:
  );

  log.info("txHash {} sellOrder maker {} taker {} makerProtocolFee {} takerProtocolFee {} makerRelayerFee {} takerRelayerFee {} feeRecipient {} feeMethod {} side {} saleKind {} exchange {} target{}", 
    [
      txHash.toHexString(),
      sellOrder.maker,
      sellOrder.taker,
      sellOrder.makerProtocolFee.toString(),
      sellOrder.takerProtocolFee.toString(),
      sellOrder.makerRelayerFee.toString(),
      sellOrder.takerRelayerFee.toString(),
      sellOrder.feeRecipient,
      sellOrder.feeMethod,
      sellOrder.side,
      sellOrder.saleKind,
      sellOrder.exchange.toHexString(),
      sellOrder.target
    ]
  )

  let matchPrice = orders.helpers.calculateMatchPrice(
    buyOrder,
    sellOrder,
    timestamp
  );

  let allSales = new Array<airstack.nft.Sale>();

  if (isBundleSale) {
    // log.info("txHash {} bundle sale", [txHash.toHexString()]);
    let decoded = abi.decodeBatchNftData(
      buyOrder.callData!,
      sellOrder.callData!,
      buyOrder.replacementPattern!
    );

    for (let i = 0; i < decoded.transfers.length; i++) {
      log.info("txHash {} transfer method {}", [txHash.toHexString(), decoded.transfers[i].method]);
      let nft = new airstack.nft.NFT(decoded.addressList[i], decoded.transfers[i].method, decoded.transfers[i].token, decoded.transfers[i].amount);
      // let feeAmount = BigInt.zero();

      let royaltyDetails = new royaltyResult();
      if (sellOrder.feeRecipient!=Address.zero().toHexString()) {
        royaltyDetails = calculateRoyalityMaker(sellOrder, matchPrice);
      }else{
        royaltyDetails = calculateRoyalityTaker(sellOrder, matchPrice);
      }
      let marketplaceRevenueETH = royaltyDetails.marketplaceRevenueETH;
      let feeRecipient = royaltyDetails.feeRecipient;
      log.info("txHash bundleSale {} feeRecipient {}", [txHash.toHexString(), feeRecipient]);
      let sale = new airstack.nft.Sale(decoded.transfers[i].to, decoded.transfers[i].from, nft, matchPrice, paymentToken, marketplaceRevenueETH, Address.fromString(feeRecipient), new Array<airstack.nft.CreatorRoyalty>());
      allSales.push(sale);
    }
  } else {
    log.info("txHash {} not bundle sale", [txHash.toHexString()]);
    let decoded = abi.decodeSingleNftData(
      txHash.toHexString(),
      buyOrder.callData!,
      sellOrder.callData!,
      buyOrder.replacementPattern!
    );

    if (decoded == null) {
      return;
    }

    contractAddress =
      decoded.contract != Address.zero() ? decoded.contract : contractAddress;

    log.info("txHash {} transfer method {}", [txHash.toHexString(), decoded.method]);
    let nft = new airstack.nft.NFT(contractAddress, decoded.method, decoded.token, decoded.amount);
    let royaltyDetails = new royaltyResult();
    if (sellOrder.feeRecipient!=Address.zero().toHexString()) {
      royaltyDetails = calculateRoyalityMaker(sellOrder, matchPrice);
    }else{
      royaltyDetails = calculateRoyalityTaker(sellOrder, matchPrice);
    }
    let feeRecipient = royaltyDetails.feeRecipient;
    let totalRevenueETH = royaltyDetails.totalRevenueETH;
    let creatorRevenueETH = royaltyDetails.creatorRevenueETH;
    creatorRevenueETH = matchPrice.minus(totalRevenueETH);
    log.info("txHash not bundleSale {} totalRevenueETH {} creatorRevenueETH {} feeRecipient {}", [txHash.toHexString(), totalRevenueETH.toString(), creatorRevenueETH.toString(), feeRecipient]);
    let sale = new airstack.nft.Sale(decoded.to, decoded.from, nft, matchPrice, paymentToken, totalRevenueETH, Address.fromString(feeRecipient), new Array<airstack.nft.CreatorRoyalty>());
    allSales.push(sale);
  }

  airstack.nft.trackNFTSaleTransactions(
    ETHEREUM_MAINNET_ID,
    txHash.toHexString(),
    call.transaction.index,
    allSales,
    TRANSACTION_TYPE_SALE,
    MARKET_PLACE_TYPE,
    PROTOCOL_SELL_ACTION_TYPE,
    timestamp,
    call.block.number,
    call.block.hash.toHexString()
  )
}

class royaltyResult {
  constructor(
    public creatorRoyaltyFeePercentage: BigInt = BigInt.zero(), 
    public totalRevenueETH: BigInt= BigInt.zero(), 
    public marketplaceRevenueETH: BigInt= BigInt.zero(), 
    public creatorRevenueETH: BigInt= BigInt.zero(), 
    public feeRecipient: string = '') {}
}

export function calculateRoyalityMaker(order: orders.Order, matchPrice: BigInt): royaltyResult  {
  let royaltyDetails = new royaltyResult();
  royaltyDetails.creatorRoyaltyFeePercentage = EXCHANGE_MARKETPLACE_FEE.le(
      order.makerRelayerFee
  )
      ? order.makerRelayerFee
          .minus(EXCHANGE_MARKETPLACE_FEE)
          .div(BIGINT_HUNDRED)
      : BigInt.zero();

  royaltyDetails.totalRevenueETH = order.makerRelayerFee
      .times(matchPrice)
      .div(INVERSE_BASIS_POINT);

  royaltyDetails.marketplaceRevenueETH = EXCHANGE_MARKETPLACE_FEE.le(order.makerRelayerFee)
      ? EXCHANGE_MARKETPLACE_FEE
          .times(matchPrice)
          .div(INVERSE_BASIS_POINT)
      : BigInt.zero();

  royaltyDetails.creatorRevenueETH = royaltyDetails.totalRevenueETH.minus(royaltyDetails.marketplaceRevenueETH);

  royaltyDetails.feeRecipient =order.feeRecipient;
  return royaltyDetails;
}

export function calculateRoyalityTaker(order: orders.Order, matchPrice: BigInt): royaltyResult  {
  let royaltyDetails = new royaltyResult();
  royaltyDetails.creatorRoyaltyFeePercentage = EXCHANGE_MARKETPLACE_FEE.le(
    order.takerRelayerFee
  )
    ? order.takerRelayerFee
        .minus(EXCHANGE_MARKETPLACE_FEE)
        .div(BIGINT_HUNDRED)
    : BigInt.zero();

  royaltyDetails.totalRevenueETH = order.takerRelayerFee
    .times(matchPrice)
    .div(INVERSE_BASIS_POINT);

  royaltyDetails.marketplaceRevenueETH = EXCHANGE_MARKETPLACE_FEE.le(order.takerRelayerFee)
    ? EXCHANGE_MARKETPLACE_FEE
        .times(matchPrice)
        .div(INVERSE_BASIS_POINT)
    : BigInt.zero();
  royaltyDetails.creatorRevenueETH = royaltyDetails.totalRevenueETH.minus(royaltyDetails.marketplaceRevenueETH);

  royaltyDetails.feeRecipient =order.feeRecipient;
  return royaltyDetails;
}