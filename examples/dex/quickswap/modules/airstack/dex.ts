import { BigInt, BigDecimal, dataSource } from "@graphprotocol/graph-ts";
import {
  AirDEXPool,
  AirTokenTransfer,
  AirLiquidityPoolStats,
  AirLiquidityPoolInputTokenStats,
  AirLiquidityPoolOutputTokenStats,
  AirLiquidityPoolTransaction,
  AirDailyAggregateEntity,
} from "../../generated/schema";
import { calculatePercentage } from "./utils/maths";
import {
  getAirDailyAggregateEntityStatsId,
  getDailyAggregatedAccountId,
  getOrCreateAirAccount,
  getOrCreateAirDailyAggregateEntity,
  getOrCreateAirDailyAggregateEntityAccount,
  getOrCreateAirDailyAggregateEntityStats,
  getOrCreateAirEntityDailyChangeStats,
  getOrCreateAirToken,
  isAirDailyAggregateEntityAccountAvailable,
  updateAirDailyAggregateEntityDailyChangePercentage,
} from "./common";

import {
  AirProtocolActionType,
  AirProtocolType,
  AirTokenStandardType,
  AirTokenUsageType,
  BIGINT,
  BIG_DECIMAL,
  DEFAULT_DECIMALS,
} from "./constants";
import { usdPrice } from "./utils";

export namespace dex {
  function getAirDexPoolId(poolAddress: string): string {
    const dexPoolId = dataSource
      .network()
      .concat("-")
      .concat(AirProtocolType.EXCHANGE)
      .concat("-")
      .concat("POOL")
      .concat("-")
      .concat(poolAddress);

    return dexPoolId;
  }

  function getOrCreateAirDexPool(poolAddress: string): AirDEXPool {
    const entityId = getAirDexPoolId(poolAddress);
    let entity = AirDEXPool.load(entityId);
    if (entity == null) {
      entity = new AirDEXPool(entityId);
      entity.poolAddress = poolAddress;
    }

    return entity;
  }

  export function addDexPool(
    poolAddress: string,
    fee: BigInt,
    inputTokens: Array<string>,
    weights: Array<BigDecimal> | null = null,
    outputToken: string | null = null
  ): void {
    const dexPool = getOrCreateAirDexPool(poolAddress);

    const lpTokenNameArray: Array<string> = [];
    const inputTokenIds: Array<string> = [];
    for (let index = 0; index < inputTokens.length; index++) {
      const inputTokenAddress = inputTokens[index];
      const token = getOrCreateAirToken(inputTokenAddress);
      token.save();
      inputTokenIds.push(token.id);
      if (token.name) {
        lpTokenNameArray.push(token.name!);
      }
    }

    let lpTokenAddress = poolAddress;
    if (outputToken !== null) {
      lpTokenAddress = outputToken;
    }
    const lpToken = getOrCreateAirToken(lpTokenAddress);
    lpToken.symbol = lpTokenNameArray.join("/");
    lpToken.name = lpToken.symbol + " LP";
    lpToken.decimals = DEFAULT_DECIMALS;
    lpToken.standard = AirTokenStandardType.ERC20;
    lpToken.save();

    dexPool.inputToken = inputTokenIds;
    dexPool.outputToken = lpToken.id;
    dexPool.fee = fee;

    let weightage: Array<BigDecimal> = [];
    if (weights == null) {
      const totalCount = BigDecimal.fromString(inputTokens.length.toString());
      for (let index = 0; index < inputTokens.length; index++) {
        weightage.push(BIG_DECIMAL.ONE.div(totalCount));
      }
    } else {
      weightage = weights;
    }

    dexPool.weightage = weightage;
    dexPool.save();
  }

