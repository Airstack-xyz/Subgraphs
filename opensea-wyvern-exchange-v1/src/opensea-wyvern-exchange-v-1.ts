import { Address, Bytes, BigInt, log } from "@graphprotocol/graph-ts";
import { AtomicMatch_Call } from "../generated/OpenseaWyvernExchangeV1/OpenseaWyvernExchangeV1";
import { abi } from "./modules/abi";
import { orders } from "./modules/orders";
import * as airstack from "./modules/airstack";

export function handleAtomicMatch_(call: AtomicMatch_Call): void {
  log.info("transaction hash {}", [call.transaction.hash.toHexString()]);
  let timestamp = call.block.timestamp;
  let sellTakerAddress = call.inputs.addrs[9];
  let paymentToken = call.inputs.addrs[6];

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

  let saleTarget = call.inputs.addrs[11];

  // todo check for V2
  let isBundleSale =
    saleTarget.toHexString() === orders.constants.WYVERN_ATOMICIZER_ADDRESS;

  let matchPrice = orders.helpers.calculateMatchPrice(
    buyOrder,
    sellOrder,
    call.block.timestamp
  );

  let fromArray: Address[] = [];
  let toArray: Address[] = [];
  let contractAddressArray: Address[] = [];
  let nftIdArray: BigInt[] = [];

  let contractAddress = call.inputs.addrs[11];

  if (isBundleSale) {
    log.info("bundle sale", []);
    let decoded = abi.decodeBatchNftData(
      buyOrder.callData!,
      sellOrder.callData!,
      buyOrder.replacementPattern!
    );

    for (let i = 0; i < decoded.transfers.length; i++) {
      fromArray.push(decoded.transfers[i].from);
      toArray.push(decoded.transfers[i].to);
      contractAddressArray.push(decoded.addressList[i]);
      nftIdArray.push(decoded.transfers[i].token);
    }
  } else {
    log.info("not bundle sale", []);
    let decoded = abi.decodeSingleNftData(
      call.transaction.hash.toHexString(),
      buyOrder.callData!,
      sellOrder.callData!,
      buyOrder.replacementPattern!
    );

    if (decoded == null) {
      return;
    }

    contractAddress =
      decoded.contract != Address.zero() ? decoded.contract : contractAddress;

    fromArray.push(decoded.from);
    toArray.push(decoded.to);
    contractAddressArray.push(contractAddress);
    nftIdArray.push(decoded.token);
  }

  airstack.nft.trackNFTSaleTransactions(
    call.transaction.hash.toHexString(),
    fromArray,
    toArray,
    contractAddressArray,
    nftIdArray,
    paymentToken,
    matchPrice,
    timestamp,
    call.block.number
  );
}
