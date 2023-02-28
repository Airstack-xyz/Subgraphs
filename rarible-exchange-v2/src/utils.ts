import {
  Address,
  BigInt,
  Bytes,
  ethereum,
  log,
  TypedMap,
  crypto,
} from "@graphprotocol/graph-ts";
import { ExchangeV2, MatchOrdersCallOrderLeftStruct, MatchOrdersCallOrderRightStruct } from "../generated/ExchangeV2/ExchangeV2";
import { RoyaltiesRegistry } from "../generated/ExchangeV2/RoyaltiesRegistry";

export const zeroAddress = Address.fromString("0x0000000000000000000000000000000000000000");
export const MINT_1155_DATA = "(uint256,string,uint256,(address,uint96)[],(address,uint96)[],bytes[])"
export const MINT_721_DATA = "(uint256,string,(address,uint96)[],(address,uint96)[],bytes[])";
export const DATA_1155_OR_721 = "(address,uint256)";
export const EMPTY_BYTES = Bytes.fromHexString("");
export const BYTES_ZERO = Bytes.fromI32(0);
export const ETHEREUM_MAINNET_ID = "1";

export const ERC20 = "ERC20";
export const ETH = "ETH";
export const ERC721 = "ERC721";
export const ERC1155 = "ERC1155";
export const ERC721_LAZY = "ERC721_LAZY";
export const ERC1155_LAZY = "ERC1155_LAZY";
export const COLLECTION = "COLLECTION";
export const CRYPTOPUNKS = "CRYPTOPUNKS";
export const SPECIAL = "SPECIAL";
export const ETH_ASSET_CLASS = "ETH_ASSET_CLASS";

export const BIGINT_ZERO = BigInt.fromI32(0);

export const classMap = new TypedMap<string, string>();
classMap.set("0xaaaebeba", ETH);
classMap.set("0x8ae85d84", ERC20);
classMap.set("0x73ad2146", ERC721);
classMap.set("0x973bb640", ERC1155);
classMap.set("0xd8f960c1", ERC721_LAZY);
classMap.set("0x1cdfaa40", ERC1155_LAZY);
classMap.set("0xf63c2825", COLLECTION);
classMap.set("0x3e6b89d4", CRYPTOPUNKS);

classMap.set(ETH, "0xaaaebeba");
classMap.set(ERC20, "0x8ae85d84");

export const V1 = "0x4c234266";
export const V2 = "0x23d235ef";
export const V3_SELL = "0x2fa3cfd3";
export const V3_BUY = "0x1b18cdf6";
export const ASSET_TYPE_TYPEHASH = Bytes.fromHexString("0x452a0dc408cb0d27ffc3b3caff933a5208040a53a9dbecd8d89cad2c0d40e00c");

export namespace AirProtocolType {
  export const GENERIC = "GENERIC";
  export const EXCHANGE = "EXCHANGE";
  export const LENDING = "LENDING";
  export const YIELD = "YIELD";
  export const BRIDGE = "BRIDGE";
  export const DAO = "DAO";
  export const NFT_MARKET_PLACE = "NFT_MARKET_PLACE";
  export const STAKING = "STAKING";
  export const P2E = "P2E";
  export const LAUNCHPAD = "LAUNCHPAD";
}

export namespace AirProtocolActionType {
  export const ALL = "ALL";
  export const BUY = "BUY";
  export const SELL = "SELL";
  export const MINT = "MINT";
  export const BURN = "BURN";
  export const ATTEND = "ATTEND";
  export const EARN = "EARN";
  export const SWAP = "SWAP";
  export const ADD_LIQUIDITY = "ADD_LIQUIDITY";
  export const REMOVE_LIQUIDITY = "REMOVE_LIQUIDITY";
  export const ADD_TO_FARM = "ADD_TO_FARM";
  export const REMOVE_FROM_FARM = "REMOVE_FROM_FARM";
  export const CLAIM_FARM_REWARD = "CLAIM_FARM_REWARD";
  export const LEND = "LEND";
  export const BORROW = "BORROW";
  export const FLASH_LOAN = "FLASH_LOAN";
  export const STAKE = "STAKE";
  export const RESTAKE = "RESTAKE";
  export const UNSTAKE = "UNSTAKE";
  export const DELEGATE = "DELEGATE";
  export const CLAIM_REWARDS = "CLAIM_REWARDS";
}

class SubFeeResponse {
  newValue: BigInt;
  realFee: BigInt;
}

function subFeeInBp(
  value: BigInt,
  total: BigInt,
  feeInBp: BigInt,
): SubFeeResponse {
  return subFee(value, bp(total, feeInBp));
}

function subFee(
  value: BigInt,
  fee: BigInt
): SubFeeResponse {
  let newValue: BigInt;
  let realFee: BigInt;
  if (value > fee) {
    newValue = value.minus(fee);
    realFee = fee;
  } else {
    newValue = BIGINT_ZERO;
    realFee = value;
  }
  return { newValue, realFee };
}

function bp(value1: BigInt, value2: BigInt): BigInt {
  return value1.times(value2).div(BigInt.fromI32(10000));
}

// exchangev2



/**
 * @dev map bytes asset hash type to string
 * @param assetClass asset class of payment/nft asset
 * @returns string - mapped class
 */
export function getClass(assetClass: Bytes): string {
  let res = classMap.get(assetClass.toHexString());
  if (res) {
    return res;
  }
  return SPECIAL;
}

/**
 * @dev maps string asset type to hash bytes
 * @param assetClass string asset class
 * @param transactionHash transaction hash to be used for logs
 * @returns asset class in bytes
 */
function getClassBytes(assetClass: string, transactionHash: Bytes): Bytes {
  // log.info("received asset class: {} hash {}", [assetClass, transactionHash.toHexString()]);
  let res = classMap.get(assetClass);
  if (res) {
    // log.info("found asset class: {} hash {}", [res, transactionHash.toHexString()]);
    return Bytes.fromHexString(res);
  }
  // log.info("found zero asset class: {} hash {}", [EMPTY_BYTES.toHexString(), transactionHash.toHexString()]);
  return EMPTY_BYTES;
}

export class Asset {
  address: Address;
  id: BigInt;
  assetClass: string;
  constructor(address: Address, id: BigInt, assetClass: string) {
    this.address = address;
    this.id = id;
    this.assetClass = assetClass;
  }
}

/**
 * @dev decodes asset data
 * @param data encoded asset data
 * @param type asset type
 * @param transactionHash transaction hash to be used for logs
 * @returns Asset - asset address, id, asset class
 */