  export function addLiquidity(
    poolAddress: string,
    inputAmounts: Array<BigInt>,
    from: string,
    to: string,
    hash: string,
    timestamp: BigInt
  ): void {
    const dexPool = getOrCreateAirDexPool(poolAddress);
    const inputTokenTransfers: Array<AirTokenTransfer> = [];
    if (dexPool.inputToken.length > 0) {
      for (let index = 0; index < dexPool.inputToken.length; index++) {
        const tokenAddress = dexPool.inputToken[index];
        const inputToken = getOrCreateAirToken(tokenAddress);
        inputToken.save();

        const tokenTransfer = getOrCreateAirTokenTransfer(
          tokenAddress,
          from,
          to,
          inputAmounts[index],
          dexPool.fee,
          hash
        );
        inputTokenTransfers.push(tokenTransfer);
      }
    }

    const outputToken = getOrCreateAirToken(dexPool.outputToken);
    outputToken.save();
    const outputTokenTransfer = getOrCreateAirTokenTransfer(
      outputToken.address,
      to,
      from,
      BIGINT.ONE,
      BIGINT.ZERO,
      hash
    );

    _addLiquidity(
      dexPool,
      inputTokenTransfers,
      outputTokenTransfer,
      timestamp,
      hash
    );
  }

  function getOrCreateAirLiquidityPoolStats(id: string): AirLiquidityPoolStats {
    let entity = AirLiquidityPoolStats.load(id);
    if (entity === null) {
      entity = new AirLiquidityPoolStats(id);
      entity.walletCount = BIGINT.ZERO;
      entity.tokenCount = BIGINT.ZERO;
      entity.transactionCount = BIGINT.ZERO;
      entity.volumeInUSD = BIG_DECIMAL.ZERO;

      const dailyChange = getOrCreateAirEntityDailyChangeStats(id);
      entity.dailyChange = dailyChange.id;
    }
    return entity;
  }

  // function getOrCreateAirDailyAggregateEntityAccount(
  //   dailyAggregatedEntityId: string,
  //   accountAddress: string,
  //   walletCount: BigInt,
  //   volumeInUSD: BigDecimal
  // ): void {
  //   const entityId = dailyAggregatedEntityId.concat("-").concat(accountAddress);
  //   let entity = AirDailyAggregateEntityAccount.load(entityId);
  //   if (entity == null) {
  //     entity = new AirDailyAggregateEntityAccount(entityId);
  //     const account = getOrCreateAirAccount(accountAddress);
  //     entity.account = account.id;
  //     entity.dailyAggregatedEntity = dailyAggregatedEntityId;
  //     entity.volumeInUSD = volumeInUSD;
  //     entity.index = walletCount.plus(BIGINT_ONE);
  //     entity.save();
  //   }
  // }
  function _addLiquidity(
    dexPool: AirDEXPool,
    inputTokenTransfer: Array<AirTokenTransfer>,
    outputTokenTransfer: AirTokenTransfer,
    timestamp: BigInt,
    hash: string
  ): void {
    const aggregateEntity = getOrCreateAirDailyAggregateEntity(
      dexPool.poolAddress,
      AirProtocolType.EXCHANGE,
      AirProtocolActionType.ADD_LIQUIDITY,
      timestamp
    );
    aggregateEntity.tokenCount = aggregateEntity.tokenCount.plus(BIGINT.ONE);
    aggregateEntity.transactionCount = aggregateEntity.transactionCount.plus(
      BIGINT.ONE
    );

    const aggregatedAccountId = getDailyAggregatedAccountId(
      aggregateEntity.id,
      outputTokenTransfer.from
    );
    const isAccountAlreadyAdded =
      isAirDailyAggregateEntityAccountAvailable(aggregatedAccountId);
    const aggregatedAccount = getOrCreateAirDailyAggregateEntityAccount(
      aggregatedAccountId,
      outputTokenTransfer.from
    );
    aggregatedAccount.dailyAggregatedEntity = aggregateEntity.id;
    if (!isAccountAlreadyAdded) {
      aggregateEntity.walletCount = aggregateEntity.walletCount.plus(
        BIGINT.ONE
      );
      aggregatedAccount.index = aggregateEntity.walletCount;
    }

    const statsId = getAirDailyAggregateEntityStatsId(aggregateEntity.id);
    const aggStats = getOrCreateAirDailyAggregateEntityStats(statsId);
    aggStats.protocolActionType = AirProtocolActionType.ADD_LIQUIDITY;
    const statsEntity = getOrCreateAirLiquidityPoolStats(statsId);
    statsEntity.dexPool = dexPool.id;
    aggStats.addPoolLiquidityStats = statsEntity.id;
    aggStats.save();

    aggregateEntity.stats = aggStats.id;

    let totalUSDPrice: BigDecimal = BIG_DECIMAL.ZERO;

    for (let index = 0; index < inputTokenTransfer.length; index++) {
      const iTokenTransfer = inputTokenTransfer[index];
      const token = getOrCreateAirToken(iTokenTransfer.token);
      const priceInUsd = usdPrice(
        token.address,
        token.decimals,
        iTokenTransfer.amount
      );

      totalUSDPrice = totalUSDPrice.plus(priceInUsd);

      updateAirLiquidityPoolInputTokenStats(
        dexPool.id,
        statsId,
        token.address,
        priceInUsd,
        aggregateEntity.daySinceEpoch
      );
    }

    aggregateEntity.volumeInUSD =
      aggregateEntity.volumeInUSD.plus(totalUSDPrice);

    statsEntity.save();
    aggregatedAccount.save();
    aggregateEntity.save();

    updateAirLiquidityPoolOutputTokenStats(
      dexPool.id,
      statsId,
      outputTokenTransfer.token,
      aggregateEntity.daySinceEpoch
    );
    updateAirLiquidityPoolTransaction(
      dexPool,
      statsId,
      inputTokenTransfer,
      outputTokenTransfer,
      hash
    );

    const prevAggregateEntity = getOrCreateAirDailyAggregateEntity(
      dexPool.poolAddress,
      AirProtocolType.EXCHANGE,
      AirProtocolActionType.ADD_LIQUIDITY,
      timestamp,
      aggregateEntity.daySinceEpoch.minus(BIGINT.ONE)
    );

    updateDailyChangePercentage(
      dexPool.poolAddress,
      aggregateEntity,
      prevAggregateEntity
    );
  }

