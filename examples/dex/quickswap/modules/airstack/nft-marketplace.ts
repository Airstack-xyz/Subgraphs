import {
  Address,
  BigDecimal,
  BigInt,
  dataSource,
  Bytes,
} from "@graphprotocol/graph-ts";
import {
  getAirDailyAggregateEntityStatsId,
  getDailyAggregatedAccountId,
  getDailyAggregatedEntityId,
  getOrCreateAirAccount,
  getOrCreateAirContract,
  getOrCreateAirDailyAggregateEntity,
  getOrCreateAirDailyAggregateEntityAccount,
  getOrCreateAirDailyAggregateEntityStats,
  getOrCreateAirToken,
} from "./common";
import { getUsdPrice } from "../prices";
import { AirProtocolActionType, AirProtocolType, BIGINT } from "./constants";
import {
  AirDailyAggregateEntityAccount,
  AirNFTSaleStats,
  AirNFTSaleTransaction,
} from "../../generated/schema";

export namespace nft {
  export function trackNFTSaleTransactions(
    txHash: string,
    fromArray: Address[],
    toArray: Address[],
    contractAddressArray: Address[],
    nftIdArray: BigInt[],
    paymentTokenAddress: Address,
    paymentAmount: BigInt,
    timestamp: BigInt
  ): void {
    // Payment Token
    let paymentToken = getOrCreateAirToken(paymentTokenAddress.toHexString());
    paymentToken.save();

    // todo formatted amount with decimal, utils.ts
    let formattedAmount = paymentAmount.toBigDecimal().div(
      BigInt.fromI32(10)
        .pow(paymentToken.decimals as u8)
        .toBigDecimal()
    );
    let volumeInUSD = getUsdPrice(paymentTokenAddress, formattedAmount);
    let transactionCount = fromArray.length;
    for (let i = 0; i < transactionCount; i++) {
      // SELL Daily AggregatedEntity
      let sellActionDailyAggregatedEntity = getOrCreateAirDailyAggregateEntity(
        contractAddressArray[i].toHexString(),
        AirProtocolType.NFT_MARKET_PLACE,
        AirProtocolActionType.SELL,
        timestamp,
        ""
      );
      const sellActionDailyAggregatedEntityId =
        sellActionDailyAggregatedEntity.id;

      sellActionDailyAggregatedEntity.transactionCount = sellActionDailyAggregatedEntity.transactionCount.plus(
        BIGINT.ONE
      );
      sellActionDailyAggregatedEntity.volumeInUSD = sellActionDailyAggregatedEntity.volumeInUSD.plus(
        volumeInUSD
      );
      sellActionDailyAggregatedEntity.updatedTimestamp = timestamp;

      // Buy Daily Aggregated Entity
      let buyActionDailyAggregatedEntity = getOrCreateAirDailyAggregateEntity(
        contractAddressArray[i].toHexString(),
        AirProtocolType.NFT_MARKET_PLACE,
        AirProtocolActionType.BUY,
        timestamp,
        ""
      );
      const buyActionDailyAggregatedEntityId =
        buyActionDailyAggregatedEntity.id;

      buyActionDailyAggregatedEntity.transactionCount = buyActionDailyAggregatedEntity.transactionCount.plus(
        BIGINT.ONE
      );
      buyActionDailyAggregatedEntity.volumeInUSD = buyActionDailyAggregatedEntity.volumeInUSD.plus(
        volumeInUSD
      );
      buyActionDailyAggregatedEntity.updatedTimestamp = timestamp;

      // Account
      let buyerAccount = getOrCreateAirAccount(toArray[i].toHexString());
      let sellerAccount = getOrCreateAirAccount(fromArray[i].toHexString());

      // AggregatedEntity Account
      let sellAggregatedEntityAccountId = getDailyAggregatedAccountId(
        sellActionDailyAggregatedEntityId,
        sellerAccount.id
      );
      let sellAggregatedEntityAccount = getOrCreateAirDailyAggregateEntityAccount(
        sellAggregatedEntityAccountId,
        sellerAccount.id
      );
      let nftVolumeInUSD = volumeInUSD.div(
        BigDecimal.fromString(fromArray.length.toString())
      );
      sellAggregatedEntityAccount.volumeInUSD = sellAggregatedEntityAccount.volumeInUSD.plus(
        nftVolumeInUSD
      );
      sellAggregatedEntityAccount.index = sellActionDailyAggregatedEntity.walletCount.plus(
        BigInt.fromI32(1)
      );

      let buyAggregatedEntityAccountId = getDailyAggregatedAccountId(
        buyActionDailyAggregatedEntityId,
        buyerAccount.id
      );
      let buyAggregatedEntityAccount = getOrCreateAirDailyAggregateEntityAccount(
        buyAggregatedEntityAccountId,
        buyerAccount.id
      );
      buyAggregatedEntityAccount.volumeInUSD = buyAggregatedEntityAccount.volumeInUSD.plus(
        nftVolumeInUSD
      );
      buyAggregatedEntityAccount.index = buyActionDailyAggregatedEntity.walletCount.plus(
        BigInt.fromI32(1)
      );

      let newBuyWalletCount =
        AirDailyAggregateEntityAccount.load(buyAggregatedEntityAccountId) ==
        null
          ? 1
          : 0;
      let newSellWalletCount =
        AirDailyAggregateEntityAccount.load(sellAggregatedEntityAccountId) ==
        null
          ? 1
          : 0;

      buyActionDailyAggregatedEntity.walletCount = buyActionDailyAggregatedEntity.walletCount.plus(
        BigInt.fromI32(newBuyWalletCount)
      );
      sellActionDailyAggregatedEntity.walletCount = sellActionDailyAggregatedEntity.walletCount.plus(
        BigInt.fromI32(newSellWalletCount)
      );

      // Sale Token
      let saleToken = getOrCreateAirToken(
        contractAddressArray[i].toHexString()
      );
      saleToken.save();

      // Air Contract
      let contract = getOrCreateAirContract(contractAddressArray[i]);

      // AirDailyAggregateEntityStats
      let sellDailyAggregateEntityStatsId = getAirDailyAggregateEntityStatsId(
        sellActionDailyAggregatedEntityId
      );
      let sellDailyAggregateEntityStats = getOrCreateAirDailyAggregateEntityStats(
        sellDailyAggregateEntityStatsId
      );

      let buyDailyAggregateEntityStatsId = getAirDailyAggregateEntityStatsId(
        buyActionDailyAggregatedEntityId
      );
      let buyDailyAggregateEntityStats = getOrCreateAirDailyAggregateEntityStats(
        buyDailyAggregateEntityStatsId
      );

      // Sale Stat
      let saleStatId = getAirNFTSaleStatsId(
        contractAddressArray[i].toHexString(),
        sellActionDailyAggregatedEntityId
      );
      let saleStat = getOrCreateAirNFTSaleStats(saleStatId);
      saleStat.volumeInUSD = saleStat.volumeInUSD.plus(volumeInUSD);
      saleStat.transactionCount = saleStat.transactionCount.plus(BIGINT.ONE);
      saleStat.walletCount = saleStat.walletCount.plus(
        BigInt.fromI32(newBuyWalletCount + newSellWalletCount)
      );

      // Transaction
      let transaction = getOrCreateAirNFTSaleTransaction(
        getNFTSaleTransactionId(
          txHash,
          contractAddressArray[i].toHexString(),
          nftIdArray[i]
        )
      );
      transaction.type = "SALE";
      transaction.tokenId = nftIdArray[i];
      transaction.paymentAmount = paymentAmount.div(
        BigInt.fromI32(fromArray.length)
      ); // For bundle sale, equally divide the payment amount in all sale transaction

      //Build Relationship
      saleStat.token = saleToken.id;

      sellActionDailyAggregatedEntity.stats = sellDailyAggregateEntityStatsId;
      sellActionDailyAggregatedEntity.contract = contract.id;

      buyActionDailyAggregatedEntity.stats = buyDailyAggregateEntityStatsId;
      buyActionDailyAggregatedEntity.contract = contract.id;

      sellAggregatedEntityAccount.dailyAggregatedEntity = sellActionDailyAggregatedEntityId;
      buyAggregatedEntityAccount.dailyAggregatedEntity = buyActionDailyAggregatedEntityId;

      sellDailyAggregateEntityStats.protocolActionType = "SELL";
      sellDailyAggregateEntityStats.saleStat = saleStatId;

      buyDailyAggregateEntityStats.protocolActionType = "BUY";
      buyDailyAggregateEntityStats.saleStat = saleStatId;

      transaction.saleStat = saleStatId;
      transaction.transactionToken = saleToken.id;
      transaction.paymentToken = paymentToken.id;
      transaction.to = buyerAccount.id;
      transaction.from = sellerAccount.id;
      transaction.hash = txHash;

      // Save Everything
      buyerAccount.save();
      sellerAccount.save();

      sellAggregatedEntityAccount.save();
      buyAggregatedEntityAccount.save();

      contract.save();

      saleStat.save();

      transaction.save();

      sellDailyAggregateEntityStats.save();
      buyDailyAggregateEntityStats.save();

      sellActionDailyAggregatedEntity.save();
      buyActionDailyAggregatedEntity.save();
    }
  }

  export function getAirNFTSaleStatsId(
    contractAddress: string,
    dailyAggregatedEntityId: string
  ): string {
    return dataSource
      .network()
      .concat("-")
      .concat(dailyAggregatedEntityId)
      .concat("-")
      .concat(contractAddress);
  }

  export function getOrCreateAirNFTSaleStats(id: string): AirNFTSaleStats {
    let entity = AirNFTSaleStats.load(id);

    if (entity == null) {
      entity = new AirNFTSaleStats(id);
      entity.volumeInUSD = BigDecimal.zero();
      entity.walletCount = BigInt.zero();
      entity.transactionCount = BigInt.zero();
      entity.tokenCount = BigInt.fromString("1"); // Aggregation is done for one NFT collection
    }
    return entity as AirNFTSaleStats;
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

  export function getOrCreateAirNFTSaleTransaction(
    id: string
  ): AirNFTSaleTransaction {
    let transaction = AirNFTSaleTransaction.load(id);

    if (transaction == null) {
      transaction = new AirNFTSaleTransaction(id);
    }

    return transaction as AirNFTSaleTransaction;
  }
}
