import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts"
import { ConstructorCall } from "../generated/Seaport/CalculationsSushiSwap";
import {
  OrderFulfilled,
} from "../generated/Seaport/Seaport"

import * as airstack from "./modules/airstack"
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from "./modules/prices/common/constants";


/**
 * 
 
offerer: event.param.offerer
reciept: event.param.recipient

List<Offer> {
  itemType
  token
  identifier
  amount
}


List<Consideration> {
  itenType
  token
  identifier
  amount
  reciepient
}


In Offer 
if(itemType == 1 || 0) { payment token transfer
	
  paymentToken = offer.token
  paymentAmount = offer.amount
  buyer = offerer
  seller = reciept
  nftIds = considerations.filter(type == 2).identififier
  contract = considerations.filter(type == 2).token

}

if(itemTyp2 ==2) {  // NFT
  nftContract = offer.token
  tokenId = offer.identifier
  buyer = reciept
  seller = offerer
  paymentAmount = considerations.filter(type == 0.1).amount
  paymentToken = considerations.filter(type == 0,1).token
}



Example 1: 
https://etherscan.io/tx/0xb3c9305842ab756838941afd59e990bc48ae88e8869aa24f72e23f6eb7600837



Example 2: 
https://etherscan.io/tx/0xa7aa89c3286587501bbb9cd229e57ae4de35c2c97f1611ff617c25a7547c636c

 */

export enum ItemType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3,
  ERC721_WITH_CRITERIA = 4,
  ERC1155_WITH_CRITERIA = 5,
}


function isNFTEntity(itemType: number):bool {
  return itemType >= 2;
}

function decodeSales(event: OrderFulfilled): void {
  let txHash = event.transaction.hash;
  log.warning("new tx {}", [txHash.toHexString()]);

  let offerer = event.params.offerer;
  let reciepient = event.params.recipient;

  log.info("Decode sales txhash {} logindex {} offerere {} reciepient {} offer {} consideration {}", [txHash.toHexString(), event.logIndex.toString() ,offerer.toHexString(), reciepient.toHexString(), event.params.offer.length.toString(), event.params.consideration.length.toString()])
  let paymentAmount = BIGINT_ZERO;
  let paymentToken:Address = Address.zero();
  let seller: Address = Address.zero(), buyer: Address = Address.zero();
  let nftContracts: Address[] = [];
  let nftIds: BigInt[] = [];
  let buyers: Address[] = [];
  let sellers: Address[] = [];


  for (let i = 0; i < event.params.offer.length; i++) {

    let offer = event.params.offer[i];

    let isNFT = isNFTEntity(offer.itemType);

    log.info("offer type txHash {} logindex {} itemType {} isNFT {} index {}", [txHash.toHexString(),  event.logIndex.toString(), offer.itemType.toString(), isNFT.toString(), i.toString()])

    if (!isNFT) {
      paymentToken = offer.token;
      paymentAmount = offer.amount;
      buyer = offerer;
      seller = reciepient;

      log.info("txHash offer log tx {} logindex {} paymentToken {} paymentAmount {} buyer {} seller {} index {}", [
        txHash.toHexString(),
        event.logIndex.toString(),
        paymentToken.toHexString(),
        paymentAmount.toString(),
        buyer.toHexString(),
        seller.toHexString(),
        i.toString()]
      );
    }
    else {
      nftContracts.push(offer.token);
      nftIds.push(offer.identifier);

      buyer = reciepient;
      seller = offerer;
      buyers.push(buyer);
      sellers.push(seller);

      log.info("txHash offer log tx {} logindex {} nftContract {} NFTId {} index {}", [
        txHash.toHexString(),
        event.logIndex.toString(),
        offer.token.toHexString(),
        offer.identifier.toString(),
        i.toString()]
      );
    }

  }

  for (let i = 0; i < event.params.consideration.length; i++) {

    let consideration = event.params.consideration[i];

    let isNFT = isNFTEntity(consideration.itemType);

    log.info("consideration type txHash {} logindex {} itemType {} isNFT {} index {}", [txHash.toHexString(),  event.logIndex.toString(), consideration.itemType.toString(), isNFT.toString(), i.toString()])
    if (!isNFT) {
      paymentToken = consideration.token;
      paymentAmount = paymentAmount.plus(consideration.amount);
      log.info("txHash consideration log tx {} logindex {} paymentToken {} paymentAmount {} buyer {} seller {} index {}", [
        txHash.toHexString(),
        event.logIndex.toString(),
        paymentToken.toHexString(),
        paymentAmount.toString(),
        buyer.toHexString(),
        seller.toHexString(),
        i.toString()]
      );
    } else {
      nftContracts.push(consideration.token);
      nftIds.push(consideration.identifier);
      buyers.push(buyer);
      sellers.push(seller);

      log.info("txHash consideration log tx {} logindex {} nftContract {} NFTId {} index {}", [
        txHash.toHexString(),
        event.logIndex.toString(),
        consideration.token.toHexString(),
        consideration.identifier.toString(),
        i.toString()]
      );

    }
  }

  log.info("data for contract call tx {} logindex {}  seller  {} buyer {} contracts {} ids {} payment Token {} payment Amoint {}", [
    txHash.toHexString(),
    event.logIndex.toString(),
    seller.toHexString(),
    buyer.toHexString(),
    nftContracts.length.toString(),
    nftIds.length.toString(),
    paymentToken.toHexString(),
    paymentAmount.toString()
  ])

  if(nftContracts.length > 0 && nftIds.length > 0 && nftContracts.length == nftIds.length) {


    airstack.nft.trackNFTSaleTransactions(
      txHash.toHexString(),
      sellers,
      buyers,
      nftContracts,
      nftIds,
      paymentToken,
      paymentAmount,
      event.block.timestamp
    ); 
  } else {
      event.logIndex.toString(),
    log.warning("Issue with decoding for tx {} log index {}", [txHash.toHexString(), event.logIndex.toString()])
  }

}

