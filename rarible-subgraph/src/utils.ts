import {
  Address,
  BigInt,
  Bytes,
  ethereum,
  log,
  TypedMap,
  crypto,
  Result,
} from "@graphprotocol/graph-ts";
import { ExchangeV1 } from "../generated/ExchangeV1/ExchangeV1";
import { HasSecondarySaleFees } from "../generated/ExchangeV1/HasSecondarySaleFees";
import { ExchangeV2 } from "../generated/ExchangeV2/ExchangeV2";
import { RoyaltiesRegistry } from "../generated/ExchangeV2/RoyaltiesRegistry";

export const INTERFACE_ID_FEES = Bytes.fromHexString("0xb7799584");
export const exchangeV1Address = Address.fromString("0xcd4ec7b66fbc029c116ba9ffb3e59351c20b5b06");
export const zeroAddress = Address.fromString("0x0000000000000000000000000000000000000000");
export const MINT_1155_DATA = "(uint256,string,uint256,(address,uint96)[],(address,uint96)[],bytes[])"
export const MINT_721_DATA = "(uint256,string,(address,uint96)[],(address,uint96)[],bytes[])";
export const DATA_1155_OR_721 = "(address,uint256)";
export const EMPTY_BYTES = Bytes.fromHexString("");
export const BYTES_ZERO = Bytes.fromI32(0);
export const DEFAULT_ORDER_TYPE = Bytes.fromHexString("0xffffffff");

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

class RoyaltyDetails {
  royaltyAmounts: BigInt[];
  royaltyRecipients: Address[];
};

class RoyaltyDetailsWithRestValue {
  royaltyAmount: BigInt;
  royaltyRecipient: Address;
  restValue: BigInt;
}

export function getRoyaltyDetails(
  tokenId: BigInt,
  tokenAddress: Address,
  restValue: BigInt,
  amount: BigInt,
): RoyaltyDetails {
  // extract data from contract logic comes here
  let contractInstance = HasSecondarySaleFees.bind(tokenAddress);
  let supportsInterface = contractInstance.try_supportsInterface(INTERFACE_ID_FEES);

  if (!supportsInterface.reverted && supportsInterface.value) {
    let royaltyRecipients = contractInstance.getFeeRecipients(tokenId);
    let royaltyAmounts = contractInstance.getFeeBps(tokenId);
    for (var i = 0; i < royaltyAmounts.length; i++) {
      let subFeeResponse = subFeeInBp(restValue, amount, royaltyAmounts[i]);
      royaltyAmounts[i] = subFeeResponse.realFee;
      restValue = subFeeResponse.newValue;
    }
    return {
      royaltyAmounts,
      royaltyRecipients,
    };
  };

  return {
    royaltyAmounts: [],
    royaltyRecipients: [],
  };
}

class SubFeeResponse {
  newValue: BigInt;
  realFee: BigInt;
}

export function subFeeInBp(
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
    newValue = BigInt.fromI32(0);
    realFee = value;
  }
  return { newValue, realFee };
}

function bp(value1: BigInt, value2: BigInt): BigInt {
  return value1.times(value2).div(BigInt.fromI32(10000));
}

class BeneficiaryDetails {
  beneficiaryFee: BigInt;
  beneficiary: Address;
  restValue: BigInt;
}

export function getFeeBeneficiaryDetails(
  total: BigInt,
  sellerFee: BigInt,
  buyerFee: BigInt,
): BeneficiaryDetails {
  let SubFeeInBpResponse = subFeeInBp(
    total,
    total,
    sellerFee
  );

  let buyerFeeValue = bp(total, buyerFee);
  let beneficiaryFee = buyerFeeValue.plus(SubFeeInBpResponse.realFee);

  let contractInstance = ExchangeV1.bind(exchangeV1Address);
  let beneficiaryResult = contractInstance.try_beneficiary();

  let beneficiary: Address;

  if (!beneficiaryResult.reverted) {
    beneficiary = beneficiaryResult.value;
  } else {
    beneficiary = zeroAddress;
  }

  return {
    beneficiaryFee,
    beneficiary,
    restValue: SubFeeInBpResponse.newValue,
  };
}


// exchangev2

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

export const V1 = "0x4c234266";
export const V2 = "0x23d235ef";

