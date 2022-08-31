import { BigInt, BigDecimal, dataSource, log } from "@graphprotocol/graph-ts";
import {
  AirDEXPool,
  AirTokenTransfer,
  AirLiquidityPoolStats,
  AirLiquidityPoolInputTokenStats,
  AirLiquidityPoolOutputTokenStats,
  AirLiquidityPoolTransaction,
  AirDailyAggregateEntity,
  AirDEXSwapStats,
  AirDEXSwapTransaction,
  AirSwapOutputTokenStats,
  AirSwapInputTokenStats,
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
  // updateAirDailyAggregateEntityDailyChangePercentage,
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

const OUT = "OUT";
const IN = "IN";
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
    const inputBalances: Array<BigInt> = [];
    for (let index = 0; index < inputTokens.length; index++) {
      const inputTokenAddress = inputTokens[index];
      const token = getOrCreateAirToken(inputTokenAddress);
      token.save();
      inputTokenIds.push(token.id);
      if (token.name) {
        lpTokenNameArray.push(token.name!);
      }
      inputBalances.push(BIGINT.ZERO);
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
    dexPool.tokenBalances = inputBalances;
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
    logIndex: BigInt,
    timestamp: BigInt,
    blockNumber: BigInt
  ): void {
    // log.info("addLiquidity: {}, {}, {}, {}, {}, {}", [
    //   poolAddress,
    //   from,
    //   to,
    //   hash,
    //   logIndex.toString(),
    //   timestamp.toString(),
    // ]);
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
          hash,
          logIndex
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
      hash,
      logIndex
    );

    _addLiquidity(
      dexPool,
      inputTokenTransfers,
      outputTokenTransfer,
      timestamp,
      hash,
      logIndex,
      blockNumber
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
    hash: string,
    logIndex: BigInt,
    blockNumber: BigInt
  ): void {
    const aggregateEntity = getOrCreateAirDailyAggregateEntity(
      blockNumber,
      dexPool.poolAddress,
      AirProtocolType.EXCHANGE,
      AirProtocolActionType.ADD_LIQUIDITY,
      timestamp,
      ""
    );

    let totalTokensAdded = BIGINT.ZERO;
    for (let index = 0; index < inputTokenTransfer.length; index++) {
      const tokenTransfer = inputTokenTransfer[index];
      totalTokensAdded = totalTokensAdded.plus(tokenTransfer.amount);
    }

    aggregateEntity.tokenCount = aggregateEntity.tokenCount.plus(
      totalTokensAdded
    );
    aggregateEntity.transactionCount = aggregateEntity.transactionCount.plus(
      BIGINT.ONE
    );

    const aggregatedAccountId = getDailyAggregatedAccountId(
      aggregateEntity.id,
      outputTokenTransfer.to
    );
    const isAccountAlreadyAdded = isAirDailyAggregateEntityAccountAvailable(
      aggregatedAccountId
    );
    const aggregatedAccount = getOrCreateAirDailyAggregateEntityAccount(
      aggregatedAccountId,
      outputTokenTransfer.to
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
        iTokenTransfer.amount,
        priceInUsd,
        aggregateEntity.daySinceEpoch,
        !isAccountAlreadyAdded
      );
    }

    aggregateEntity.volumeInUSD = aggregateEntity.volumeInUSD.plus(
      totalUSDPrice
    );

    statsEntity.save();
    aggregatedAccount.save();
    aggregateEntity.save();

    updateAirLiquidityPoolOutputTokenStats(
      dexPool.id,
      statsId,
      outputTokenTransfer.token,
      BIGINT.ONE,
      aggregateEntity.daySinceEpoch,
      !isAccountAlreadyAdded
    );
    updateAirLiquidityPoolTransaction(
      dexPool,
      statsId,
      inputTokenTransfer,
      outputTokenTransfer,
      hash,
      logIndex
    );

    // const prevAggregateEntity = getOrCreateAirDailyAggregateEntity(
    //   dexPool.poolAddress,
    //   AirProtocolType.EXCHANGE,
    //   AirProtocolActionType.ADD_LIQUIDITY,
    //   timestamp,
    //   "",
    //   aggregateEntity.daySinceEpoch.minus(BIGINT.ONE)
    // );

    // updateDailyChangePercentage(
    //   dexPool.poolAddress,
    //   aggregateEntity,
    //   prevAggregateEntity,
    //   AirProtocolActionType.ADD_LIQUIDITY
    // );
  }

  function getOrCreateAirTokenTransfer(
    tokenAddress: string,
    from: string,
    to: string,
    amount: BigInt,
    fee: BigInt,
    hash: string,
    logIndex: BigInt
  ): AirTokenTransfer {
    const entityId = dataSource
      .network()
      .concat(hash)
      .concat("-")
      .concat(logIndex.toString())
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

  // function getAirLiquidityPoolInputTokenStatsId(
  //   dexPoolId: string,
  //   inputTokenAddress: string,
  //   daySinceEpoch: BigInt
  // ): string {
  //   let entityId = dataSource
  //     .network()
  //     .concat("-")
  //     .concat(dexPoolId)
  //     .concat("-")
  //     .concat(inputTokenAddress)
  //     .concat("-")
  //     .concat(daySinceEpoch.toString());
  //   return entityId;
  // }

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
    tokenAmount: BigInt,
    usdVolume: BigDecimal,
    daySinceEpoch: BigInt,
    shouldAddWalletCount: bool
  ): void {
    const entityId = getAirTokenStatsId(
      dexPoolId,
      AirProtocolActionType.ADD_LIQUIDITY,
      inputTokenAddress,
      daySinceEpoch,
      IN
    );

    let tokenStats = getOrCreateAirLiquidityPoolInputTokenStats(entityId);
    tokenStats.liquidityPoolStatsRef = statsId;
    const inputToken = getOrCreateAirToken(inputTokenAddress);
    tokenStats.token = inputToken.id;
    tokenStats.tokenCount = tokenStats.tokenCount.plus(tokenAmount);
    if (shouldAddWalletCount) {
      tokenStats.walletCount = tokenStats.walletCount.plus(BIGINT.ONE);
    }
    tokenStats.transactionCount = tokenStats.transactionCount.plus(BIGINT.ONE);
    tokenStats.volumeInUSD = tokenStats.volumeInUSD.plus(usdVolume);

    tokenStats.save();
  }

  function getAirTokenStatsId(
    dexPoolId: string,
    type: string,
    tokenAddress: string,
    daySinceEpoch: BigInt,
    identifier: string
  ): string {
    let entityId = dataSource
      .network()
      .concat("-")
      .concat(dexPoolId)
      .concat("-")
      .concat(type)
      .concat("-")
      .concat(tokenAddress)
      .concat("-")
      .concat(identifier)
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
    tokenAmount: BigInt,
    daySinceEpoch: BigInt,
    shouldAddWalletCount: bool
  ): void {
    const entityId = getAirTokenStatsId(
      dexPoolId,
      AirProtocolActionType.ADD_LIQUIDITY,
      outputTokenAddress,
      daySinceEpoch,
      OUT
    );

    let tokenStats = getOrCreateAirLiquidityPoolOutputTokenStats(entityId);
    tokenStats.liquidityPoolStatsRef = statsId;
    const outputToken = getOrCreateAirToken(outputTokenAddress);
    tokenStats.token = outputToken.id;
    tokenStats.tokenCount = tokenStats.tokenCount.plus(tokenAmount);
    if (shouldAddWalletCount) {
      tokenStats.walletCount = tokenStats.walletCount.plus(BIGINT.ONE);
    }

    tokenStats.transactionCount = tokenStats.transactionCount.plus(BIGINT.ONE);
    tokenStats.save();
  }

  function updateAirLiquidityPoolTransaction(
    dexPool: AirDEXPool,
    statsId: string,
    inputTokenTransfer: Array<AirTokenTransfer>,
    outputTokenTransfer: AirTokenTransfer,
    hash: string,
    logIndex: BigInt
  ): void {
    const entityId = statsId
      .concat("-")
      .concat(hash)
      .concat("-")
      .concat(logIndex.toString());

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

  // function updateDailyChangePercentage(
  //   poolAddress: string,
  //   aggregateEntity: AirDailyAggregateEntity,
  //   prevAggregateEntity: AirDailyAggregateEntity,
  //   actionType: string
  // ): void {
  //   updateAirDailyAggregateEntityDailyChangePercentage(
  //     aggregateEntity,
  //     prevAggregateEntity
  //   );

  //   if (actionType === AirProtocolActionType.ADD_LIQUIDITY) {
  //     updateAirLiquidityPoolStatsDailyChangePercentage(
  //       aggregateEntity.stats,
  //       prevAggregateEntity.stats
  //     );

  //     updateAirLiquidityPoolTokenStatsDailyChangePercentage(
  //       poolAddress,
  //       aggregateEntity.daySinceEpoch
  //     );
  //   } else if (actionType === AirProtocolActionType.SWAP) {
  //     updateAirSwapStatsDailyChangePercentage(
  //       aggregateEntity.stats,
  //       prevAggregateEntity.stats
  //     );
  //   }
  // }

  // function updateAirLiquidityPoolStatsDailyChangePercentage(
  //   currentEntityId: string,
  //   prevEntityId: string
  // ): void {
  //   const currentEntity = getOrCreateAirLiquidityPoolStats(currentEntityId);
  //   const prevEntity = getOrCreateAirLiquidityPoolStats(prevEntityId);

  //   const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(
  //     currentEntity.id
  //   );

  //   dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
  //     currentEntity.walletCount.toBigDecimal(),
  //     prevEntity.walletCount.toBigDecimal()
  //   );
  //   dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
  //     currentEntity.tokenCount.toBigDecimal(),
  //     prevEntity.tokenCount.toBigDecimal()
  //   );
  //   dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
  //     currentEntity.transactionCount.toBigDecimal(),
  //     prevEntity.transactionCount.toBigDecimal()
  //   );
  //   dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
  //     currentEntity.volumeInUSD,
  //     prevEntity.volumeInUSD
  //   );

  //   dailyChangeStats.save();
  // }

  // function updateAirLiquidityPoolTokenStatsDailyChangePercentage(
  //   poolAddress: string,
  //   currentDaySinceEpoch: BigInt
  // ): void {
  //   const dexPool = getOrCreateAirDexPool(poolAddress);

  //   if (dexPool.inputToken.length > 0) {
  //     for (let index = 0; index < dexPool.inputToken.length; index++) {
  //       const tokenAddress = dexPool.inputToken[index];
  //       const currentEntityId = getAirTokenStatsId(
  //         dexPool.id,
  //         AirProtocolActionType.ADD_LIQUIDITY,
  //         tokenAddress,
  //         currentDaySinceEpoch,
  //         IN
  //       );
  //       const prevEntityId = getAirTokenStatsId(
  //         dexPool.id,
  //         AirProtocolActionType.ADD_LIQUIDITY,
  //         tokenAddress,
  //         currentDaySinceEpoch.minus(BIGINT.ONE),
  //         IN
  //       );

  //       updateAirLiquidityPoolInputTokenStatsDailyChangePercentage(
  //         currentEntityId,
  //         prevEntityId
  //       );
  //     }

  //     // const outputTokenAddress = dexPool.outputToken;
  //     // const currentEntityId = getAirTokenStatsId(
  //     //   dexPool.id,
  //     //   AirProtocolActionType.ADD_LIQUIDITY,
  //     //   outputTokenAddress,
  //     //   currentDaySinceEpoch,
  //     //   OUT
  //     // );
  //     // const prevEntityId = getAirTokenStatsId(
  //     //   dexPool.id,
  //     //   AirProtocolActionType.ADD_LIQUIDITY,
  //     //   outputTokenAddress,
  //     //   currentDaySinceEpoch.minus(BIGINT.ONE),
  //     //   OUT
  //     // );

  //     // updateAirLiquidityPoolOutputTokenStatsDailyChangePercentage(
  //     //   currentEntityId,
  //     //   prevEntityId
  //     // );
  //   }
  // }

  // function updateAirLiquidityPoolInputTokenStatsDailyChangePercentage(
  //   currentEntityId: string,
  //   prevEntityId: string
  // ): void {
  //   const currentEntity = getOrCreateAirLiquidityPoolInputTokenStats(
  //     currentEntityId
  //   );
  //   const prevEntity = getOrCreateAirLiquidityPoolInputTokenStats(prevEntityId);
  //   const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(
  //     currentEntity.id
  //   );

  //   dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
  //     currentEntity.walletCount.toBigDecimal(),
  //     prevEntity.walletCount.toBigDecimal()
  //   );
  //   dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
  //     currentEntity.tokenCount.toBigDecimal(),
  //     prevEntity.tokenCount.toBigDecimal()
  //   );
  //   dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
  //     currentEntity.transactionCount.toBigDecimal(),
  //     prevEntity.transactionCount.toBigDecimal()
  //   );
  //   dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
  //     currentEntity.volumeInUSD,
  //     prevEntity.volumeInUSD
  //   );

  //   dailyChangeStats.save();
  // }

  // function updateAirLiquidityPoolOutputTokenStatsDailyChangePercentage(
  //   currentEntityId: string,
  //   prevEntityId: string
  // ): void {
  //   const currentEntity = getOrCreateAirLiquidityPoolOutputTokenStats(
  //     currentEntityId
  //   );
  //   const prevEntity = getOrCreateAirLiquidityPoolOutputTokenStats(
  //     prevEntityId
  //   );
  //   const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(
  //     currentEntity.id
  //   );

  //   dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
  //     currentEntity.walletCount.toBigDecimal(),
  //     prevEntity.walletCount.toBigDecimal()
  //   );
  //   dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
  //     currentEntity.tokenCount.toBigDecimal(),
  //     prevEntity.tokenCount.toBigDecimal()
  //   );
  //   dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
  //     currentEntity.transactionCount.toBigDecimal(),
  //     prevEntity.transactionCount.toBigDecimal()
  //   );
  //   dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
  //     currentEntity.volumeInUSD,
  //     prevEntity.volumeInUSD
  //   );

  //   dailyChangeStats.save();
  // }

  // Swap related

  export function swap(
    poolAddress: string,
    inputAmounts: Array<BigInt>,
    outputAmounts: Array<BigInt>,
    inputTokenIndex: i32,
    outputTokenIndex: i32,
    from: string,
    to: string,
    hash: string,
    logIndex: BigInt,
    timestamp: BigInt,
    blockNumber: BigInt
  ): void {
    const dexPool = getOrCreateAirDexPool(poolAddress);
    if (dexPool.inputToken.length == 0) {
      return;
    }

    const inputTokenAddress = dexPool.inputToken[inputTokenIndex];
    const inputToken = getOrCreateAirToken(inputTokenAddress);
    inputToken.save();
    const inputTokenTransfer = getOrCreateAirTokenTransfer(
      inputTokenAddress,
      from,
      to,
      inputAmounts[inputTokenIndex],
      dexPool.fee,
      hash,
      logIndex
    );

    const outputTokenAddress = dexPool.inputToken[outputTokenIndex];
    const outputToken = getOrCreateAirToken(outputTokenAddress);
    outputToken.save();
    const outputTokenTransfer = getOrCreateAirTokenTransfer(
      outputTokenAddress,
      to,
      from,
      outputAmounts[outputTokenIndex],
      dexPool.fee,
      hash,
      logIndex
    );

    const aggregateEntity = getOrCreateAirDailyAggregateEntity(
      blockNumber,
      poolAddress,
      AirProtocolType.EXCHANGE,
      AirProtocolActionType.SWAP,
      timestamp,
      inputTokenAddress
    );
    aggregateEntity.tokenCount = aggregateEntity.tokenCount.plus(
      inputAmounts[inputTokenIndex]
    );
    aggregateEntity.transactionCount = aggregateEntity.transactionCount.plus(
      BIGINT.ONE
    );

    let walletCount = BIGINT.ZERO;

    const fromAggregatedAccountId = getDailyAggregatedAccountId(
      aggregateEntity.id,
      from
    );
    const isFromAccountAlreadyAdded = isAirDailyAggregateEntityAccountAvailable(
      fromAggregatedAccountId
    );
    const fromAggregatedAccount = getOrCreateAirDailyAggregateEntityAccount(
      fromAggregatedAccountId,
      from
    );
    fromAggregatedAccount.dailyAggregatedEntity = aggregateEntity.id;
    if (!isFromAccountAlreadyAdded) {
      walletCount = walletCount.plus(BIGINT.ONE);
      const currentCount = aggregateEntity.walletCount.plus(BIGINT.ONE);
      aggregateEntity.walletCount = currentCount;
      fromAggregatedAccount.index = currentCount;
      fromAggregatedAccount.save();
    }

    const toAggregatedAccountId = getDailyAggregatedAccountId(
      aggregateEntity.id,
      to
    );
    const isToAccountAlreadyAdded = isAirDailyAggregateEntityAccountAvailable(
      toAggregatedAccountId
    );
    const toAggregatedAccount = getOrCreateAirDailyAggregateEntityAccount(
      toAggregatedAccountId,
      to
    );
    toAggregatedAccount.dailyAggregatedEntity = aggregateEntity.id;
    if (!isToAccountAlreadyAdded) {
      walletCount = walletCount.plus(BIGINT.ONE);
      const currentCount = aggregateEntity.walletCount.plus(BIGINT.ONE);
      aggregateEntity.walletCount = currentCount;
      toAggregatedAccount.index = currentCount;
      toAggregatedAccount.save();
    }

    const aggStatsId = getAirDailyAggregateEntityStatsId(aggregateEntity.id);
    const aggStats = getOrCreateAirDailyAggregateEntityStats(aggStatsId);
    aggStats.protocolActionType = AirProtocolActionType.SWAP;
    const dexStatsEntity = getOrCreateAirDexSwapStats(aggStatsId);
    dexStatsEntity.dexPool = dexPool.id;
    aggStats.swapStats = dexStatsEntity.id;
    aggStats.save();

    aggregateEntity.stats = aggStats.id;

    let totalUSDPrice: BigDecimal = BIG_DECIMAL.ZERO;

    const inputPriceInUsd = usdPrice(
      inputToken.address,
      inputToken.decimals,
      inputAmounts[inputTokenIndex]
    );

    totalUSDPrice = totalUSDPrice.plus(inputPriceInUsd);

    updateAirSwapInputTokenStats(
      dexPool.id,
      dexStatsEntity.id,
      inputToken.address,
      inputAmounts[inputTokenIndex],
      inputPriceInUsd,
      aggregateEntity.daySinceEpoch,
      walletCount
    );

    const outputPriceInUsd = usdPrice(
      outputToken.address,
      outputToken.decimals,
      outputAmounts[outputTokenIndex]
    );
    updateAirSwapOutputTokenStats(
      dexPool.id,
      dexStatsEntity.id,
      outputToken.address,
      outputAmounts[outputTokenIndex],
      outputPriceInUsd,
      aggregateEntity.daySinceEpoch,
      walletCount
    );

    aggregateEntity.volumeInUSD = aggregateEntity.volumeInUSD.plus(
      totalUSDPrice
    );

    dexStatsEntity.save();
    fromAggregatedAccount.save();
    toAggregatedAccount.save();
    aggregateEntity.save();

    updateAirDEXSwapTransaction(
      dexPool,
      dexStatsEntity.id,
      inputTokenTransfer,
      outputTokenTransfer,
      hash,
      logIndex
    );

    // const prevAggregateEntity = getOrCreateAirDailyAggregateEntity(
    //   dexPool.poolAddress,
    //   AirProtocolType.EXCHANGE,
    //   AirProtocolActionType.SWAP,
    //   timestamp,
    //   inputTokenAddress,
    //   aggregateEntity.daySinceEpoch.minus(BIGINT.ONE)
    // );

    // updateDailyChangePercentage(
    //   dexPool.poolAddress,
    //   aggregateEntity,
    //   prevAggregateEntity,
    //   AirProtocolActionType.SWAP
    // );
  }

  function getOrCreateAirDexSwapStats(id: string): AirDEXSwapStats {
    let entity = AirDEXSwapStats.load(id);
    if (entity === null) {
      entity = new AirDEXSwapStats(id);
      entity.walletCount = BIGINT.ZERO;
      entity.tokenCount = BIGINT.ZERO;
      entity.transactionCount = BIGINT.ZERO;
      entity.volumeInUSD = BIG_DECIMAL.ZERO;

      const dailyChange = getOrCreateAirEntityDailyChangeStats(id);
      entity.dailyChange = dailyChange.id;
    }
    return entity;
  }

  function updateAirSwapInputTokenStats(
    dexPoolId: string,
    statsId: string,
    inputTokenAddress: string,
    tokenAmount: BigInt,
    usdVolume: BigDecimal,
    daySinceEpoch: BigInt,
    walletCount: BigInt
  ): void {
    const entityId = getAirTokenStatsId(
      dexPoolId,
      AirProtocolActionType.SWAP,
      inputTokenAddress,
      daySinceEpoch,
      IN
    );

    let tokenStats = getOrCreateAirSwapInputTokenStats(entityId);
    tokenStats.swapStatsRef = statsId;
    const inputToken = getOrCreateAirToken(inputTokenAddress);
    tokenStats.token = inputToken.id;
    tokenStats.tokenCount = tokenStats.tokenCount.plus(tokenAmount);
    tokenStats.walletCount = tokenStats.walletCount.plus(walletCount);

    tokenStats.transactionCount = tokenStats.transactionCount.plus(BIGINT.ONE);
    tokenStats.volumeInUSD = tokenStats.volumeInUSD.plus(usdVolume);

    tokenStats.save();
  }

  function getOrCreateAirSwapInputTokenStats(
    id: string
  ): AirSwapInputTokenStats {
    let tokenStats = AirSwapInputTokenStats.load(id);
    if (tokenStats == null) {
      tokenStats = new AirSwapInputTokenStats(id);
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

  function updateAirSwapOutputTokenStats(
    dexPoolId: string,
    statsId: string,
    outputTokenAddress: string,
    tokenAmount: BigInt,
    usdVolume: BigDecimal,
    daySinceEpoch: BigInt,
    walletCount: BigInt
  ): void {
    const entityId = getAirTokenStatsId(
      dexPoolId,
      AirProtocolActionType.SWAP,
      outputTokenAddress,
      daySinceEpoch,
      OUT
    );

    let tokenStats = getOrCreateAirSwapOutputTokenStats(entityId);
    tokenStats.swapStatsRef = statsId;
    const outputToken = getOrCreateAirToken(outputTokenAddress);
    tokenStats.token = outputToken.id;
    tokenStats.tokenCount = tokenStats.tokenCount.plus(tokenAmount);
    tokenStats.walletCount = tokenStats.walletCount.plus(walletCount);

    tokenStats.transactionCount = tokenStats.transactionCount.plus(BIGINT.ONE);
    tokenStats.volumeInUSD = tokenStats.volumeInUSD.plus(usdVolume);
    tokenStats.save();
  }

  function getOrCreateAirSwapOutputTokenStats(
    id: string
  ): AirSwapOutputTokenStats {
    let tokenStats = AirSwapOutputTokenStats.load(id);
    if (tokenStats == null) {
      tokenStats = new AirSwapOutputTokenStats(id);
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

  function updateAirDEXSwapTransaction(
    dexPool: AirDEXPool,
    statsId: string,
    inputTokenTransfer: AirTokenTransfer,
    outputTokenTransfer: AirTokenTransfer,
    hash: string,
    logIndex: BigInt
  ): void {
    const entityId = statsId
      .concat("-")
      .concat(hash)
      .concat("-")
      .concat(logIndex.toHexString());

    let transaction = AirDEXSwapTransaction.load(entityId);
    if (transaction === null) {
      transaction = new AirDEXSwapTransaction(entityId);
      transaction.dexPool = dexPool.id;
      transaction.swapStatsRef = statsId;
      transaction.hash = hash;
      transaction.inputTokenTransfer = inputTokenTransfer.id;
      transaction.outputTokenTransfer = outputTokenTransfer.id;
      transaction.save();
    }
  }

  // function updateAirSwapStatsDailyChangePercentage(
  //   currentEntityId: string,
  //   prevEntityId: string
  // ): void {
  //   const currentEntity = getOrCreateAirDexSwapStats(currentEntityId);
  //   const prevEntity = getOrCreateAirDexSwapStats(prevEntityId);

  //   const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(
  //     currentEntity.id
  //   );

  //   dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
  //     currentEntity.walletCount.toBigDecimal(),
  //     prevEntity.walletCount.toBigDecimal()
  //   );
  //   dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
  //     currentEntity.tokenCount.toBigDecimal(),
  //     prevEntity.tokenCount.toBigDecimal()
  //   );
  //   dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
  //     currentEntity.transactionCount.toBigDecimal(),
  //     prevEntity.transactionCount.toBigDecimal()
  //   );
  //   dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
  //     currentEntity.volumeInUSD,
  //     prevEntity.volumeInUSD
  //   );

  //   dailyChangeStats.save();
  // }

  // function updateAirSwapTokenStatsDailyChangePercentage(
  //   poolAddress: string,
  //   currentDaySinceEpoch: BigInt
  // ): void {
  //   const dexPool = getOrCreateAirDexPool(poolAddress);

  //   if (dexPool.inputToken.length > 0) {
  //     for (let index = 0; index < dexPool.inputToken.length; index++) {
  //       const tokenAddress = dexPool.inputToken[index];
  //       const currentEntityId = getAirTokenStatsId(
  //         dexPool.id,
  //         AirProtocolActionType.SWAP,
  //         tokenAddress,
  //         currentDaySinceEpoch,
  //         IN
  //       );
  //       const prevEntityId = getAirTokenStatsId(
  //         dexPool.id,
  //         AirProtocolActionType.SWAP,
  //         tokenAddress,
  //         currentDaySinceEpoch.minus(BIGINT.ONE),
  //         IN
  //       );

  //       updateAirSwapInputTokenStatsDailyChangePercentage(
  //         currentEntityId,
  //         prevEntityId
  //       );
  //     }

  //     const outputTokenAddress = dexPool.outputToken;
  //     const currentEntityId = getAirTokenStatsId(
  //       dexPool.id,
  //       AirProtocolActionType.ADD_LIQUIDITY,
  //       outputTokenAddress,
  //       currentDaySinceEpoch,
  //       OUT
  //     );
  //     const prevEntityId = getAirTokenStatsId(
  //       dexPool.id,
  //       AirProtocolActionType.ADD_LIQUIDITY,
  //       outputTokenAddress,
  //       currentDaySinceEpoch.minus(BIGINT.ONE),
  //       OUT
  //     );

  //     updateAirLiquidityPoolOutputTokenStatsDailyChangePercentage(
  //       currentEntityId,
  //       prevEntityId
  //     );
  //   }
  // }

  // function updateAirSwapInputTokenStatsDailyChangePercentage(
  //   currentEntityId: string,
  //   prevEntityId: string
  // ): void {
  //   const currentEntity = getOrCreateAirSwapInputTokenStats(currentEntityId);
  //   const prevEntity = getOrCreateAirSwapInputTokenStats(prevEntityId);
  //   const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(
  //     currentEntity.id
  //   );

  //   dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
  //     currentEntity.walletCount.toBigDecimal(),
  //     prevEntity.walletCount.toBigDecimal()
  //   );
  //   dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
  //     currentEntity.tokenCount.toBigDecimal(),
  //     prevEntity.tokenCount.toBigDecimal()
  //   );
  //   dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
  //     currentEntity.transactionCount.toBigDecimal(),
  //     prevEntity.transactionCount.toBigDecimal()
  //   );
  //   dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
  //     currentEntity.volumeInUSD,
  //     prevEntity.volumeInUSD
  //   );

  //   dailyChangeStats.save();
  // }

  // function updateAirSwapOutputTokenStatsDailyChangePercentage(
  //   currentEntityId: string,
  //   prevEntityId: string
  // ): void {
  //   const currentEntity = getOrCreateAirSwapOutputTokenStats(currentEntityId);
  //   const prevEntity = getOrCreateAirSwapOutputTokenStats(prevEntityId);
  //   const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(
  //     currentEntity.id
  //   );

  //   dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
  //     currentEntity.walletCount.toBigDecimal(),
  //     prevEntity.walletCount.toBigDecimal()
  //   );
  //   dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
  //     currentEntity.tokenCount.toBigDecimal(),
  //     prevEntity.tokenCount.toBigDecimal()
  //   );
  //   dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
  //     currentEntity.transactionCount.toBigDecimal(),
  //     prevEntity.transactionCount.toBigDecimal()
  //   );
  //   dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
  //     currentEntity.volumeInUSD,
  //     prevEntity.volumeInUSD
  //   );

  //   dailyChangeStats.save();
  // }

  export function syncPoolReserve(
    poolAddress: string,
    inputBalances: Array<BigInt>
  ): void {
    const pool = getOrCreateAirDexPool(poolAddress);
    pool.tokenBalances = inputBalances;
    pool.save();
  }

  export function updatePoolReserve(
    poolAddress: string,
    inputBalances: Array<BigInt>
  ): void {
    const pool = getOrCreateAirDexPool(poolAddress);
    const poolBalance = pool.tokenBalances;
    for (let index = 0; index < poolBalance.length; index++) {
      poolBalance[index] = poolBalance[index].plus(inputBalances[index]);
    }
    pool.tokenBalances = poolBalance;
    pool.save();
  }
}
