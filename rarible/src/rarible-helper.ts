import {
  Address,
  BigInt,
  Bytes,
  ethereum,
  TypedMap,
} from "@graphprotocol/graph-ts";
import { log } from "@graphprotocol/graph-ts";
import { ERC1155 as ERC1155Metadata } from "../generated/ExchangeV2/ERC1155";
import { ERC721MetaData } from "../generated/ExchangeV2/ERC721MetaData";
export const ERC20 = "ERC20";
export const ETH = "ETH";
export const ERC721 = "ERC721";
export const ERC1155 = "ERC1155";
export const COLLECTION = "COLLECTION";
export const CRYPTOPUNKS = "CRYPTOPUNKS";
export const SPECIAL = "SPECIAL";

export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);
export const BIGINT_ZERO = BigInt.fromI32(0);

export const classMap = new TypedMap<string, string>();
classMap.set("0xaaaebeba", ETH);
classMap.set("0x8ae85d84", ERC20);
classMap.set("0x73ad2146", ERC721);
classMap.set("0x973bb640", ERC1155);
classMap.set("0xf63c2825", COLLECTION);
classMap.set("0x3e6b89d4", CRYPTOPUNKS);

export const V1 = "0x4c234266";
export const V2 = "0x23d235ef";

export function getExchange(dataType: Bytes): string {
  if (dataType.toHexString() == V1) {
    return "V2V1";
  } else if (dataType.toHexString() == V2) {
    return "V2V2";
  }
  return "";
}

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
  let asset = new Asset(ZERO_ADDRESS, BIGINT_ZERO, type);
  return asset;
}

export function getNFTType(nftAddress: Address): string {
  let erc721contract = ERC721MetaData.bind(nftAddress);
  let erc1155contract = ERC1155Metadata.bind(nftAddress);
  let supportsEIP721Identifier = erc721contract.try_supportsInterface(
    Bytes.fromByteArray(Bytes.fromHexString("0x80ac58cd"))
  );
  if (supportsEIP721Identifier.reverted) {
    return "";
  } else {
    if (supportsEIP721Identifier.value) {
      return "ERC721";
    }
  }
  let supportsERC1155Identifier = erc1155contract.try_supportsInterface(
    Bytes.fromByteArray(Bytes.fromHexString("0xd9b67a26"))
  );
  if (supportsERC1155Identifier.reverted) {
    return "";
  } else {
    if (supportsERC1155Identifier.value) {
      return "ERC1155";
    }
  }
  return "";
}

export function getOriginFees(exchangeType: Bytes, data: Bytes): BigInt {
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
        for (let i = 0; i < originFeeArray.length; i++) {
          let originFeeItem = originFeeArray[i].toTuple();
          originFee = originFee.plus(originFeeItem[1].toBigInt());
        }
        return originFee;
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
      for (let i = 0; i < originFeeArray.length; i++) {
        let originFeeItem = originFeeArray[i].toTuple();
        originFee = originFee.plus(originFeeItem[1].toBigInt());
      }
      return originFee;
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
      for (let i = 0; i < originFeeArray.length; i++) {
        let originFeeItem = originFeeArray[i].toTuple();
        originFee = originFee.plus(originFeeItem[1].toBigInt());
      }
      return originFee;
    }
  }
  log.error("Not V1/V2 data={}", [data.toHexString()]);
  return BIGINT_ZERO;
}
export function calculatedTotal(
  amt: BigInt,
  exchangeType: Bytes,
  data: Bytes
): BigInt {
  let originFees = getOriginFees(exchangeType, data);
  let calculatedFees = amt.times(originFees).div(BigInt.fromI32(10000));
  return amt.plus(calculatedFees);
}
