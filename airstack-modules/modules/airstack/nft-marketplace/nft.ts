import {
    Address,
    BigInt,
    ethereum,
    log,
} from "@graphprotocol/graph-ts";

import {
    AirNftTransaction,
    AirNftSaleRoyalty,
    AirNFT,
    AirBlock,
} from "../../../generated/schema";

import { AIR_NFT_SALE_TRANSACTION_COUNTER_ID, BUNDLE_SALE, SINGLE_ITEM_SALE } from "./utils";
import { updateAirEntityCounter, getOrCreateAirBlock, getOrCreateAirAccount, getOrCreateAirToken, getChainId } from "../common";

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
        protocolActionType: string,
    ): void {
        let nftIds: string[] = [];
        let royaltyIds: string[] = [];
        let saleType = SINGLE_ITEM_SALE;
        const chainId = getChainId();
        let airBlock = getOrCreateAirBlock(chainId, block.number, block.hash.toHexString(), block.timestamp);
        airBlock.save();
        for (let i = 0; i < sale.nfts.length; i++) {
            let nft = sale.nfts[i];
            let nftEntity = getOrCreateAirNFTEntity(nft.collection.toHexString(), nft.tokenId.toString(), nft.amount);
            nftIds.push(nftEntity.id);
        }
        for (let i = 0; i < sale.royalties.length; i++) {
            let royalty = sale.royalties[i];
            createAirNftSaleRoyalty(chainId, transactionHash, logOrCallIndex, royalty.beneficiary.toHexString(), royalty.fee, airBlock);
        }
        if (nftIds.length > 1) {
            saleType = BUNDLE_SALE;
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
            sale.protocolFeesBeneficiary.toHexString(),
        );
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
        ) { }
    }

    /**
     * @param fee royalty fee
     * @param beneficiary royalty beneficiary
     */
    export class CreatorRoyalty {
        constructor(
            public fee: BigInt,
            public beneficiary: Address
        ) { }
    }

    /**
     * @param collection nft collection address
     * @param standard nft standard (ERC1155 or ERC721)
     * @param tokenId nft token id
     * @param amount nft amount
     */
    export class NFT {
        constructor(
            public readonly collection: Address,
            public readonly standard: string, //ERC1155 or ERC721
            public readonly tokenId: BigInt,
            public readonly amount: BigInt
        ) { }
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
    feeBeneficiary: string,
): void {
    const id = chainId.concat('-').concat(transactionHash).concat("-").concat(logOrCallIndex.toString());
    let entity = AirNftTransaction.load(id);
    if (entity == null) {
        entity = new AirNftTransaction(id);
        let airAccountFrom = getOrCreateAirAccount(chainId, from, block);
        airAccountFrom.save();
        entity.from = airAccountFrom.id;
        let airAccountTo = getOrCreateAirAccount(chainId, to, block);
        airAccountTo.save();
        entity.to = airAccountTo.id;
        entity.hash = transactionHash;
        entity.block = block.id;
        entity.index = updateAirEntityCounter(AIR_NFT_SALE_TRANSACTION_COUNTER_ID, block);
        entity.protocolType = protocolType;
        entity.protocolActionType = protocolActionType;
        entity.nfts = nftIds;
        entity.saleType = saleType;
        let airTokenPaymentToken = getOrCreateAirToken(chainId, paymentToken);
        airTokenPaymentToken.save();
        entity.paymentToken = airTokenPaymentToken.id;
        entity.paymentAmount = paymentAmount;
        entity.feeAmount = feeAmount;
        let airAccountFeeBeneficiary = getOrCreateAirAccount(chainId, feeBeneficiary, block);
        airAccountFeeBeneficiary.save();
        entity.feeBeneficiary = airAccountFeeBeneficiary.id;
        entity.save();
    }
}

/**
 * @dev this function gets or creates AirNFT entity
 * @param tokenAddress nft token address
 * @param tokenId nft token id
 * @param tokenAmount nft token amount
 * @returns AirNFT entity
 */
function getOrCreateAirNFTEntity(
    tokenAddress: string,
    tokenId: string,
    tokenAmount: BigInt,
): AirNFT {
    const chainId = getChainId();
    const id = chainId.concat("-").concat(tokenAddress).concat('-').concat(tokenId.toString());
    let entity = AirNFT.load(id);
    if (entity == null) {
        entity = new AirNFT(id);
        let airToken = getOrCreateAirToken(chainId, tokenAddress);
        airToken.save();
        entity.tokenAddress = airToken.id;
        entity.tokenId = tokenId;
        entity.tokenAmount = tokenAmount;
        entity.save();
    }
    return entity as AirNFT;
}

/**
 * @dev this function creates AirNftSaleRoyalty entity
 * @param chainId chain id
 * @param transactionHash transaction hash
 * @param logOrCallIndex transaction log or call index
 * @param royaltyBeneficiary royalty beneficiary address
 * @param royaltyAmount royalty amount
 * @param airBlock air block entity
 * @returns AirNftSaleRoyalty entity
 */
function createAirNftSaleRoyalty(
    chainId: string,
    transactionHash: string,
    logOrCallIndex: BigInt,
    royaltyBeneficiary: string,
    royaltyAmount: BigInt,
    airBlock: AirBlock,
): AirNftSaleRoyalty {
    const airNftTransactionId = chainId.concat('-').concat(transactionHash).concat("-").concat(logOrCallIndex.toString());
    const id = airNftTransactionId.concat("-").concat(royaltyBeneficiary);
    let entity = AirNftSaleRoyalty.load(id);
    if (entity == null) {
        entity = new AirNftSaleRoyalty(id);
        entity.amount = royaltyAmount;
        let airAccountRoyaltyBeneficiary = getOrCreateAirAccount(chainId, royaltyBeneficiary, airBlock);
        airAccountRoyaltyBeneficiary.save();
        entity.beneficiary = airAccountRoyaltyBeneficiary.id;
        entity.nftTransaction = airNftTransactionId;
        entity.save();
    }
    return entity as AirNftSaleRoyalty;
}