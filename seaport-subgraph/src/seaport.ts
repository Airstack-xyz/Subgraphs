import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";

import {
    OrderFulfilled,
} from "../generated/Seaport/Seaport"
import { isERC1155, isERC721, isOpenSeaFeeAccount, NftStandard } from "./utils";

import * as airstack from "../../modules/airstack";
  
export enum ItemType {
    NATIVE = 0,
    ERC20 = 1,
    ERC721 = 2,
    ERC1155 = 3,
    ERC721_WITH_CRITERIA = 4,
    ERC1155_WITH_CRITERIA = 5,
}

function isNFTEntity(itemType: number): bool {
    return itemType >= 2;
}
  

export function handleOrderFulfilled(event: OrderFulfilled): void {
    let txHash = event.transaction.hash;
    log.warning("new tx {}", [txHash.toHexString()]);

    let offerer = event.params.offerer;
    let recipient = event.params.recipient;

    let paymentAmount = BigInt.fromI32(0);
    let paymentToken: Address = Address.zero();
    let seller: Address = Address.zero(),
        buyer: Address = Address.zero();
    let royaltyFees = BigInt.fromI32(0);
    let royaltyBeneficiary = Address.zero();
    let protocolFees = BigInt.fromI32(0);
    let protocolBeneficiary = Address.zero();

    let allSales = new Array<airstack.nft.Sale>();

    log.info("Parameters txHash {} offerer {} recipient {} orderHash {}", [txHash.toHexString(), offerer.toHexString(), recipient.toHexString(), event.params.orderHash.toHexString()]);

    for (let i = 0; i < event.params.offer.length; i++) {
        let offer = event.params.offer[i];
    
        let isNFT = isNFTEntity(offer.itemType);
    
        log.info("offer type txHash {} logindex {} itemType {} isNFT {} index {}", [
          txHash.toHexString(),
          event.logIndex.toString(),
          offer.itemType.toString(),
          isNFT.toString(),
          i.toString(),
        ]);
    
        if (!isNFT) {
          paymentToken = offer.token;
          paymentAmount = offer.amount;
          buyer = offerer;
          seller = recipient;
    
          log.info(
            "txHash offer log tx {} logindex {} paymentToken {} paymentAmount {} buyer {} seller {} index {}",
            [
              txHash.toHexString(),
              event.logIndex.toString(),
              paymentToken.toHexString(),
              paymentAmount.toString(),
              buyer.toHexString(),
              seller.toHexString(),
              i.toString(),
            ]
          );
        } else {
            let standard = isERC721(offer.itemType)
              ? NftStandard.ERC721
              : isERC1155(offer.itemType)
              ? NftStandard.ERC1155
              : NftStandard.UNKNOWN;
            let nft = new airstack.nft.NFT(offer.token, standard, offer.identifier, offer.amount);
            
            buyer = recipient;
            seller = offerer;

            let sale = new airstack.nft.Sale(buyer, seller, nft, paymentAmount, paymentToken, protocolFees, protocolBeneficiary, new Array<airstack.nft.CreatorRoyalty>());
            allSales.push(sale);
        
            log.info(
                "txHash offer log tx {} logindex {} nftContract {} NFTId {} index {} buyer {} seller {}",
                [
                    txHash.toHexString(),
                    event.logIndex.toString(),
                    offer.token.toHexString(),
                    offer.identifier.toString(),
                    i.toString(),
                    buyer.toHexString(),
                    seller.toHexString(),
                ]
            );
        }
    }
    
    for (let i = 0; i < event.params.consideration.length; i++) {
        let consideration = event.params.consideration[i];
        let isNFT = isNFTEntity(consideration.itemType);
    
        log.info(
          "consideration type txHash {} logindex {} itemType {} isNFT {} index {}",
          [
            txHash.toHexString(),
            event.logIndex.toString(),
            consideration.itemType.toString(),
            isNFT.toString(),
            i.toString(),
          ]
        );
        if (!isNFT) {
            paymentToken = consideration.token;
            paymentAmount = paymentAmount.plus(consideration.amount);
            if(isOpenSeaFeeAccount(consideration.recipient)){
                protocolFees = protocolFees.plus(consideration.amount)
                protocolBeneficiary = consideration.recipient
            }
            if(!isOpenSeaFeeAccount(consideration.recipient) && consideration.recipient != seller){
                royaltyFees = royaltyFees.plus(consideration.amount)
                royaltyBeneficiary = consideration.recipient
            }
            log.info(
                "txHash consideration log tx {} logindex {} paymentToken {} paymentAmount {} recipient {} buyer {} seller {} index {}",
                [
                    txHash.toHexString(),
                    event.logIndex.toString(),
                    paymentToken.toHexString(),
                    paymentAmount.toString(),
                    consideration.recipient.toHexString(),
                    buyer.toHexString(),
                    seller.toHexString(),
                    i.toString(),
                ]
            );
        } else {
          if (buyer == Address.zero()){
            buyer = consideration.recipient;
          }
          let standard = isERC721(consideration.itemType)
            ? NftStandard.ERC721
            : isERC1155(consideration.itemType)
            ? NftStandard.ERC1155
            : NftStandard.UNKNOWN;
          let nft = new airstack.nft.NFT(consideration.token, standard, consideration.identifier, consideration.amount);

          let sale = new airstack.nft.Sale(buyer, seller, nft, paymentAmount, paymentToken, protocolFees, protocolBeneficiary, new Array<airstack.nft.CreatorRoyalty>());
          allSales.push(sale);
          
          log.info(
            "txHash consideration log tx {} logindex {} nftContract {} NFTId {} index {} recipient {} buyer {} seller {}",
            [
              txHash.toHexString(),
              event.logIndex.toString(),
              consideration.token.toHexString(),
              consideration.identifier.toString(),
              i.toString(),
              consideration.recipient.toHexString(),
              buyer.toHexString(),
              seller.toHexString(),
            ]
          );
        }
    }
    
    for(let i = 0; i <allSales.length; i++){
        let royalty = new airstack.nft.CreatorRoyalty(royaltyFees.div(BigInt.fromI64(allSales.length)), royaltyBeneficiary);
        allSales[i].royalties.push(royalty);
        allSales[i].protocolFees = protocolFees.div(BigInt.fromI64(allSales.length));
        allSales[i].protocolFeesBeneficiary = protocolBeneficiary;
        allSales[i].paymentAmount = paymentAmount.div(
          BigInt.fromI32(allSales.length)
        ); // For bundle sale, equally divide the payment amount in all sale transaction
        allSales[i].paymentToken = paymentToken;
        log.info("txHash {} royaltyBeneficiary {} feeBeneficiary {} feeAmount {}",
          [ 
            txHash.toHexString(),
            royaltyBeneficiary.toHexString(),
            protocolBeneficiary.toHexString(),
            // allSales[i].royaltyFees.toString(),
            allSales[i].protocolFees.toString(),
          ]
        )
    }
    airstack.nft.trackNFTSaleTransactions(
      txHash.toHexString(),
      event.transaction.index,
      allSales,
      "NFT_MARKET_PLACE",
      "SELL",
      event.block.timestamp,
      event.block.number,
      event.block.hash.toHexString()
    )
}
