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
  // note: below tests were written only for debugging purposes

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

  // test("should be able to get royalties array data for 721 lazy", () => {
  //   // need to be able to use ethers.js in subgraph to decode the data or make some api call to do this
  //   let assetClass = Bytes.fromHexString("0xd8f960c1");
  //   const data = Bytes.fromHexString("0x000000000000000000000000744766422b025cd0c0ab267e2cd115883fc32bbc00000000000000000000000000000000000000000000000000000000000000401a51069fad4452e582f1e49784c217bcf78bd94e00000000000000000000002500000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000412f697066732f6261666b72656962757a326c7633643368696b726b626e3765656561716d3479376833656b696a73666e696b366e68616e6964706d6c7463346a750000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000001a51069fad4452e582f1e49784c217bcf78bd94e000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000010000000000000000000000001a51069fad4452e582f1e49784c217bcf78bd94e00000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000041298f7ab4dab11f9a2072bd440622d2d681c23f4d2071f4cbd9e324c3d73b03262151a3f3a5b2c8043e5029197992a60db23eeb34a45e5921e640a3de9add1c591b00000000000000000000000000000000000000000000000000000000000000");
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

  // test("should be able to get royalties array data for 1155 lazy", () => {
  //   // need to be able to use ethers.js in subgraph to decode the data or make some api call to do this
  //   let assetClass = Bytes.fromHexString("0x1cdfaa40");
  //   const data = Bytes.fromHexString("0x0000000000000000000000005d1bcdd029fe9b00271fa75110acebf5dcd69c8800000000000000000000000000000000000000000000000000000000000000409d383ac1546f0bbf78e23b5471ff0c28fe60b21100000000000000000000000100000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000457000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000412f697066732f6261666b7265696277717079686f75366b336b6362656a717864726e65663776796673376f76707069676f7033337070796e6764613767616f72750000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000009d383ac1546f0bbf78e23b5471ff0c28fe60b211000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000010000000000000000000000009d383ac1546f0bbf78e23b5471ff0c28fe60b2110000000000000000000000000000000000000000000000000000000000000ce4000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000041528ce7229cc4999e02b4f0731a5987913d41f4700e544558f672e0d46b47ed871d61099c8ae5368a735509b8c034fe6c196a987a45ce391db8d06008b1b782b61c00000000000000000000000000000000000000000000000000000000000000");
  //   let nftAssetType = new LibAssetType(
  //     assetClass,
  //     data,
  //   );
  //   const exchangeV2Address = Address.fromString("0x9757f2d2b135150bbeb65308d4a91804107cd8d6");
  //   const txnHash = Bytes.fromHexString("0x6935592bd645cc101ad91398195092550193c71477a386302452e6097d9fca12");
  //   let decoded1155LazyMintRoyalties = getRoyaltiesByAssetType(
  //     nftAssetType,
  //     exchangeV2Address,
  //     txnHash,
  //   );
  //   for (let i = 0; i < decoded1155LazyMintRoyalties.length; i++) {
  //     log.info("decoded1155LazyMintRoyalties: index {} address {} value {}", [i.toString(), decoded1155LazyMintRoyalties[i].address.toHexString(), decoded1155LazyMintRoyalties[i].value.toString()]);
  //   }
  //   assert.i32Equals(1, decoded1155LazyMintRoyalties.length);
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

  // test("Test Decoding Mint721Data", () => {
  //   const PREFIX = "0x000000000000000000000000000000000000000000000000000000000000002"
  //   let encodedBytes = Bytes.fromHexString(
  //     "0x000000000000000000000000c9154424b823b10579895ccbe442d41b9abd96ed00000000000000000000000000000000000000000000000000000000000000404b1bd82c5788cdd04891805420fb25b998f04a9000000000000000000000004800000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000342f697066732f516d5972774b507942736f634b7141644232547a6a51504548667a334a38676b6b647368445559636565725a594400000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000004b1bd82c5788cdd04891805420fb25b998f04a90000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000010000000000000000000000004b1bd82c5788cdd04891805420fb25b998f04a9000000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000411f0520c593dc4abdab59c4d98857aecb5c2044fa54c38457a9af73d4a92643b60f20f43770e9e4eee28c308cfa280051214e21e4d569f53a610e25e971d1987d1b00000000000000000000000000000000000000000000000000000000000000"
  //   )
  //   let addressRemoved = PREFIX + encodedBytes.toHexString().substring(129)
  //   log.debug("bytes {} ", [encodedBytes.toHexString()])
  //   log.debug("addressRemoved {} ", [addressRemoved])
  //   let decoded = ethereum.decode(
  //     "(uint256,string,(address,uint96)[],(address,uint96)[],bytes[])",
  //     Bytes.fromHexString(addressRemoved)
  //   )
  //   if (decoded != null) {
  //     let decodedTuple = decoded.toTuple()
  //     log.debug("decodedTuple.length {}", [decodedTuple.length.toString()])
  //     let tokenId = decodedTuple[0].toBigInt()
  //     let tokenURI = decodedTuple[1].toString()
  //     let creators = decodedTuple[2].toArray()
  //     for (let i = 0; i < creators.length; i++) {
  //       const creator = creators[i].toTuple()
  //       log.debug("creator account {}", [creator[0].toAddress().toHexString()])
  //       log.debug("creator value {}", [creator[1].toBigInt().toString()])
  //     }
  //     let royalties = decodedTuple[3].toArray()

  //     for (let i = 0; i < royalties.length; i++) {
  //       const royalty = royalties[i].toTuple()
  //       log.debug("royalty account {}", [royalty[0].toAddress().toHexString()])
  //       log.debug("royalty value {}", [royalty[1].toBigInt().toString()])
  //     }
  //     let signatures = decodedTuple[4].toArray()
  //     log.debug("tokenId {}", [tokenId.toString()])
  //     log.debug("tokenURI {}", [tokenURI.toString()])
  //     for (let i = 0; i < signatures.length; i++) {
  //       const signature = signatures[i]
  //       log.debug("signature {}", [signature.toBytes().toHexString()])
  //     }
  //   }
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