export function decodeAsset(data: Bytes, type: string, transactionHash: Bytes): Asset {
  if (type == ERC20) {
    let decoded = ethereum.decode("(address)", data);
    if (decoded != null) {
      let decodedTuple = decoded.toTuple();
      let asset = new Asset(
        decodedTuple[0].toAddress(),
        BIGINT_ZERO,
        type
      );
      // log.info("decodedasset address {} id {} class {} hash {}", [asset.address.toHexString(), asset.id.toString(), asset.assetClass, transactionHash.toHexString()]);
      return asset;
    }
  } else if (type == ERC721 || type == ERC1155) {
    let decoded = ethereum.decode("(address,uint256)", data);
    if (decoded != null) {
      let decodedTuple = decoded.toTuple();
      let address = decodedTuple[0].toAddress();
      let id = decodedTuple[1].toBigInt();
      let asset = new Asset(address, id, type);
      // log.info("decodedasset address {} id {} class {} hash {}", [asset.address.toHexString(), asset.id.toString(), asset.assetClass, transactionHash.toHexString()]);
      return asset;
    }
  } else if (type == ERC721_LAZY || type == ERC1155_LAZY) {
    let decoded = ethereum.decode("(address,uint256,uint256)", data);
    if (decoded != null) {
      let decodedTuple = decoded.toTuple();
      let address = decodedTuple[0].toAddress();
      let id = decodedTuple[2].toBigInt();
      let asset = new Asset(address, id, type);
      // log.info("decodedasset address {} id {} class {} hash {}", [asset.address.toHexString(), asset.id.toString(), asset.assetClass, transactionHash.toHexString()]);
      return asset;
    }
  }
  let asset = new Asset(zeroAddress, BIGINT_ZERO, type);
  // log.info("decodedasset address {} id {} class {} hash {}", [asset.address.toHexString(), asset.id.toString(), asset.assetClass, transactionHash.toHexString()]);
  return asset;
}

export class OriginFeeClass {
  originFee: BigInt;
  originFeeAddress: Address;
  constructor(originFee: BigInt, originFeeAddress: Address) {
    this.originFee = originFee;
    this.originFeeAddress = originFeeAddress;
  }
}

export class OriginFeeClassWithRestValue extends OriginFeeClass {
  restValue: BigInt;
  constructor(originFee: BigInt, originFeeAddress: Address, restValue: BigInt) {
    super(originFee, originFeeAddress);
    this.restValue = restValue;
  }
}

class OriginFeeArrayClass {
  originFeeArray: Array<LibPart>;
  payoutFeeArray: Array<LibPart>;
  isMakeFill: bool;
}

/**
 * @dev decodes origin and payout fee array
 * @param exchangeType exchange type - V1, V2
 * @param data encoded payout and origin fee data
 * @param transactionHash transaction hash to be used for logs
 * @returns OriginFeeClass - LibPart array of origin and payout fee
 */
export function getOriginFeeArray(exchangeType: Bytes, data: Bytes, transactionHash: Bytes): OriginFeeArrayClass {
  let originFeeArray: Array<LibPart> = [];
  let payoutFeeArray: Array<LibPart> = [];
  let isMakeFill: bool = false;
  if (exchangeType.toHexString() == V1) {
    let decoded = ethereum.decode(
      "((address,uint96)[],(address,uint96)[])",
      data
    );
    if (!decoded) {
      log.error("{} not decoded", [data.toHexString()]);
    } else {
      let dataV1 = decoded.toTuple();
      let payoutFeeArrayData = dataV1[0].toArray();
      let originFeeArrayData = dataV1[1].toArray();
      for (let i = 0; i < originFeeArrayData.length; i++) {
        let originFeeItem = originFeeArrayData[i].toTuple();
        let libPart = new LibPart(
          originFeeItem[0].toAddress(),
          originFeeItem[1].toBigInt()
        );
        // log.info("originFeeItem index {} bps {} address {} and hash {}", [i.toString(), originFeeItem[1].toBigInt().toString(), originFeeItem[0].toAddress().toHexString(), transactionHash.toHexString()]);
        originFeeArray.push(libPart);
      }
      for (let i = 0; i < payoutFeeArrayData.length; i++) {
        let payoutFeeItem = payoutFeeArrayData[i].toTuple();
        let libPart = new LibPart(
          payoutFeeItem[0].toAddress(),
          payoutFeeItem[1].toBigInt()
        );
        // log.info("payoutFeeItem index {} bps {} address {} and hash {}", [i.toString(), payoutFeeItem[1].toBigInt().toString(), payoutFeeItem[0].toAddress().toHexString(), transactionHash.toHexString()]);
        payoutFeeArray.push(libPart);
      }
      return { originFeeArray, payoutFeeArray, isMakeFill };
    }
  } else if (exchangeType.toHexString() == V2) {
    let decoded = ethereum.decode(
      "((address,uint96)[],(address,uint96)[],bool)",
      data
    );

    if (!decoded) {
      log.error("{} not decoded", [data.toHexString()]);
    } else {
      let dataV2 = decoded.toTuple();
      let payoutFeeArrayData = dataV2[0].toArray();
      let originFeeArrayData = dataV2[1].toArray();
      isMakeFill = dataV2[2].toBoolean();
      for (let i = 0; i < originFeeArrayData.length; i++) {
        let originFeeItem = originFeeArrayData[i].toTuple();
        let libPart = new LibPart(
          originFeeItem[0].toAddress(),
          originFeeItem[1].toBigInt()
        );
        originFeeArray.push(libPart);
      }
      for (let i = 0; i < payoutFeeArrayData.length; i++) {
        let payoutFeeItem = payoutFeeArrayData[i].toTuple();
        let libPart = new LibPart(
          payoutFeeItem[0].toAddress(),
          payoutFeeItem[1].toBigInt()
        );
        payoutFeeArray.push(libPart);
      }
      return { originFeeArray, payoutFeeArray, isMakeFill };
    }
  }
  return { originFeeArray, payoutFeeArray, isMakeFill };
}

class FeeDataV3Class {
  payouts: BigInt;
  originFeeFirst: BigInt;
  originFeeSecond: BigInt;
  maxFeesBasePoint: BigInt;
}

/**
 * @dev decodes origin and payout fee array for V3
 * @param data encoded fee data
 * @param exchangeType exchange type - V3_SELL, V3_BUY
 * @returns FeeDataV3Class - decoded fee data
 */
function getFeeDataV3(
  data: Bytes,
  exchangeType: Bytes
): FeeDataV3Class {
  let payouts: BigInt = BIGINT_ZERO;
  let originFeeFirst: BigInt = BIGINT_ZERO;
  let originFeeSecond: BigInt = BIGINT_ZERO;
  let maxFeesBasePoint: BigInt = BIGINT_ZERO;

  if (exchangeType.toHexString() == V3_SELL) {
    let decoded = ethereum.decode(
      "(uint256,uint256,uint256,uint256,bytes32)",
      data
    );

    if (!decoded) {
      log.error("{} not decoded", [data.toHexString()]);
    } else {
      let dataV3_SELL = decoded.toTuple();
      payouts = dataV3_SELL[0].toBigInt();
      originFeeFirst = dataV3_SELL[1].toBigInt();
      originFeeSecond = dataV3_SELL[2].toBigInt();
      maxFeesBasePoint = dataV3_SELL[3].toBigInt();
    }
    return { payouts, originFeeFirst, originFeeSecond, maxFeesBasePoint };
  }
  else if (exchangeType.toHexString() == V3_BUY) {
    let decoded = ethereum.decode(
      "(uint256,uint256,uint256,bytes32)",
      data
    );

    if (!decoded) {
      log.error("{} not decoded", [data.toHexString()]);
    } else {
      let dataV3_SELL = decoded.toTuple();
      payouts = dataV3_SELL[0].toBigInt();
      originFeeFirst = dataV3_SELL[1].toBigInt();
      originFeeSecond = dataV3_SELL[2].toBigInt();
      maxFeesBasePoint = BIGINT_ZERO;
    }
    return { payouts, originFeeFirst, originFeeSecond, maxFeesBasePoint };
  }
  return { payouts, originFeeFirst, originFeeSecond, maxFeesBasePoint };
}

