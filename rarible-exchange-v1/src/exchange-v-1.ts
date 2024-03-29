import { BigInt } from "@graphprotocol/graph-ts";
import { ExchangeCall } from "../generated/ExchangeV1/ExchangeV1";
import * as airstack from "../modules/airstack";
import * as utils from "./utils";
import { AirProtocolType, AirProtocolActionType, ETHEREUM_MAINNET_ID } from "./utils";

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

    let beneficiaryDetails = utils.getFeeBeneficiaryDetails(
      paying,
      call.inputs.order.sellerFee,
      call.inputs.buyerFee,
    );

    let royaltyDetails = utils.getRoyaltyDetails(
      call.inputs.order.key.sellAsset.tokenId,
      call.inputs.order.key.sellAsset.token,
      beneficiaryDetails.restValue,
      paying,
    );

    let nft = new airstack.nft.NFT(
      sellAsset.token,
      sellAsset.assetType == 2 ? "ERC1155" : sellAsset.assetType == 3 ? "ERC721" : "UNKNOWN",
      sellAsset.tokenId,
      call.inputs.amount,
    )

    let nftSales = new airstack.nft.Sale(
      call.from,
      call.inputs.order.key.owner,
      nft,
      paymentAmount,
      buyAsset.token,
      beneficiaryDetails.beneficiaryFee,
      beneficiaryDetails.beneficiary,
      royaltyDetails,
    )

    airstack.nft.trackNFTSaleTransactions(
      ETHEREUM_MAINNET_ID,
      call.transaction.hash.toHexString(),
      call.transaction.index,
      [nftSales],
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.BUY,
      call.block.timestamp,
      call.block.number,
      call.block.hash.toHexString(),
    );

  } else {
    // buyAsset is NFT,the owner wants NFT & give token/ETH
    let fee = call.inputs.amount
      .times(call.inputs.order.sellerFee)
      .div(BigInt.fromI32(10000));
    let paymentAmount = call.inputs.amount.plus(fee);

    let beneficiaryDetails = utils.getFeeBeneficiaryDetails(
      call.inputs.amount,
      call.inputs.buyerFee,
      call.inputs.order.sellerFee,
    );

    let royaltyDetails = utils.getRoyaltyDetails(
      call.inputs.order.key.buyAsset.tokenId,
      call.inputs.order.key.buyAsset.token,
      beneficiaryDetails.restValue,
      call.inputs.amount,
    );

    let nft = new airstack.nft.NFT(
      buyAsset.token,
      buyAsset.assetType == 2 ? "ERC1155" : sellAsset.assetType == 3 ? "ERC721" : "UNKNOWN",
      buyAsset.tokenId,
      call.inputs.amount,
    )

    let nftSales = new airstack.nft.Sale(
      call.inputs.order.key.owner,
      call.from,
      nft,
      paymentAmount,
      sellAsset.token,
      beneficiaryDetails.beneficiaryFee,
      beneficiaryDetails.beneficiary,
      royaltyDetails,
    )

    airstack.nft.trackNFTSaleTransactions(
      ETHEREUM_MAINNET_ID,
      call.transaction.hash.toHexString(),
      call.transaction.index,
      [nftSales],
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.SELL,
      call.block.timestamp,
      call.block.number,
      call.block.hash.toHexString(),
    );
  }
}
