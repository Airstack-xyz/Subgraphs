import { Address, BigDecimal, BigInt, Bytes, log } from "@graphprotocol/graph-ts"

import { AtomicMatch_Call } from "../generated/WyvernExchange/WyvernExchange"

import { orders } from "./orders"

import * as airstack from "../modules/airstack/nft-marketplace"
import { abi } from "./abi"
import { BIGINT_HUNDRED, EXCHANGE_MARKETPLACE_FEE, INVERSE_BASIS_POINT } from "./shared"
import {
    ENS_WALLET,
    ETHEREUM_MAINNET_ID,
    MARKET_PLACE_TYPE,
    PROTOCOL_SELL_ACTION_TYPE,
} from "./utils"
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common"

export function atomicMatch(
    txHash: string,
    blockTimeStamp: BigInt,
    addrs: Array<Address>,
    uints: Array<BigInt>,
    feeMethodsSidesKindsHowToCalls: Array<i32>,
    calldataBuy: Bytes,
    calldataSell: Bytes,
    replacementPatternBuy: Bytes,
    replacementPatternSell: Bytes,
    staticExtradataBuy: Bytes,
    staticExtradataSell: Bytes,
    vs: Array<i32>,
    rssMetadata: Array<Bytes>
): airstack.nft.Sale | null {
    let sellTakerAddress = addrs[9]
    let paymentToken = addrs[6]
    let saleTarget = addrs[11]
    let isBundleSale = saleTarget.toHexString() == orders.constants.WYVERN_ATOMICIZER_ADDRESS
    let contractAddress = addrs[11]
    // buy Order
    let buyOrder: orders.Order = new orders.Order(
        addrs[0], //exchange:
        addrs[1].toHexString(), //maker:
        addrs[2].toHexString(), // taker:
        uints[0], //makerRelayerFee:
        uints[1], //takerRelayerFee:
        uints[2], //makerProtocolFee:
        uints[3], //takerProtocolFee:
        addrs[3].toHex(), //feeRecipient:
        orders.helpers.getFeeMethod(feeMethodsSidesKindsHowToCalls[0]), //feeMethod:
        orders.helpers.getOrderSide(feeMethodsSidesKindsHowToCalls[1]), //side:
        orders.helpers.getSaleKind(feeMethodsSidesKindsHowToCalls[2]), //saleKind:
        addrs[4].toHexString(), //target:
        orders.helpers.getHowToCall(feeMethodsSidesKindsHowToCalls[3]), //howToCall:
        calldataBuy, //callData:
        replacementPatternBuy, //replacementPattern:
        addrs[5], //staticTarget:
        staticExtradataBuy, //staticExtradata:
        paymentToken.toHexString(), //paymentToken:
        uints[4], //basePrice:
        uints[5], //extra:
        uints[6], //listingTime:
        uints[7], //expirationTIme:
        uints[8] // salt:
    )

    log.info(
        "txHash {} buyOrder maker {} taker {} makerProtocolFee {} takerProtocolFee {} makerRelayerFee {} takerRelayerFee {} feeRecipient {} feeMethod {} side {} saleKind {} exchange {} target{}",
        [
            txHash,
            buyOrder.maker,
            buyOrder.taker,
            buyOrder.makerProtocolFee.toString(),
            buyOrder.takerProtocolFee.toString(),
            buyOrder.makerRelayerFee.toString(),
            buyOrder.takerRelayerFee.toString(),
            buyOrder.feeRecipient,
            buyOrder.feeMethod,
            buyOrder.side,
            buyOrder.saleKind,
            buyOrder.exchange.toHexString(),
            buyOrder.target,
        ]
    )
    let sellOrder: orders.Order = new orders.Order(
        addrs[7], //exchange:
        addrs[8].toHexString(), //maker:
        sellTakerAddress.toHexString(), //taker:
        uints[9], //makerRelayerFee:
        uints[10], // takerRelayerFee:
        uints[11], //makerProtocolFee:
        uints[12], //takerProtocolFee:
        addrs[10].toHexString(), // feeRecipient:
        orders.helpers.getFeeMethod(feeMethodsSidesKindsHowToCalls[4]), //feeMethod:
        orders.helpers.getOrderSide(feeMethodsSidesKindsHowToCalls[5]), //side:
        orders.helpers.getSaleKind(feeMethodsSidesKindsHowToCalls[6]), //saleKind:
        addrs[11].toHexString(), //target:
        orders.helpers.getHowToCall(feeMethodsSidesKindsHowToCalls[7]), //howToCall:
        calldataSell, // callData:
        replacementPatternSell, //replacementPattern:
        addrs[12], //staticTarget:
        staticExtradataSell, //staticExtradata:
        paymentToken.toHexString(), //paymentToken:
        uints[13], //basePrice:
        uints[14], //extra:
        uints[15], //listingTime:
        uints[16], //expirationTIme:
        uints[17] //salt:
    )
    log.info(
        "txHash {} sellOrder maker {} taker {} makerProtocolFee {} takerProtocolFee {} makerRelayerFee {} takerRelayerFee {} feeRecipient {} feeMethod {} side {} saleKind {} exchange {} target{}",
        [
            txHash,
            sellOrder.maker,
            sellOrder.taker,
            sellOrder.makerProtocolFee.toString(),
            sellOrder.takerProtocolFee.toString(),
            sellOrder.makerRelayerFee.toString(),
            sellOrder.takerRelayerFee.toString(),
            sellOrder.feeRecipient,
            sellOrder.feeMethod,
            sellOrder.side,
            sellOrder.saleKind,
            sellOrder.exchange.toHexString(),
            sellOrder.target,
        ]
    )

    let matchPrice = orders.helpers.calculateMatchPrice(buyOrder, sellOrder, blockTimeStamp)

    if (isBundleSale) {
        log.debug("txHash {} isbundlesale", [txHash])
        let decoded = abi.decodeBatchNftData(
            buyOrder.callData,
            sellOrder.callData,
            buyOrder.replacementPattern
        )
        if (decoded.addressList.length != decoded.transfers.length) {
            log.error("bundleSale addressList len != transfers len,txHash {}", [txHash])
        }
        let from = Address.zero()
        let to = Address.zero()
        let nfts: airstack.nft.NFT[] = []
        for (let i = 0; i < decoded.transfers.length; i++) {
            let transfer = decoded.transfers[i]
            log.debug("from {} to {} method {} ", [
                transfer.from.toHexString(),
                transfer.to.toHexString(),
                transfer.method,
            ])
            if (from == Address.zero()) {
                from = transfer.from
            } else if (from != transfer.from) {
                log.error("from address change not expected,txhash {}", [txHash])
                throw new Error("from address change not expected")
            }
            if (to == Address.zero()) {
                to = transfer.to
            } else if (to != transfer.to) {
                log.error("to address change not expected,txhash {}", [txHash])
                throw new Error("to address change not expected")
            }
            if (transfer.tokens.length > 1) {
                log.error("transferlen >1 isn't expected,txhash {}", [txHash])
                throw new Error("transferlen >1 isn't expected")
            }
            let token = transfer.tokens[0]
            let nft = new airstack.nft.NFT(decoded.addressList[i], token.tokenId, token.amount)
            log.debug("bundleSale hash {} collection {} tokenId {} amount {}", [
                txHash,
                nft.collection.toHexString(),
                nft.tokenId.toString(),
                nft.amount.toString(),
            ])
            nfts.push(nft)
        }
        let royaltyDetails = new royaltyResult()
        if (sellOrder.feeRecipient != Address.zero().toHexString()) {
            royaltyDetails = calculateRoyality(
                sellOrder.makerRelayerFee,
                sellOrder.feeRecipient,
                matchPrice
            )
        } else {
            royaltyDetails = calculateRoyality(
                sellOrder.takerRelayerFee,
                sellOrder.feeRecipient,
                matchPrice
            )
        }
        let feeRecipient = royaltyDetails.feeRecipient
        let totalRevenueETH = royaltyDetails.totalRevenueETH
        if (from == Address.zero() || to == Address.zero()) {
            log.error("from or to is zero, from {} to {} ,txHash {}", [
                from.toHexString(),
                to.toHexString(),
                txHash,
            ])
            throw new Error("from or to is zero address")
        }
        log.error(
            "bundle hash {} from {} to {} matchPrice {} paymentToken {} feeRecipient {} protocolFees {}",
            [
                txHash,
                from.toHexString(),
                to.toHexString(),
                matchPrice.toString(),
                paymentToken.toHexString(),
                feeRecipient.toString(),
                totalRevenueETH.toString(),
            ]
        )

        let sale = new airstack.nft.Sale(
            to,
            from,
            nfts,
            matchPrice,
            paymentToken,
            totalRevenueETH,
            Address.fromString(feeRecipient),
            new Array<airstack.nft.CreatorRoyalty>()
        )
        return sale
    } else {
        log.info("txHash {} not bundle sale", [txHash])
        let decoded = abi.decodeSingleNftData(
            txHash,
            buyOrder.callData,
            sellOrder.callData,
            buyOrder.replacementPattern
        )
        if (decoded == null) {
            log.debug("missing record {} ", [txHash])
            return null
        }

        let royaltyDetails = new royaltyResult()
        if (sellOrder.feeRecipient != Address.zero().toHexString()) {
            royaltyDetails = calculateRoyality(
                sellOrder.makerRelayerFee,
                sellOrder.feeRecipient,
                matchPrice
            )
        } else {
            royaltyDetails = calculateRoyality(
                sellOrder.takerRelayerFee,
                buyOrder.feeRecipient,
                matchPrice
            )
        }
        let feeRecipient = royaltyDetails.feeRecipient
        let totalRevenueETH = royaltyDetails.totalRevenueETH
        // let creatorRevenueETH = royaltyDetails.creatorRevenueETH
        // creatorRevenueETH = matchPrice.minus(totalRevenueETH)
        let nfts: airstack.nft.NFT[] = []
        for (let i = 0; i < decoded.tokens.length; i++) {
            const token = decoded.tokens[i]
            contractAddress = token.contract != Address.zero() ? token.contract : contractAddress
            let nft = new airstack.nft.NFT(contractAddress, token.tokenId, token.amount)
            nfts.push(nft)
        }

        log.debug(
            // protocolFeesBeneficiary: Address
            "sale decoded buyer {} seller {} paymentAmount {} paymentToken {} protocolFees {} protocolFeesBeneficiary {} ",
            [
                decoded.to.toHexString(),
                decoded.from.toHexString(),
                matchPrice.toString(),
                paymentToken.toHexString(),
                totalRevenueETH.toString(),
                feeRecipient,
            ]
        )
        for (let i = 0; i < nfts.length; i++) {
            const nft = nfts[i]
            log.debug("nft collection {} tokenId {} amount {} ", [
                nft.collection.toHexString(),
                nft.tokenId.toString(),
                nft.amount.toString(),
            ])
        }
        let sale = new airstack.nft.Sale(
            decoded.to,
            decoded.from,
            nfts,
            matchPrice,
            paymentToken,
            totalRevenueETH,
            Address.fromString(feeRecipient),
            new Array<airstack.nft.CreatorRoyalty>()
        )
        return sale
    }
}