/**
 * @dev makes an rpc call to get royalty registry address for the exchange
 * @param exchangeV2 exchangeV2 contract address
 * @returns exchangeV2 royalty registry address
 */
function getRoyaltiesRegistryAddress(exchangeV2: Address): Address {
  let exchangeInstance = ExchangeV2.bind(exchangeV2);
  let royaltiesRegistryResponse = exchangeInstance.try_royaltiesRegistry();
  if (!royaltiesRegistryResponse.reverted) {
    return royaltiesRegistryResponse.value;
  }
  return zeroAddress;
}

class LibPart {
  address: Address;
  value: BigInt;

  constructor(address: Address, value: BigInt) {
    this.address = address;
    this.value = value;
  }
}

export class LibDealSide {
  asset: LibAsset;
  payouts: LibPart[];
  originFees: LibPart[];
  proxy: Address;
  from: Address;
  constructor(asset: LibAsset, payouts: LibPart[], originFees: LibPart[], proxy: Address, from: Address) {
    this.asset = asset;
    this.payouts = payouts;
    this.originFees = originFees;
    this.proxy = proxy;
    this.from = from;
  }
}

export class LibAssetType {
  assetClass: Bytes;
  data: Bytes;
  constructor(assetClass: Bytes, data: Bytes) {
    this.assetClass = assetClass;
    this.data = data;
  }
}

export class LibAsset {
  assetType: LibAssetType;
  value: BigInt;
  constructor(assetType: LibAssetType, value: BigInt) {
    this.assetType = assetType;
    this.value = value;
  }
}

/**
 * @dev converts Asset to LibAsset
 * @param asset payment/nft asset to be converted to LibAsset
 * @returns LibAsset - converted payment/nft asset
 */
function convertAssetToLibAsset(asset: ethereum.Tuple): LibAsset {
  let tuple = asset;
  let assetType = tuple[0].toTuple();
  let value = tuple[1].toBigInt();
  let assetClass = assetType[0].toBytes();
  let data = assetType[1].toBytes();
  return new LibAsset(new LibAssetType(assetClass, data), value);
}

enum FeeSide {
  NONE,
  LEFT,
  RIGHT,
}

class LibDealData {
  maxFeesBasePoint: BigInt;
  feeSide: FeeSide;

  constructor(maxFeesBasePoint: BigInt, feeSide: FeeSide) {
    this.maxFeesBasePoint = maxFeesBasePoint;
    this.feeSide = feeSide;
  }
}

export class LibOrder {
  maker: Address;
  makeAsset: LibAsset;
  taker: Address;
  takeAsset: LibAsset;
  salt: BigInt;
  start: BigInt;
  end: BigInt;
  dataType: Bytes;
  data: Bytes;

  constructor(maker: Address, makeAsset: LibAsset, taker: Address, takeAsset: LibAsset, salt: BigInt, start: BigInt, end: BigInt, dataType: Bytes, data: Bytes) {
    this.maker = maker;
    this.makeAsset = makeAsset;
    this.taker = taker;
    this.takeAsset = takeAsset;
    this.salt = salt;
    this.start = start;
    this.end = end;
    this.dataType = dataType;
    this.data = data;
  }
}

class LibOrderGenericData {
  payouts: LibPart[];
  originFees: LibPart[];
  isMakeFill: bool;
  maxFeesBasePoint: BigInt;
  constructor(payouts: LibPart[], originFees: LibPart[], isMakeFill: bool, maxFeesBasePoint: BigInt) {
    this.payouts = payouts;
    this.originFees = originFees;
    this.isMakeFill = isMakeFill;
    this.maxFeesBasePoint = maxFeesBasePoint;
  }
}

class LibFillResult {
  leftValue: BigInt;
  rightValue: BigInt;
  constructor(leftValue: BigInt, rightValue: BigInt) {
    this.leftValue = leftValue;
    this.rightValue = rightValue;
  }
}

function calculateTotalAmount(
  amount: BigInt,
  orderOriginFees: LibPart[],
  maxFeesBasePoint: BigInt,
): BigInt {
  if (maxFeesBasePoint > BIGINT_ZERO) {
    return amount;
  }
  let total = amount;
  for (let i = 0; i < orderOriginFees.length; i++) {
    total = total.plus(bp(amount, orderOriginFees[i].value));
  }
  return total;
}

class doTransfersClass {
  totalLeftValue: BigInt;
  totalRightValue: BigInt;
  royalty: LibPart[];
  originFee: LibPart;
  payment: BigInt;
}

/**
 * @dev holds logic to direct the transfer of funds between the maker and taker
 * @param left left side of the deal
 * @param right right side of the deal
 * @param dealData deal data
 * @param exchangeV2 exchangeV2 contract address
 * @param transactionHash transaction hash
 * @param isMatchOrders true if being called from handleMatchOrders
 * @returns doTransfersClass - totalLeftValue, totalRightValue, royalty, originFee, payment
 */
