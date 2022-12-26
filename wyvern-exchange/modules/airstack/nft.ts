import {
    Address,
    BigInt,
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
} from "../../generated/schema";

import { AIR_ENTITY_ID, AIR_META_ID, BIGINT_ONE, SUBGRAPH_VERSION, SUBGRAPH_NAME, SUBGRAPH_SLUG } from "./utils";

export namespace nft {
    export function trackNFTSaleTransactions(
        chainID: string,
        txHash: string,
        txIndex: BigInt,
        NftSales: Sale[],
        transactionType: string,
        protocolType: string,
        protocolActionType: string,
        timestamp: BigInt,
        blockHeight: BigInt,
        blockHash: string
    ): void{
        if (NftSales.length == 0) {
            return;
        }

        let block = getOrCreateAirBlock(chainID+"-"+blockHeight.toString());
        block.number = blockHeight;
        block.timestamp = timestamp;
        block.hash = blockHash;
        
        let transactionCount = NftSales.length;
        for(let i=0; i<transactionCount; i++){
            // Payment Token
            let paymentToken = getOrCreateAirToken(chainID+"-"+NftSales[i].paymentToken.toHexString());
            paymentToken.save();

            // Account
            // let buyerOutput = getOrCreateAirAccount(chainID+"-"+NftSales[i].buyer.toHexString());
            let buyerAccount = handleAccountCreation(chainID+"-"+NftSales[i].buyer.toHexString(), block.id);
            let sellerAccount = handleAccountCreation(chainID+"-"+NftSales[i].seller.toHexString(), block.id);
            let feeAccount = handleAccountCreation(chainID+"-"+NftSales[i].protocolFeesBeneficiary.toHexString(), block.id);

            // Sale Token
            let saleToken = getOrCreateAirToken(
                chainID+"-"+NftSales[i].nft.collection.toHexString()
            );
            saleToken.save();
            
            // Transaction
            let transactionId = getNFTSaleTransactionId(
                chainID,
                txHash,
                NftSales[i].nft.collection.toHexString(),
                NftSales[i].nft.tokenId
            )
            
            let transaction = AirNftTransaction.load(transactionId);
            if (transaction != null){
                if (transaction.from == Address.zero().toHexString()){
                    if (buyerAccount.address != Address.zero().toHexString()){
                      transaction.from = buyerAccount.id;
                    } else if (sellerAccount.address != Address.zero().toHexString()){
                      transaction.from = sellerAccount.id;
                    }
                  }
                  else if (transaction.to == Address.zero().toHexString()){
                    if (buyerAccount.address != Address.zero().toHexString()){
                        transaction.to = buyerAccount.id;
                    } else if (sellerAccount.address != Address.zero().toHexString()){
                        transaction.to = sellerAccount.id;
                    }
                  }
            }else{
                transaction = getOrCreateAirNftTransaction(
                    transactionId
                );
                transaction.to = buyerAccount.id;
                transaction.from = sellerAccount.id;
            }
            
            transaction.type = transactionType;
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
            transaction.index = txIndex;
            transaction.block = block.id;

            block.save();

            // Creator Royalty
            for(let j=0; j<NftSales[i].royalties.length; j++){
                let royaltyAccount = handleAccountCreation(chainID+"-"+NftSales[i].royalties[j].beneficiary.toHexString(), block.id);
                let royalty = AirNftSaleRoyalty.load(chainID+"-"+transactionId +"-"+ NftSales[i].royalties[j].beneficiary.toHexString());
                if (royalty == null) {
                    royalty = getOrCreateRoyalty(chainID+"-"+transactionId +"-"+ NftSales[i].royalties[j].beneficiary.toHexString());
                    royalty.amount = NftSales[i].royalties[j].fee
                    royalty.beneficiary = royaltyAccount.id
                    royalty.nftTransaction = transactionId
                    royalty.save()
                }
                
                log.info("txId {} royaltyBeneficiary {} Amount {}",
                    [ 
                        transactionId,
                        royalty.beneficiary,
                        royalty.amount.toString(),
                    ]
                )
            }
            transaction.save();
            updateAirEntityCounter(chainID, AIR_ENTITY_ID, block);
        }
    }

    export function getNFTSaleTransactionId(
        chainID: string,
        txHash: string,
        contractAddress: string,
        nftId: BigInt
      ): string {
        return chainID
          .concat("-")
          .concat(txHash)
          .concat("-")
          .concat(contractAddress)
          .concat(nftId.toString());
      }

    export function getOrCreateAirToken(id: string): AirToken {
        let entity = AirToken.load(id); //todo add network
        if (entity == null) {
          entity = new AirToken(id);
          entity.address = id;
        }
        return entity as AirToken;
    }

    export function getOrCreateAirAccount(id: string): AirAccount {
        let entity = AirAccount.load(id);
        if (entity == null) {
          entity = new AirAccount(id);
          entity.address = id;
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

    export function getOrCreateAirBlock(
        id: string
    ):AirBlock {
        let block = AirBlock.load(id);
        if (block == null){
            block = new AirBlock(id);
        }
        return block as AirBlock;
    }

    export function getOrCreateRoyalty(
        id: string
    ): AirNftSaleRoyalty {
        let royalty = AirNftSaleRoyalty.load(id);
        if (royalty == null){
            royalty = new AirNftSaleRoyalty(id);
        }
        return royalty as AirNftSaleRoyalty;
    }

    export function updateAirEntityCounter(
        chainId: string,
        id: string,
        block: AirBlock,
    ): void {
        let entity = AirEntityCounter.load(id);
        if (entity == null) {
          entity = new AirEntityCounter(id);
          entity.count = BIGINT_ONE;
          entity.createdAt = block.id;
          entity.lastUpdatedAt = block.id;
          createAirMeta(chainId, SUBGRAPH_NAME, SUBGRAPH_SLUG);
        } else {
          entity.count = entity.count.plus(BIGINT_ONE);
          entity.lastUpdatedAt = block.id;
        }
        entity.save();
    }

    export function createAirMeta(
        network: string,
        slug: string,
        name: string
    ): void {
        let meta = AirMeta.load(AIR_META_ID);
        if (meta == null) {
          meta = new AirMeta(AIR_META_ID);
          meta.network = network;
          meta.schemaVersion = SUBGRAPH_VERSION;
          meta.slug = slug;
          meta.name = name;
          meta.save();
        }
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
        ) {}
    }

    export class CreatorRoyalty {
        constructor(
            public fee: BigInt,
            public beneficiary: Address
        ) {}
    }
    
    export class NFT {
        constructor(
          public readonly collection: Address,
          public readonly standard: string, //ERC1155 or ERC721
          public readonly tokenId: BigInt,
          public readonly amount: BigInt
        ) {}
    }

    export function handleAccountCreation(id: string, createdAt: string): AirAccount {
        let account = AirAccount.load(id);
        if (account == null) {
            account = getOrCreateAirAccount(id);
            account.createdAt = createdAt;
            account.save();
        }
        return account as AirAccount;
    }
}