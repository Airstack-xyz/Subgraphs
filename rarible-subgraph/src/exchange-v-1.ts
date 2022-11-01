import { BigInt } from "@graphprotocol/graph-ts";
import { ExchangeCall } from "../generated/ExchangeV1/ExchangeV1";
import * as airstack from "./modules/nft";
import * as utils from "./utils";

export function handleExchange(call: ExchangeCall): void {
  let sellAsset = call.inputs.order.key.sellAsset;
  let buyAsset = call.inputs.order.key.buyAsset;
  if (sellAsset.assetType > 1) {
    // sellAsset is NFT,the owner has it & wants buy Asset
    let paying = call.inputs.order.buying
      .times(call.inputs.amount)
      .div(call.inputs.order.selling);
    let fee = paying.times(call.inputs.buyerFee).div(BigInt.fromI32(10000));
    let paymentAmount = paying.plus(fee);

    let { royaltyAmount, royaltyRecipients } = utils.getRoyaltyDetails(call.inputs.order.key.sellAsset.tokenId, call.inputs.order.key.sellAsset.token);

    let { beneficiaryFee, beneficiary } = utils.getFeeBeneficiaryDetails(
      call.inputs.amount,
      call.inputs.order.sellerFee,
      call.inputs.buyerFee,
    );

    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      [call.inputs.order.key.owner], //from
      [call.from], //to
      [sellAsset.token], //nft address
      [sellAsset.tokenId], // nft id
      buyAsset.token, // token address
      paymentAmount, // token amount
      royaltyAmount, //royalty amount
      royaltyRecipients, //royalty beneficiary
      [beneficiaryFee],  //exchange fee
      [beneficiary],  //exchange beneficiary
      call.block.timestamp,
      call.block.number,
    );

  } else {
    // buyAsset is NFT,the owner wants NFT & give token/ETH
    let fee = call.inputs.amount
      .times(call.inputs.order.sellerFee)
      .div(BigInt.fromI32(10000));
    let paymentAmount = call.inputs.amount.plus(fee);

    let { royaltyAmount, royaltyRecipients } = utils.getRoyaltyDetails(call.inputs.order.key.buyAsset.tokenId, call.inputs.order.key.buyAsset.token);

    let { beneficiaryFee, beneficiary } = utils.getFeeBeneficiaryDetails(
      call.inputs.amount,
      call.inputs.buyerFee,
      call.inputs.order.sellerFee,
    );

    airstack.nft.trackNFTSaleTransactions(
      call.transaction.hash.toHexString(),
      [call.from], //from
      [call.inputs.order.key.owner], //to
      [buyAsset.token], //nft address
      [buyAsset.tokenId], // nft id
      sellAsset.token, // token address
      paymentAmount, // token amount
      royaltyAmount, //royalty amount
      royaltyRecipients, //royalty beneficiary
      [beneficiaryFee],  //exchange fee
      [beneficiary],  //exchange beneficiary
      call.block.timestamp,
      call.block.number
    );
  }
}
