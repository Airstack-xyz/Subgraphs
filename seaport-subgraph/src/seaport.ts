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

  let allSales = new Array<airstack.nft.Sale>()
  let paymentToken = Address.zero()
  let offerAmount = BIGINT_ZERO
  for (let i = 0; i < event.params.offer.length; i++) {
    const offer = event.params.offer[i]

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
  let totalAmountToSeller = BIGINT_ZERO
  let feeRecipient = Address.zero()
  let totalfeeAmount = BIGINT_ZERO
  let totalRoyaltyFees = BIGINT_ZERO
  let totalRoyaltyArr = new Array<airstack.nft.CreatorRoyalty>()
  for (let i = 0; i < event.params.consideration.length; i++) {
    const consideration = event.params.consideration[i]
    let isNFT = isNFTEntity(consideration.itemType)

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
        let royalty = new airstack.nft.CreatorRoyalty(consideration.amount, consideration.recipient)
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

  let totalPaymentAmount = BIGINT_ZERO
  if (totalAmountToSeller == BIGINT_ZERO) {
    totalPaymentAmount = offerAmount
  } else {
    totalPaymentAmount = totalRoyaltyFees.plus(totalfeeAmount).plus(totalAmountToSeller)
  }

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
  // logging
  for (let i = 0; i < allSales.length; i++) {
    let sale = allSales[i]
    let royalties = sale.royalties
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
      let partialNft = getOrCreatePartialNft(
        txHash,
        offer.token.toHexString(),
        offer.identifier,
        offer.amount,
        standard
      )
      partialNft.save()
      let alreadyExists = false
      let partialNftArr = partialRecord.partialNFT
      for (let j = 0; j < partialNftArr.length; j++) {
        const partialNftKey = partialNftArr[j]
        if (partialNftKey == partialNft.id) {
          alreadyExists = true
          break
        }
      }
      if (!alreadyExists) {
        partialNftArr.push(partialNft.id)
        partialRecord.partialNFT = partialNftArr
      }
      partialRecord.from = offerer.toHexString()
    }
  }
  for (let i = 0; i < event.params.consideration.length; i++) {
    const consideration = event.params.consideration[i]
    let isNFT = isNFTEntity(consideration.itemType)
    if (!isNFT) {
      partialRecord.paymentToken = consideration.token.toHexString()

      if (consideration.recipient.toHexString() == partialRecord.from) {
        let amountToSeller = partialRecord.totalAmountToSeller
        partialRecord.totalAmountToSeller = amountToSeller.plus(consideration.amount)
      } else if (isOpenSeaFeeAccount(consideration.recipient)) {
        let feeAmount = partialRecord.totalFeeAmount
        partialRecord.totalFeeAmount = feeAmount.plus(consideration.amount)
        partialRecord.feeBeneficiary = consideration.recipient.toHexString()
      } else if (consideration.recipient.toHexString() != partialRecord.to) {
        let royaltyCount = partialRecord.royaltyCount
        let partialRoyalty = getOrCreatePartialRoyalty(txHash, royaltyCount.toI64())
        partialRecord.totalRoyalty = partialRecord.totalRoyalty.plus(consideration.amount)
        partialRoyalty.amount = consideration.amount
        partialRoyalty.beneficiary = consideration.recipient.toHexString()
        partialRoyalty.save()
        partialRecord.royaltyCount = royaltyCount.plus(BIGINT_ONE)
      }
    } else {
      let standard = getNFTStandard(consideration.itemType)
      let partialNft = getOrCreatePartialNft(
        txHash,
        consideration.token.toHexString(),
        consideration.identifier,
        consideration.amount,
        standard
      )
      partialNft.save()
      let alreadyExists = false
      let partialNftArr = partialRecord.partialNFT
      for (let j = 0; j < partialNftArr.length; j++) {
        const partialNftKey = partialNftArr[j]
        if (partialNftKey == partialNft.id) {
          alreadyExists = true
          break
        }
      }
      if (!alreadyExists) {
        partialNftArr.push(partialNft.id)
        partialRecord.partialNFT = partialNftArr
      }
      partialRecord.to = consideration.recipient.toHexString()
    }
  }
  if (partialRecord.isComplete) {
    if (partialRecord.totalAmountToSeller != BIGINT_ZERO) {
      partialRecord.totalPaymentAmount = partialRecord.totalAmountToSeller
        .plus(partialRecord.totalFeeAmount)
        .plus(partialRecord.totalRoyalty)
    } else {
      log.info("verify more, partialRecord txhash {} totalPaymentAmount took as offerAmount", [
        txHash.toHexString(),
      ])
      partialRecord.totalPaymentAmount = partialRecord.totalOfferAmount
    }
  }
  partialRecord.save()
  if (partialRecord.isComplete) {
    // logging
    let royaltyArr = new Array<airstack.nft.CreatorRoyalty>()
    for (let i = 0; i < partialRecord.royaltyCount.toI64(); i++) {
      let royaltyKey = getPartialRoyaltyKey(txHash, i)
      let royalty = PartialRoyalty.load(royaltyKey)
      if (royalty != null) {
        log.debug("isComplete pusing royalty amount {} beneficiary {}", [
          royalty.amount.div(BigInt.fromI64(partialRecord.partialNFT.length)).toString(),
          royalty.beneficiary,
        ])
        let royaltyRec = new airstack.nft.CreatorRoyalty(
          royalty.amount.div(BigInt.fromI64(partialRecord.partialNFT.length)),
          Address.fromString(royalty.beneficiary)
        )
        royaltyArr.push(royaltyRec)
      }
    }
    let allSales = new Array<airstack.nft.Sale>()

    for (let i = 0; i < partialRecord.partialNFT.length; i++) {
      let partialNftKey = partialRecord.partialNFT[i]
      let partialNft = PartialNft.load(partialNftKey)
      if (partialNft != null) {
        let nft = new airstack.nft.NFT(
          Address.fromString(partialNft.transactionToken),
          partialNft.standard,
          partialNft.tokenId,
          partialNft.tokenAmount
        )
        let sale = new airstack.nft.Sale(
          Address.fromString(partialRecord.to),
          Address.fromString(partialRecord.from),
          nft,
          partialRecord.totalPaymentAmount.div(BigInt.fromI64(partialRecord.partialNFT.length)),
          Address.fromString(partialRecord.paymentToken),
          partialRecord.totalFeeAmount.div(BigInt.fromI64(partialRecord.partialNFT.length)),
          Address.fromString(partialRecord.feeBeneficiary),
          royaltyArr
        )
        allSales.push(sale)
      }
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
    partialRecord.paymentToken = Address.zero().toHexString()
    partialRecord.totalOfferAmount = BIG_INT_ZERO
    partialRecord.totalAmountToSeller = BIG_INT_ZERO
    partialRecord.totalPaymentAmount = BIG_INT_ZERO
    partialRecord.totalFeeAmount = BIG_INT_ZERO
    partialRecord.totalRoyalty = BIG_INT_ZERO
    partialRecord.feeBeneficiary = Address.zero().toHexString()
    partialRecord.isComplete = false
    partialRecord.royaltyCount = BIGINT_ZERO
    partialRecord.partialNFT = []
  }
  return partialRecord
}

function getPartialRoyaltyKey(txHash: Bytes, index: i64): string {
  return txHash.toHexString() + "-" + index.toString()
}
function getPartialNftKey(
  txHash: Bytes,
  transactionToken: String,
  tokenId: BigInt,
  tokenAmount: BigInt
): string {
  return (
    txHash.toHexString() +
    "-" +
    transactionToken +
    "-" +
    tokenId.toString() +
    "-" +
    tokenAmount.toString()
  )
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
  transactionToken: string,
  tokenId: BigInt,
  tokenAmount: BigInt,
  standard: string
): PartialNft {
  let nftKey = getPartialNftKey(txHash, transactionToken, tokenId, tokenAmount)
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
