import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { OrdersMatched } from "../generated/BlurExchange/BlurExchange"
import * as airstack from "../modules/airstack/nft-marketplace"
import { PROTOCOL_SELL_ACTION_TYPE, MARKET_PLACE_TYPE } from "./constants"
import { _canMatchOrders } from "./blur-utils"
import { BIG_INT_ZERO } from "../modules/airstack/common"
export function handleOrdersMatched(event: OrdersMatched): void {
    let txHash = event.transaction.hash.toHexString()
    let buyer = event.params.buy.trader
    let seller = event.params.sell.trader

    let orderDetails = _canMatchOrders(txHash, event.params.sell, event.params.buy)
    log.debug("orderDetails txHash {} tokenId {} price {} amount {}", [
        txHash,
        orderDetails.tokenId.toString(),
        orderDetails.price.toString(),
        orderDetails.amount.toString(),
    ])
    let nfts = new Array<airstack.nft.NFT>()
    let nft = new airstack.nft.NFT(
        event.params.sell.collection,
        orderDetails.tokenId,
        orderDetails.amount
    )
    nfts.push(nft)
    let royalties = new Array<airstack.nft.CreatorRoyalty>()
    for (let i = 0; i < event.params.sell.fees.length; i++) {
        const royaltyObj = event.params.sell.fees[i]
        const royaltyAmt = orderDetails.price
            .times(BigInt.fromI64(royaltyObj.rate))
            .div(BigInt.fromI64(10000))
        let royalty = new airstack.nft.CreatorRoyalty(royaltyAmt, royaltyObj.recipient)
        royalties.push(royalty)
    }
    let sale = new airstack.nft.Sale(
        buyer,
        seller,
        nfts,
        orderDetails.price,
        event.params.sell.paymentToken,
        BIG_INT_ZERO,
        Address.zero(),
        royalties
    )
    airstack.nft.trackNFTSaleTransactions(
        event.block,
        txHash,
        event.logIndex,
        sale,
        MARKET_PLACE_TYPE,
        PROTOCOL_SELL_ACTION_TYPE
    )
}
