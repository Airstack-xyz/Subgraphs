import { Address, BigInt, Bytes, log, TypedMap } from "@graphprotocol/graph-ts";
import { address, integer } from "@protofire/subgraph-toolkit";
import { shared } from "./shared";

export namespace orders {

	export class Order {

		exchange: Address;
		maker: string;
		taker: string;
		makerRelayerFee: BigInt;
		takerRelayerFee: BigInt;
		makerProtocolFee: BigInt;
		takerProtocolFee: BigInt;
		feeRecipient: string;
		feeMethod: string;
		side: string;
		saleKind: string;
		target: string;
		howToCall: string;
		callData: Bytes;
		replacementPattern: Bytes;
		staticTarget: Address;
		staticExtradata: Bytes;
		paymentToken: string;
		basePrice: BigInt;
		extra: BigInt;
		listingTime: BigInt;
		expirationTIme: BigInt;
		salt: BigInt;

		constructor(

			exchange: Address,
			maker: string,
			taker: string,
			makerRelayerFee: BigInt,
			takerRelayerFee: BigInt,
			makerProtocolFee: BigInt,
			takerProtocolFee: BigInt,
			feeRecipient: string,
			feeMethod: string,
			side: string,
			saleKind: string,
			target: string,
			howToCall: string,
			callData: Bytes,
			replacementPattern: Bytes,
			staticTarget: Address,
			staticExtradata: Bytes,
			paymentToken: string,
			basePrice: BigInt,
			extra: BigInt,
			listingTime: BigInt,
			expirationTIme: BigInt,
			salt: BigInt,
		) {
			this.exchange = exchange;
			this.maker = maker;
			this.taker = taker;
			this.makerRelayerFee = makerRelayerFee;
			this.takerRelayerFee = takerRelayerFee;
			this.makerProtocolFee = makerProtocolFee;
			this.takerProtocolFee = takerProtocolFee;
			this.feeRecipient = feeRecipient;
			this.feeMethod = feeMethod;
			this.side = side;
			this.saleKind = saleKind;
			this.target = target;
			this.howToCall = howToCall;
			this.callData = callData;
			this.replacementPattern = replacementPattern;
			this.staticTarget = staticTarget;
			this.staticExtradata = staticExtradata;
			this.paymentToken = paymentToken;
			this.basePrice = basePrice;
			this.extra = extra;
			this.listingTime = listingTime;
			this.expirationTIme = expirationTIme;
			this.salt = salt;

		}

	}


	export let ORDER_STATUS_NONE = "NONE"
	export let ORDER_STATUS_OPEN = "OPEN"
	export let ORDER_STATUS_FILLED = "FILLED"

	export let YIELD_STATUS_NONE = "NONE"
	export let YIELD_STATUS_PART_ONE = "PART_ONE"
	export let YIELD_STATUS_PART_TWO = "PART_TWO"

	export let FEE_METHOD_PROTOCOL_FEE = "ProtocolFee"
	export let FEE_METHOD_SPLIT_FEE = "SplitFee"

	export let SALE_KIND_FIXEDPRICE = "FixedPrice"
	export let SALE_KIND_DUTCHAUCTION = "DutchAuction"

	export let ORDER_CALL = "Call"
	export let ORDER_DELEGATE = "DelegateCall"

	export let SIDE_BUY = "Buy"
	export let SIDE_SELL = "Sell"

	export namespace constants {

		export const WYVERN_ATOMICIZER_ADDRESS = "0xc99f70bfd82fb7c8f8191fdfbfb735606b15e5c5" 

		export function getFeeTypes(): TypedMap<string, string> {
			let PROTOCOL = "0"
			let SPLIT = "1"
			let NAMES = new TypedMap<string, string>()
			NAMES.set(PROTOCOL, FEE_METHOD_PROTOCOL_FEE)
			NAMES.set(SPLIT, FEE_METHOD_SPLIT_FEE)
			return NAMES
		}

