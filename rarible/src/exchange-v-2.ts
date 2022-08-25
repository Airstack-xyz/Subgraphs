import { Match as MatchEvent } from "../generated/ExchangeV2/ExchangeV2";
import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  ethereum,
  TypedMap,
} from "@graphprotocol/graph-ts";
import {
  classMap,
  ERC20,
  ERC721,
  ERC1155,
  ETH,
  getClass,
  getDecodedAddress,
} from "./rarible-helper";
import * as airstack from "./modules/airstack";

export function handleMatch(event: MatchEvent): void {
  let leftClass = getClass(event.params.leftAsset.assetClass);
  let leftAddress = getDecodedAddress(event.params.leftAsset.data);
  let leftId: BigInt;
  if (leftClass == ERC721 || leftClass == ERC1155) {
    let decoded = ethereum.decode(
      "(address,uint256)",
      event.params.leftAsset.data
    );
    if (decoded) {
      let decodedTuple = decoded.toTuple();
      leftId = decodedTuple[1].toBigInt();
    }
  } else if (leftClass == null) {
    let decoded = ethereum.decode(
      "(address,uint256,uint256)",
      event.params.leftAsset.data
    );
    if (decoded) {
      let decodedTuple = decoded.toTuple();
      leftId = decodedTuple[2].toBigInt();
    }
  }

  let rightClass = getClass(event.params.rightAsset.assetClass);

  let rightAddress = getDecodedAddress(event.params.rightAsset.data);
  let rightId = BigInt.fromI32(0);
  if (rightClass == ERC721 || rightClass == ERC1155) {
    let decoded = ethereum.decode(
      "(address,uint256)",
      event.params.rightAsset.data
    );
    if (decoded) {
      let decodedTuple = decoded.toTuple();
      rightId = decodedTuple[1].toBigInt();
    }
  } else if (rightClass == null) {
    let decoded = ethereum.decode(
      "(address,uint256,uint256)",
      event.params.rightAsset.data
    );
    if (decoded) {
      let decodedTuple = decoded.toTuple();
      rightId = decodedTuple[2].toBigInt();
    }
  }
  if (leftClass == ERC20 || leftClass == ETH) {
    // left is the buyer
    airstack.nft.trackNFTSaleTransactions(
      event.transaction.hash.toHexString(),
      [event.params.rightMaker],
      [event.params.leftMaker],
      [rightAddress],
      [rightId],
      leftAddress,
      event.params.newRightFill,
      event.block.timestamp
    );
  }
}
