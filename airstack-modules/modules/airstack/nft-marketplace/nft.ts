import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

import { AirNftTransaction, AirNftSaleRoyalty, AirNFT, AirBlock } from "../../../generated/schema"

import { AIR_NFT_SALE_TRANSACTION_COUNTER_ID, BUNDLE_SALE, SINGLE_ITEM_SALE } from "./utils"
import {
  updateAirEntityCounter,
  getOrCreateAirBlock,
  getOrCreateAirAccount,
  getOrCreateAirToken,
  getChainId,
} from "../common"

export namespace nft {
  /**
   * @dev this function is used to track nft marketplace sale transactions
   * @param block ethereum block
   * @param transactionHash transaction hash
   * @param logOrCallIndex transaction log or call index
   * @param sale sale object
   * @param protocolType protocol type (eg: NFT_MARKET_PLACE)
   * @param protocolActionType protocol action type (eg: BUY/SELL)
   */
  export function trackNFTSaleTransactions(
    block: ethereum.Block,
    transactionHash: string,
    logOrCallIndex: BigInt,
    sale: Sale,
    protocolType: string,
    protocolActionType: string
  ): void {
    const chainId = getChainId()
    const airNftTransactionEntityId = GetAirNftTransactionEntityId(
      chainId,
      transactionHash,
      logOrCallIndex
    )
    let nftIds: string[] = []
    let saleType = SINGLE_ITEM_SALE
    let airBlock = getOrCreateAirBlock(
      chainId,
      block.number,
      block.hash.toHexString(),
      block.timestamp
    )
    airBlock.save()
    for (let i = 0; i < sale.nfts.length; i++) {
      let nft = sale.nfts[i]
      let nftEntity = getOrCreateAirNFTEntity(
        nft.collection.toHexString(),
        nft.tokenId.toString(),
        nft.amount,
        airNftTransactionEntityId
      )
      nftIds.push(nftEntity.id)
    }
    for (let i = 0; i < sale.royalties.length; i++) {
      let royalty = sale.royalties[i]
      createAirNftSaleRoyalty(
        chainId,
        royalty.beneficiary.toHexString(),
        royalty.fee,
        airBlock,
        airNftTransactionEntityId
      )
    }
    if (nftIds.length > 1) {
      saleType = BUNDLE_SALE
    }
    createAirNftSaleTransaction(
      chainId,
      airBlock,
      transactionHash,
      logOrCallIndex,
      sale.seller.toHexString(),
      sale.buyer.toHexString(),
      protocolType,
      protocolActionType,
      nftIds,
      saleType,
      sale.paymentToken.toHexString(),
      sale.paymentAmount,
      sale.protocolFees,
      sale.protocolFeesBeneficiary.toHexString()
    )
  }

  /**
   * @param buyer buyer address
   * @param seller seller address
   * @param nfts nfts class
   *
   */
  export class Sale {
    constructor(
      public buyer: Address,
      public seller: Address,
      public nfts: NFT[],
      public paymentAmount: BigInt,
      public paymentToken: Address,
      public protocolFees: BigInt,
      public protocolFeesBeneficiary: Address,
      public royalties: CreatorRoyalty[]
    ) {}
  }

  /**
   * @param fee royalty fee
   * @param beneficiary royalty beneficiary
   */
  export class CreatorRoyalty {
    constructor(public fee: BigInt, public beneficiary: Address) {}
  }

  /**
   * @param collection nft collection address
   * @param tokenId nft token id
   * @param amount nft amount
   */
  export class NFT {
    constructor(
      public readonly collection: Address,
      public readonly tokenId: BigInt,
      public readonly amount: BigInt
    ) {}
  }
}

/**
 *
 * @param chainId chaind id
 * @param block air block entity
 * @param transactionHash transaction hash
 * @param logOrCallIndex transaction log or call index
 * @param from nft sender address
 * @param to nft receiver address
 * @param protocolType protocol type (eg: NFT_MARKET_PLACE)
 * @param protocolActionType protocol action type (eg: BUY/SELL)
 * @param nftIds AirNFT entity ids
 * @param saleType sale type (eg: SINGLE_ITEM_SALE/BUNDLE_SALE)
 * @param paymentToken payment token address used for sale
 * @param paymentAmount payment amount for sale
 * @param feeAmount protocol fee amount
 * @param feeBeneficiary protocol fee beneficiary address
 */