export function getClass(assetClass: Bytes): string {
  let res = classMap.get(assetClass.toHexString());
  if (res) {
    return res;
  }
  return SPECIAL;
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

export function decodeAsset(data: Bytes, type: string): Asset {
  if (type == ERC20) {
    let decoded = ethereum.decode("(address)", data);
    if (decoded != null) {
      let decodedTuple = decoded.toTuple();
      let asset = new Asset(
        decodedTuple[0].toAddress(),
        BigInt.fromI32(0),
        type
      );
      return asset;
    }
  } else if (type == ERC721 || type == ERC1155) {
    let decoded = ethereum.decode("(address,uint256)", data);
    if (decoded != null) {
      let decodedTuple = decoded.toTuple();
      let address = decodedTuple[0].toAddress();
      let id = decodedTuple[1].toBigInt();
      let asset = new Asset(address, id, type);
      return asset;
    }
  } else if (type == SPECIAL) {
    let decoded = ethereum.decode("(address,uint256,uint256)", data);
    if (decoded != null) {
      let decodedTuple = decoded.toTuple();
      let address = decodedTuple[0].toAddress();
      let id = decodedTuple[2].toBigInt();
      let asset = new Asset(address, id, type);
      return asset;
    }
  }
  let asset = new Asset(zeroAddress, BIGINT_ZERO, type);
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

export function getOriginFees(exchangeType: Bytes, data: Bytes): OriginFeeClass {
  if (exchangeType.toHexString() == V1) {
    if (
      data
        .toHexString()
        .startsWith(
          "0x000000000000000000000000000000000000000000000000000000000000004"
        )
    ) {
      data = Bytes.fromHexString(
        "0x0000000000000000000000000000000000000000000000000000000000000020" +
        data.toHexString().slice(2)
      );
      log.error("weird case {}", [data.toHexString()]);
      let decoded = ethereum.decode(
        "((address,uint96)[],(address,uint96)[])",
        data
      );
      if (!decoded) {
        log.error("{} not decoded", [data.toHexString()]);
      } else {
        let dataV1 = decoded.toTuple();
        let originFeeArray = dataV1[1].toArray();
        let originFee = BIGINT_ZERO;
        let originFeeReceiver: Address = zeroAddress;
        for (let i = 0; i < originFeeArray.length; i++) {
          let originFeeItem = originFeeArray[i].toTuple();
          originFeeReceiver = originFeeItem[0].toAddress();
          originFee = originFee.plus(originFeeItem[1].toBigInt());
        }
        return new OriginFeeClass(originFee, originFeeReceiver);
      }
    }
    let decoded = ethereum.decode(
      "((address,uint96)[],(address,uint96)[])",
      data
    );
    if (!decoded) {
      log.error("{} not decoded", [data.toHexString()]);
    } else {
      let dataV1 = decoded.toTuple();
      let originFeeArray = dataV1[1].toArray();
      let originFee = BIGINT_ZERO;
      let originFeeReceiver: Address = zeroAddress;
      for (let i = 0; i < originFeeArray.length; i++) {
        let originFeeItem = originFeeArray[i].toTuple();
        originFeeReceiver = originFeeItem[0].toAddress();
        originFee = originFee.plus(originFeeItem[1].toBigInt());
      }
      return new OriginFeeClass(originFee, originFeeReceiver);
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
      let originFeeArray = dataV2[1].toArray();
      let originFee = BIGINT_ZERO;
      let originFeeReceiver: Address = zeroAddress;
      for (let i = 0; i < originFeeArray.length; i++) {
        let originFeeItem = originFeeArray[i].toTuple();
        originFeeReceiver = originFeeItem[0].toAddress();
        originFee = originFee.plus(originFeeItem[1].toBigInt());
      }
      return new OriginFeeClass(originFee, originFeeReceiver);
    }
  }
  log.error("Not V1/V2 data={}", [data.toHexString()]);
  return new OriginFeeClass(BIGINT_ZERO, zeroAddress);
}

export function abiDecode(data: Bytes, format: string): ethereum.Value | null {
  let decoded = ethereum.decode(
    format,
    data
  );
  return decoded;
}

class OriginFeeArrayClass {
  originFeeArray: Array<LibPart>;
  payoutFeeArray: Array<LibPart>;
  isMakeFill: bool;
}

export function getOriginFeeArray(exchangeType: Bytes, data: Bytes): OriginFeeArrayClass {
  let originFeeArray: Array<LibPart> = [];
  let payoutFeeArray: Array<LibPart> = [];
  let isMakeFill: bool = false;
  if (exchangeType.toHexString() == V1) {
    if (
      data
        .toHexString()
        .startsWith(
          "0x000000000000000000000000000000000000000000000000000000000000004"
        )
    ) {
      data = Bytes.fromHexString(
        "0x0000000000000000000000000000000000000000000000000000000000000020" +
        data.toHexString().slice(2)
      );
      log.error("weird case {}", [data.toHexString()]);
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

export function getOriginFeesWithRestValue(
  exchangeType: Bytes,
  data: Bytes,
  restValue: BigInt,
  totalAmount: BigInt
): OriginFeeClassWithRestValue {
  if (exchangeType.toHexString() == V1) {
    if (
      data
        .toHexString()
        .startsWith(
          "0x000000000000000000000000000000000000000000000000000000000000004"
        )
    ) {
      data = Bytes.fromHexString(
        "0x0000000000000000000000000000000000000000000000000000000000000020" +
        data.toHexString().slice(2)
      );
      log.error("weird case {}", [data.toHexString()]);
      let decoded = ethereum.decode(
        "((address,uint96)[],(address,uint96)[])",
        data
      );
      if (!decoded) {
        log.error("{} not decoded", [data.toHexString()]);
      } else {
        let dataV1 = decoded.toTuple();
        let originFeeArray = dataV1[1].toArray();
        let originFeeReceiver: Address = zeroAddress;
        let originFeeTotalBps: BigInt = BIGINT_ZERO;
        for (let i = 0; i < originFeeArray.length; i++) {
          let originFeeItem = originFeeArray[i].toTuple();
          originFeeReceiver = originFeeItem[0].toAddress();
          originFeeTotalBps = originFeeTotalBps.plus(originFeeItem[1].toBigInt());
        }
        let originFee = subFeeInBp(restValue, totalAmount, originFeeTotalBps);
        return new OriginFeeClassWithRestValue(
          originFee.realFee,
          originFeeReceiver,
          originFee.newValue,
        );
      }
    }
    let decoded = ethereum.decode(
      "((address,uint96)[],(address,uint96)[])",
      data
    );
    if (!decoded) {
      log.error("{} not decoded", [data.toHexString()]);
    } else {
      let dataV1 = decoded.toTuple();
      let originFeeArray = dataV1[1].toArray();
      let originFeeReceiver: Address = zeroAddress;
      let originFeeTotalBps: BigInt = BIGINT_ZERO;
      for (let i = 0; i < originFeeArray.length; i++) {
        let originFeeItem = originFeeArray[i].toTuple();
        originFeeReceiver = originFeeItem[0].toAddress();
        originFeeTotalBps = originFeeTotalBps.plus(originFeeItem[1].toBigInt());
      }
      let originFee = subFeeInBp(restValue, totalAmount, originFeeTotalBps);
      return new OriginFeeClassWithRestValue(
        originFee.realFee,
        originFeeReceiver,
        originFee.newValue,
      );
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
      let originFeeArray = dataV2[1].toArray();
      let originFeeReceiver: Address = zeroAddress;
      let originFeeTotalBps: BigInt = BIGINT_ZERO;
      for (let i = 0; i < originFeeArray.length; i++) {
        let originFeeItem = originFeeArray[i].toTuple();
        originFeeReceiver = originFeeItem[0].toAddress();
        originFeeTotalBps = originFeeTotalBps.plus(originFeeItem[1].toBigInt());
      }
      let originFee = subFeeInBp(restValue, totalAmount, originFeeTotalBps);
      return new OriginFeeClassWithRestValue(
        originFee.realFee,
        originFeeReceiver,
        originFee.newValue,
      );
    }
  }
  log.error("Not V1/V2 data={}", [data.toHexString()]);
  return new OriginFeeClassWithRestValue(
    BIGINT_ZERO,
    zeroAddress,
    BIGINT_ZERO,
  );
}

export function calculatedTotal(
  amt: BigInt,
  exchangeType: Bytes,
  data: Bytes
): BigInt {
  let originFeesData = getOriginFees(exchangeType, data);
  let calculatedFees = amt.times(originFeesData.originFee).div(BigInt.fromI32(10000));
  return amt.plus(calculatedFees);
}

export function getRoyaltyDetailsForExchangeV2(
  assetClass: Bytes,
  data: Bytes,
  exchangeV2: Address,
  restValue: BigInt,
  totalAmount: BigInt
): RoyaltyDetailsWithRestValue {
  if (getClass(assetClass) == ERC721_LAZY) {
    let decoded = ethereum.decode(
      MINT_721_DATA,
      data
    );
    if (!decoded) {
      log.error("{} ERC721_LAZY not decoded", [data.toHexString()]);
    } else {
      let decodedData = decoded.toTuple();
      let royaltyAmounts: BigInt[] = [];
      let royaltyRecipients: Address[] = [];
      let royaltyDataArray = decodedData[3].toArray();
      let royaltyValue: SubFeeResponse = {
        newValue: BIGINT_ZERO,
        realFee: BIGINT_ZERO,
      };
      for (let i = 0; i < royaltyDataArray.length; i++) {
        let royaltyItem = royaltyDataArray[i].toTuple();
        let royaltyBeneficiary = royaltyItem[0].toAddress();
        royaltyValue = subFeeInBp(restValue, totalAmount, royaltyItem[1].toBigInt());
        log.info("{} royaltyAmount for royaltyBps {} and totalAmount {} newValue {}", [royaltyValue.realFee.toString(), royaltyItem[1].toBigInt().toString(), totalAmount.toString(), royaltyValue.newValue.toString()]);
        royaltyAmounts.push(royaltyValue.realFee);
        restValue = royaltyValue.newValue;
        royaltyRecipients.push(royaltyBeneficiary);
        log.info("{} {} ERC721_LAZY decoded data", [royaltyBeneficiary.toHexString(), royaltyValue.realFee.toString()]);
      }
      let royaltyAmount = royaltyAmounts.length > 0 ? royaltyAmounts[0] : BigInt.fromI32(0);
      let royaltyRecipient = royaltyRecipients.length > 0 ? royaltyRecipients[0] : zeroAddress;
      return {
        royaltyAmount,
        royaltyRecipient,
        restValue: royaltyValue.newValue
      }
    }
  } else if (getClass(assetClass) == ERC1155_LAZY) {
    let decoded = ethereum.decode(
      MINT_721_DATA,
      data
    );
    if (!decoded) {
      log.error("{} ERC1155_LAZY not decoded", [data.toHexString()]);
    } else {
      let decodedData = decoded.toTuple();
      let royaltyAmounts: BigInt[] = [];
      let royaltyRecipients: Address[] = [];
      let royaltyDataArray = decodedData[4].toArray();
      let royaltyValue: SubFeeResponse = {
        newValue: BIGINT_ZERO,
        realFee: BIGINT_ZERO,
      };
      for (let i = 0; i < royaltyDataArray.length; i++) {
        let royaltyItem = royaltyDataArray[i].toTuple();
        let royaltyBeneficiary = royaltyItem[0].toAddress();
        royaltyValue = subFeeInBp(restValue, totalAmount, royaltyItem[1].toBigInt());
        log.info("{} royaltyAmount for royaltyBps {} and totalAmount {} newValue {}", [royaltyValue.realFee.toString(), royaltyItem[1].toBigInt().toString(), totalAmount.toString(), royaltyValue.newValue.toString()]);
        royaltyAmounts.push(royaltyValue.realFee);
        restValue = royaltyValue.newValue;
        royaltyRecipients.push(royaltyBeneficiary);
        log.info("{} {} ERC1155_LAZY decoded data", [royaltyBeneficiary.toHexString(), royaltyValue.realFee.toString()]);
      }
      let royaltyAmount = royaltyAmounts.length > 0 ? royaltyAmounts[0] : BigInt.fromI32(0);
      let royaltyRecipient = royaltyRecipients.length > 0 ? royaltyRecipients[0] : zeroAddress;
      return {
        royaltyAmount,
        royaltyRecipient,
        restValue: royaltyValue.newValue
      }
    }
  } else if (getClass(assetClass) == ERC1155 || getClass(assetClass) == ERC721) {
    let decoded = ethereum.decode(
      DATA_1155_OR_721,
      data
    );
    if (!decoded) {
      log.error("{} ERC1155 not decoded", [data.toHexString()]);
    } else {
      let decodedData = decoded.toTuple();
      let royaltyAmounts: BigInt[] = [];
      let royaltyRecipients: Address[] = [];
      let token = decodedData[0].toAddress();
      let tokenId = decodedData[1].toBigInt();
      let royaltiesRegistry = getRoyaltiesRegistryAddress(exchangeV2);
      let royaltyValue: SubFeeResponse = {
        newValue: BIGINT_ZERO,
        realFee: BIGINT_ZERO,
      };
      if (royaltiesRegistry !== zeroAddress) {
        let royaltiesRegistryInstance = RoyaltiesRegistry.bind(royaltiesRegistry);
        let royaltiesDataResponse = royaltiesRegistryInstance.try_getRoyalties(token, tokenId);
        if (!royaltiesDataResponse.reverted) {
          for (let i = 0; i < royaltiesDataResponse.value.length; i++) {
            let royaltyItem = royaltiesDataResponse.value[i];
            let royaltyBeneficiary = royaltyItem[0].toAddress();
            royaltyValue = subFeeInBp(restValue, totalAmount, royaltyItem[1].toBigInt());
            log.info("{} royaltyAmount for royaltyBps {} and totalAmount {} newValue {}", [royaltyValue.realFee.toString(), royaltyItem[1].toBigInt().toString(), totalAmount.toString(), royaltyValue.newValue.toString()]);
            royaltyAmounts.push(royaltyValue.realFee);
            restValue = royaltyValue.newValue;
            royaltyRecipients.push(royaltyBeneficiary);
            log.info("{} {} ERC1155 and ERC721 decoded data", [royaltyBeneficiary.toHexString(), royaltyValue.realFee.toString()]);
          }
        }
      }
      let royaltyAmount = royaltyAmounts.length > 0 ? royaltyAmounts[0] : BigInt.fromI32(0);
      let royaltyRecipient = royaltyRecipients.length > 0 ? royaltyRecipients[0] : zeroAddress;
      return {
        royaltyAmount,
        royaltyRecipient,
        restValue: royaltyValue.newValue
      }
    }
  }
  return {
    royaltyAmount: BigInt.fromI32(0),
    royaltyRecipient: zeroAddress,
    restValue,
  }
}

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

class LibDealSide {
  asset: LibAsset;
  payouts: LibPart[];
  originFees: LibPart[];
  proxy: Address;
  from: Address;
}

class LibAssetType {
  assetClass: Bytes;
  data: Bytes;
  constructor(assetClass: Bytes, data: Bytes) {
    this.assetClass = assetClass;
    this.data = data;
  }
}

class LibAsset {
  assetType: LibAssetType;
  value: BigInt;
  constructor(assetType: LibAssetType, value: BigInt) {
    this.assetType = assetType;
    this.value = value;
  }
}

enum FeeSide {
  NONE,
  LEFT,
  RIGHT,
}

class LibDealData {
  maxFeesBasePoint: BigInt;
  feeSide: FeeSide;
}

class LibOrder {
  maker: Address;
  makeAsset: LibAsset;
  taker: Address;
  takeAsset: LibAsset;
  salt: BigInt;
  start: BigInt;
  end: BigInt;
  dataType: Bytes;
  data: Bytes;
}

function LibOrderHashKey(order: LibOrder): Bytes {
  if (getClass(order.dataType) == V1 || order.dataType == DEFAULT_ORDER_TYPE) {
    return crypto.keccak256(ethereum.encode(
      order.maker,
      LibAsset.hash(order.makeAsset.assetType),
      LibAsset.hash(order.takeAsset.assetType),
      order.salt
    ));
  } else {
    //order.data is in hash for V2, V3 and all new order
    return crypto.keccak256(ethereum.encode(
      order.maker,
      LibAsset.hash(order.makeAsset.assetType),
      LibAsset.hash(order.takeAsset.assetType),
      order.salt,
      order.data
    ));
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

// funcs from rarible transfer manager

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
  royaltyAmount: BigInt;
  originFeeAmount: BigInt;
}

function doTransfers(
  left: LibDealSide,
  right: LibDealSide,
  dealData: LibDealData,
  exchangeV2: Address,
): doTransfersClass {
  let totalLeftValue = left.asset.value;
  let totalRightValue = right.asset.value;
  let sellerPayoutsAmount = BIGINT_ZERO;
  let royaltyAmount = BIGINT_ZERO;
  let originFeeAmount = BIGINT_ZERO;
  let doTransferWithFeesResult: DoTransfersWithFeesClass;
  if (dealData.feeSide == FeeSide.LEFT) {
    doTransferWithFeesResult = doTransferWithFees(left, right, dealData.maxFeesBasePoint, exchangeV2);
    totalLeftValue = doTransferWithFeesResult.rest;
    royaltyAmount = doTransferWithFeesResult.royaltyAmount;
    originFeeAmount = doTransferWithFeesResult.originFeeAmount;
    sellerPayoutsAmount = transferPayouts(right.asset.assetType, right.asset.value, right.from, left.payouts, right.proxy);
  } else if (dealData.feeSide == FeeSide.RIGHT) {
    doTransferWithFeesResult = doTransferWithFees(right, left, dealData.maxFeesBasePoint, exchangeV2);
    totalRightValue = doTransferWithFeesResult.rest;
    royaltyAmount = doTransferWithFeesResult.royaltyAmount;
    originFeeAmount = doTransferWithFeesResult.originFeeAmount;
    sellerPayoutsAmount = transferPayouts(left.asset.assetType, left.asset.value, left.from, right.payouts, left.proxy);
  } else {
    sellerPayoutsAmount = transferPayouts(left.asset.assetType, left.asset.value, left.from, right.payouts, left.proxy);
    sellerPayoutsAmount = sellerPayoutsAmount.plus(transferPayouts(right.asset.assetType, right.asset.value, right.from, left.payouts, right.proxy));
  }
  return {
    totalLeftValue,
    totalRightValue,
    royaltyAmount,
    originFeeAmount,
    // sellerPayoutsAmount,
  }
}

class DoTransfersWithFeesClass {
  rest: BigInt;
  royaltyAmount: BigInt;
  originFeeAmount: BigInt;
}

function doTransferWithFees(
  paymentSide: LibDealSide,
  nftSide: LibDealSide,
  maxFeesBasePoint: BigInt,
  exchangeV2: Address,
): DoTransfersWithFeesClass {
  let totalAmount = calculateTotalAmount(paymentSide.asset.value, paymentSide.originFees, maxFeesBasePoint);
  let rest = totalAmount;
  let transferRoyaltiesResult = transferRoyalties(paymentSide.asset.assetType, nftSide.asset.assetType, nftSide.payouts, rest, paymentSide.asset.value, paymentSide.from, paymentSide.proxy, exchangeV2);
  rest = transferRoyaltiesResult.rest;
  let royaltyAmount = transferRoyaltiesResult.royaltyAmount;
  let originFeeAmount = BIGINT_ZERO;
  if (
    paymentSide.originFees.length === 1 &&
    nftSide.originFees.length === 1 &&
    nftSide.originFees[0].address == paymentSide.originFees[0].address
  ) {
    let origin: Array<LibPart> = [];
    origin.push(new LibPart(nftSide.originFees[0].address, nftSide.originFees[0].value.plus(paymentSide.originFees[0].value)));
    let transferFeesResult = transferFees(paymentSide.asset.assetType, rest, paymentSide.asset.value, origin, paymentSide.from, paymentSide.proxy);
    rest = transferFeesResult.newRest;
    originFeeAmount = transferFeesResult.transferResult;
  } else {
    let transferFeesResult = transferFees(paymentSide.asset.assetType, rest, paymentSide.asset.value, paymentSide.originFees, paymentSide.from, paymentSide.proxy);
    rest = transferFeesResult.newRest;
    originFeeAmount = transferFeesResult.transferResult;

    transferFeesResult = transferFees(nftSide.asset.assetType, rest, paymentSide.asset.value, nftSide.originFees, paymentSide.from, paymentSide.proxy);
    rest = transferFeesResult.newRest;
    originFeeAmount = originFeeAmount.plus(transferFeesResult.transferResult);
  }
  let transferPayoutAmount = transferPayouts(paymentSide.asset.assetType, rest, paymentSide.from, nftSide.payouts, paymentSide.proxy);
  return { rest, royaltyAmount, originFeeAmount };
}

class TransferRoyaltyResult {
  rest: BigInt;
  royaltyAmount: BigInt;
}

function transferRoyalties(
  paymentAssetType: LibAssetType,
  nftAssetType: LibAssetType,
  payouts: LibPart[],
  rest: BigInt,
  amount: BigInt,
  from: Address,
  proxy: Address,
  exchangeV2: Address,
): TransferRoyaltyResult {
  let royalties = getRoyaltiesByAssetType(nftAssetType, exchangeV2);
  if (royalties.length === 1 && payouts.length === 1 && royalties[0].address == payouts[0].address) {
    return { rest, royaltyAmount: BIGINT_ZERO };
  }
  let transferRoyaltiesResult = transferFees(paymentAssetType, rest, amount, royalties, from, proxy);
  return {
    rest: transferRoyaltiesResult.newRest,
    royaltyAmount: transferRoyaltiesResult.transferResult
  };
}

export function getRoyaltiesByAssetType(
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
        royalties.push({
          address: royaltyBeneficiary,
          value: royaltyBps,
        });
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
        royalties.push({
          address: royaltyBeneficiary,
          value: royaltyBps,
        });
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
            royalties.push({
              address: royaltyBeneficiary,
              value: royaltyBps,
            });
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
  transferResult: BigInt;
}

function transferFees(
  assetType: LibAssetType,
  rest: BigInt,
  amount: BigInt,
  fees: LibPart[],
  from: Address,
  proxy: Address,
): TransferFeesResult {
  let totalFee = BigInt.fromI32(0);
  let newRest = rest;
  let transferResult = BIGINT_ZERO;
  for (let i = 0; i < fees.length; i++) {
    totalFee = totalFee.plus(fees[i].value);
    let feeValue;
    let subFeeInBpResponse = subFeeInBp(newRest, amount, fees[i].value);
    newRest = subFeeInBpResponse.newValue;
    feeValue = subFeeInBpResponse.realFee;
    if (feeValue > BigInt.fromI32(0)) {
      transferResult = transfer(new LibAsset(assetType, feeValue), from, fees[i].address, proxy);
    }
  }
  return {
    newRest,
    totalFee,
    transferResult,
  };
}

function transferPayouts(
  assetType: LibAssetType,
  amount: BigInt,
  from: Address,
  payouts: LibPart[],
  proxy: Address,
): BigInt {
  let sumBps = BigInt.fromI32(0);
  let rest = amount;
  let transferPayoutAmount = BIGINT_ZERO;
  for (let i = 0; i < payouts.length - 1; i++) {
    let currentAmount = bp(amount, payouts[i].value);
    sumBps = sumBps.plus(payouts[i].value);
    if (currentAmount > BigInt.fromI32(0)) {
      rest = rest.minus(currentAmount);
      transferPayoutAmount = transfer(new LibAsset(assetType, currentAmount), from, payouts[i].address, proxy);
    }
  }
  return transferPayoutAmount;
}

function transfer(
  asset: LibAsset,
  from: Address,
  to: Address,
  proxy: Address,
): BigInt {
  return asset.value;
}

// funcs from exchangev2core

class MatchAndTransferClass {
  royaltyAmount: BigInt;
  originFeeAmount: BigInt;
}

function matchAndTransfer(
  orderLeft: LibOrder,
  orderRight: LibOrder,
): MatchAndTransferClass {
  let royaltyAmount = BIGINT_ZERO;
  let originFeeAmount = BIGINT_ZERO;

  let matchAssetsResult = matchAssets(orderLeft, orderRight);
  let makeMatch = matchAssetsResult.makeMatch;
  let takeMatch = matchAssetsResult.takeMatch;

  let doTransfersResult = doTransfers();

  return {
    royaltyAmount: doTransfersResult.royaltyAmount,
    originFeeAmount: doTransfersResult.originFeeAmount,
  };
}

class MatchAssetsClass {
  makeMatch: LibAssetType;
  takeMatch: LibAssetType;
}

function matchAssets(
  orderLeft: LibOrder,
  orderRight: LibOrder,
): MatchAssetsClass {
  let makeMatch = assetMatcherMatchAssets(orderLeft.makeAsset.assetType, orderRight.takeAsset.assetType);
  let takeMatch = assetMatcherMatchAssets(orderLeft.takeAsset.assetType, orderRight.makeAsset.assetType);
  return {
    makeMatch,
    takeMatch,
  };
}

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
): ParseOrdersSetFillEmitMatchClass {
  let leftOrderHashKey = LibOrderHashKey(orderLeft);
  let rightOrderHashKey = LibOrderHashKey(orderRight);

  if (orderLeft.maker == zeroAddress) {
    orderLeft.maker = msgSender;
  }
  if (orderRight.maker == zeroAddress) {
    orderRight.maker = msgSender;
  }

  let leftOrderData = LibOrderDataParse(orderLeft);
  let rightOrderData = LibOrderDataParse(orderRight);

  let newFill = setFillEmitMatch(
    orderLeft,
    orderRight,
    leftOrderHashKey,
    rightOrderHashKey,
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
  leftOrderHashKey: Bytes,
  rightOrderHashKey: Bytes,
  leftMakeFill: bool,
  rightMakeFill: bool,
): LibFillResult {
  let leftOrderFill = getOrderFill(orderLeft.salt, leftOrderHashKey);
  let rightOrderFill = getOrderFill(orderRight.salt, rightOrderHashKey);

  let newFill = fillOrder(orderLeft, orderRight, leftOrderFill, rightOrderFill, leftMakeFill, rightMakeFill);
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

function getOrderFill(salt: BigInt, hash: Bytes): BigInt {
  let fill = BIGINT_ZERO;
  if (salt == BIGINT_ZERO) {
    fill = BIGINT_ZERO;
  } else {
    fill = fills[hash];
  }
  return fill;
}

function LibOrderDataParse(order: LibOrder): LibOrderGenericData {
  let dataOrder = new LibOrderGenericData();
  if (getClass(order.dataType) == V1) {
    let data = getOriginFeeArray(Bytes.fromHexString(V1), order.data);
    dataOrder.payouts = data.payoutFeeArray;
    dataOrder.originFees = data.originFeeArray;
  } else if (getClass(order.dataType) == V2) {
    let data = getOriginFeeArray(Bytes.fromHexString(V2), order.data);
    dataOrder.payouts = data.payoutFeeArray;
    dataOrder.originFees = data.originFeeArray;
    dataOrder.isMakeFill = data.isMakeFill;
  } else if (order.dataType == LibOrderDataV3.V3_SELL) {
    LibOrderDataV3.DataV3_SELL memory data = LibOrderDataV3.decodeOrderDataV3_SELL(order.data);
    dataOrder.payouts = parsePayouts(data.payouts);
    dataOrder.originFees = parseOriginFeeData(data.originFeeFirst, data.originFeeSecond);
    dataOrder.isMakeFill = true;
    dataOrder.maxFeesBasePoint = data.maxFeesBasePoint;
  } else if (order.dataType == LibOrderDataV3.V3_BUY) {
    LibOrderDataV3.DataV3_BUY memory data = LibOrderDataV3.decodeOrderDataV3_BUY(order.data);
    dataOrder.payouts = parsePayouts(data.payouts);
    dataOrder.originFees = parseOriginFeeData(data.originFeeFirst, data.originFeeSecond);
    dataOrder.isMakeFill = false;
  } else if (order.dataType == 0xffffffff) {
  } else {
    revert("Unknown Order data type");
  }
  if (dataOrder.payouts.length == 0) {
    dataOrder.payouts = payoutSet(order.maker);
  }
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
  if (dataFirst > 0 && dataSecond > 0) {
    let originFee = new LibPart.Part[](2);

    originFee[0] = uintToLibPart(dataFirst);
    originFee[1] = uintToLibPart(dataSecond);
  }

  if (dataFirst > 0 && dataSecond == 0) {
    originFee = new LibPart.Part[](1);

    originFee[0] = uintToLibPart(dataFirst);
  }

  if (dataFirst == 0 && dataSecond > 0) {
    originFee = new LibPart.Part[](1);

    originFee[0] = uintToLibPart(dataSecond);
  }

  return originFee;
}

function parsePayouts(uint data) internal pure returns(LibPart.Part[] memory) {
  LibPart.Part[] memory payouts;

  if (data > 0) {
    payouts = new LibPart.Part[](1);
    payouts[0] = uintToLibPart(data);
  }

  return payouts;
}

/**
    @notice converts uint to LibPart.Part
    @param data address and value encoded in uint (first 12 bytes )
    @return result LibPart.Part 
 */
function uintToLibPart(data: BigInt): LibPart {
  if (data > BIGINT_ZERO) {
    result.account = payable(address(data));
    result.value = uint96(data >> 160);
  }
  return Result;
}

// function getDealData(bytes4 makeMatchAssetClass,
//   bytes4 takeMatchAssetClass,
//   bytes4 leftDataType,
//   bytes4 rightDataType,
//   LibOrderData.GenericOrderData memory leftOrderData,
//   LibOrderData.GenericOrderData memory rightOrderData): {

//   }