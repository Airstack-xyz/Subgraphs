import { Address, BigInt, dataSource, log } from "@graphprotocol/graph-ts";
import { ExchangeCall } from "../generated/ExchangeV1/ExchangeV1";
import { BuyCall as BuyCall721, Buy as Buy721Sale } from "../generated/ERC721Sale1/ERC721Sale";
import { BuyCall as BuyCall1155Sale1 } from "../generated/ERC1155Sale1/ERC1155Sale1";
import { BuyCall as BuyCall1155Sale2 } from "../generated/ERC1155Sale2/ERC1155Sale2";
import { Buy as BuyTokenSale721 } from "../generated/TokenSaleErc721/TokenSale";
import * as airstack from "../modules/airstack/nft-marketplace";
import * as utils from "./utils";
import { AirProtocolType, AirProtocolActionType, ETHEREUM_MAINNET_ID, getProtocolFeeDetails } from "./utils";
import { BIGINT_ONE } from "../modules/airstack/common";

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

    let sale = new airstack.nft.Sale(
      call.from,
      call.inputs.order.key.owner,
      [nft],
      paymentAmount,
      buyAsset.token,
      beneficiaryDetails.beneficiaryFee,
      beneficiaryDetails.beneficiary,
      royaltyDetails,
    )

    airstack.nft.trackNFTSaleTransactions(
      call.block,
      call.transaction.hash.toHexString(),
      call.transaction.index,
      sale,
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.BUY,
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

    let sale = new airstack.nft.Sale(
      call.inputs.order.key.owner,
      call.from,
      [nft],
      paymentAmount,
      sellAsset.token,
      beneficiaryDetails.beneficiaryFee,
      beneficiaryDetails.beneficiary,
      royaltyDetails,
    )

    airstack.nft.trackNFTSaleTransactions(
      call.block,
      call.transaction.hash.toHexString(),
      call.transaction.index,
      sale,
      AirProtocolType.NFT_MARKET_PLACE,
      AirProtocolActionType.SELL,
    );
  }
}

export function handleBuyTokenSaleErc721(event: BuyTokenSale721): void {
  const sale = new airstack.nft.Sale(
    event.params.buyer,
    event.params.seller,
    [new airstack.nft.NFT(
      event.params.token,
      "ERC721",
      event.params.tokenId,
      BIGINT_ONE,
    )],
    event.transaction.value,
    utils.zeroAddress,
    utils.BIGINT_ZERO,
    utils.zeroAddress,
    new Array<airstack.nft.CreatorRoyalty>(),
  );
  airstack.nft.trackNFTSaleTransactions(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    sale,
    AirProtocolType.NFT_MARKET_PLACE,
    AirProtocolActionType.BUY,
  );
  log.info("handleBuyTokenSaleErc721 price {} token {} tokenId {} buyer {} seller {} exchange {} txhash {}", [
    event.params.price.toString(),
    event.params.token.toHexString(),
    event.params.tokenId.toString(),
    event.params.buyer.toHexString(),
    event.params.seller.toHexString(),
    dataSource.address().toHexString(),
    event.transaction.hash.toHexString(),
  ]);
}

export function handleBuyErc1155Sale1(call: BuyCall1155Sale1): void {
  const royalties = utils.getRoyaltyDetailsErc1155Sale1(
    call.inputs.tokenId,
    call.inputs.token,
    call.transaction.value,
  );
  const sale = new airstack.nft.Sale(
    call.transaction.from,
    call.inputs.owner,
    [new airstack.nft.NFT(
      call.inputs.token,
      "ERC1155",
      call.inputs.tokenId,
      call.inputs.buying,
    )],
    call.transaction.value,
    utils.zeroAddress,
    utils.BIGINT_ZERO,
    utils.zeroAddress,
    royalties,
  );
  airstack.nft.trackNFTSaleTransactions(
    call.block,
    call.transaction.hash.toHexString(),
    call.transaction.index,
    sale,
    AirProtocolType.NFT_MARKET_PLACE,
    AirProtocolActionType.BUY,
  );
  log.info("handleBuyErc1155Sale1 total {} token {} tokenId {} buyer {} seller {} royalty lenght {} exchange {} txhash {}", [
    call.transaction.value.toString(),
    call.inputs.token.toHexString(),
    call.inputs.tokenId.toString(),
    call.transaction.from.toHexString(),
    call.inputs.owner.toHexString(),
    royalties.length.toString(),
    dataSource.address().toHexString(),
    call.transaction.hash.toHexString(),
  ]);
}

