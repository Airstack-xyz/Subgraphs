import {
    Address,
    BigInt,
    log,
} from "@graphprotocol/graph-ts";

import {
    AirNftTransaction,
    AirNftSaleRoyalty,
} from "../../../generated/schema";

import { AIR_NFT_SALE_ENTITY_ID } from "./utils";
import { updateAirEntityCounter, getOrCreateAirBlock, getOrCreateAirAccount, getOrCreateAirToken } from "../common";

export namespace nft {
    export function trackNFTSaleTransactions(
        chainID: string,
        txHash: string,
        txIndex: BigInt,
        NftSales: Sale[],
        protocolType: string,
        protocolActionType: string,
        timestamp: BigInt,
        blockHeight: BigInt,
        blockHash: string
    ): void {
        if (NftSales.length == 0) {
            return;
        }

        let block = getOrCreateAirBlock(chainID, blockHeight, blockHash, timestamp);
        block.save();
        let transactionCount = NftSales.length;
        for (let i = 0; i < transactionCount; i++) {
            // Payment Token
            let paymentToken = getOrCreateAirToken(chainID, NftSales[i].paymentToken.toHexString());
            paymentToken.save();
            // Account
            let buyerAccount = getOrCreateAirAccount(chainID, NftSales[i].buyer.toHexString(), block);
            buyerAccount.save();
            let sellerAccount = getOrCreateAirAccount(chainID, NftSales[i].seller.toHexString(), block);
            sellerAccount.save();
            let feeAccount = getOrCreateAirAccount(chainID, NftSales[i].protocolFeesBeneficiary.toHexString(), block);
            feeAccount.save();
            // Sale Token
            let saleToken = getOrCreateAirToken(
                chainID, NftSales[i].nft.collection.toHexString()
            );
            saleToken.save();

            // Transaction
            let transactionId = getNFTSaleTransactionId(
                chainID,
                txHash,
                txIndex,
                NftSales[i].nft.collection.toHexString(),
                NftSales[i].nft.tokenId
            )

            let transaction = AirNftTransaction.load(transactionId);
            if (transaction == null) {
                transaction = getOrCreateAirNftTransaction(
                    transactionId
                );

                transaction.index = updateAirEntityCounter(AIR_NFT_SALE_ENTITY_ID, block);
            }

            transaction.to = buyerAccount.id;
            transaction.from = sellerAccount.id;
            transaction.protocolType = protocolType;
            transaction.protocolActionType = protocolActionType;
            transaction.tokenId = NftSales[i].nft.tokenId;
            transaction.tokenAmount = NftSales[i].nft.amount;
            transaction.paymentToken = paymentToken.id;
            transaction.paymentAmount = NftSales[i].paymentAmount;
            transaction.feeAmount = NftSales[i].protocolFees;
            transaction.feeBeneficiary = feeAccount.id;

            transaction.transactionToken = saleToken.id;
            transaction.hash = txHash;
            transaction.block = block.id;

            // Creator Royalty
            for (let j = 0; j < NftSales[i].royalties.length; j++) {
                let royaltyAccount = getOrCreateAirAccount(
                    chainID,
                    NftSales[i].royalties[j].beneficiary.toHexString(),
                    block
                );
                royaltyAccount.save();
                let royaltyId = transactionId + "-" + NftSales[i].royalties[j].beneficiary.toHexString();
                let royalty = getOrCreateRoyalty(royaltyId);

                royalty.amount = NftSales[i].royalties[j].fee
                royalty.beneficiary = royaltyAccount.id
                royalty.nftTransaction = transactionId

                royalty.save()

                log.debug("txId {} royaltyBeneficiary {} Amount {}",
                    [
                        transactionId,
                        royalty.beneficiary,
                        royalty.amount.toString(),
                    ]
                )

            }
            transaction.save();
        }
    }

    export function getNFTSaleTransactionId(
        chainID: string,
        txHash: string,
        txIndex: BigInt,
        contractAddress: string,
        nftId: BigInt
    ): string {
        return chainID
            .concat("-")
            .concat(txHash)
            .concat("-")
            .concat(txIndex.toString())
            .concat("-")
            .concat(contractAddress)
            .concat("-")
            .concat(nftId.toString());
    }

    export function getOrCreateAirNftTransaction(
        id: string
    ): AirNftTransaction {
        let transaction = AirNftTransaction.load(id);

        if (transaction == null) {
            transaction = new AirNftTransaction(id);
        }

        return transaction as AirNftTransaction;
    }

    export function getOrCreateRoyalty(
        id: string
    ): AirNftSaleRoyalty {
        let royalty = AirNftSaleRoyalty.load(id);
        if (royalty == null) {
            royalty = new AirNftSaleRoyalty(id);
        }
        return royalty as AirNftSaleRoyalty;
    }

    export class Sale {
        constructor(
            public buyer: Address,
            public seller: Address,
            public nft: NFT,
            public paymentAmount: BigInt,
            public paymentToken: Address,
            public protocolFees: BigInt,
            public protocolFeesBeneficiary: Address,
            public royalties: CreatorRoyalty[]
        ) { }
    }

    export class CreatorRoyalty {
        constructor(
            public fee: BigInt,
            public beneficiary: Address
        ) { }
    }

    export class NFT {
        constructor(
            public readonly collection: Address,
            public readonly standard: string, //ERC1155 or ERC721
            public readonly tokenId: BigInt,
            public readonly amount: BigInt
        ) { }
    }

}