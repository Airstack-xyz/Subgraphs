import {
    Address,
    BigInt,
    dataSource,
    log,
} from "@graphprotocol/graph-ts";

import {
    AirAccount,
    AirEntityCounter,
    AirNftTransaction,
    AirToken,
    AirBlock,
    AirNftSaleRoyalty,
    AirMeta
} from "../../../generated/schema";

import { AIR_NFT_SALE_ENTITY_ID } from "./utils";
import { updateAirEntityCounter, getOrCreateAirBlock } from "../common";

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

        let transactionCount = NftSales.length;
        for (let i = 0; i < transactionCount; i++) {
            // Payment Token
            let paymentToken = getOrCreateAirToken(chainID, NftSales[i].paymentToken.toHexString());

            // Account
            let buyerAccount = handleAccountCreation(chainID, NftSales[i].buyer.toHexString(), block.id);
            let sellerAccount = handleAccountCreation(chainID, NftSales[i].seller.toHexString(), block.id);
            let feeAccount = handleAccountCreation(chainID, NftSales[i].protocolFeesBeneficiary.toHexString(), block.id);

            // Sale Token
            let saleToken = getOrCreateAirToken(
                chainID, NftSales[i].nft.collection.toHexString()
            );

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
                let royaltyAccount = handleAccountCreation(
                    chainID,
                    NftSales[i].royalties[j].beneficiary.toHexString(),
                    block.id
                );

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

    export function getOrCreateAirToken(chainID: string, address: string): AirToken {
        let entity = AirToken.load(chainID + "-" + address);
        if (entity == null) {
            entity = new AirToken(chainID + "-" + address);
            entity.address = address;
            entity.save();
        }
        return entity as AirToken;
    }

    export function getOrCreateAirAccount(chainID: string, address: string): AirAccount {
        let entity = AirAccount.load(chainID + "-" + address);
        if (entity == null) {
            entity = new AirAccount(chainID + "-" + address);
            entity.address = address;
        }
        return entity as AirAccount;
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

    export function handleAccountCreation(chainID: string, address: string, createdAt: string): AirAccount {
        let account = AirAccount.load(chainID + "-" + address);
        if (account == null) {
            account = getOrCreateAirAccount(chainID, address);
            account.createdAt = createdAt;
            account.save();
        }
        return account as AirAccount;
    }
}