function doTransfers(
  left: LibDealSide,
  right: LibDealSide,
  dealData: LibDealData,
  exchangeV2: Address,
  transactionHash: Bytes,
  isMatchOrders: boolean
): doTransfersClass {
  let totalLeftValue = left.asset.value;
  let totalRightValue = right.asset.value;
  let sellerPayouts = new LibPart(zeroAddress, BIGINT_ZERO);
  let royalty = new Array<LibPart>();
  let originFee = new LibPart(zeroAddress, BIGINT_ZERO);
  let payment = BIGINT_ZERO;
  let doTransferWithFeesResult: DoTransfersWithFeesClass;

  let paymentSide = left;
  let nftSide = right;

  if (dealData.feeSide == FeeSide.RIGHT && isMatchOrders) {
    paymentSide = right;
    nftSide = left;
    log.info("feeSide == FeeSide.RIGHT && isMatchOrders hash {}", [transactionHash.toHexString()]);
  } else if (dealData.feeSide == FeeSide.LEFT && !isMatchOrders) {
    paymentSide = right;
    nftSide = left;
    log.info("feeSide == FeeSide.LEFT && !isMatchOrders hash {}", [transactionHash.toHexString()]);
  } else if (dealData.feeSide == FeeSide.LEFT && isMatchOrders) {
    paymentSide = right;
    nftSide = left;
    log.info("feeSide == FeeSide.LEFT && isMatchOrders hash {}", [transactionHash.toHexString()]);
  }

  if (dealData.feeSide == FeeSide.LEFT && isMatchOrders || dealData.feeSide == FeeSide.RIGHT && !isMatchOrders) {
    log.info("doTransfers feeSide == FeeSide.LEFT hash {}", [transactionHash.toHexString()]);
    doTransferWithFeesResult = doTransferWithFees(paymentSide, nftSide, dealData.maxFeesBasePoint, exchangeV2, transactionHash);
    totalLeftValue = doTransferWithFeesResult.rest;
    royalty = doTransferWithFeesResult.royalty;
    originFee = doTransferWithFeesResult.originFee;
    payment = doTransferWithFeesResult.payment;
    log.info("doTransfers feeSide == FeeSide.LEFT before transferPayouts hash {}", [transactionHash.toHexString()]);
    sellerPayouts = transferPayouts(right.asset.assetType, right.asset.value, right.from, left.payouts, right.proxy, transactionHash);
    log.info("doTransfers feeSide == FeeSide.LEFT after transferPayouts hash {}", [transactionHash.toHexString()]);
  } else if (dealData.feeSide == FeeSide.RIGHT && isMatchOrders || dealData.feeSide == FeeSide.LEFT && !isMatchOrders) {
    log.info("doTransfers feeSide == FeeSide.RIGHT hash {}", [transactionHash.toHexString()]);
    doTransferWithFeesResult = doTransferWithFees(paymentSide, nftSide, dealData.maxFeesBasePoint, exchangeV2, transactionHash);
    totalRightValue = doTransferWithFeesResult.rest;
    royalty = doTransferWithFeesResult.royalty;
    originFee = doTransferWithFeesResult.originFee;
    payment = doTransferWithFeesResult.payment;
    log.info("doTransfers feeSide == FeeSide.RIGHT before transferPayouts", []);
    sellerPayouts = transferPayouts(left.asset.assetType, left.asset.value, left.from, right.payouts, left.proxy, transactionHash);
    log.info("doTransfers feeSide == FeeSide.RIGHT after transferPayouts", []);
  } else {
    log.info("doTransfers feeSide == FeeSide.NONE hash {}", [transactionHash.toHexString()]);
    sellerPayouts = transferPayouts(left.asset.assetType, left.asset.value, left.from, right.payouts, left.proxy, transactionHash);
    sellerPayouts.value = sellerPayouts.value.plus(transferPayouts(right.asset.assetType, right.asset.value, right.from, left.payouts, right.proxy, transactionHash).value);
  }
  return {
    totalLeftValue,
    totalRightValue,
    royalty,
    originFee,
    payment,
  }
}

class DoTransfersWithFeesClass {
  rest: BigInt;
  royalty: LibPart[];
  originFee: LibPart;
  payment: BigInt;
}

/**
 * @dev holds logic to calculate paymentAmount, royalty, fee
 * @param paymentSide payment side of the deal
 * @param nftSide nft side of the deal
 * @param maxFeesBasePoint max fees base point
 * @param exchangeV2 exchangeV2 contract address
 * @param transactionHash transaction hash
 * @returns 
 */
function doTransferWithFees(
  paymentSide: LibDealSide,
  nftSide: LibDealSide,
  maxFeesBasePoint: BigInt,
  exchangeV2: Address,
  transactionHash: Bytes,
): DoTransfersWithFeesClass {
  log.info("calculatetotalamount input passetvalue {} poriginfee {} maxfeebps {} hash {}", [
    paymentSide.asset.value.toString(),
    paymentSide.originFees.length.toString(),
    maxFeesBasePoint.toString(),
    transactionHash.toHexString(),
  ]);
  let totalAmount = calculateTotalAmount(paymentSide.asset.value, paymentSide.originFees, maxFeesBasePoint);
  log.info("total calculatedFees amount {} hash {}", [totalAmount.toString(), transactionHash.toHexString()]);
  let rest = totalAmount;
  let payment = totalAmount;
  let transferRoyaltiesResult = transferRoyalties(paymentSide.asset.assetType, nftSide.asset.assetType, nftSide.payouts, rest, paymentSide.asset.value, paymentSide.from, paymentSide.proxy, exchangeV2, transactionHash);
  log.info("{} rest {} hash transferRoyaltiesResult rest and royalty amount and hash", [transferRoyaltiesResult.rest.toString(), transactionHash.toHexString()]);
  rest = transferRoyaltiesResult.rest;
  let royalty = transferRoyaltiesResult.royalty;
  let originFee = new LibPart(zeroAddress, BIGINT_ZERO);
  if (
    paymentSide.originFees.length === 1 &&
    nftSide.originFees.length === 1 &&
    nftSide.originFees[0].address == paymentSide.originFees[0].address
  ) {
    let origin = new Array<LibPart>();
    origin.push(new LibPart(nftSide.originFees[0].address, nftSide.originFees[0].value.plus(paymentSide.originFees[0].value)));
    // log.info("{} assetclass {} assetdata {} rest {} paymentsidevalue {} originfeebps {} originfeereceiver {} paymentsidefrom {} hash transferfeesinput if", [
    // paymentSide.asset.assetType.assetClass.toHexString(),
    //   paymentSide.asset.assetType.data.toHexString(),
    //   rest.toString(),
    //   paymentSide.asset.value.toString(),
    //   (nftSide.originFees[0].value.plus(paymentSide.originFees[0].value)).toString(),
    //   nftSide.originFees[0].address.toHexString(),
    //   paymentSide.from.toHexString(),
    //   transactionHash.toHexString()
    // ]);
    let transferFeesResult = transferFees(paymentSide.asset.assetType, rest, paymentSide.asset.value, origin, paymentSide.from, paymentSide.proxy, transactionHash);
    rest = transferFeesResult.newRest;
    originFee = transferFeesResult.transferResult;
    // log.info("{} rest {} amount {} hash transferFeesResult rest and origin fee amount and hash if", [rest.toString(), originFee.value.toString(), transactionHash.toHexString()]);
  } else {
    // log.info("{} assetclass {} assetdata {} rest {} paymentsidevalue {} paymetnsideoriginfeeslength {} paymentsidefrom {} hash  transferfeesinput else", [
    // paymentSide.asset.assetType.assetClass.toHexString(),
    //   paymentSide.asset.assetType.data.toHexString(),
    //   rest.toString(),
    //   paymentSide.asset.value.toString(),
    //   paymentSide.originFees.length.toString(),
    //   paymentSide.from.toHexString(),
    //   transactionHash.toHexString()
    // ]);
    let transferFeesResult = transferFees(paymentSide.asset.assetType, rest, paymentSide.asset.value, paymentSide.originFees, paymentSide.from, paymentSide.proxy, transactionHash);
    rest = transferFeesResult.newRest;
    originFee = transferFeesResult.transferResult;
    transferFeesResult = transferFees(nftSide.asset.assetType, rest, paymentSide.asset.value, nftSide.originFees, paymentSide.from, paymentSide.proxy, transactionHash);
    rest = transferFeesResult.newRest;
    originFee.value = originFee.value.plus(transferFeesResult.transferResult.value);
    // log.info("{} rest {} amount {} hash transferFeesResult rest and origin fee amount and hash else", [rest.toString(), originFee.value.toString(), transactionHash.toHexString()]);
  }
  return { rest, royalty, originFee, payment };
}

class TransferRoyaltyResult {
  rest: BigInt;
  royalty: LibPart[];
}

