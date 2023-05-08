import { describe, test, clearStore, beforeEach } from "matchstick-as/assembly/index"

import { getOrdersMatched } from "./utils"
import { expectedOutput1, sample1 } from "./example"
import { handleOrdersMatched } from "../src/blur-exchange"
import { assertMarketPlaceOutput } from "./test-utils"
// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
    beforeEach(() => {
        clearStore()
    })
    test("test handleOrdersMatched", () => {
        let orderMatchedEvent = getOrdersMatched(sample1)
        handleOrdersMatched(orderMatchedEvent)
        // asserting AirNftTransaction
        assertMarketPlaceOutput(expectedOutput1)
    })
})
