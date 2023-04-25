import { assert } from "matchstick-as"
import { ExpectedOutput } from "./example"
import { Address } from "@graphprotocol/graph-ts"
const chainIdPrefix = "1-"
export function assertMarketPlaceOutput(expected: ExpectedOutput): void {
  let txId = chainIdPrefix
    .concat(expected.hash)
    .concat("-")
    .concat("1")
  assert.fieldEquals("AirNftTransaction", txId, "from", chainIdPrefix.concat(expected.from.address))
  assert.fieldEquals("AirNftTransaction", txId, "to", chainIdPrefix.concat(expected.to.address))
  assert.fieldEquals("AirNftTransaction", txId, "hash", expected.hash)
  let nftsArr: string[] = []
  for (let i = 0; i < expected.nfts.length; i++) {
    const nft = expected.nfts[i]
    nftsArr.push(
      chainIdPrefix
        .concat(expected.hash)
        .concat("-")
        .concat(chainIdPrefix)
        .concat(nft.tokenAddress.address)
        .concat("-")
        .concat(nft.tokenId)
    )
  }
  assert.fieldEquals("AirNftTransaction", txId, "nfts", `[${nftsArr}]`)
  assert.fieldEquals(
    "AirNftTransaction",
    txId,
    "feeBeneficiary",
    chainIdPrefix.concat(Address.zero().toHexString())
  )
  assert.fieldEquals("AirNftTransaction", txId, "feeAmount", "0")
  assert.fieldEquals("AirNftTransaction", txId, "feeAmount", "0")
  assert.fieldEquals("AirNftTransaction", txId, "paymentAmount", expected.paymentAmount)
  assert.fieldEquals(
    "AirNftTransaction",
    txId,
    "paymentToken",
    chainIdPrefix.concat(expected.paymentToken.address)
  )
  assert.entityCount("AirNftSaleRoyalty", expected.royalties.length)
  for (let i = 0; i < expected.royalties.length; i++) {
    const royalty = expected.royalties[i]
    //   asserting royalties
    assert.fieldEquals(
      "AirNftSaleRoyalty",
      txId
        .concat("-")
        .concat(royalty.beneficiary.address)
        .concat("-")
        .concat(royalty.amount),
      "beneficiary",
      chainIdPrefix.concat(royalty.beneficiary.address)
    )
    assert.fieldEquals(
      "AirNftSaleRoyalty",
      txId
        .concat("-")
        .concat(royalty.beneficiary.address)
        .concat("-")
        .concat(royalty.amount),
      "amount",
      royalty.amount
    )
  }
}