/**
 * @dev holds logic to calculate royalty
 * @param paymentAssetType payment asset type
 * @param nftAssetType nft asset type
 * @param payouts payouts array
 * @param rest rest amount
 * @param amount total amount
 * @param from from address
 * @param proxy proxy address
 * @param exchangeV2 exchangeV2 contract address
 * @param transactionHash transaction hash
 * @returns rest amount and royalty array
 */
function transferRoyalties(
  paymentAssetType: LibAssetType,
  nftAssetType: LibAssetType,
  payouts: LibPart[],
  rest: BigInt,
  amount: BigInt,
  from: Address,
  proxy: Address,
  exchangeV2: Address,
  transactionHash: Bytes,
): TransferRoyaltyResult {
  let royalties = getRoyaltiesByAssetType(nftAssetType, exchangeV2);
  if (royalties.length === 1 && payouts.length === 1 && royalties[0].address == payouts[0].address) {
    return { rest, royalty: new Array<LibPart>() };
  }
  let transferRoyaltiesResult = transferRoyaltyFees(paymentAssetType, rest, amount, royalties, from, proxy, transactionHash);
  return {
    rest: transferRoyaltiesResult.newRest,
    royalty: transferRoyaltiesResult.transferResult,
  };
}

/**
 * @dev holds logic to calculate/retrieve royalty data by rpc call
 * @param nftAssetType nft asset type
 * @param exchangeV2 exchangeV2 contract address
 * @returns get royalty array with address and bps value
 */
function getRoyaltiesByAssetType(
  nftAssetType: LibAssetType,
  exchangeV2: Address,
): Array<LibPart> {
  let royalties: Array<LibPart> = [];
  if (getClass(nftAssetType.assetClass) == ERC721_LAZY) {
    let decoded = ethereum.decode(
      MINT_721_DATA,
      nftAssetType.data
    );
    if (!decoded) {
      log.error("{} ERC721_LAZY not decoded", [nftAssetType.data.toHexString()]);
    } else {
      let decodedData = decoded.toTuple();
      let royaltyDataArray = decodedData[3].toArray();
      for (let i = 0; i < royaltyDataArray.length; i++) {
        let royaltyItem = royaltyDataArray[i].toTuple();
        let royaltyBeneficiary = royaltyItem[0].toAddress();
        let royaltyBps = royaltyItem[1].toBigInt();
        royalties.push(new LibPart(
          royaltyBeneficiary,
          royaltyBps,
        ));
      };
      return royalties;
    }
  } else if (getClass(nftAssetType.assetClass) == ERC1155_LAZY) {
    let decoded = ethereum.decode(
      MINT_721_DATA,
      nftAssetType.data
    );
    if (!decoded) {
      log.error("{} ERC1155_LAZY not decoded", [nftAssetType.data.toHexString()]);
    } else {
      let decodedData = decoded.toTuple();
      let royaltyDataArray = decodedData[4].toArray();
      for (let i = 0; i < royaltyDataArray.length; i++) {
        let royaltyItem = royaltyDataArray[i].toTuple();
        let royaltyBeneficiary = royaltyItem[0].toAddress();
        let royaltyBps = royaltyItem[1].toBigInt();
        royalties.push(new LibPart(
          royaltyBeneficiary,
          royaltyBps,
        ));
      };
      return royalties;
    }
  } else if (getClass(nftAssetType.assetClass) == ERC1155 || getClass(nftAssetType.assetClass) == ERC721) {
    let decoded = ethereum.decode(
      DATA_1155_OR_721,
      nftAssetType.data
    );
    if (!decoded) {
      log.error("{} ERC1155 not decoded", [nftAssetType.data.toHexString()]);
    } else {
      let decodedData = decoded.toTuple();
      let token = decodedData[0].toAddress();
      let tokenId = decodedData[1].toBigInt();
      let royaltiesRegistry = getRoyaltiesRegistryAddress(exchangeV2);
      if (royaltiesRegistry !== zeroAddress) {
        let royaltiesRegistryInstance = RoyaltiesRegistry.bind(royaltiesRegistry);
        let royaltiesDataResponse = royaltiesRegistryInstance.try_getRoyalties(token, tokenId);
        if (!royaltiesDataResponse.reverted) {
          for (let i = 0; i < royaltiesDataResponse.value.length; i++) {
            let royaltyItem = royaltiesDataResponse.value[i];
            let royaltyBeneficiary = royaltyItem[0].toAddress();
            let royaltyBps = royaltyItem[1].toBigInt();
            royalties.push(new LibPart(
              royaltyBeneficiary,
              royaltyBps
            ));
          }
        }
      }
      return royalties;
    }
  }
  return royalties;
}

class TransferFeesResult {
  newRest: BigInt;
  totalFee: BigInt;
  transferResult: LibPart;
}

/**
 * @dev holds logic to calculate fee for the actual transfer
 * @param assetType asset type
 * @param rest rest amount
 * @param amount total amount
 * @param fees fees array
 * @param from from address
 * @param proxy proxy address
 * @param transactionHash transaction hash
 * @returns rest amount, total fee and transfer result
 */
function transferFees(
  assetType: LibAssetType,
  rest: BigInt,
  amount: BigInt,
  fees: LibPart[],
  from: Address,
  proxy: Address,
  transactionHash: Bytes
): TransferFeesResult {
  let totalFee = BIGINT_ZERO;
  let newRest = rest;
  let transferResult = new LibPart(zeroAddress, BIGINT_ZERO);
  for (let i = 0; i < fees.length; i++) {
    totalFee = totalFee.plus(fees[i].value);
    let feeValue = BIGINT_ZERO;
    let subFeeInBpResponse = subFeeInBp(newRest, amount, fees[i].value);
    newRest = subFeeInBpResponse.newValue;
    feeValue = subFeeInBpResponse.realFee;
    // log.info("{} bps {} fees {} address {} hash transferFees", [fees[i].value.toString(), feeValue.toString(), fees[i].address.toHexString(), transactionHash.toHexString()]);
    if (feeValue > BIGINT_ZERO) {
      transferResult = transfer(new LibAsset(assetType, feeValue), from, fees[i].address, proxy);
    }
  }
  return {
    newRest,
    totalFee,
    transferResult,
  };
}

class TransferRoyaltyFeesResult {
  newRest: BigInt;
  totalFee: BigInt;
  transferResult: LibPart[];
}

/**
 * @dev holds logic to calculate royalty fee array for the actual transfer
 * @param assetType asset type
 * @param rest rest amount
 * @param amount total amount
 * @param fees fees array
 * @param from from address
 * @param proxy proxy address
 * @param transactionHash transaction hash
 * @returns rest amount, total fee and transfer result
 */
