import { Address, BigDecimal, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
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
import { PartialRoyalty, PartialNftTransaction } from "../generated/schema"
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common"
export function handleOrderFulfilled(event: OrderFulfilled): void {
  let txHash = event.transaction.hash
  let offerer = event.params.offerer
  let recipient = event.params.recipient
  let isPartialEvent = recipient == Address.zero()
  let seller: Address = Address.zero(),
    buyer: Address = Address.zero()
  let allSales = new Array<airstack.nft.Sale>()
  let paymentToken = Address.zero()
  let offerAmount = BIGINT_ZERO
  // only used if needed
  let partialRecord = getOrCreatePartialNftTransaction(txHash)
  for (let i = 0; i < event.params.offer.length; i++) {
    const offer = event.params.offer[i]
    if (isPartialEvent) {
      let isNFT = isNFTEntity(offer.itemType)
      if (!isNFT) {
        partialRecord.offerAmount = offer.amount
        partialRecord.paymentToken = offer.token.toHexString()
        partialRecord.to = offerer.toHexString()
        if (!partialRecord.isComplete) {
          partialRecord.isComplete =
            partialRecord.from != Address.zero().toHexString() &&
            partialRecord.to != Address.zero().toHexString()
        }
      } else {
        partialRecord.tokenId = offer.identifier
        partialRecord.tokenAmount = offer.amount
        partialRecord.transactionToken = offer.token.toHexString()
        partialRecord.from = offerer.toHexString()
        if (!partialRecord.isComplete) {
          partialRecord.isComplete =
            partialRecord.from != Address.zero().toHexString() &&
            partialRecord.to != Address.zero().toHexString()
        }
      }
    } else {
      let isNFT = isNFTEntity(offer.itemType)
      if (isNFT) {
        let standard = getNFTStandard(offer.itemType)
        let nft = new airstack.nft.NFT(offer.token, standard, offer.identifier, offer.amount)
        buyer = recipient
        seller = offerer
        let sale = new airstack.nft.Sale(
          buyer,
          seller,
          nft,
          BigInt.fromI32(0),
          Address.zero(),
          BigInt.fromI32(0),
          Address.zero(),
          new Array<airstack.nft.CreatorRoyalty>()
        )
        allSales.push(sale)
      } else {
        buyer = offerer
        seller = recipient
        paymentToken = offer.token
        offerAmount = offer.amount
      }
    }
  }
  let totalAmountToSeller = BIGINT_ZERO
  let feeRecipient = Address.zero()
  let totalfeeAmount = BIGINT_ZERO
  let totalRoyaltyFees = BIGINT_ZERO
  let totalRoyaltyArr = new Array<airstack.nft.CreatorRoyalty>()
  for (let i = 0; i < event.params.consideration.length; i++) {
    const consideration = event.params.consideration[i]
    let isNFT = isNFTEntity(consideration.itemType)
    if (isPartialEvent) {
      if (!isNFT) {
        partialRecord.paymentToken = consideration.token.toHexString()
        if (consideration.recipient.toHexString() == partialRecord.from) {
          let amountToSeller = partialRecord.amountToSeller
          partialRecord.amountToSeller = amountToSeller.plus(consideration.amount)
        } else if (isOpenSeaFeeAccount(consideration.recipient)) {
          let feeAmount = partialRecord.feeAmount
          partialRecord.feeAmount = feeAmount.plus(consideration.amount)
          partialRecord.feeBeneficiary = consideration.recipient.toHexString()
        } else {
          let royaltyCount = partialRecord.royaltyCount
          let partialRoyalty = getOrCreatePartialRoyalty(txHash, royaltyCount.toI64())
          partialRecord.totalRoyalty = partialRecord.totalRoyalty.plus(consideration.amount)
          partialRoyalty.amount = consideration.amount
          partialRoyalty.beneficiary = consideration.recipient.toHexString()
          partialRoyalty.save()
          partialRecord.royaltyCount = royaltyCount.plus(BIGINT_ONE)
        }
      } else {
        partialRecord.tokenId = consideration.identifier
        partialRecord.tokenAmount = consideration.amount
        partialRecord.transactionToken = consideration.token.toHexString()
        partialRecord.to = consideration.recipient.toHexString()
        partialRecord.standard = getNFTStandard(consideration.itemType)
      }
    } else {
      if (!isNFT) {
        paymentToken = consideration.token
        if (consideration.recipient == seller) {
          totalAmountToSeller = totalAmountToSeller.plus(consideration.amount)
        } else if (isOpenSeaFeeAccount(consideration.recipient)) {
          feeRecipient = consideration.recipient
          totalfeeAmount = totalfeeAmount.plus(consideration.amount)
        } else {
          // royalty case
          totalRoyaltyFees = totalRoyaltyFees.plus(consideration.amount)
          let royalty = new airstack.nft.CreatorRoyalty(
            consideration.amount,
            consideration.recipient
          )
          totalRoyaltyArr.push(royalty)
        }
      } else {
        let standard = getNFTStandard(consideration.itemType)
        let nft = new airstack.nft.NFT(
          consideration.token,
          standard,
          consideration.identifier,
          consideration.amount
        )
        let sale = new airstack.nft.Sale(
          buyer,
          seller,
          nft,
          offerAmount,
          paymentToken,
          BigInt.fromI32(0),
          Address.zero(),
          new Array<airstack.nft.CreatorRoyalty>()
        )
        allSales.push(sale)
      }
    }
  }
  if (partialRecord.isComplete) {
    if (partialRecord.amountToSeller != BIGINT_ZERO) {
      partialRecord.paymentAmount = partialRecord.amountToSeller
        .plus(partialRecord.feeAmount)
        .plus(partialRecord.totalRoyalty)
    } else {
      log.info("partialRecord txhash {} paymentAmount took as offerAmount", [txHash.toHexString()])
      throw new Error("")
      partialRecord.paymentAmount = partialRecord.offerAmount
    }
  }
  partialRecord.save()
  let totalPaymentAmount = BIGINT_ZERO
  if (totalAmountToSeller == BIGINT_ZERO) {
    totalPaymentAmount = offerAmount
  } else {
    totalPaymentAmount = totalRoyaltyFees.plus(totalfeeAmount).plus(totalAmountToSeller)
  }
  if (isPartialEvent) {
    log.debug(
      " isPartialEvent hash {} from {} to {} standard {} tokenId {} tokenAmount {} transactionToken {} paymentToken {} offerAmount {} amountToSeller {} paymentAmount {} feeAmount {} feeBeneficiary {} isComplete {} totalRoyalty {}",
      [
        partialRecord.hash,
        partialRecord.from,
        partialRecord.to,
        partialRecord.standard,
        partialRecord.tokenId.toString(),
        partialRecord.tokenAmount.toString(),
        partialRecord.transactionToken,
        partialRecord.paymentToken,
        partialRecord.offerAmount.toString(),
        partialRecord.amountToSeller.toString(),
        partialRecord.paymentAmount.toString(),
        partialRecord.feeAmount.toString(),
        partialRecord.feeBeneficiary,
        partialRecord.isComplete.toString(),
        partialRecord.totalRoyalty.toString(),
      ]
    )
    for (let i = 0; i < partialRecord.royaltyCount.toI64(); i++) {
      let royaltyKey = getPartialRoyaltyKey(txHash, i)
      let royalty = PartialRoyalty.load(royaltyKey)
      if (royalty != null) {
        log.debug("isPartialEvent hash {} royaly amount {} beneficiary {}", [
          txHash.toHexString(),
          royalty.amount.toString(),
          royalty.beneficiary,
        ])
      }
    }
    if (partialRecord.isComplete) {
      let standard = partialRecord.standard
      let nft = new airstack.nft.NFT(
        Address.fromString(partialRecord.transactionToken),
        standard,
        partialRecord.tokenId,
        partialRecord.tokenAmount
      )
      // preparing royalty arr
      let royaltyArr = new Array<airstack.nft.CreatorRoyalty>()
      for (let i = 0; i < partialRecord.royaltyCount.toI64(); i++) {
        let royaltyKey = getPartialRoyaltyKey(txHash, i)
        let royalty = PartialRoyalty.load(royaltyKey)
        if (royalty != null) {
          log.debug("isComplete pusing royalty amount {} beneficiary {}", [
            royalty.amount.toString(),
            royalty.beneficiary,
          ])
          let royaltyRec = new airstack.nft.CreatorRoyalty(
            royalty.amount,
            Address.fromString(royalty.beneficiary)
          )
          royaltyArr.push(royaltyRec)
        }
      }
      for (let i = 0; i < royaltyArr.length; i++) {
        log.debug("from actual royalty {} {}", [
          royaltyArr[i].fee.toString(),
          royaltyArr[i].beneficiary.toHexString(),
        ])
      }
      let sale = new airstack.nft.Sale(
        Address.fromString(partialRecord.to),
        Address.fromString(partialRecord.from),
        nft,
        partialRecord.paymentAmount,
        Address.fromString(partialRecord.paymentToken),
        partialRecord.feeAmount,
        Address.fromString(partialRecord.feeBeneficiary),
        royaltyArr
      )
      allSales.push(sale)
      log.debug("allsales len{}", [allSales.length.toString()])
      airstack.nft.trackNFTSaleTransactions(
        ETHEREUM_MAINNET_ID,
        txHash.toHexString(),
        event.transaction.index,
        allSales,
        MARKET_PLACE_TYPE,
        PROTOCOL_SELL_ACTION_TYPE,
        event.block.timestamp,
        event.block.number,
        event.block.hash.toHexString()
      )
    }
  } else {
    for (let i = 0; i < allSales.length; i++) {
      // for dividing fees
      let sale = allSales[i]
      sale.protocolFeesBeneficiary = feeRecipient
      sale.protocolFees = totalfeeAmount.div(BigInt.fromI64(allSales.length))
      sale.paymentAmount = totalPaymentAmount.div(BigInt.fromI64(allSales.length))
      sale.paymentToken = paymentToken
      let finalRoyaltyArr = new Array<airstack.nft.CreatorRoyalty>()
      for (let j = 0; j < totalRoyaltyArr.length; j++) {
        let totalRoyalty = totalRoyaltyArr[j]
        let royalty = new airstack.nft.CreatorRoyalty(
          totalRoyalty.fee.div(BigInt.fromI64(allSales.length)),
          totalRoyalty.beneficiary
        )
        finalRoyaltyArr.push(royalty)
      }
      sale.royalties = finalRoyaltyArr
    }
  }
  // logging
  for (let i = 0; i < allSales.length; i++) {
    let sale = allSales[i]
    let royalties = sale.royalties
    let nft = sale.nft
    log.debug(
      "buyer {}, seller {} paymentAmount {} paymentToken {} protocolFees {} protocolFeesBeneficiary {} ",
      [
        sale.buyer.toHexString(),
        sale.seller.toHexString(),
        sale.paymentAmount.toString(),
        sale.paymentToken.toHexString(),
        sale.protocolFees.toString(),
        sale.protocolFeesBeneficiary.toHexString(),
      ]
    )
    for (let i = 0; i < royalties.length; i++) {
      let royalty = royalties[i]
      log.debug("royalty: fee {}, beneficiary {}", [
        royalty.fee.toString(),
        royalty.beneficiary.toHexString(),
      ])
    }
    airstack.nft.trackNFTSaleTransactions(
      ETHEREUM_MAINNET_ID,
      txHash.toHexString(),
      event.transaction.index,
      allSales,
      MARKET_PLACE_TYPE,
      PROTOCOL_SELL_ACTION_TYPE,
      event.block.timestamp,
      event.block.number,
      event.block.hash.toHexString()
    )
  }
}

function getOrCreatePartialNftTransaction(txHash: Bytes): PartialNftTransaction {
  let partialRecord = PartialNftTransaction.load(txHash.toHexString())
  if (partialRecord == null) {
    partialRecord = new PartialNftTransaction(txHash.toHexString())
    partialRecord.hash = txHash.toHexString()
    partialRecord.from = Address.zero().toHexString()
    partialRecord.to = Address.zero().toHexString()
    partialRecord.standard = ""
    partialRecord.tokenId = BIG_INT_ZERO
    partialRecord.tokenAmount = BIG_INT_ZERO
    partialRecord.transactionToken = Address.zero().toHexString()
    partialRecord.paymentToken = Address.zero().toHexString()
    partialRecord.offerAmount = BIG_INT_ZERO
    partialRecord.amountToSeller = BIG_INT_ZERO
    partialRecord.paymentAmount = BIG_INT_ZERO
    partialRecord.feeAmount = BIG_INT_ZERO
    partialRecord.totalRoyalty = BIG_INT_ZERO
    partialRecord.feeBeneficiary = Address.zero().toHexString()
    partialRecord.isComplete = false
    partialRecord.royaltyCount = BIGINT_ZERO
  }
  return partialRecord
}

function getPartialRoyaltyKey(txHash: Bytes, index: i64): string {
  return txHash.toHexString() + "-" + index.toString()
}
function getOrCreatePartialRoyalty(txHash: Bytes, index: i64): PartialRoyalty {
  let royaltyKey = getPartialRoyaltyKey(txHash, index)
  let partialRoyalty = PartialRoyalty.load(royaltyKey)
  if (partialRoyalty == null) {
    partialRoyalty = new PartialRoyalty(royaltyKey)
  }
  return partialRoyalty
}