function createAirNftSaleTransaction(
  chainId: string,
  block: AirBlock,
  transactionHash: string,
  logOrCallIndex: BigInt,
  from: string,
  to: string,
  protocolType: string,
  protocolActionType: string,
  nftIds: string[],
  saleType: string,
  paymentToken: string,
  paymentAmount: BigInt,
  feeAmount: BigInt,
  feeBeneficiary: string
): void {
  const id = GetAirNftTransactionEntityId(chainId, transactionHash, logOrCallIndex)
  let entity = AirNftTransaction.load(id)
  if (entity == null) {
    entity = new AirNftTransaction(id)
    let airAccountFrom = getOrCreateAirAccount(chainId, from, block)
    airAccountFrom.save()
    entity.from = airAccountFrom.id
    let airAccountTo = getOrCreateAirAccount(chainId, to, block)
    airAccountTo.save()
    entity.to = airAccountTo.id
    entity.hash = transactionHash
    entity.block = block.id
    entity.index = updateAirEntityCounter(AIR_NFT_SALE_TRANSACTION_COUNTER_ID, block)
    entity.protocolType = protocolType
    entity.protocolActionType = protocolActionType
    entity.nfts = nftIds
    entity.saleType = saleType
    let airTokenPaymentToken = getOrCreateAirToken(chainId, paymentToken)
    airTokenPaymentToken.save()
    entity.paymentToken = airTokenPaymentToken.id
    entity.paymentAmount = paymentAmount
    entity.feeAmount = feeAmount
    let airAccountFeeBeneficiary = getOrCreateAirAccount(chainId, feeBeneficiary, block)
    airAccountFeeBeneficiary.save()
    entity.feeBeneficiary = airAccountFeeBeneficiary.id
    entity.save()
  }
}

/**
 * @dev this function gets or creates AirNFT entity
 * @param tokenAddress nft token address
 * @param tokenId nft token id
 * @param tokenAmount nft token amount
 * @param airNftTransactionEntityId AirNftTransaction entity id
 * @returns AirNFT entity
 */
function getOrCreateAirNFTEntity(
  tokenAddress: string,
  tokenId: string,
  tokenAmount: BigInt,
  airNftTransactionEntityId: string
): AirNFT {
  const chainId = getChainId()
  const id = airNftTransactionEntityId
    .concat("-")
    .concat(tokenAddress)
    .concat("-")
    .concat(tokenId.toString())
  let entity = AirNFT.load(id)
  if (entity == null) {
    entity = new AirNFT(id)
    let airToken = getOrCreateAirToken(chainId, tokenAddress)
    airToken.save()
    entity.tokenAddress = airToken.id
    entity.tokenId = tokenId
    entity.tokenAmount = tokenAmount
    entity.save()
  }
  return entity as AirNFT
}

/**
 * @dev this function creates AirNftSaleRoyalty entity
 * @param chainId chain id
 * @param royaltyBeneficiary royalty beneficiary address
 * @param royaltyAmount royalty amount
 * @param airBlock air block entity
 * @param airNftTransactionId AirNftTransaction entity id
 * @returns AirNftSaleRoyalty entity
 */
function createAirNftSaleRoyalty(
  chainId: string,
  royaltyBeneficiary: string,
  royaltyAmount: BigInt,
  airBlock: AirBlock,
  airNftTransactionId: string
): AirNftSaleRoyalty {
  const id = airNftTransactionId
    .concat("-")
    .concat(royaltyBeneficiary)
    .concat("-")
    .concat(royaltyAmount.toString())
  let entity = AirNftSaleRoyalty.load(id)
  if (entity == null) {
    entity = new AirNftSaleRoyalty(id)
    entity.amount = royaltyAmount
    let airAccountRoyaltyBeneficiary = getOrCreateAirAccount(chainId, royaltyBeneficiary, airBlock)
    airAccountRoyaltyBeneficiary.save()
    entity.beneficiary = airAccountRoyaltyBeneficiary.id
    entity.nftTransaction = airNftTransactionId
    entity.save()
  }
  return entity as AirNftSaleRoyalty
}

/**
 * @dev this function returns id of AirNftTransactionEntity
 * @param chainId
 * @param transactionHash
 * @param logOrCallIndex
 * @returns AirNftTransactionEntity id
 */
function GetAirNftTransactionEntityId(
  chainId: string,
  transactionHash: string,
  logOrCallIndex: BigInt
): string {
  return chainId
    .concat("-")
    .concat(transactionHash)
    .concat("-")
    .concat(logOrCallIndex.toString())
}
