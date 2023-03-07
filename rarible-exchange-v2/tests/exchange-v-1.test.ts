import {
  describe,
  test,
  assert,
} from "matchstick-as/assembly/index"
import {
  Address,
  BigInt,
  Bytes,
  log,
} from "@graphprotocol/graph-ts";
import { decodeAsset, ERC721_LAZY, getRoyaltiesByAssetType, LibAsset, LibAssetType, LibOrder, LibOrderDataParse } from "../src/utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Test decoding for nft txn type", () => {
  // note: below tess were written only for debugging purposes

  test("should be able to decode ERC721_LAZY encoded data", () => {
    // prep decoding func input for 721 lazy mint txns
    const data = Bytes.fromHexString("0x000000000000000000000000021779e0124ddfdc7b0215071b50c174d6e4376f");
    const type = Bytes.fromHexString("0xd8f960c1");
    const txnHash = Bytes.fromHexString("0x0c6ce195e7cbac071ff28f5d1d7ce44dd3ced7ee9dc67c5efb29ae203f1252fe");
    // call decode function
    const asset = decodeAsset(
      data,
      type,
      txnHash
    );
    log.info("asset: address {} type {} bytes {}", [asset.address.toHexString(), asset.id.toString(), asset.assetClass.toString()]);
  })

  // test("should be able to get royalties array data", () => {
  //   let assetClass = Bytes.fromHexString("0xd8f960c1");
  //   const data = Bytes.fromHexString("0x000000000000000000000000c9154424b823b10579895ccbe442d41b9abd96ed00000000000000000000000000000000000000000000000000000000000000404b1bd82c5788cdd04891805420fb25b998f04a9000000000000000000000004800000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000342f697066732f516d5972774b507942736f634b7141644232547a6a51504548667a334a38676b6b647368445559636565725a594400000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000004b1bd82c5788cdd04891805420fb25b998f04a90000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000010000000000000000000000004b1bd82c5788cdd04891805420fb25b998f04a9000000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000411f0520c593dc4abdab59c4d98857aecb5c2044fa54c38457a9af73d4a92643b60f20f43770e9e4eee28c308cfa280051214e21e4d569f53a610e25e971d1987d1b00000000000000000000000000000000000000000000000000000000000000");
  //   let nftAssetType = new LibAssetType(
  //     assetClass,
  //     data,
  //   );
  //   const exchangeV2Address = Address.fromString("0x9757f2d2b135150bbeb65308d4a91804107cd8d6");
  //   const txnHash = Bytes.fromHexString("0x0061c42b5c653d330c90f5d4cd83b952b1e157a9d32a3394df20d13eb0eb9846");
  //   let decoded721LazyMintRoyalties = getRoyaltiesByAssetType(
  //     nftAssetType,
  //     exchangeV2Address,
  //     txnHash,
  //   );
  //   for (let i = 0; i < decoded721LazyMintRoyalties.length; i++) {
  //     log.info("decoded721LazyMintRoyalties: index {} address {} value {}", [i.toString(), decoded721LazyMintRoyalties[i].address.toHexString(), decoded721LazyMintRoyalties[i].value.toString()]);
  //   }
  //   assert.i32Equals(1, decoded721LazyMintRoyalties.length);
  // })

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
  //     Bytes.fromHexString("0x4c234266"),
  //     Bytes.fromHexString("0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
  //   );
  //   const txHash = Bytes.fromHexString("0x0c6ce195e7cbac071ff28f5d1d7ce44dd3ced7ee9dc67c5efb29ae203f1252fe");
  //   let parsedData = LibOrderDataParse(order, txHash);
  //   for (let i = 0; i < parsedData.originFees.length; i++) {
  //     log.info("origin: index {} address {} value {}", [i.toString(), parsedData.originFees[i].address.toHexString(), parsedData.originFees[i].value.toString()]);
  //   }
  //   for (let i = 0; i < parsedData.payouts.length; i++) {
  //     log.info("payouts: index {} address {} value {}", [i.toString(), parsedData.payouts[i].address.toHexString(), parsedData.payouts[i].value.toString()]);
  //   }
  //   assert.i32Equals(0, parsedData.originFees.length);
  //   assert.i32Equals(1, parsedData.payouts.length);
  // })
})