export function handleAtomicMatch_(call: AtomicMatch_Call): void {
    log.error("txhash {} blockNo {}", [
        call.transaction.hash.toHexString(),
        call.block.number.toString(),
    ])
    let sale = atomicMatch(
        call.transaction.hash.toHexString(),
        call.block.timestamp,
        call.inputs.addrs,
        call.inputs.uints,
        call.inputs.feeMethodsSidesKindsHowToCalls,
        call.inputs.calldataBuy,
        call.inputs.calldataSell,
        call.inputs.replacementPatternBuy,
        call.inputs.replacementPatternSell,
        call.inputs.staticExtradataBuy,
        call.inputs.staticExtradataSell,
        call.inputs.vs,
        call.inputs.rssMetadata
    )
    if (sale != null) {
        airstack.nft.trackNFTSaleTransactions(
            call.block,
            call.transaction.hash.toHexString(),
            call.transaction.index,
            sale,
            MARKET_PLACE_TYPE,
            PROTOCOL_SELL_ACTION_TYPE
        )
    }
}

class royaltyResult {
    constructor(
        public creatorRoyaltyFeePercentage: BigInt = BigInt.zero(),
        public totalRevenueETH: BigInt = BigInt.zero(),
        public marketplaceRevenueETH: BigInt = BigInt.zero(),
        public creatorRevenueETH: BigInt = BigInt.zero(),
        public feeRecipient: string = ""
    ) {}
}

