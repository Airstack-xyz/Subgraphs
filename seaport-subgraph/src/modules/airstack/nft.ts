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
} from "../../../generated/schema";

export namespace nft {
    export function trackNFTSaleTransactions(
        txHash: string,
        fromArray: Address[],
        toArray: Address[],
        contractAddressArray: Address[],
        nftIdArray: BigInt[],
        paymentTokenAddress: Address,
        paymentAmount: BigInt,
        protocolType: string,
        protocolActionType: string,
        royaltyAmount: BigInt[],
        royaltyBeneficiary: Address[],
        feeAmount: BigInt[],
        feeBeneficiary: Address[],
        timestamp: BigInt,
        blockHeight: BigInt,
        blockHash: string
    ): void{
        if (fromArray.length == 0) {
            return;
        }

        // Payment Token
        let paymentToken = getOrCreateAirToken(paymentTokenAddress.toHexString());
        paymentToken.save();


        let chainID = 1;
        let block = getOrCreateAirBlock(chainID.toString()+"-"+blockHeight.toString());
        block.number = blockHeight;
        block.timestamp = timestamp;
        block.hash = blockHash;
        
        let transactionCount = fromArray.length;
        for(let i=0; i<transactionCount; i++){
            // Account
            let buyerAccount = getOrCreateAirAccount(toArray[i].toHexString());
            let sellerAccount = getOrCreateAirAccount(fromArray[i].toHexString());
            let royaltyAccount = getOrCreateAirAccount(royaltyBeneficiary[i].toHexString());
            let feeAccount = getOrCreateAirAccount(feeBeneficiary[i].toHexString());

            // Sale Token
            let saleToken = getOrCreateAirToken(
                contractAddressArray[i].toHexString()
            );
            saleToken.save();

            // Transaction
            let transaction = getOrCreateAirNftTransaction(
                getNFTSaleTransactionId(
                    txHash,
                    contractAddressArray[i].toHexString(),
                    nftIdArray[i]
                )
            );
            transaction.type = "SALE";
            transaction.protocolType = protocolType;
            transaction.protocolActionType = protocolActionType;
            transaction.tokenId = nftIdArray[i];
            transaction.paymentAmount = paymentAmount.div(
                BigInt.fromI32(fromArray.length)
            ); // For bundle sale, equally divide the payment amount in all sale transaction
            transaction.royaltyAmount = royaltyAmount[i]
            transaction.royaltyBeneficiary = royaltyBeneficiary[i].toHexString()
            transaction.feeAmount = feeAmount[i]
            transaction.feeBeneficiary = feeBeneficiary[i].toHexString()

            transaction.transactionToken = saleToken.id;
            transaction.paymentToken = paymentToken.id;
            transaction.to = buyerAccount.id;
            transaction.from = sellerAccount.id;
            transaction.hash = txHash;

            block.save();
            buyerAccount.save();
            sellerAccount.save();
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
}