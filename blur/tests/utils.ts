//  Events
// event OrdersMatched(
//     address indexed maker,
//     address indexed taker,
//     Order sell,
//     bytes32 sellHash,
//     Order buy,
//     bytes32 buyHash
// );

// struct Order {
//     address trader;
//     Side side;
//     address matchingPolicy;
//     address collection;
//     uint256 tokenId;
//     uint256 amount;
//     address paymentToken;
//     uint256 price;
//     uint256 listingTime;
//     /* Order expiration timestamp - 0 for oracle cancellations. */
//     uint256 expirationTime;
//     Fee[] fees;
//     uint256 salt;
//     bytes extraParams;
// }

// enum Side { Buy, Sell }
// struct Fee {
//     uint16 rate;
//     address payable recipient;
// }
import { OrderMatchedInput, OrderInput } from "./example"
import { OrdersMatched } from "../generated/BlurExchange/BlurExchange"
import { Address, Bytes, ethereum, BigInt } from "@graphprotocol/graph-ts"
import { newMockEvent } from "matchstick-as"

export function getOrdersMatched(input: OrderMatchedInput): OrdersMatched {
    //   preparing event params
    let maker = getAddressEventParam("maker", input.maker)
    let taker = getAddressEventParam("taker", input.taker)
    let sellTuple = getOrderTuple(input.sell)
    let sell = new ethereum.EventParam("sell", ethereum.Value.fromTuple(sellTuple))
    let buyTuple = getOrderTuple(input.buy)
    let buy = new ethereum.EventParam("buy", ethereum.Value.fromTuple(buyTuple))
    let sellHash = getBytesEventParam("sellHash", input.sellHash)
    let buyHash = getBytesEventParam("buyHash", input.buyHash)
    let ordersMatchedEvent = changetype<OrdersMatched>(newMockEvent())
    ordersMatchedEvent.parameters = [maker, taker, sell, sellHash, buy, buyHash]
    ordersMatchedEvent.transaction.hash = Bytes.fromHexString(input.hash)
    return ordersMatchedEvent
}
function getOrderTuple(input: OrderInput): ethereum.Tuple {
    let arr: Array<ethereum.Value> = []
    arr.push(addressValue(input.trader))
    arr.push(bigIntValue(input.side.toString()))
    arr.push(addressValue(input.matchingPolicy))
    arr.push(addressValue(input.collection))
    arr.push(bigIntValue(input.tokenId))
    arr.push(bigIntValue(input.amount))
    arr.push(addressValue(input.paymentToken))
    arr.push(bigIntValue(input.price))
    arr.push(bigIntValue(input.listingTime))
    arr.push(bigIntValue(input.expirationTime))
    let fees: Array<ethereum.Tuple> = []
    for (let i = 0; i < input.fees.length; i++) {
        let feeArr: Array<ethereum.Value> = []
        const feeInput = input.fees[i]
        feeArr.push(ethereum.Value.fromI32(feeInput.rate))
        feeArr.push(ethereum.Value.fromAddress(Address.fromString(feeInput.recipient)))
        let feeTuple = changetype<ethereum.Tuple>(feeArr)
        fees.push(feeTuple)
    }
    arr.push(tupleArrayValue(fees))
    arr.push(bigIntValue(input.salt))
    arr.push(bytesValue(input.extraParams))
    let orderTuple = changetype<ethereum.Tuple>(arr)
    return orderTuple
}
function tupleArrayValue(arg: ethereum.Tuple[]): ethereum.Value {
    return ethereum.Value.fromTupleArray(arg)
}
function addressValue(arg: string): ethereum.Value {
    return ethereum.Value.fromAddress(Address.fromString(arg))
}
function bytesValue(arg: string): ethereum.Value {
    return ethereum.Value.fromBytes(Bytes.fromHexString(arg))
}
function bigIntValue(arg: string): ethereum.Value {
    return ethereum.Value.fromUnsignedBigInt(BigInt.fromString(arg))
}
function getAddressEventParam(eventName: string, arg: string): ethereum.EventParam {
    let eventParam = new ethereum.EventParam(eventName, addressValue(arg))
    return eventParam
}

function getBytesEventParam(eventName: string, arg: string): ethereum.EventParam {
    let eventParam = new ethereum.EventParam(eventName, bytesValue(arg))
    return eventParam
}
function getBigIntEventParam(eventName: string, arg: string): ethereum.EventParam {
    let eventParam = new ethereum.EventParam(eventName, bigIntValue(arg))
    return eventParam
}
