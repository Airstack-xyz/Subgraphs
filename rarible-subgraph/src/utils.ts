import {
  Address,
  BigInt,
  Bytes,
  ethereum,
  log,
  TypedMap,
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
  originFees: LibPart;
  proxy: Address;
  from: Address;
}

class LibAssetType {
  assetClass: Bytes;
  assetData: Bytes;
}

class LibAsset {
  assetType: LibAssetType;
  value: BigInt;
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



// function getDealData(bytes4 makeMatchAssetClass,
//   bytes4 takeMatchAssetClass,
//   bytes4 leftDataType,
//   bytes4 rightDataType,
//   LibOrderData.GenericOrderData memory leftOrderData,
//   LibOrderData.GenericOrderData memory rightOrderData): {

//   }