  function getOrCreateAirTokenTransfer(
    tokenAddress: string,
    from: string,
    to: string,
    amount: BigInt,
    fee: BigInt,
    hash: string
  ): AirTokenTransfer {
    const entityId = dataSource
      .network()
      .concat(hash)
      .concat("-")
      .concat(to)
      .concat("-")
      .concat(from)
      .concat("-")
      .concat(amount.toHexString())
      .concat("-")
      .concat(fee.toHexString());

    let airTokenTransfer = AirTokenTransfer.load(entityId);
    if (airTokenTransfer === null) {
      airTokenTransfer = new AirTokenTransfer(entityId);
      const fromAccount = getOrCreateAirAccount(from);
      fromAccount.save();
      airTokenTransfer.from = fromAccount.address;

      const toAccount = getOrCreateAirAccount(to);
      toAccount.save();
      airTokenTransfer.to = toAccount.address;

      airTokenTransfer.amount = amount;
      airTokenTransfer.fee = fee;

      const token = getOrCreateAirToken(tokenAddress);
      token.save();

      airTokenTransfer.token = token.id;
    }
    airTokenTransfer.save();

    return airTokenTransfer;
  }

  function getAirLiquidityPoolInputTokenStatsId(
    dexPoolId: string,
    inputTokenAddress: string,
    daySinceEpoch: BigInt
  ): string {
    let entityId = dataSource
      .network()
      .concat("-")
      .concat(dexPoolId)
      .concat("-")
      .concat(inputTokenAddress)
      .concat("-")
      .concat(daySinceEpoch.toString());
    return entityId;
  }

  function getOrCreateAirLiquidityPoolInputTokenStats(
    id: string
  ): AirLiquidityPoolInputTokenStats {
    let tokenStats = AirLiquidityPoolInputTokenStats.load(id);
    if (tokenStats == null) {
      tokenStats = new AirLiquidityPoolInputTokenStats(id);
      tokenStats.type = AirTokenUsageType.LP;
      tokenStats.walletCount = BIGINT.ZERO;
      tokenStats.tokenCount = BIGINT.ZERO;
      tokenStats.transactionCount = BIGINT.ZERO;
      tokenStats.volumeInUSD = BIG_DECIMAL.ZERO;
      const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(id);
      tokenStats.dailyChange = dailyChangeStats.id;
    }
    return tokenStats;
  }