// Calculate the royalty/revenue fees by using the known opensea marketplace fee of 2.5% on all trades
// Here we calculate the royalty by taking fee payment and subtracting it from the marketplace fee.
// https://github.com/ProjectWyvern/wyvern-ethereum/blob/master/contracts/exchange/ExchangeCore.sol
export function calculateRoyality(
    fee: BigInt,
    feeRecipient: string,
    matchPrice: BigInt
): royaltyResult {
    let royaltyDetails = new royaltyResult()
    royaltyDetails.creatorRoyaltyFeePercentage = EXCHANGE_MARKETPLACE_FEE.le(fee)
        ? fee.minus(EXCHANGE_MARKETPLACE_FEE).div(BIGINT_HUNDRED)
        : BigInt.zero()

    royaltyDetails.totalRevenueETH = fee.times(matchPrice).div(INVERSE_BASIS_POINT)

    royaltyDetails.marketplaceRevenueETH = EXCHANGE_MARKETPLACE_FEE.le(fee)
        ? EXCHANGE_MARKETPLACE_FEE.times(matchPrice).div(INVERSE_BASIS_POINT)
        : BigInt.zero()
    royaltyDetails.creatorRevenueETH = royaltyDetails.totalRevenueETH.minus(
        royaltyDetails.marketplaceRevenueETH
    )

    royaltyDetails.feeRecipient = feeRecipient
    return royaltyDetails
}