		export function getSaleKinds(): TypedMap<string, string> {
			let FIXED = "0"
			let AUCTION = "1"
			let NAMES = new TypedMap<string, string>()
			NAMES.set(FIXED, SALE_KIND_FIXEDPRICE)
			NAMES.set(AUCTION, SALE_KIND_DUTCHAUCTION)
			return NAMES
		}

		export function getOrderCalls(): TypedMap<string, string> {
			let CALL = "0"
			let DELEGATE = "1"
			let NAMES = new TypedMap<string, string>()
			NAMES.set(CALL, ORDER_CALL)
			NAMES.set(DELEGATE, ORDER_DELEGATE)
			return NAMES
		}

		export function getOrderSides(): TypedMap<string, string> {
			let BUY = "0"
			let SELL = "1"
			let NAMES = new TypedMap<string, string>()
			NAMES.set(BUY, SIDE_BUY)
			NAMES.set(SELL, SIDE_SELL)
			return NAMES
		}
	}
	export namespace helpers {
		export function calculateMatchPrice(buy: Order, sell: Order, now: BigInt): BigInt {
			/* Calculate sell price. */
			let sellPrice = calculateFinalPrice(
				sell.side!, sell.saleKind!, sell.basePrice!,
				sell.extra!, sell.listingTime!, sell.expirationTIme!, now)

			/* Calculate buy price. */
			let buyPrice = calculateFinalPrice(
				buy.side!, buy.saleKind!, buy.basePrice!,
				buy.extra!, buy.listingTime!, buy.expirationTIme!, now)

			/* Maker/taker priority. */
			let isMissingSellFeeRecipient = (address.isZeroAddress(Address.fromString(sell.feeRecipient!)))
			return isMissingSellFeeRecipient ? buyPrice : sellPrice

		}

		function safeDiv(a: BigInt, b: BigInt): BigInt {
			let _a = a === integer.ZERO ? integer.ONE : a
			let _b = b === integer.ZERO ? integer.ONE : b
			return _a.div(_b)
		}

		function calculateFinalPrice(
			side: string, saleKind: string, basePrice: BigInt, extra: BigInt,
			listingTime: BigInt, expirationTime: BigInt, now: BigInt
		): BigInt {
			if (saleKind == SALE_KIND_FIXEDPRICE) {
				return basePrice;
			} else if (saleKind == SALE_KIND_DUTCHAUCTION) {
				let diff = safeDiv(
					extra.times(now.minus(listingTime)),
					expirationTime.minus(listingTime)
				)
				if (side == SIDE_SELL) {
					/* Sell-side - start price: basePrice. End price: basePrice - extra. */
					return basePrice.minus(diff)
				}
				// else...
				/* Buy-side - start price: basePrice. End price: basePrice + extra. */
				return basePrice.plus(diff)
			}
			return integer.ZERO
		}


		export function getFeeMethod(feeMethod: i32): string {
			let key = shared.helpers.i32ToString(feeMethod)
			// log.info("getFeeMethod said: {}", [key])
			return shared.helpers.getPropById(key, constants.getFeeTypes())
		}

		export function getSaleKind(kind: i32): string {
			let key = shared.helpers.i32ToString(kind)
			// log.info("getSaleKind said: {}", [key])
			return shared.helpers.getPropById(key, constants.getSaleKinds())
		}

		export function getHowToCall(call: i32): string {
			let callAsString = shared.helpers.i32ToString(call)
			// log.info("getHowToCall said: {}", [callAsString])
			return shared.helpers.getPropById(callAsString, constants.getOrderCalls())
		}

		export function getOrderSide(side: i32): string {
			let sideAsString = shared.helpers.i32ToString(side)
			// log.info("getOrderSide said: {}", [sideAsString])
			return shared.helpers.getPropById(sideAsString, constants.getOrderSides())
		}
	}

}