function transferRoyaltyFees(
  assetType: LibAssetType,
  rest: BigInt,
  amount: BigInt,
  fees: LibPart[],
  from: Address,
  proxy: Address,
  transactionHash: Bytes
): TransferRoyaltyFeesResult {
  let totalFee = BIGINT_ZERO;
  let newRest = rest;
  let transferResult = new Array<LibPart>();
  // log.info("inside transferRoyaltyFees fees.length {}", [fees.length.toString()]);
  for (let i = 0; i < fees.length; i++) {
    totalFee = totalFee.plus(fees[i].value);
    let feeValue = BIGINT_ZERO;
    let subFeeInBpResponse = subFeeInBp(newRest, amount, fees[i].value);
    newRest = subFeeInBpResponse.newValue;
    feeValue = subFeeInBpResponse.realFee;
    // log.info("{} bps {} fees {} address {} hash transferRoyaltyFees", [fees[i].value.toString(), feeValue.toString(), fees[i].address.toHexString(), transactionHash.toHexString()]);
    if (feeValue > BIGINT_ZERO) {
      let transferR = transfer(new LibAsset(assetType, feeValue), from, fees[i].address, proxy);
      transferResult.push(transferR);
    }
  }
  return {
    newRest,
    totalFee,
    transferResult,
  };
}

/**
 * @dev holds logic to calculate fee for the seller transfer
 * @param assetType asset type
 * @param amount rest amount
 * @param from from address
 * @param payouts payouts array
 * @param proxy proxy address
 * @param transactionHash transaction hash
 * @returns seller address and amount
 */
function transferPayouts(
  assetType: LibAssetType,
  amount: BigInt,
  from: Address,
  payouts: LibPart[],
  proxy: Address,
  transactionHash: Bytes
): LibPart {
  let sumBps = BIGINT_ZERO;
  let rest = amount;
  let transferPayoutResult = new LibPart(zeroAddress, BIGINT_ZERO);
  for (let i = 0; i < payouts.length; i++) {
    let currentAmount = bp(amount, payouts[i].value);
    sumBps = sumBps.plus(payouts[i].value);
    if (currentAmount > BIGINT_ZERO) {
      rest = rest.minus(currentAmount);
      transferPayoutResult = transfer(new LibAsset(assetType, currentAmount), from, payouts[i].address, proxy);
    }
    // log.info("{} bps {} amount {} address {} hash transferPayouts", [payouts[i].value.toString(), currentAmount.toString(), payouts[i].address.toHexString(), transactionHash.toHexString()]);
  }
  return transferPayoutResult;
}

/**
 * @dev returns data of final transfer
 * @param asset asset
 * @param from from address
 * @param to to address
 * @param proxy proxy address
 * @returns transfer beneficiary and amount
 */
function transfer(
  asset: LibAsset,
  from: Address,
  to: Address,
  proxy: Address,
): LibPart {
  return new LibPart(to, asset.value);
}

class MatchAndTransferClass {
  royalty: LibPart[];
  originFee: LibPart;
  payment: BigInt;
}

/**
 * @dev holds logic to match and transfer the assets
 * @param left left deal side
 * @param right right deal side
 * @param orderLeft left order
 * @param orderRight right order
 * @param msgSender msg sender
 * @param exchangeV2 exchange v2
 * @param transactionHash transaction hash
 * @param isMatchOrders is called from matchOrders
 * @returns royalty, origin fee and payment amount 
 */
export function matchAndTransfer(
  left: LibDealSide,
  right: LibDealSide,
  orderLeft: LibOrder,
  orderRight: LibOrder,
  msgSender: Address,
  exchangeV2: Address,
  transactionHash: Bytes,
  isMatchOrders: boolean
): MatchAndTransferClass {

  let parseOrdersSetFillEmitMatchResult = parseOrdersSetFillEmitMatch(orderLeft, orderRight, msgSender, transactionHash);
  let leftOrderData = parseOrdersSetFillEmitMatchResult.leftOrderData;
  let rightOrderData = parseOrdersSetFillEmitMatchResult.rightOrderData;

  let getDealDataParams: getDealDataClass = {
    makeMatchAssetClass: left.asset.assetType.assetClass,
    takeMatchAssetClass: right.asset.assetType.assetClass,
    leftDataType: orderLeft.dataType,
    rightDataType: orderRight.dataType,
    leftOrderData,
    rightOrderData,
    transactionHash,
  };

  if (!isMatchOrders) {
    getDealDataParams.makeMatchAssetClass = right.asset.assetType.assetClass;
    getDealDataParams.takeMatchAssetClass = left.asset.assetType.assetClass;
  }

  let doTransfersResult = doTransfers(
    left,
    right,
    getDealData(getDealDataParams),
    exchangeV2,
    transactionHash,
    isMatchOrders,
  );

  return {
    royalty: doTransfersResult.royalty,
    originFee: doTransfersResult.originFee,
    payment: doTransfersResult.payment,
  };
}

//helper functions for getDealData - start
function assetMatcherMatchAssets(leftAssetType: LibAssetType, rightAssetType: LibAssetType): LibAssetType {
  let result = matchAssetOneSide(leftAssetType, rightAssetType);
  if (result.assetClass == BYTES_ZERO) {
    return matchAssetOneSide(rightAssetType, leftAssetType);
  } else {
    return result;
  }
}

function matchAssetOneSide(
  leftAssetType: LibAssetType,
  rightAssetType: LibAssetType
): LibAssetType {
  let classLeft = leftAssetType.assetClass;
  let classRight = rightAssetType.assetClass;
  if (getClass(classLeft) == ETH) {
    if (getClass(classRight) == ETH) {
      return leftAssetType;
    }
    return new LibAssetType(BYTES_ZERO, EMPTY_BYTES);
  }
  if (getClass(classLeft) == ERC20) {
    if (getClass(classRight) == ERC20) {
      return simpleMatch(leftAssetType, rightAssetType);
    }
    return new LibAssetType(BYTES_ZERO, EMPTY_BYTES);
  }
  if (getClass(classLeft) == ERC721) {
    if (getClass(classRight) == ERC721) {
      return simpleMatch(leftAssetType, rightAssetType);
    }
    return new LibAssetType(BYTES_ZERO, EMPTY_BYTES);
  }
  if (getClass(classLeft) == ERC1155) {
    if (getClass(classRight) == ERC1155) {
      return simpleMatch(leftAssetType, rightAssetType);
    }
    return new LibAssetType(BYTES_ZERO, EMPTY_BYTES);
  }
  if (getClass(classLeft) == getClass(classRight)) {
    return simpleMatch(leftAssetType, rightAssetType);
  }
  return assetMatcherMatchAssets(leftAssetType, rightAssetType);
}

function simpleMatch(leftAssetType: LibAssetType, rightAssetType: LibAssetType): LibAssetType {
  let leftHash = crypto.keccak256(leftAssetType.data);
  let rightHash = crypto.keccak256(rightAssetType.data);
  if (leftHash == rightHash) {
    return leftAssetType;
  }
  return new LibAssetType(BYTES_ZERO, EMPTY_BYTES);
}

class ParseOrdersSetFillEmitMatchClass {
  leftOrderData: LibOrderGenericData;
  rightOrderData: LibOrderGenericData;
  newFill: LibFillResult;
}

