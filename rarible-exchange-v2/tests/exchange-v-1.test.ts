import {
  describe,
  test,
  assert,
} from "matchstick-as/assembly/index"
import {
  Address,
  BigInt,
  Bytes,
  ethereum,
  crypto,
  log,
  Value,
} from "@graphprotocol/graph-ts";
import { BIGINT_ZERO, decodeAsset, ERC721_LAZY, getRoyaltiesByAssetType, LibAsset, LibAssetType, LibOrder, LibOrderDataParse, convertAssetToLibAsset } from "../src/utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Test decoding for nft txn type", () => {
  // note: below tess were written only for debugging purposes

  // test("should be able to decode ERC721_LAZY encoded data", () => {
  //   // prep decoding func input for 721 lazy mint txns //need decode signature for this to work
  //   const data = Bytes.fromHexString("0x000000000000000000000000021779e0124ddfdc7b0215071b50c174d6e4376f");
  //   const type = Bytes.fromHexString("0xa8c6716e");
  //   const txnHash = Bytes.fromHexString("0x0061c42b5c653d330c90f5d4cd83b952b1e157a9d32a3394df20d13eb0eb9846");
  //   // call decode function
  //   const asset = decodeAsset(
  //     data,
  //     type,
  //     txnHash
  //   );
  //   // assert.bigIntEquals(asset.id, BigInt.fromString("110449601212866956133230113711357141837340681677522603848188100401869494846582"));
  //   log.info("asset: address {} id {} bytes {}", [asset.address.toHexString(), asset.id.toString(), asset.assetClass.toString()]);
  // })

  test("should be able to get royalties array data for 721 and 1155 lazy", () => {
    // need to be able to use ethers.js in subgraph to decode the data or make some api call to do this
    let assetClass = Bytes.fromHexString("0xd8f960c1");
    const data = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000b262d7a005b23065cb10656810a542635dbc4c8a000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000010000000000000000000000001cf0df2a5a20cd61d68d4489eebbf85b8d39e18a00000000000000000000000000000000000000000000000000000000000000fa");
    let nftAssetType = new LibAssetType(
      assetClass,
      data,
    );
    const exchangeV2Address = Address.fromString("0x9757f2d2b135150bbeb65308d4a91804107cd8d6");
    const txnHash = Bytes.fromHexString("0x0061c42b5c653d330c90f5d4cd83b952b1e157a9d32a3394df20d13eb0eb9846");
    let decoded721LazyMintRoyalties = getRoyaltiesByAssetType(
      nftAssetType,
      exchangeV2Address,
      txnHash,
    );
    for (let i = 0; i < decoded721LazyMintRoyalties.length; i++) {
      log.info("decoded721LazyMintRoyalties: index {} address {} value {}", [i.toString(), decoded721LazyMintRoyalties[i].address.toHexString(), decoded721LazyMintRoyalties[i].value.toString()]);
    }
    assert.i32Equals(1, decoded721LazyMintRoyalties.length);
  })

  // test("should be able to get origin and payouts array data", () => {
  //   const order = new LibOrder(
  //     Address.fromString("0x7451434DEe96dd4E6970C35aEf14173E25D13e60"),
  //     new LibAsset(
  //       new LibAssetType(
  //         Bytes.fromHexString("0xa8c6716e"), //unknown asset type
  //         Bytes.fromHexString("0x000000000000000000000000021779e0124ddfdc7b0215071b50c174d6e4376f")
  //       ),
  //       BigInt.fromString("9750")
  //     ),
  //     Address.fromString("0x0000000000000000000000000000000000000000"),
  //     new LibAsset(
  //       new LibAssetType(
  //         Bytes.fromHexString("0xaaaebeba"),
  //         Bytes.fromHexString("0x")
  //       ),
  //       BigInt.fromString("1950000000000000000000")
  //     ),
  //     BigInt.fromString("984710"),
  //     BigInt.fromString("1650982650"),
  //     BigInt.fromString("0"),
  //     Bytes.fromHexString("0x23d235ef"),
  //     Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000001cf0df2a5a20cd61d68d4489eebbf85b8d39e18a00000000000000000000000000000000000000000000000000000000000000fa")
  //   );
  //   const txHash = Bytes.fromHexString("0x0061c42b5c653d330c90f5d4cd83b952b1e157a9d32a3394df20d13eb0eb9846");
  //   let parsedData = LibOrderDataParse(order, txHash);
  //   for (let i = 0; i < parsedData.originFees.length; i++) {
  //     log.info("origin: index {} address {} value {}", [i.toString(), parsedData.originFees[i].address.toHexString(), parsedData.originFees[i].value.toString()]);
  //   }
  //   for (let i = 0; i < parsedData.payouts.length; i++) {
  //     log.info("payouts: index {} address {} value {}", [i.toString(), parsedData.payouts[i].address.toHexString(), parsedData.payouts[i].value.toString()]);
  //   }
  //   log.info("ismakefill {}", [parsedData.isMakeFill.toString()]);
  //   assert.i32Equals(1, parsedData.originFees.length);
  //   assert.i32Equals(1, parsedData.payouts.length);
  // })

  // test("generate tokenid from random function", () => {
  //   const seed = BigInt.fromString("0");
  //   const supply = BigInt.fromString("12");
  //   const to = Address.fromString("0x67f3d16a91991cf169920f1e79f78e66708da328");
  //   const blockTimestamp = BigInt.fromString("1651076602");
  //   const blockNumber = BigInt.fromString("14667563");
  //   const blockDifficulty = BigInt.fromString("13466652186642414");

  //   const tokenId = random(seed, blockTimestamp, blockNumber, blockDifficulty, supply, to);
  //   log.info("randomly generated tokenId {}", [tokenId.toString()]);
  // })
})

function random(seed: BigInt, blockTimestamp: BigInt, blockNumber: BigInt, blockDifficulty: BigInt, supply: BigInt, to: Address): BigInt {
  const ethArray = new Array<ethereum.Value>();
  ethArray.push(ethereum.Value.fromSignedBigInt(seed));
  ethArray.push(ethereum.Value.fromSignedBigInt(blockTimestamp));
  ethArray.push(ethereum.Value.fromSignedBigInt(blockNumber));
  ethArray.push(ethereum.Value.fromSignedBigInt(blockDifficulty));
  ethArray.push(ethereum.Value.fromSignedBigInt(supply));
  ethArray.push(ethereum.Value.fromAddress(to));

  const ethTuple = changetype<ethereum.Tuple>(ethArray);

  let encoded = ethereum.encode(
    ethereum.Value.fromTuple(ethTuple)
  );

  if (encoded) {
    let keccackHash = crypto.keccak256(encoded);
    return BigInt.fromByteArray(keccackHash);
  }
  return BigInt.fromString("0");
  // second approach would be to listen to the GenArtMint function, map it to a txn hash and then assign tokenid from that evnet to the call processed data
}