import { Address, BigDecimal, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts"
import { OrderFulfilled } from "../generated/Seaport/Seaport"
import {
    isOpenSeaFeeAccount,
    ETHEREUM_MAINNET_ID,
    MARKET_PLACE_TYPE,
    PROTOCOL_SELL_ACTION_TYPE,
    BIGINT_ZERO,
    isNFTEntity,
    getNFTStandard,
} from "./utils"
import * as airstack from "../modules/airstack/nft-marketplace"
import { PartialRoyalty, PartialNftTransaction, PartialNft } from "../generated/schema"
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common"
export function handleOrderFulfilled(event: OrderFulfilled): void {
    let isPartialEvent = event.params.recipient == Address.zero()
    if (isPartialEvent) {
        handlePartialEvent(event)
    } else {
        handleCompleteEvent(event)
    }
}
// one event will have complete info. about transaction
function handleCompleteEvent(event: OrderFulfilled): void {
    let txHash = event.transaction.hash
    let offerer = event.params.offerer
    let recipient = event.params.recipient
    let seller: Address = Address.zero(),
        buyer: Address = Address.zero()
    let paymentToken = Address.zero()
    let paymentAmount = BIGINT_ZERO
    let offerAmount = BIGINT_ZERO
    let protocolFees = BIGINT_ZERO
    let protocolFeesBeneficiary = Address.zero()
    let nfts = new Array<airstack.nft.NFT>()
    let royalties = new Array<airstack.nft.CreatorRoyalty>()

    for (let i = 0; i < event.params.offer.length; i++) {
        const offer = event.params.offer[i]
        let isNFT = isNFTEntity(offer.itemType)
        if (isNFT) {
            let standard = getNFTStandard(offer.itemType)
            let nft = new airstack.nft.NFT(offer.token, standard, offer.identifier, offer.amount)
            nfts.push(nft)
            buyer = recipient
            seller = offerer
        } else {
            buyer = offerer
            seller = recipient
            paymentToken = offer.token
            offerAmount = offer.amount
        }
    }
    // stores amount returned
    let totalAmountToSeller = BIGINT_ZERO
    // stores total royalty fees
    let totalRoyaltyFees = BIGINT_ZERO

    for (let i = 0; i < event.params.consideration.length; i++) {
        const consideration = event.params.consideration[i]
        let isNFT = isNFTEntity(consideration.itemType)

        if (!isNFT) {
            paymentToken = consideration.token
            if (consideration.recipient == seller) {
                totalAmountToSeller = totalAmountToSeller.plus(consideration.amount)
            } else if (isOpenSeaFeeAccount(consideration.recipient)) {
                protocolFeesBeneficiary = consideration.recipient
                protocolFees = protocolFees.plus(consideration.amount)
            } else {
                // royalty case
                totalRoyaltyFees = totalRoyaltyFees.plus(consideration.amount)
                let royalty = new airstack.nft.CreatorRoyalty(
                    consideration.amount,
                    consideration.recipient
                )
                royalties.push(royalty)
            }
        } else {
            let standard = getNFTStandard(consideration.itemType)
            let nft = new airstack.nft.NFT(
                consideration.token,
                standard,
                consideration.identifier,
                consideration.amount
            )
            nfts.push(nft)
        }
    }

    if (totalAmountToSeller == BIGINT_ZERO) {
        paymentAmount = offerAmount
    } else {
        paymentAmount = totalRoyaltyFees.plus(protocolFees).plus(totalAmountToSeller)
    }
    // logging sale
    log.info(
        "buyer {} seller {} paymentToken {}  paymentAmount {} protocolFees {} protocolFeesBeneficiary {}",
        [
            buyer.toHexString(),
            seller.toHexString(),
            paymentToken.toHexString(),
            paymentAmount.toString(),
            protocolFees.toString(),
            protocolFeesBeneficiary.toHexString(),
        ]
    )
    let sale = new airstack.nft.Sale(
        buyer,
        seller,
        nfts,
        paymentAmount,
        paymentToken,
        protocolFees,
        protocolFeesBeneficiary,
        royalties
    )
    airstack.nft.trackNFTSaleTransactions(
        event.block,
        txHash.toHexString(),
        event.transaction.index,
        sale,
        MARKET_PLACE_TYPE,
        PROTOCOL_SELL_ACTION_TYPE
    )
    // logging nfts
    for (let i = 0; i < nfts.length; i++) {
        let nft = nfts[i]
        log.debug("nftAddress {} amount {} nftstandard {} tokenId {}", [
            nft.collection.toHexString(),
            nft.amount.toString(),
            nft.standard,
            nft.tokenId.toString(),
        ])
    }

    // logging royalties
    for (let i = 0; i < royalties.length; i++) {
        let royalty = royalties[i]
        log.debug("beneficiary {}, fee {}", [
            royalty.beneficiary.toHexString(),
            royalty.fee.toString(),
        ])
    }
}
// two events under same hash is required to get complete info about transaction
function handlePartialEvent(event: OrderFulfilled): void {
    let txHash = event.transaction.hash
    let offerer = event.params.offerer
    let recipient = event.params.recipient
    if (recipient != Address.zero()) {
        log.error("recipient {} not expected for partial event", [recipient.toHexString()])
        throw new Error("")
    }
    let partialRecord = getOrCreatePartialNftTransaction(txHash)
    if (
        partialRecord.from != Address.zero().toHexString() ||
        partialRecord.to != Address.zero().toHexString()
    ) {
        partialRecord.isComplete = true
        partialRecord.save()
    }

    for (let i = 0; i < event.params.offer.length; i++) {
        const offer = event.params.offer[i]
        let isNFT = isNFTEntity(offer.itemType)
        if (!isNFT) {
            partialRecord.totalOfferAmount = offer.amount
            partialRecord.paymentToken = offer.token.toHexString()
            partialRecord.to = offerer.toHexString()
        } else {
            let standard = getNFTStandard(offer.itemType)
            let tokenAddress = offer.token
            let tokenId = offer.identifier
            let tokenAmount = offer.amount

            let alreadyExists = false
            for (let j = 0; j < partialRecord.nftCount.toI64(); j++) {
                let partialNFT = PartialNft.load(getPartialNftKey(txHash, BigInt.fromI64(j)))
                if (partialNFT == null) {
                    log.error("partialNFT should not be null", [])
                    throw new Error("")
                } else {
                    if (
                        partialNFT.standard == standard &&
                        partialNFT.tokenId == tokenId &&
                        partialNFT.transactionToken == tokenAddress.toHexString() &&
                        partialNFT.tokenAmount == tokenAmount
                    ) {
                        alreadyExists = true
                    }
                }
            }
            if (!alreadyExists) {
                let partialNft = getOrCreatePartialNft(
                    txHash,
                    partialRecord.nftCount,
                    tokenAddress.toHexString(),
                    tokenId,
                    tokenAmount,
                    standard
                )
                partialNft.save()
                partialRecord.nftCount = partialRecord.nftCount.plus(BIGINT_ONE)
            }
            partialRecord.from = offerer.toHexString()
        }
    }
    partialRecord.save()
    for (let i = 0; i < event.params.consideration.length; i++) {
        const consideration = event.params.consideration[i]
        let isNFT = isNFTEntity(consideration.itemType)
        if (!isNFT) {
            partialRecord.paymentToken = consideration.token.toHexString()
            if (consideration.recipient.toHexString() == partialRecord.from) {
                let amountToSeller = partialRecord.totalAmountToSeller
                partialRecord.totalAmountToSeller = amountToSeller.plus(consideration.amount)
            } else if (isOpenSeaFeeAccount(consideration.recipient)) {
                let feeAmount = partialRecord.feeAmount
                partialRecord.feeAmount = feeAmount.plus(consideration.amount)
                partialRecord.feeBeneficiary = consideration.recipient.toHexString()
            } else if (consideration.recipient.toHexString() != partialRecord.to) {
                let royaltyCount = partialRecord.royaltyCount
                let partialRoyalty = getOrCreatePartialRoyalty(txHash, royaltyCount.toI64())
                partialRecord.totalRoyalty = partialRecord.totalRoyalty.plus(consideration.amount)
                partialRoyalty.fees = consideration.amount
                partialRoyalty.beneficiary = consideration.recipient.toHexString()
                partialRoyalty.save()
                partialRecord.royaltyCount = royaltyCount.plus(BIGINT_ONE)
            }
        } else {
            let standard = getNFTStandard(consideration.itemType)
            let tokenId = consideration.identifier
            let tokenAmount = consideration.amount
            let tokenAddress = consideration.token

            let partialNft = getOrCreatePartialNft(
                txHash,
                partialRecord.nftCount,
                tokenAddress.toHexString(),
                tokenId,
                tokenAmount,
                standard
            )
            partialNft.save()
            let alreadyExists = false
            for (let j = 0; j < partialRecord.nftCount.toI64(); j++) {
                let partialNFT = PartialNft.load(getPartialNftKey(txHash, BigInt.fromI64(j)))
                if (partialNFT == null) {
                    log.error("partialNFT should not be null", [])
                    throw new Error("")
                } else {
                    if (
                        partialNFT.standard == standard &&
                        partialNFT.tokenId == tokenId &&
                        partialNFT.transactionToken == tokenAddress.toHexString() &&
                        partialNFT.tokenAmount == tokenAmount
                    ) {
                        alreadyExists = true
                    }
                }
            }
            if (!alreadyExists) {
                let partialNft = getOrCreatePartialNft(
                    txHash,
                    partialRecord.nftCount,
                    tokenAddress.toHexString(),
                    tokenId,
                    tokenAmount,
                    standard
                )
                partialNft.save()
                partialRecord.nftCount = partialRecord.nftCount.plus(BIGINT_ONE)
            }
            partialRecord.to = consideration.recipient.toHexString()
        }
    }
    partialRecord.save()

    if (partialRecord.isComplete) {
        if (partialRecord.totalAmountToSeller != BIGINT_ZERO) {
            partialRecord.paymentAmount = partialRecord.totalAmountToSeller
                .plus(partialRecord.feeAmount)
                .plus(partialRecord.totalRoyalty)
        } else {
            log.info(
                "verify more, partialRecord txhash {} totalPaymentAmount took as offerAmount",
                [txHash.toHexString()]
            )
            partialRecord.paymentAmount = partialRecord.totalOfferAmount
        }
    }
    partialRecord.save()
    if (partialRecord.isComplete) {
        let nfts = new Array<airstack.nft.NFT>()
        for (let i = 0; i < partialRecord.nftCount.toI64(); i++) {
            const nftId = partialRecord.id + "-" + i.toString()
            let partialNFT = PartialNft.load(nftId)
            if (partialNFT == null) {
                log.error("partialNfT should not be null", [])
                throw new Error("")
            }
            let nft = new airstack.nft.NFT(
                Address.fromString(partialNFT.transactionToken),
                partialNFT.standard,
                partialNFT.tokenId,
                partialNFT.tokenAmount
            )
            log.info("adding nft -> tokenAddress {} tokenId {} tokenAmount {}", [
                partialNFT.standard,
                partialNFT.tokenId.toString(),
                partialNFT.tokenAmount.toString(),
            ])
            nfts.push(nft)
        }
        let royalties = new Array<airstack.nft.CreatorRoyalty>()
        for (let i = 0; i < partialRecord.royaltyCount.toI64(); i++) {
            const royaltyId = partialRecord.id + "-" + i.toString()
            let partialRoyalty = PartialRoyalty.load(royaltyId)
            if (partialRoyalty == null) {
                log.error("partialRoyalty should not be null", [])
                throw new Error("")
            }
            let royalty = new airstack.nft.CreatorRoyalty(
                partialRoyalty.fees,
                Address.fromString(partialRoyalty.beneficiary)
            )
            log.info("adding royalty -> fees {} beneficiary {}", [
                partialRoyalty.fees.toString(),
                partialRoyalty.beneficiary,
            ])
            royalties.push(royalty)
        }
        let paymentToken: Address = Address.fromString(partialRecord.paymentToken)
        let feeBeneficiary: Address = Address.fromString(partialRecord.feeBeneficiary)
        let feeAmount: BigInt = partialRecord.feeAmount
        let paymentAmount: BigInt = partialRecord.paymentAmount
        let from: Address = Address.fromString(partialRecord.from)
        let to: Address = Address.fromString(partialRecord.to)
        let sale = new airstack.nft.Sale(
            to,
            from,
            nfts,
            paymentAmount,
            paymentToken,
            feeAmount,
            feeBeneficiary,
            royalties
        )
        log.info(
            "adding sale -> from {} to {} nftsLen {} paymentAmount {} paymentToken {} feeAmount {} feeBeneficiary {} royaltiesLen {}",
            [
                from.toHexString(),
                to.toHexString(),
                nfts.length.toString(),
                paymentAmount.toString(),
                paymentToken.toHexString(),
                feeAmount.toString(),
                feeBeneficiary.toHexString(),
                royalties.length.toString(),
            ]
        )
        if (nfts.length == 0) {
            log.error("no nfts involved in this txn hash {}", [txHash.toHexString()])
        } else {
            airstack.nft.trackNFTSaleTransactions(
                event.block,
                txHash.toHexString(),
                event.transaction.index,
                sale,
                MARKET_PLACE_TYPE,
                PROTOCOL_SELL_ACTION_TYPE
            )
        }
    } else {
        log.error("txHash {} not valid since no nft sales involved", [txHash.toHexString()])
    }
}

function getOrCreatePartialNftTransaction(txHash: Bytes): PartialNftTransaction {
    let partialRecord = PartialNftTransaction.load(txHash.toHexString())
    if (partialRecord == null) {
        partialRecord = new PartialNftTransaction(txHash.toHexString())
        partialRecord.hash = txHash.toHexString()
        partialRecord.from = Address.zero().toHexString()
        partialRecord.to = Address.zero().toHexString()
        partialRecord.paymentToken = Address.zero().toHexString()
        partialRecord.totalOfferAmount = BIG_INT_ZERO
        partialRecord.totalAmountToSeller = BIG_INT_ZERO
        partialRecord.paymentAmount = BIG_INT_ZERO
        partialRecord.feeAmount = BIG_INT_ZERO
        partialRecord.totalRoyalty = BIG_INT_ZERO
        partialRecord.feeBeneficiary = Address.zero().toHexString()
        partialRecord.isComplete = false
        partialRecord.royaltyCount = BIGINT_ZERO
        partialRecord.nftCount = BIGINT_ZERO
    }
    return partialRecord
}
function getPartialRoyaltyKey(txHash: Bytes, index: i64): string {
    return txHash.toHexString() + "-" + index.toString()
}
function getPartialNftKey(txHash: Bytes, nftCount: BigInt): string {
    return txHash.toHexString() + "-" + nftCount.toString()
}
function getOrCreatePartialRoyalty(txHash: Bytes, index: i64): PartialRoyalty {
    let royaltyKey = getPartialRoyaltyKey(txHash, index)
    let partialRoyalty = PartialRoyalty.load(royaltyKey)
    if (partialRoyalty == null) {
        partialRoyalty = new PartialRoyalty(royaltyKey)
    }
    return partialRoyalty
}
function getOrCreatePartialNft(
    txHash: Bytes,
    nftCount: BigInt,
    transactionToken: string,
    tokenId: BigInt,
    tokenAmount: BigInt,
    standard: string
): PartialNft {
    let nftKey = getPartialNftKey(txHash, nftCount)
    let partialNft = PartialNft.load(nftKey)
    if (partialNft == null) {
        partialNft = new PartialNft(nftKey)
        partialNft.transactionToken = transactionToken
        partialNft.tokenId = tokenId
        partialNft.tokenAmount = tokenAmount
        partialNft.standard = standard
    }
    return partialNft
}
