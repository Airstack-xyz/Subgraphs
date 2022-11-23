import {
    Address,
    BigDecimal,
    BigInt,
    dataSource,
    Bytes,
    log,
} from "@graphprotocol/graph-ts";

import {
    AirAccount,
    AirNftTransaction,
    AirToken,
    AirBlock,
    AirNftSaleRoyalty
} from "../../../generated/schema";

export namespace nft {
    export function trackNFTSaleTransactions(
        txHash: string,
        txIndex: BigInt,
        NftSales: Sale[],
        protocolType: string,
        protocolActionType: string,
        timestamp: BigInt,
        blockHeight: BigInt,
        blockHash: string
    ): void{
        if (NftSales.length == 0) {
            return;
        }


        let chainID = 1;
        let block = getOrCreateAirBlock(chainID.toString()+"-"+blockHeight.toString());
        block.number = blockHeight;
        block.timestamp = timestamp;
        block.hash = blockHash;
        
        let transactionCount = NftSales.length;
        for(let i=0; i<transactionCount; i++){
            // Payment Token
            let paymentToken = getOrCreateAirToken(NftSales[i].paymentToken.toHexString());
            paymentToken.save();

            // Transaction
            let transactionId = getNFTSaleTransactionId(
                txHash,
                NftSales[i].nft.collection.toHexString(),
                NftSales[i].nft.tokenId
            )

            // Account
            let buyerAccount = getOrCreateAirAccount(NftSales[i].buyer.toHexString());
            buyerAccount.createdAt = block.id
            let sellerAccount = getOrCreateAirAccount(NftSales[i].seller.toHexString());
            sellerAccount.createdAt = block.id
            
            let royalties = new Array<string>();
            // Royalty
            for(let j=0; j<NftSales[i].royalties.length; j++){
                let royaltyAccount = getOrCreateAirAccount(NftSales[i].royalties[j].beneficiary.toHexString());
                royaltyAccount.createdAt = block.id
                let royalty = getOrCreateRoyalty(transactionId + NftSales[i].royalties[j].beneficiary.toHexString());
                royalty.amount = NftSales[i].royalties[j].fee
                royalty.beneficiary = NftSales[i].royalties[j].beneficiary.toHexString()
                royaltyAccount.save()
                royalty.save()
                royalties.push(royalty.id)
            }
            let feeAccount = getOrCreateAirAccount(NftSales[i].protocolFeesBeneficiary.toHexString());
            feeAccount.createdAt = block.id

            // Sale Token
            let saleToken = getOrCreateAirToken(
                NftSales[i].nft.collection.toHexString()
            );
            saleToken.save();

            
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
            
            transaction.type = "SALE";
            transaction.protocolType = protocolType;
            transaction.protocolActionType = protocolActionType;
            transaction.tokenId = NftSales[i].nft.tokenId;
            transaction.tokenAmount = NftSales[i].nft.amount;
            transaction.paymentToken = paymentToken.id;
            transaction.paymentAmount = NftSales[i].paymentAmount;
            transaction.royalties = royalties;
            transaction.feeAmount = NftSales[i].protocolFees;
            transaction.feeBeneficiary = feeAccount.id;

            transaction.transactionToken = saleToken.id;
            transaction.hash = txHash;
            transaction.index = txIndex;
            transaction.block = block.id;

            block.save();
            buyerAccount.save();
            sellerAccount.save();
            feeAccount.save();
            transaction.save();
        }
    }

    export function getNFTSaleTransactionId(
        txHash: string,
        contractAddress: string,
        nftId: BigInt
      ): string {
        return dataSource
          .network()
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

    export class Sale {
        constructor(
          public readonly buyer: Address,
          public readonly seller: Address,
          public readonly nft: NFT,
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
}