function parseOrdersSetFillEmitMatch(
  orderLeft: LibOrder,
  orderRight: LibOrder,
  msgSender: Address,
  transactionHash: Bytes,
): ParseOrdersSetFillEmitMatchClass {
  // let leftOrderHashKey = LibOrderHashKey(orderLeft);
  // let rightOrderHashKey = LibOrderHashKey(orderRight);

  if (orderLeft.maker == zeroAddress) {
    orderLeft.maker = msgSender;
  }
  if (orderRight.maker == zeroAddress) {
    orderRight.maker = msgSender;
  }

  let leftOrderData = LibOrderDataParse(orderLeft, transactionHash);
  let rightOrderData = LibOrderDataParse(orderRight, transactionHash);

  let newFill = setFillEmitMatch(
    orderLeft,
    orderRight,
    // leftOrderHashKey,
    // rightOrderHashKey,
    leftOrderData.isMakeFill,
    rightOrderData.isMakeFill,
  );

  return {
    leftOrderData,
    rightOrderData,
    newFill,
  }
}

function setFillEmitMatch(
  orderLeft: LibOrder,
  orderRight: LibOrder,
  // leftOrderHashKey: Bytes,
  // rightOrderHashKey: Bytes,
  leftMakeFill: bool,
  rightMakeFill: bool,
): LibFillResult {
  let leftOrderFill = getOrderFill(orderLeft.salt);
  let rightOrderFill = getOrderFill(orderRight.salt);

  let newFill = fillOrder(orderLeft, orderRight, leftOrderFill, rightOrderFill, leftMakeFill, rightMakeFill);
  return newFill;
}

function fillOrder(
  leftOrder: LibOrder,
  rightOrder: LibOrder,
  leftOrderFill: BigInt,
  rightOrderFill: BigInt,
  leftIsMakeFill: bool,
  rightIsMakeFill: bool,
): LibFillResult {
  let leftCalculateRemaining = calculateRemaining(leftOrder, leftOrderFill, leftIsMakeFill);
  let leftMakeValue = leftCalculateRemaining.makeValue;
  let leftTakeValue = leftCalculateRemaining.takeValue;

  let rightCalculateRemaining = calculateRemaining(rightOrder, rightOrderFill, rightIsMakeFill);
  let rightMakeValue = rightCalculateRemaining.makeValue;
  let rightTakeValue = rightCalculateRemaining.takeValue;

  //We have 3 cases here:
  if (rightTakeValue > leftMakeValue) { //1nd: left order should be fully filled
    return fillLeft(leftMakeValue, leftTakeValue, rightOrder.makeAsset.value, rightOrder.takeAsset.value);
  }//2st: right order should be fully filled or 3d: both should be fully filled if required values are the same
  return fillRight(leftOrder.makeAsset.value, leftOrder.takeAsset.value, rightMakeValue, rightTakeValue);
}

function fillRight(
  leftMakeValue: BigInt,
  leftTakeValue: BigInt,
  rightMakeValue: BigInt,
  rightTakeValue: BigInt
): LibFillResult {
  let makerValue = safeGetPartialAmountFloor(rightTakeValue, leftMakeValue, leftTakeValue);
  return new LibFillResult(rightTakeValue, makerValue);
}

function fillLeft(
  leftMakeValue: BigInt,
  leftTakeValue: BigInt,
  rightMakeValue: BigInt,
  rightTakeValue: BigInt
): LibFillResult {
  let rightTake = safeGetPartialAmountFloor(leftTakeValue, rightMakeValue, rightTakeValue);
  return new LibFillResult(leftMakeValue, leftTakeValue);
}

class CalculateRemainingClass {
  makeValue: BigInt;
  takeValue: BigInt;
}

function calculateRemaining(
  order: LibOrder,
  fill: BigInt,
  isMakeFill: bool
): CalculateRemainingClass {
  let makeValue = BIGINT_ZERO;
  let takeValue = BIGINT_ZERO;
  if (isMakeFill) {
    makeValue = order.makeAsset.value.minus(fill);
    takeValue = safeGetPartialAmountFloor(order.takeAsset.value, order.makeAsset.value, makeValue);
  } else {
    takeValue = order.takeAsset.value.minus(fill);
    makeValue = safeGetPartialAmountFloor(order.makeAsset.value, order.takeAsset.value, takeValue);
  }
  return {
    makeValue,
    takeValue,
  }
}

function safeGetPartialAmountFloor(
  numerator: BigInt,
  denominator: BigInt,
  target: BigInt,
): BigInt {
  return numerator.times(target).div(denominator);
}

function getOrderFill(salt: BigInt): BigInt {
  let fill = BIGINT_ZERO;
  if (salt == BIGINT_ZERO) {
    fill = BIGINT_ZERO;
  } else {
    fill = BigInt.fromI32(1);
  }
  return fill;
}

function LibOrderDataParse(
  order: LibOrder,
  transactionHash: Bytes,
): LibOrderGenericData {
  let dataOrder = new LibOrderGenericData(
    [],
    [],
    false,
    BIGINT_ZERO
  );
  if (getClass(order.dataType) == V1) {
    let data = getOriginFeeArray(Bytes.fromHexString(V1), order.data, transactionHash);
    dataOrder.payouts = data.payoutFeeArray;
    dataOrder.originFees = data.originFeeArray;
  } else if (getClass(order.dataType) == V2) {
    let data = getOriginFeeArray(Bytes.fromHexString(V2), order.data, transactionHash);
    dataOrder.payouts = data.payoutFeeArray;
    dataOrder.originFees = data.originFeeArray;
    dataOrder.isMakeFill = data.isMakeFill;
  } else if (getClass(order.dataType) == V3_SELL) {
    let data = getFeeDataV3(Bytes.fromHexString(V3_SELL), order.data);
    dataOrder.payouts = parsePayouts(data.payouts);
    dataOrder.originFees = parseOriginFeeData(data.originFeeFirst, data.originFeeSecond);
    dataOrder.isMakeFill = true;
    dataOrder.maxFeesBasePoint = data.maxFeesBasePoint;
  } else if (getClass(order.dataType) == V3_BUY) {
    let data = getFeeDataV3(Bytes.fromHexString(V3_SELL), order.data);
    dataOrder.payouts = parsePayouts(data.payouts);
    dataOrder.originFees = parseOriginFeeData(data.originFeeFirst, data.originFeeSecond);
    dataOrder.isMakeFill = false;
  }
  if (dataOrder.payouts.length == 0) {
    dataOrder.payouts = payoutSet(order.maker);
  }
  return dataOrder;
}

function payoutSet(orderAddress: Address): Array<LibPart> {
  let payout = new Array<LibPart>();
  payout.push(new LibPart(orderAddress, BigInt.fromI32(10000)));
  return payout;
}

function parseOriginFeeData(
  dataFirst: BigInt,
  dataSecond: BigInt
): LibPart[] {
  let originFee = new Array<LibPart>();
  if (dataFirst > BIGINT_ZERO && dataSecond > BIGINT_ZERO) {
    originFee = new Array<LibPart>();
    originFee[0] = uintToLibPart(dataFirst);
    originFee[1] = uintToLibPart(dataSecond);
  }

  if (dataFirst > BIGINT_ZERO && dataSecond == BIGINT_ZERO) {
    originFee = new Array<LibPart>();
    originFee[0] = uintToLibPart(dataFirst);
  }

  if (dataFirst == BIGINT_ZERO && dataSecond > BIGINT_ZERO) {
    originFee = new Array<LibPart>();
    originFee[0] = uintToLibPart(dataSecond);
  }

  return originFee;
}

