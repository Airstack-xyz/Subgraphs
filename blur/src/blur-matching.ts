import { Address, log } from "@graphprotocol/graph-ts"
import {
    OrdersMatchedBuyStruct,
    OrdersMatchedSellStruct,
} from "../generated/BlurExchange/BlurExchange"
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common"
import { OrderDetails } from "./blur-utils"

export namespace StandardPolicyERC721 {
    export const addresses = [
        "0x00000000006411739da1c40b106f8511de5d1fac",
        "0x0000000000dab4a563819e8fd93dba3b25bc3495",
    ]
    export function canMatchMakerAsk(
        makerAsk: OrdersMatchedSellStruct,
        takerBid: OrdersMatchedBuyStruct
    ): OrderDetails {
        return new OrderDetails(makerAsk.price, makerAsk.tokenId, BIGINT_ONE)
    }
    export function canMatchMakerBid(
        makerBid: OrdersMatchedBuyStruct,
        takerAsk: OrdersMatchedSellStruct
    ): OrderDetails {
        return new OrderDetails(makerBid.price, makerBid.tokenId, BIGINT_ONE)
    }
}

export namespace SafeCollectionBidPolicyERC721 {
    export const addresses = ["0x0000000000b92d5d043faf7cecf7e2ee6aaed232"]
    export function canMatchMakerAsk(
        makerAsk: OrdersMatchedSellStruct,
        takerBid: OrdersMatchedBuyStruct
    ): OrderDetails {
        return new OrderDetails(BIG_INT_ZERO, BIG_INT_ZERO, BIG_INT_ZERO)
    }
    export function canMatchMakerBid(
        makerBid: OrdersMatchedBuyStruct,
        takerAsk: OrdersMatchedSellStruct
    ): OrderDetails {
        return new OrderDetails(makerBid.price, takerAsk.tokenId, BIGINT_ONE)
    }
}

export function canMatchMakerAsk(
    _address: Address,
    makerAsk: OrdersMatchedSellStruct,
    takerBid: OrdersMatchedBuyStruct
): OrderDetails {
    let address = _address.toHexString()
    if (SafeCollectionBidPolicyERC721.addresses.includes(address)) {
        return SafeCollectionBidPolicyERC721.canMatchMakerAsk(makerAsk, takerBid)
    } else if (StandardPolicyERC721.addresses.includes(address)) {
        return StandardPolicyERC721.canMatchMakerAsk(makerAsk, takerBid)
    } else {
        log.error("unknown policy address {}", [address])
        throw new Error("unknown policy address")
    }
}

export function canMatchMakerBid(
    _address: Address,
    makerBid: OrdersMatchedBuyStruct,
    takerAsk: OrdersMatchedSellStruct
): OrderDetails {
    let address = _address.toHexString()
    if (SafeCollectionBidPolicyERC721.addresses.includes(address)) {
        return SafeCollectionBidPolicyERC721.canMatchMakerBid(makerBid, takerAsk)
    } else if (StandardPolicyERC721.addresses.includes(address)) {
        return StandardPolicyERC721.canMatchMakerBid(makerBid, takerAsk)
    } else {
        log.error("unknown policy address {}", [address])
        throw new Error("unknown policy address")
    }
}