  function updateAirLiquidityPoolInputTokenStats(
    dexPoolId: string,
    statsId: string,
    inputTokenAddress: string,
    usdVolume: BigDecimal,
    daySinceEpoch: BigInt
  ): void {
    const entityId = getAirLiquidityPoolInputTokenStatsId(
      dexPoolId,
      inputTokenAddress,
      daySinceEpoch
    );

    let tokenStats = getOrCreateAirLiquidityPoolInputTokenStats(entityId);
    tokenStats.liquidityPoolStatsRef = statsId;
    const inputToken = getOrCreateAirToken(inputTokenAddress);
    tokenStats.token = inputToken.id;
    tokenStats.walletCount = tokenStats.walletCount.plus(BIGINT.ONE);
    tokenStats.transactionCount = tokenStats.walletCount.plus(BIGINT.ONE);
    tokenStats.volumeInUSD = tokenStats.volumeInUSD.plus(usdVolume);

    tokenStats.save();
  }

  function getAirLiquidityPoolOutputTokenStatsId(
    dexPoolId: string,
    outputTokenAddress: string,
    daySinceEpoch: BigInt
  ): string {
    let entityId = dataSource
      .network()
      .concat("-")
      .concat(dexPoolId)
      .concat("-")
      .concat(outputTokenAddress)
      .concat("-")
      .concat(daySinceEpoch.toString());
    return entityId;
  }

  function getOrCreateAirLiquidityPoolOutputTokenStats(
    id: string
  ): AirLiquidityPoolOutputTokenStats {
    let tokenStats = AirLiquidityPoolOutputTokenStats.load(id);
    if (tokenStats == null) {
      tokenStats = new AirLiquidityPoolOutputTokenStats(id);
      tokenStats.type = AirTokenUsageType.LP;
      tokenStats.walletCount = BIGINT.ZERO;
      tokenStats.tokenCount = BIGINT.ZERO;
      tokenStats.transactionCount = BIGINT.ZERO;
      tokenStats.volumeInUSD = BIG_DECIMAL.ZERO;

      const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(id);
      tokenStats.dailyChange = dailyChangeStats.id;
    }
    return tokenStats;
  }

  function updateAirLiquidityPoolOutputTokenStats(
    dexPoolId: string,
    statsId: string,
    outputTokenAddress: string,
    daySinceEpoch: BigInt
  ): void {
    const entityId = getAirLiquidityPoolOutputTokenStatsId(
      dexPoolId,
      outputTokenAddress,
      daySinceEpoch
    );

    let tokenStats = getOrCreateAirLiquidityPoolOutputTokenStats(entityId);
    tokenStats.liquidityPoolStatsRef = statsId;
    const outputToken = getOrCreateAirToken(outputTokenAddress);
    tokenStats.token = outputToken.id;
    tokenStats.walletCount = tokenStats.walletCount.plus(BIGINT.ONE);
    tokenStats.transactionCount = tokenStats.walletCount.plus(BIGINT.ONE);
    tokenStats.save();
  }

  function updateAirLiquidityPoolTransaction(
    dexPool: AirDEXPool,
    statsId: string,
    inputTokenTransfer: Array<AirTokenTransfer>,
    outputTokenTransfer: AirTokenTransfer,
    hash: string
  ): void {
    const entityId = statsId.concat("-").concat(hash);

    let lpTransaction = AirLiquidityPoolTransaction.load(entityId);
    if (lpTransaction === null) {
      lpTransaction = new AirLiquidityPoolTransaction(entityId);
      lpTransaction.dexPool = dexPool.id;
      lpTransaction.liquidityPoolStatsRef = statsId;
      lpTransaction.hash = hash;

      const inputTokenTransferEntityIds: Array<string> = [];
      for (let index = 0; index < inputTokenTransfer.length; index++) {
        const tokenTransfer = inputTokenTransfer[index];
        inputTokenTransferEntityIds.push(tokenTransfer.id);
      }
      lpTransaction.inputTokenTransfers = inputTokenTransferEntityIds;
      lpTransaction.outputTokenTransfer = outputTokenTransfer.id;
      lpTransaction.save();
    }
  }

  function updateDailyChangePercentage(
    poolAddress: string,
    aggregateEntity: AirDailyAggregateEntity,
    prevAggregateEntity: AirDailyAggregateEntity
  ): void {
    updateAirDailyAggregateEntityDailyChangePercentage(
      aggregateEntity,
      prevAggregateEntity
    );

    updateAirLiquidityPoolStatsDailyChangePercentage(
      aggregateEntity.stats,
      prevAggregateEntity.stats
    );

    updateAirLiquidityPoolTokenStatsDailyChangePercentage(
      poolAddress,
      aggregateEntity.daySinceEpoch
    );
  }

