import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import {
  OrdersMatchedBuyStruct,
  OrdersMatchedSellStruct,
} from "../generated/BlurExchange/BlurExchange"
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common"
import { canMatchMakerAsk, canMatchMakerBid } from "./blur-matching"
import { MatchingPolicy } from "../generated/schema"

export class OrderDetails {
  price: BigInt
  tokenId: BigInt
  amount: BigInt

  constructor(_price: BigInt, _tokenId: BigInt, _amount: BigInt) {
    this.price = _price
    this.tokenId = _tokenId
    this.amount = _amount
  }
}

export function _canMatchOrders(
  hash: string,
  sell: OrdersMatchedSellStruct,
  buy: OrdersMatchedBuyStruct
): OrderDetails {
  if (sell.listingTime <= buy.listingTime) {
    getOrCreateMatchingPolicy(hash, sell.matchingPolicy.toHexString())
    return canMatchMakerAsk(sell.matchingPolicy, sell, buy)
  } else {
    getOrCreateMatchingPolicy(hash, buy.matchingPolicy.toHexString())
    return canMatchMakerBid(buy.matchingPolicy, buy, sell)
  }
}

export function getOrCreateMatchingPolicy(hash: string, policy: string): void {
  let policyEntity = MatchingPolicy.load(policy)
  if (policyEntity == null) {
    log.debug("new-policy {} hash {}", [policy, hash])
    policyEntity = new MatchingPolicy(policy)
    let hashArray = [hash]
    policyEntity.hashArr = hashArray
  } else {
    let hashArr = policyEntity.hashArr
    hashArr!.push(hash)
    policyEntity.hashArr = hashArr
  }
  policyEntity.save()
}