export function handleOrderFulfilled(event: OrderFulfilled): void {

  let txHash = event.transaction.hash;
  log.warning("new tx {}", [txHash.toHexString()]);


  

  
  // if (event.params.consideration.length == 0) {
  //   log.warning("error consideration length tx {}", [txHash.toHexString()]);
  //   return;
  // }

  // if (event.params.offer.length == 0) {
  //   log.warning("error offer length tx {}", [txHash.toHexString()]);
  //   return;
  // }



  log.info("Order tx {}, orderhash {} offerer {} zone {} recipient {}",
    [
      txHash.toHexString(),
      event.params.orderHash.toHexString(),
      event.params.offerer.toHexString(),
      event.params.zone.toHexString(),
      event.params.recipient.toHexString(),
    ]
  );


  for (let i = 0; i < event.params.offer.length; i++) {

    log.info("Offer details tx {} index {} offer.itemtype {} offer.token {} offer.identifier {} offer.amount {} ", [
      txHash.toHexString(),
      i.toString(),
      event.params.offer[i].itemType.toString(),
      event.params.offer[i].token.toHexString(),
      event.params.offer[i].identifier.toString(),
      event.params.offer[i].amount.toString(),
    ]);
  }

  for (let i = 0; i < event.params.consideration.length; i++) {

    log.info("consideration details tx {} index {} consideration.itemtype {} consideration.token {} consideration.identifier {} consideration.amount {} consideration.recipient {}", [
      txHash.toHexString(),
      i.toString(),
      event.params.consideration[i].itemType.toString(),
      event.params.consideration[i].token.toHexString(),
      event.params.consideration[i].identifier.toHexString(),
      event.params.consideration[i].amount.toString(),
      event.params.consideration[i].recipient.toHexString(),
    ]);
  }

  decodeSales(event);
  // log.info("debug log  tx {} seller {} buyer {}  payment token {} amount {}  nftContract {} nftId {}", [
  //   event.transaction.hash.toHexString(),
  //   seller!.toHexString(),
  //   buyer!.toHexString(),
  //   paymentToken!.toHexString(),
  //   amount!.toString(),
  //   nftContract!.toHexString(),
  //   nftId!.toString()
  // ]
  // );


  // airstack.nft.trackNFTSaleTransactions(
  //   txHash.toHexString(),
  //   [seller],
  //   [buyer],
  //   [nftContract],
  //   [nftId],
  //   paymentToken,
  //   amount,
  //   timestamp
  // );
  log.warning("Done new tx {}", [txHash.toHexString()]);
}

