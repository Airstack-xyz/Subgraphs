import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes, log } from "@graphprotocol/graph-ts"
import {
  CounterIncremented,
  OrderCancelled,
  OrderFulfilled,
  OrderValidated,
} from "../generated/Seaport/Seaport"
import {
  AirNftSaleRoyaltyExpectedResponse,
  AirNftTransactionExpectedResponse,
  OrderFulfilledEventType,
} from "./types"
import * as airstack from "../modules/airstack/nft-marketplace"
import { assert } from "matchstick-as/assembly/index"

//  -------------- EVENT  --------------
// event OrderFulfilled(
//         bytes32 orderHash,
//         address indexed offerer,
//         address indexed zone,
//         address recipient,
//         SpentItem[] offer,
//         ReceivedItem[] consideration
//     );

// struct SpentItem {
//     ItemType itemType;
//     address token;
//     uint256 identifier;
//     uint256 amount;
// }

// struct ReceivedItem {
//     ItemType itemType;
//     address token;
//     uint256 identifier;
//     uint256 amount;
//     address payable recipient;
// }

export function convertObjectToEvent(eventJson: OrderFulfilledEventType): OrderFulfilled {
  let orderFulfilledEvent = changetype<OrderFulfilled>(newMockEvent())
  // preparing offer Array
  let offerTupleArr: Array<ethereum.Tuple> = []
  for (let i = 0; i < eventJson.offer.length; i++) {
    let offerArr: Array<ethereum.Value> = []
    const offer = eventJson.offer[i]
    offerArr.push(ethereum.Value.fromI32(offer.itemType))
    offerArr.push(ethereum.Value.fromAddress(Address.fromString(offer.token)))
    offerArr.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromString(offer.identifier)))
    offerArr.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromString(offer.amount)))
    let offerTuple = changetype<ethereum.Tuple>(offerArr)
    offerTupleArr.push(offerTuple)
  }
  // preparing consideration Array
  let considerationTupleArr: Array<ethereum.Tuple> = []
  for (let i = 0; i < eventJson.consideration.length; i++) {
    let considerationArr: Array<ethereum.Value> = []
    const consideration = eventJson.consideration[i]
    considerationArr.push(ethereum.Value.fromI32(consideration.itemType))
    considerationArr.push(ethereum.Value.fromAddress(Address.fromString(consideration.token)))
    considerationArr.push(
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString(consideration.identifier))
    )
    considerationArr.push(
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString(consideration.amount))
    )
    considerationArr.push(ethereum.Value.fromAddress(Address.fromString(consideration.recipient)))
    let considerationTuple = changetype<ethereum.Tuple>(considerationArr)
    considerationTupleArr.push(considerationTuple)
  }
  // preparing rest of the event
  let orderHash = new ethereum.EventParam(
    "orderHash",
    ethereum.Value.fromBytes(Bytes.fromHexString(eventJson.orderHash))
  )
  let offerer = new ethereum.EventParam(
    "offerer",
    ethereum.Value.fromAddress(Address.fromString(eventJson.offerer))
  )
  let zone = new ethereum.EventParam(
    "zone",
    ethereum.Value.fromAddress(Address.fromString(eventJson.zone))
  )
  let recipient = new ethereum.EventParam(
    "recipient",
    ethereum.Value.fromAddress(Address.fromString(eventJson.recipient))
  )
  let offer = new ethereum.EventParam("displayName", ethereum.Value.fromTupleArray(offerTupleArr))
  let consideration = new ethereum.EventParam(
    "displayName",
    ethereum.Value.fromTupleArray(considerationTupleArr)
  )
  orderFulfilledEvent.parameters = [orderHash, offerer, zone, recipient, offer, consideration]
  return orderFulfilledEvent
}
export function createAirNftTransactionExpectedResponse(
  from: string,
  to: string,
  hash: string,
  tokenId: string,
  tokenAmount: string,
  transactionToken: string,
  paymentToken: string,
  paymentAmount: string,
  feeAmount: string,
  feeBeneficiary: string
): AirNftTransactionExpectedResponse {
  let prefix = "1-"
  return new AirNftTransactionExpectedResponse(
    prefix + from,
    prefix + to,
    hash,
    tokenId,
    tokenAmount,
    prefix + transactionToken,
    prefix + paymentToken,
    paymentAmount,
    feeAmount,
    prefix + feeBeneficiary
  )
}
export function assertAirNftSaleRoyaltyExpectedResponse(
  txIndex: BigInt,
  transactionToken: string,
  tokenId: string,
  hash: string,
  beneficiary: string,
  amount: string
): void {
  let saleId = airstack.nft.getNFTSaleTransactionId(
    "1",
    hash,
    txIndex,
    transactionToken,
    BigInt.fromString(tokenId)
  )
  let royaltyId = saleId + "-" + beneficiary
  let expected = new AirNftSaleRoyaltyExpectedResponse(amount, "1-" + beneficiary)
  assert.fieldEquals("AirNftSaleRoyalty", royaltyId, "amount", expected.amount)
  assert.fieldEquals("AirNftSaleRoyalty", royaltyId, "beneficiary", expected.beneficiary)
}
export function assertAirNftTransactionExpectedResponse(
  txIndex: BigInt,
  from: string,
  to: string,
  hash: string,
  tokenId: string,
  tokenAmount: string,
  transactionToken: string,
  paymentToken: string,
  paymentAmount: string,
  feeAmount: string,
  feeBeneficiary: string
): void {
  let expectedResponse = createAirNftTransactionExpectedResponse(
    from,
    to,
    hash,
    tokenId,
    tokenAmount,
    transactionToken,
    paymentToken,
    paymentAmount,
    feeAmount,
    feeBeneficiary
  )
  let entityId = airstack.nft.getNFTSaleTransactionId(
    "1",
    hash,
    txIndex,
    transactionToken,
    BigInt.fromString(tokenId)
  )
  assert.fieldEquals("AirNftTransaction", entityId, "from", expectedResponse.from)
  assert.fieldEquals("AirNftTransaction", entityId, "to", expectedResponse.to)
  assert.fieldEquals("AirNftTransaction", entityId, "hash", expectedResponse.hash)
  assert.fieldEquals("AirNftTransaction", entityId, "tokenId", expectedResponse.tokenId)
  assert.fieldEquals("AirNftTransaction", entityId, "tokenAmount", expectedResponse.tokenAmount)
  assert.fieldEquals(
    "AirNftTransaction",
    entityId,
    "transactionToken",
    expectedResponse.transactionToken
  )
  assert.fieldEquals("AirNftTransaction", entityId, "paymentToken", expectedResponse.paymentToken)
  assert.fieldEquals("AirNftTransaction", entityId, "paymentAmount", expectedResponse.paymentAmount)
  assert.fieldEquals("AirNftTransaction", entityId, "feeAmount", expectedResponse.feeAmount)
  assert.fieldEquals(
    "AirNftTransaction",
    entityId,
    "feeBeneficiary",
    expectedResponse.feeBeneficiary
  )
}