  function updateAirLiquidityPoolStatsDailyChangePercentage(
    currentEntityId: string,
    prevEntityId: string
  ): void {
    const currentEntity = getOrCreateAirLiquidityPoolStats(currentEntityId);
    const prevEntity = getOrCreateAirLiquidityPoolStats(prevEntityId);

    const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(
      currentEntity.id
    );

    dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
      currentEntity.walletCount.toBigDecimal(),
      prevEntity.walletCount.toBigDecimal()
    );
    dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
      currentEntity.tokenCount.toBigDecimal(),
      prevEntity.tokenCount.toBigDecimal()
    );
    dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
      currentEntity.transactionCount.toBigDecimal(),
      prevEntity.transactionCount.toBigDecimal()
    );
    dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
      currentEntity.volumeInUSD,
      prevEntity.volumeInUSD
    );

    dailyChangeStats.save();
  }

  function updateAirLiquidityPoolTokenStatsDailyChangePercentage(
    poolAddress: string,
    currentDaySinceEpoch: BigInt
  ): void {
    const dexPool = getOrCreateAirDexPool(poolAddress);

    if (dexPool.inputToken.length > 0) {
      for (let index = 0; index < dexPool.inputToken.length; index++) {
        const tokenAddress = dexPool.inputToken[index];
        const currentEntityId = getAirLiquidityPoolOutputTokenStatsId(
          dexPool.id,
          tokenAddress,
          currentDaySinceEpoch
        );
        const prevEntityId = getAirLiquidityPoolOutputTokenStatsId(
          dexPool.id,
          tokenAddress,
          currentDaySinceEpoch.minus(BIGINT.ONE)
        );

        updateAirLiquidityPoolInputTokenStatsDailyChangePercentage(
          currentEntityId,
          prevEntityId
        );
      }

      const outputTokenAddress = dexPool.outputToken;
      const currentEntityId = getAirLiquidityPoolOutputTokenStatsId(
        dexPool.id,
        outputTokenAddress,
        currentDaySinceEpoch
      );
      const prevEntityId = getAirLiquidityPoolOutputTokenStatsId(
        dexPool.id,
        outputTokenAddress,
        currentDaySinceEpoch.minus(BIGINT.ONE)
      );

      updateAirLiquidityPoolOutputTokenStatsDailyChangePercentage(
        currentEntityId,
        prevEntityId
      );
    }
  }

  function updateAirLiquidityPoolInputTokenStatsDailyChangePercentage(
    currentEntityId: string,
    prevEntityId: string
  ): void {
    const currentEntity =
      getOrCreateAirLiquidityPoolInputTokenStats(currentEntityId);
    const prevEntity = getOrCreateAirLiquidityPoolInputTokenStats(prevEntityId);
    const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(
      currentEntity.id
    );

    dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
      currentEntity.walletCount.toBigDecimal(),
      prevEntity.walletCount.toBigDecimal()
    );
    dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
      currentEntity.tokenCount.toBigDecimal(),
      prevEntity.tokenCount.toBigDecimal()
    );
    dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
      currentEntity.transactionCount.toBigDecimal(),
      prevEntity.transactionCount.toBigDecimal()
    );
    dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
      currentEntity.volumeInUSD,
      prevEntity.volumeInUSD
    );

    dailyChangeStats.save();
  }

  function updateAirLiquidityPoolOutputTokenStatsDailyChangePercentage(
    currentEntityId: string,
    prevEntityId: string
  ): void {
    const currentEntity =
      getOrCreateAirLiquidityPoolOutputTokenStats(currentEntityId);
    const prevEntity =
      getOrCreateAirLiquidityPoolOutputTokenStats(prevEntityId);
    const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(
      currentEntity.id
    );

    dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
      currentEntity.walletCount.toBigDecimal(),
      prevEntity.walletCount.toBigDecimal()
    );
    dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
      currentEntity.tokenCount.toBigDecimal(),
      prevEntity.tokenCount.toBigDecimal()
    );
    dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
      currentEntity.transactionCount.toBigDecimal(),
      prevEntity.transactionCount.toBigDecimal()
    );
    dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
      currentEntity.volumeInUSD,
      prevEntity.volumeInUSD
    );

    dailyChangeStats.save();
  }
}
