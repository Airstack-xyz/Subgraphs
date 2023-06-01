import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
} from "matchstick-as/assembly/index"
import { Address, BigDecimal, BigInt, Bytes, log } from "@graphprotocol/graph-ts"

import {
    batchInSingle,
    batchTransfer,
    noPayment,
    phishing,
    safeTransferFromWithBytes,
    sample1,
    sharedStorefront,
    tokenAmountGt1,
} from "./example"
import { AtomicMatchInput } from "./types"
import * as airstack from "../modules/airstack/nft-marketplace"
import { atomicMatch } from "../src/wyvern-exchange"
export function callAtomicMatch(
    hash: string,
    blockTimeStamp: BigInt,
    input: AtomicMatchInput
): airstack.nft.Sale | null {
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
        let sale = callAtomicMatch(hash, blockTimeStamp, sample)

        let expectedNfts: airstack.nft.NFT[] = []
        let expectedNFT1 = new airstack.nft.NFT(
            Address.fromString("0x045Ec645aBB6b768206B079cdDb59677cDb071A5"),
            BigInt.fromString("2"),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT1)
        let expectedSale = new airstack.nft.Sale(
            Address.fromString("0x30559Da92dCAf2786aFcc71541B46DD292d274b5"),
            Address.fromString("0x2eBCd2b0872DF5447386Ea0e58F6A5B4296eE63F"),
            expectedNfts,
            BigInt.fromString("20000000000000000"),
            Address.zero(),
            BigInt.fromString("500000000000000"),
            Address.fromString("0x5b3256965e7c3cf26e11fcaf296dfc8807c01073"),
            []
        )
        assert.assertNotNull(sale)
        if (sale != null) {
            checkSaledata(sale, expectedSale)
        }
    })
    test("should handle batch transfer in single case", () => {
        let sample = new AtomicMatchInput(batchInSingle)
        let hash = "0x1c7b53bffbbae31380d4e53ee31825d97fbcded698c8a0d5004bba3a36d3035b"
        let blockTimeStamp = BigInt.fromString("1659274589")
        let sale = callAtomicMatch(hash, blockTimeStamp, sample)

        let expectedNfts: airstack.nft.NFT[] = []
        let expectedNFT1 = new airstack.nft.NFT(
            Address.fromString("0x366E3B64Ef9060EB4B2B0908d7cD165C26312A23"),
            BigInt.fromString("1445"),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT1)

        let expectedNFT2 = new airstack.nft.NFT(
            Address.fromString("0x9f35425c2ef3616dd024d866082e0b61023fbfe1"),
            BigInt.fromString("3017"),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT2)
        let expectedNFT3 = new airstack.nft.NFT(
            Address.fromString("0xF80bd8c7f0f68CCF76E638Edb53fDB922e05295c"),
            BigInt.fromString("7220"),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT3)

        let expectedSale = new airstack.nft.Sale(
            Address.fromString("0x252C0fDa7d557a5cB80FAD0A31218CAa8f805C34"),
            Address.fromString("0xbE71E51ea3A288278302a1541119242f41a2B7Ff"),
            expectedNfts,
            BigInt.fromString("0"),
            Address.zero(),
            BigInt.fromString("0"),
            Address.fromString("0x5b3256965e7c3cf26e11fcaf296dfc8807c01073"),
            []
        )
        assert.assertNotNull(sale)
        if (sale != null) {
            checkSaledata(sale, expectedSale)
        }
    })
    test("should handle sharedStorefront case", () => {
        let sample = new AtomicMatchInput(sharedStorefront)
        let hash = "0x02694067af289079289648b1706510c9a521637c28cf476f1eeeaef440b610d0"
        let blockTimeStamp = BigInt.fromString("1623211679")
        let sale = callAtomicMatch(hash, blockTimeStamp, sample)
        let expectedNfts: airstack.nft.NFT[] = []
        let expectedNFT1 = new airstack.nft.NFT(
            Address.fromString("0x5fbef9fcb449d56154980e52e165d9650b9f6ec2"),
            BigInt.fromString(
                "34923513782120467435984595847068866881775186546998211107474682676588369129455"
            ),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT1)
        let expectedSale = new airstack.nft.Sale(
            Address.fromString("0x72BFb4d1Ae160552B44F9c99Ff56d9311b5941f4"),
            Address.fromString("0x1b532293e000C53761b7aF98255fC66EF5dF750C"),
            expectedNfts,
            BigInt.fromString("0"),
            Address.zero(),
            BigInt.fromString("0"),
            Address.fromString("0xb4e7843ebf4e9e4bb618627d6f7697096ae1be7a"),
            []
        )
        assert.assertNotNull(sale)
        if (sale != null) {
            checkSaledata(sale, expectedSale)
        }
    })
    test("should handle batch case", () => {
        let sample = new AtomicMatchInput(batchTransfer)
        let hash = "0xa5b0b2d7773741598016e877dc351e7956605ce22c07c5a1675648409608b4f8"
        let blockTimeStamp = BigInt.fromString("1659353957")
        let sale = callAtomicMatch(hash, blockTimeStamp, sample)
        let expectedNfts: airstack.nft.NFT[] = []
        let expectedNFT1 = new airstack.nft.NFT(
            Address.fromString("0x495f947276749ce646f68ac8c248420045cb7b5e"),
            BigInt.fromString(
                "17854310454196282035870592841598074249268846845716858963664664195636899348481"
            ),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT1)
        let expectedNFT2 = new airstack.nft.NFT(
            Address.fromString("0x495f947276749ce646f68ac8c248420045cb7b5e"),
            BigInt.fromString(
                "17854310454196282035870592841598074249268846845716858963664664196736410976257"
            ),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT2)
        let expectedNFT3 = new airstack.nft.NFT(
            Address.fromString("0x495f947276749ce646f68ac8c248420045cb7b5e"),
            BigInt.fromString(
                "17854310454196282035870592841598074249268846845716858963664664197835922604033"
            ),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT3)
        let expectedNFT4 = new airstack.nft.NFT(
            Address.fromString("0x495f947276749ce646f68ac8c248420045cb7b5e"),
            BigInt.fromString(
                "17854310454196282035870592841598074249268846845716858963664664198935434231809"
            ),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT4)
        let expectedNFT5 = new airstack.nft.NFT(
            Address.fromString("0x495f947276749ce646f68ac8c248420045cb7b5e"),
            BigInt.fromString(
                "17854310454196282035870592841598074249268846845716858963664664200034945859585"
            ),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT5)
        let expectedSale = new airstack.nft.Sale(
            Address.fromString("0x2De69A20482210f50E7C754D635e2d3E18CcE28a"),
            Address.fromString("0x27792E7d87a5f05334B52C0584Ad8497852aEf8B"),
            expectedNfts,
            BigInt.fromString("0"),
            Address.zero(),
            BigInt.fromString("0"),
            Address.fromString("0x5b3256965e7C3cF26E11FCAf296DfC8807C01073"),
            []
        )
        assert.assertNotNull(sale)
        if (sale != null) {
            checkSaledata(sale, expectedSale)
        }
    })
    test("should handle tokenAmountGt1 case", () => {
        let sample = new AtomicMatchInput(tokenAmountGt1)
        let hash = "0x00008f324bf193b214a701d5321ca3e493f638936ca48bdf095a61dacbf77bbc"
        let blockTimeStamp = BigInt.fromString("1644856231")
        let sale = callAtomicMatch(hash, blockTimeStamp, sample)
        let expectedNfts: airstack.nft.NFT[] = []
        let expectedNFT1 = new airstack.nft.NFT(
            Address.fromString("0x5079FC4e96338be1B5aff236ff4b00eC4452B2D3"),
            BigInt.fromString("1"),
            BigInt.fromString("4")
        )
        expectedNfts.push(expectedNFT1)
        let expectedSale = new airstack.nft.Sale(
            Address.fromString("0x6A95931f9E0FF1810B5A04BE3f1c29152209b482"),
            Address.fromString("0x235E14F5cDe92a098D9B38a3f3ac07E7058cD40c"),
            expectedNfts,
            BigInt.fromString("1760000000000000000"),
            Address.zero(),
            BigInt.fromString("132000000000000000"),
            Address.fromString("0x5b3256965e7C3cF26E11FCAf296DfC8807C01073"),
            []
        )
        assert.assertNotNull(sale)
        if (sale != null) {
            checkSaledata(sale, expectedSale)
        }
    })
    test("should handle safeTransferFromWithBytes case with BundleSale", () => {
        let sample = new AtomicMatchInput(safeTransferFromWithBytes)
        let hash = "0x7deac5070dfd74998bc5059db3e602167433fea6b620e13dad2ff73ac4236e2a"
        let blockTimeStamp = BigInt.fromString("13773433")
        let sale = callAtomicMatch(hash, blockTimeStamp, sample)
        let expectedNfts: airstack.nft.NFT[] = []
        let expectedNFT1 = new airstack.nft.NFT(
            Address.fromString("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"),
            BigInt.fromString("8167"),
            BigInt.fromString("1")
        )
        let expectedNFT2 = new airstack.nft.NFT(
            Address.fromString("0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e"),
            BigInt.fromString("2779"),
            BigInt.fromString("1")
        )
        expectedNfts.push(expectedNFT1)
        expectedNfts.push(expectedNFT2)
        let expectedSale = new airstack.nft.Sale(
            Address.fromString("0x3baec890358f50f0d173101829b63c3033d790be"),
            Address.fromString("0xb3169e54c6994609aa42377d2525168ac958f3ff"),
            expectedNfts,
            BigInt.fromString("10000000"),
            Address.zero(),
            BigInt.fromString("750000"),
            Address.fromString("0x5b3256965e7C3cF26E11FCAf296DfC8807C01073"),
            []
        )
        assert.assertNotNull(sale)
        if (sale != null) {
            checkSaledata(sale, expectedSale)
        }
    })

    test("should handle Phishing case", () => {
        let sample = new AtomicMatchInput(phishing)
        let hash = "0x337a707baaa15f3aa4004f0a2c9b5dcf38efc5c00fe162b27787409097cf20f8"
        let blockTimeStamp = BigInt.fromString("14238192")
        let sale = callAtomicMatch(hash, blockTimeStamp, sample)
        assert.assertNull(sale)
    })
    test("should handle case without payment", () => {
        let sample = new AtomicMatchInput(noPayment)
        let hash = "0x337a707baaa15f3aa4004f0a2c9b5dcf38efc5c00fe162b27787409097cf20f8"
        let blockTimeStamp = BigInt.fromString("14238192")
        let sale = callAtomicMatch(hash, blockTimeStamp, sample)
        assert.assertNull(sale)
    })
})

function checkSaledata(sale: airstack.nft.Sale, expectedSale: airstack.nft.Sale): void {
    assert.addressEquals(sale.buyer, expectedSale.buyer)
    assert.addressEquals(sale.seller, expectedSale.seller)
    assert.addressEquals(sale.paymentToken, expectedSale.paymentToken)
    assert.addressEquals(sale.protocolFeesBeneficiary, expectedSale.protocolFeesBeneficiary)
    assert.bigIntEquals(sale.paymentAmount, expectedSale.paymentAmount)
    assert.bigIntEquals(sale.protocolFees, expectedSale.protocolFees)
    if (expectedSale.nfts.length == 0) {
        throw new Error("expectedSale.nfts.length is zero")
    }
    for (let i = 0; i < expectedSale.nfts.length; i++) {
        const nft = sale.nfts[i]
        const expectedNft = expectedSale.nfts[i]
        assert.addressEquals(nft.collection, expectedNft.collection)
        assert.bigIntEquals(nft.tokenId, expectedNft.tokenId)
        assert.bigIntEquals(nft.amount, expectedNft.amount)
    }
}
