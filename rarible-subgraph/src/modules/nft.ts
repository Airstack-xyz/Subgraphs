import {
  Address,
  BigInt,
  Bytes,
} from "@graphprotocol/graph-ts";

export namespace nft {

  export function trackNFTSaleTransactions(
    txHash: string,
    fromArray: Address[],
    toArray: Address[],
    contractAddressArray: Address[],
    nftIdArray: BigInt[],
    paymentTokenAddress: Address,
    paymentAmount: BigInt,
    royaltyAmount: BigInt[],
    royaltyBeneficiary: Address[],
    feeAmount: BigInt[],
    feeBeneficiary: Address[],
    timestamp: BigInt,
    blockHeight: BigInt
  ): void { }
}