function parsePayouts(data: BigInt): Array<LibPart> {
  let payouts = [new LibPart(zeroAddress, BIGINT_ZERO)];
  if (data > BIGINT_ZERO) {
    payouts[0] = uintToLibPart(data);
  }
  return payouts;
}

function uintToLibPart(data: BigInt): LibPart {
  let result = new LibPart(zeroAddress, BIGINT_ZERO);
  if (data > BIGINT_ZERO) {
    result.address = Address.fromBytes(Address.fromI32(data.toI32()));
    result.value = BigInt.fromI32(data.toI32() >> 160);
  }
  return result;
}
// helper functions for getDealData - end

class getDealDataClass {
  makeMatchAssetClass: Bytes;
  takeMatchAssetClass: Bytes;
  leftDataType: Bytes;
  rightDataType: Bytes;
  leftOrderData: LibOrderGenericData;
  rightOrderData: LibOrderGenericData;
  transactionHash: Bytes;
}

/**
 * @dev calculate the deal data for the order
 * @param input of type getDealDataClass
 * @returns feeSide and maxFeesBasePoint
 */
function getDealData(
  input: getDealDataClass
): LibDealData {
  let dealData = new LibDealData(
    BIGINT_ZERO,
    FeeSide.NONE,
  );
  // log.info("getfeeside input: makeMatchAssetClass {} takeMatchAssetClass {} hash {}", [
  // input.makeMatchAssetClass.toHexString(),
  //   input.takeMatchAssetClass.toHexString(),
  //   input.transactionHash.toHexString()
  // ])
  dealData.feeSide = getFeeSide(input.makeMatchAssetClass, input.takeMatchAssetClass);
  dealData.maxFeesBasePoint = getMaxFee(
    input.leftDataType,
    input.rightDataType,
    input.leftOrderData,
    input.rightOrderData,
    dealData.feeSide
  );
  // log.info("getDealData output: feeside {} maxfeebps {} hash {}", [dealData.feeSide.toString(), dealData.maxFeesBasePoint.toString(), input.transactionHash.toHexString()]);
  return dealData;
};

/**
 * @dev calculate the fee side for the order
 * @param leftClass left asset class
 * @param rightClass right asset class
 * @returns feeSide of type FeeSide
 */
function getFeeSide(leftClass: Bytes, rightClass: Bytes): FeeSide {
  if (getClass(leftClass) == ETH) {
    return FeeSide.LEFT;
  }
  if (getClass(rightClass) == ETH) {
    return FeeSide.RIGHT;
  }
  if (getClass(leftClass) == ERC20) {
    return FeeSide.LEFT;
  }
  if (getClass(rightClass) == ERC20) {
    return FeeSide.RIGHT;
  }
  if (getClass(leftClass) == ERC1155) {
    return FeeSide.LEFT;
  }
  if (getClass(rightClass) == ERC1155) {
    return FeeSide.RIGHT;
  }
  return FeeSide.NONE;
}

/**
 * @dev calculate the max fee bps for the order
 * @param dataTypeLeft left order data type
 * @param dataTypeRight right order data type
 * @param leftOrderData left order data
 * @param rightOrderData right order data
 * @param feeSide fee side
 * @returns maxFeesBasePoint
 */
function getMaxFee(
  dataTypeLeft: Bytes,
  dataTypeRight: Bytes,
  leftOrderData: LibOrderGenericData,
  rightOrderData: LibOrderGenericData,
  feeSide: FeeSide
): BigInt {
  if (
    getClass(dataTypeLeft) != V3_SELL &&
    getClass(dataTypeRight) != V3_SELL &&
    getClass(dataTypeLeft) != V3_BUY &&
    getClass(dataTypeRight) != V3_BUY
  ) {
    return BIGINT_ZERO;
  }

  let maxFee = BIGINT_ZERO;
  if (feeSide == FeeSide.LEFT) {
    maxFee = rightOrderData.maxFeesBasePoint;
  } else if (feeSide == FeeSide.RIGHT) {
    maxFee = leftOrderData.maxFeesBasePoint;
  } else {
    return BIGINT_ZERO;
  }
  return maxFee;
}

/**
 * @dev holds logic to calulate payment asset type
 * @param token token address
 * @param transactionHash transaction hash
 * @returns assetclass and data od type LibAssetType
 */
export function getPaymentAssetType(token: Address, transactionHash: Bytes): LibAssetType {
  let assetType = new LibAssetType(BYTES_ZERO, BYTES_ZERO);
  if (token == zeroAddress) {
    // log.info("getpaymentassetype token is zero address hash {}", [transactionHash.toHexString()]);
    assetType.assetClass = getClassBytes(ETH, transactionHash);
    // log.info("getpaymentassetype assetclass is hash {}", [assetType.assetClass.toHexString(), transactionHash.toHexString()]);
    return assetType;
  } else {
    // log.info('getPaymentAssetType token else: {} hash {}', [token.toHexString(), transactionHash.toHexString()]);
    assetType.assetClass = getClassBytes(ERC20, transactionHash);
    let encoded = token.toHexString().replace("0x", "0x000000000000000000000000");
    // log.info("encoded: {} hash {}", [encoded, transactionHash.toHexString()]);
    assetType.data = Bytes.fromHexString(encoded);
    return assetType;
  }
}

/**
 * @dev holds logic to calulate other order type
 * @param dataType order type - V3_SELL or V3_BUY or V1 or V2
 * @returns order type for other side - left or right order
 */
export function getOtherOrderType(dataType: Bytes): Bytes {
  if (dataType == Bytes.fromHexString(V3_SELL)) {
    return Bytes.fromHexString(V3_BUY);
  }
  if (dataType == Bytes.fromHexString(V3_BUY)) {
    return Bytes.fromHexString(V3_SELL);
  }
  return dataType;
}

class generateOrderDataClass {
  paymentSide: LibDealSide;
  nftSide: LibDealSide;
  orderLeftInput: LibOrder;
  orderRightInput: LibOrder;
}

/**
 * @dev generate order data for matchAndTransfer input in matchOrders
 * @param orderLeft left order
 * @param orderRight right order
 * @param isRightAssetNft is right asset nft
 * @param transactionHash transaction hash
 * @returns order data of type generateOrderDataClass
 */
export function generateOrderData(
  orderLeft: MatchOrdersCallOrderLeftStruct,
  orderRight: MatchOrdersCallOrderRightStruct,
  isRightAssetNft: boolean,
  transactionHash: Bytes
): generateOrderDataClass {

  if (isRightAssetNft) {
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
    return {
      paymentSide,
      nftSide,
      orderLeftInput,
      orderRightInput,
    };
  } else {

    let orderLeftInput = new LibOrder(
      orderRight.maker,
      convertAssetToLibAsset(orderLeft.takeAsset),
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
      convertAssetToLibAsset(orderRight.takeAsset),
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
    return {
      paymentSide,
      nftSide,
      orderLeftInput,
      orderRightInput,
    };
  }
}