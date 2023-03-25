import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
    afterEach,
} from "matchstick-as/assembly/index"

import { BigInt, Address, Bytes, log } from "@graphprotocol/graph-ts"
import { handleOrderFulfilled } from "../src/seaport"
import {
    assertAirNftSaleRoyaltyExpectedResponse,
    assertAirNftTransactionExpectedResponse,
    convertObjectToEvent,
} from "./seaport-utils"
import {
    batchTransfer,
    singleNftOffer,
    multiEvent1,
    multiEvent2,
    multipleRoyalties1,
    multipleRoyalties2,
    offersToken,
    offersNFTAndToken1,
    offersNFTAndToken2,
    huge2,
    huge1,
    transferingWETHOnly1,
    transferingWETHOnly2,
    zeroBeneficiary,
} from "./example"
import * as airstack from "../modules/airstack/nft-marketplace"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
    afterEach(() => {
        clearStore()
    })

    // For more test scenarios, see:
    // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

    test("handling batchTransfer", () => {
        let fulFillEvent = convertObjectToEvent(batchTransfer)
        handleOrderFulfilled(fulFillEvent)
        let txHash = fulFillEvent.transaction.hash.toHexString()
        let txIndex = fulFillEvent.transaction.index
        // assertAirNftTransactionExpectedResponse(
        //     txIndex,
        //     "0x05fb51ae421bdd4a8d8d8357b16bc8db8c059f9f",
        //     "0x66f59e9a3329a9100fe59b487f71644f1849e480",
        //     txHash.toString(),
        //     "8977",
        //     "1",
        //     "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
        //     "0x0000000000000000000000000000000000000000",
        //     "2500000000000",
        //     "62500000000",
        //     "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
        //     true
        // )
        // assertAirNftSaleRoyaltyExpectedResponse(
        //     txIndex,
        //     "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
        //     "8977",
        //     txHash,
        //     "0x7d82c0fc40d417ef89870a2c08d1a3c6a1315703",
        //     "125000000000"
        // )
        // assertAirNftTransactionExpectedResponse(
        //     txIndex,
        //     "0x05fb51ae421bdd4a8d8d8357b16bc8db8c059f9f",
        //     "0x66f59e9a3329a9100fe59b487f71644f1849e480",
        //     txHash.toString(),
        //     "8976",
        //     "1",
        //     "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
        //     "0x0000000000000000000000000000000000000000",
        //     "2500000000000",
        //     "62500000000",
        //     "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
        //     true
        // )
        // assertAirNftSaleRoyaltyExpectedResponse(
        //     txIndex,
        //     "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
        //     "8976",
        //     txHash,
        //     "0x7d82c0fc40d417ef89870a2c08d1a3c6a1315703",
        //     "125000000000"
        // )
        // assertAirNftTransactionExpectedResponse(
        //     txIndex,
        //     "0x05fb51ae421bdd4a8d8d8357b16bc8db8c059f9f",
        //     "0x66f59e9a3329a9100fe59b487f71644f1849e480",
        //     txHash.toString(),
        //     "8974",
        //     "1",
        //     "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
        //     "0x0000000000000000000000000000000000000000",
        //     "2500000000000",
        //     "62500000000",
        //     "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
        //     true
        // )
        // assertAirNftSaleRoyaltyExpectedResponse(
        //     txIndex,
        //     "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
        //     "8974",
        //     txHash,
        //     "0x7d82c0fc40d417ef89870a2c08d1a3c6a1315703",
        //     "125000000000"
        // )
        // assertAirNftTransactionExpectedResponse(
        //     txIndex,
        //     "0x05fb51ae421bdd4a8d8d8357b16bc8db8c059f9f",
        //     "0x66f59e9a3329a9100fe59b487f71644f1849e480",
        //     txHash.toString(),
        //     "8975",
        //     "1",
        //     "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
        //     "0x0000000000000000000000000000000000000000",
        //     "2500000000000",
        //     "62500000000",
        //     "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
        //     true
        // )
        // assertAirNftSaleRoyaltyExpectedResponse(
        //     txIndex,
        //     "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
        //     "8975",
        //     txHash,
        //     "0x7d82c0fc40d417ef89870a2c08d1a3c6a1315703",
        //     "125000000000"
        // )
        // More assert options:
        // https://thegraph.com/docs/en/developer/matchstick/#asserts
    })
    test("handling singleNftOffer", () => {
        let fulFillEvent = convertObjectToEvent(singleNftOffer)
        let txHash = fulFillEvent.transaction.hash.toHexString()
        let txIndex = fulFillEvent.transaction.index
        handleOrderFulfilled(fulFillEvent)
        // assertAirNftTransactionExpectedResponse(
        //     txIndex,
        //     "0xa26edf96b6a921a9f4b2c961e3db573547a5d701",
        //     "0x39327ba65a22701d8563d9f3a7d001bd83f147d1",
        //     txHash.toString(),
        //     "73470577800278525308063113538359163815840392689226212689732198568968744599562",
        //     "1",
        //     "0xa604060890923ff400e8c6f5290461a83aedacec",
        //     "0x0000000000000000000000000000000000000000",
        //     "10000000000000000",
        //     "250000000000000",
        //     "0x0000a26b00c1f0df003000390027140000faa719",
        //     false
        // )
    })
    test("handling multiEvent1 & multiEvent2", () => {
        let multiEvent_1 = convertObjectToEvent(multiEvent1)
        handleOrderFulfilled(multiEvent_1)
        let multiEvent_2 = convertObjectToEvent(multiEvent2)
        handleOrderFulfilled(multiEvent_2)
        // let txHash = multiEvent_2.transaction.hash.toHexString()
        // let txIndex = multiEvent_2.transaction.index
        // assertAirNftTransactionExpectedResponse(
        //     txIndex,
        //     "0xaf3e4a9126729ba97da99df29ae7f7e53d1c4a1a",
        //     "0x7e8dbf5d60f93b91d2e59abd326840772bb073d8",
        //     txHash,
        //     "0",
        //     "1",
        //     "0x515dc98b0c660bdcb1ad656473907b4d1900ba1b",
        //     "0x6b175474e89094c44da98b954eedeac495271d0f",
        //     "5250000000000000000",
        //     "375000000000000000",
        //     "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
        //     false
        // )
    })
    test("handling multiEvent2 & multiEvent1", () => {
        let multiEvent_2 = convertObjectToEvent(multiEvent2)
        handleOrderFulfilled(multiEvent_2)
        let multiEvent_1 = convertObjectToEvent(multiEvent1)
        handleOrderFulfilled(multiEvent_1)
        // let txHash = multiEvent_1.transaction.hash.toHexString()
        // let txIndex = multiEvent_1.transaction.index
        // assertAirNftTransactionExpectedResponse(
        //     txIndex,
        //     "0xaf3e4a9126729ba97da99df29ae7f7e53d1c4a1a",
        //     "0x7e8dbf5d60f93b91d2e59abd326840772bb073d8",
        //     txHash,
        //     "0",
        //     "1",
        //     "0x515dc98b0c660bdcb1ad656473907b4d1900ba1b",
        //     "0x6b175474e89094c44da98b954eedeac495271d0f",
        //     "5250000000000000000",
        //     "375000000000000000",
        //     "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
        //     false
        // )
    })
    test("handling multipleRoyalties1 & multipleRoyalties1", () => {
        let multipleRoyalties1_event = convertObjectToEvent(multipleRoyalties1)
        handleOrderFulfilled(multipleRoyalties1_event)
        let multipleRoyalties2_event = convertObjectToEvent(multipleRoyalties2)
        handleOrderFulfilled(multipleRoyalties2_event)
        let txHash = multipleRoyalties2_event.transaction.hash.toHexString()
        let txIndex = multipleRoyalties2_event.transaction.index
        //     assertAirNftTransactionExpectedResponse(
        //         txIndex,
        //         "0xc1ef02f7b0d81fb5c55d6097c18b4d6592184b64",
        //         "0xd91095ec5a892a1b7e42030f01868e86ef0fd935",
        //         txHash,
        //         "2243",
        //         "1",
        //         "0xb18380485f7ba9c23deb729bedd3a3499dbd4449",
        //         "0x0000000000000000000000000000000000000000",
        //         "82000000000000000",
        //         "2050000000000000",
        //         "0x0000a26b00c1f0df003000390027140000faa719",
        //         false
        //     )
        //     assertAirNftSaleRoyaltyExpectedResponse(
        //         txIndex,
        //         "0xb18380485f7ba9c23deb729bedd3a3499dbd4449",
        //         "2243",
        //         txHash,
        //         "0xa394070c35090b57342b3064c6ba7f4082eba122",
        //         "4100000000000000"
        //     )
    })
    test("handling case where event offers token", () => {
        let offersToken_event = convertObjectToEvent(offersToken)
        handleOrderFulfilled(offersToken_event)
        let txHash = offersToken_event.transaction.hash.toHexString()
        let txIndex = offersToken_event.transaction.index
        //     assertAirNftTransactionExpectedResponse(
        //         txIndex,
        //         "0xf5a48858f6895674c3937bd059d4b0a4ea0a63c6",
        //         "0x3b52ad533687ce908ba0485ac177c5fb42972962",
        //         txHash,
        //         "30",
        //         "1",
        //         "0x3f53082981815ed8142384edb1311025ca750ef1",
        //         "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        //         "100000",
        //         "2500",
        //         "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
        //         false
        // )
    })
    test("handling case where offer has nft and token & triggered by someone else", () => {
        let event1 = convertObjectToEvent(offersNFTAndToken1)
        handleOrderFulfilled(event1)
        let event2 = convertObjectToEvent(offersNFTAndToken2)
        handleOrderFulfilled(event2)
        let txHash = event2.transaction.hash.toHexString()
        let txIndex = event2.transaction.index
        // assertAirNftTransactionExpectedResponse(
        //     txIndex,
        //     "0xc515af393e0eb6bc05c0071361cb027fd89bfa33",
        //     "0x7c8af8638248586d3ba775c8a4178f59ef993d05",
        //     txHash,
        //     "1429",
        //     "1",
        //     "0xc99c679c50033bbc5321eb88752e89a93e9e83c5",
        //     "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        //     "40457500000000000",
        //     "0",
        //     "0x0000000000000000000000000000000000000000",
        //     false
        // )
    })
    test("handling huge number of nft transactions in a txn", () => {
        let event1 = convertObjectToEvent(huge1)
        handleOrderFulfilled(event1)
        let event2 = convertObjectToEvent(huge2)
        handleOrderFulfilled(event2)
        let txHash = event2.transaction.hash.toHexString()
        let txIndex = event2.transaction.index
        // for (let i = 0; i < huge1.offer.length; i++) {
        //     assertAirNftTransactionExpectedResponse(
        //         txIndex,
        //         "0x9b6cd0ff5789748aa352a9257c13be99126f3fb2",
        //         "0xc858598bed0b11098c917cbf9fd3e0f435bab303",
        //         txHash,
        //         huge1.offer[i].identifier,
        //         "1",
        //         huge1.offer[i].token,
        //         "0x0000000000000000000000000000000000000000",
        //         "0",
        //         "0",
        //         "0x0000000000000000000000000000000000000000",
        //         true
        //     )
        // }
    })
    test("handling transaction without NFT", () => {
        let event1 = convertObjectToEvent(transferingWETHOnly1)
        handleOrderFulfilled(event1)
        let event2 = convertObjectToEvent(transferingWETHOnly2)
        handleOrderFulfilled(event2)
    })
    test("handling no beneficiary case ", () => {
        let zbEvent = convertObjectToEvent(zeroBeneficiary)
        handleOrderFulfilled(zbEvent)
        let txHash = zbEvent.transaction.hash.toHexString()
        let txIndex = zbEvent.transaction.index
        // assertAirNftTransactionExpectedResponse(
        //     txIndex,
        //     "0xaa6e633be7fe76331b67fa4a897f803d79fe53b3",
        //     "0xd2f86cbed86db85c859903ff5f110b15d95b1350",
        //     txHash,
        //     "183",
        //     "1",
        //     "0xa2830b0519ab246a52a85ba09cf0f11f36b105db",
        //     "0x0000000000000000000000000000000000000000",
        //     "150000000000000000",
        //     "3750000000000000",
        //     "0x0000a26b00c1f0df003000390027140000faa719",
        //     false
        // )
        // assertAirNftSaleRoyaltyExpectedResponse(
        //     txIndex,
        //     "0xa2830b0519ab246a52a85ba09cf0f11f36b105db",
        //     "183",
        //     txHash,
        //     "0x0000000000000000000000000000000000000000",
        //     "15000000000000000"
        // )
    })
})