export function handleBuyErc1155Sale2(call: BuyCall1155Sale2): void {
  const total = call.inputs.price.times(call.inputs.buying);
  const protocolFeeDetails = getProtocolFeeDetails(
    dataSource.address(),
    total,
    call.inputs.sellerFee,
  );
  const royalties = utils.getRoyaltyDetails(
    call.inputs.tokenId,
    call.inputs.token,
    protocolFeeDetails.restValue,
    total
  );
  const sale = new airstack.nft.Sale(
    call.transaction.from,
    call.inputs.owner,
    [new airstack.nft.NFT(
      call.inputs.token,
      "ERC1155",
      call.inputs.tokenId,
      call.inputs.buying,
    )],
    call.transaction.value,
    utils.zeroAddress,
    protocolFeeDetails.beneficiaryFee,
    protocolFeeDetails.beneficiary,
    royalties,
  );
  airstack.nft.trackNFTSaleTransactions(
    call.block,
    call.transaction.hash.toHexString(),
    call.transaction.index,
    sale,
    AirProtocolType.NFT_MARKET_PLACE,
    AirProtocolActionType.BUY,
  );
  log.info("handleBuyErc1155Sale2 price {} sellerFee {} token {} tokenId {} buyer {} seller {} royalty length {} protocolfee {} protocol beneficiary {} exchange {} txhash {}", [
    call.inputs.price.toString(),
    call.inputs.sellerFee.toString(),
    call.inputs.token.toHexString(),
    call.inputs.tokenId.toString(),
    call.transaction.from.toHexString(),
    call.inputs.owner.toHexString(),
    royalties.length.toString(),
    protocolFeeDetails.beneficiaryFee.toString(),
    protocolFeeDetails.beneficiary.toHexString(),
    dataSource.address().toHexString(),
    call.transaction.hash.toHexString(),
  ]);
}

export function handleBuyErc721(event: Buy721Sale): void {
  const protocolFeeDetails = getProtocolFeeDetails(
    dataSource.address(),
    event.params.price,
    utils.BIGINT_ZERO,
  );
  const royalties = utils.getRoyaltyDetails(
    event.params.tokenId,
    event.params.token,
    protocolFeeDetails.restValue,
    event.params.price,
  );
  const sale = new airstack.nft.Sale(
    event.params.buyer,
    event.params.seller,
    [new airstack.nft.NFT(
      event.params.token,
      "ERC721",
      event.params.tokenId,
      BIGINT_ONE,
    )],
    event.transaction.value,
    utils.zeroAddress,
    protocolFeeDetails.beneficiaryFee,
    protocolFeeDetails.beneficiary,
    royalties,
  );
  airstack.nft.trackNFTSaleTransactions(
    event.block,
    event.transaction.hash.toHexString(),
    event.logIndex,
    sale,
    AirProtocolType.NFT_MARKET_PLACE,
    AirProtocolActionType.BUY,
  );
  log.info("handleBuyErc721 token {} tokenId {} buyer {} seller {} royalty length {} protocolfee {} protocol beneficiary {} exchange {} txhash {}", [
    event.params.token.toHexString(),
    event.params.tokenId.toString(),
    event.params.buyer.toHexString(),
    event.params.seller.toHexString(),
    royalties.length.toString(),
    protocolFeeDetails.beneficiaryFee.toString(),
    protocolFeeDetails.beneficiary.toHexString(),
    dataSource.address().toHexString(),
    event.transaction.hash.toHexString(),
  ]);
}