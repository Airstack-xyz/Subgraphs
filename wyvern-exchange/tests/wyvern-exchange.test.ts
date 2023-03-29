import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
} from "matchstick-as/assembly/index"
import { Address, BigDecimal, BigInt, Bytes, log } from "@graphprotocol/graph-ts"

import { batchInSingle, batchTransfer, sample1, sharedStorefront } from "./example"
import { AtomicMatchInput } from "./types"
import * as airstack from "../modules/airstack/nft-marketplace"
import { atomicMatch } from "../src/wyvern-exchange"
export function callAtomicMatch(
    hash: string,
    blockTimeStamp: BigInt,
    input: AtomicMatchInput
): airstack.nft.Sale {
    return atomicMatch(
        hash,
        blockTimeStamp,
        input.addrs,
        input.uints,
        input.feeMethodsSidesKindsHowToCalls,
        input.calldataBuy,
        input.calldataSell,
        input.replacementPatternBuy,
        input.replacementPatternSell,
        input.staticExtradataBuy,
        input.staticExtradataSell,
        input.vs,
        input.rssMetadata
    )
}

describe("Describe entity assertions", () => {
    test("should handle CheckMatchERC1155UsingCriteria case", () => {
        let sample = new AtomicMatchInput(sample1)
        let hash = "0x00726bb566eea40542346f2bef251729de2468f0ee2993cf000cd06993b04af5"
        let blockTimeStamp = BigInt.fromString("1659294740")
        callAtomicMatch(hash, blockTimeStamp, sample)
    })
    test("should handle batch transfer in single case", () => {
        let sample = new AtomicMatchInput(batchInSingle)
        let hash = "0x1c7b53bffbbae31380d4e53ee31825d97fbcded698c8a0d5004bba3a36d3035b"
        let blockTimeStamp = BigInt.fromString("1659274589")
        callAtomicMatch(hash, blockTimeStamp, sample)
    })
    test("should handle sharedStorefront case", () => {
        let sample = new AtomicMatchInput(sharedStorefront)
        let hash = "0x02694067af289079289648b1706510c9a521637c28cf476f1eeeaef440b610d0"
        let blockTimeStamp = BigInt.fromString("1623211679")
        callAtomicMatch(hash, blockTimeStamp, sample)
    })
    test("should handle batch case", () => {
        let sample = new AtomicMatchInput(batchTransfer)
        let hash = "0xa5b0b2d7773741598016e877dc351e7956605ce22c07c5a1675648409608b4f8"
        let blockTimeStamp = BigInt.fromString("1659353957")
        let sale = callAtomicMatch(hash, blockTimeStamp, sample)
    })
})
