import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  dataSource,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";
import { ERC20 } from "../../../generated/Factory/ERC20";
import { SupportsInterface } from "../../../generated/Factory/SupportsInterface";
import {
  AirDEXPool,
  AirEntityDailyChangeStats,
  AirLiquidityPoolInputTokenStats,
  AirLiquidityPoolOutputTokenStats,
  AirLiquidityPoolTransaction,
  AirToken,
  AirTokenStats,
} from "../../../generated/schema";
import {
  AirTokenStandardType,
  CallbackType,
  ERC1155InterfaceId,
  ERC721InterfaceId,
  DEFAULT_DECIMALS,
  AirProtocolActionType,
  AirProtocolType,
  INT_ZERO,
  BIGDECIMAL_ONE,
  INT_ONE,
  BIGDECIMAL_TEN,
  AirTokenUsageType,
  BIGINT_ZERO,
  BIGDECIMAL_ZERO,
  BIGINT_ONE,
} from "./constants";
import { getDaysSinceEpoch } from "./datetime";

function getAirDexPoolId(event: ethereum.Event): string {
  const dexPoolId = dataSource
    .network()
    .concat("-")
    .concat(AirProtocolType.EXCHANGE)
    .concat("-")
    .concat("POOL")
    .concat("-")
    .concat(event.address.toHexString());

  return dexPoolId;
}

function getAirLiquidityPoolStatsId(event: ethereum.Event): string {
  const timestamp = event.block.timestamp.toI32();
  let daySinceEpoch = getDaysSinceEpoch(timestamp);

  const entityId = getAirDexPoolId(event)
    .concat("-ADD-LP-STATS-")
    .concat(daySinceEpoch.toString());

  return entityId;
}

function getAirLiquidityPoolTransactionId(event: ethereum.Event): string {
  const timestamp = event.block.timestamp.toI32();
  let daySinceEpoch = getDaysSinceEpoch(timestamp);

  const entityId = getAirDexPoolId(event)
    .concat("-LP-TRANSACTION-")
    .concat(event.block.hash.toHexString())
    .concat("-")
    .concat(daySinceEpoch.toString());

  return entityId;
}

function getAirTokenStatsId(
  tokenAddress: Address,
  tokenUsageType: string,
  event: ethereum.Event,
  isPrevDay: boolean = false
): string {
  const timestamp = event.block.timestamp.toI32();
  let daySinceEpoch = getDaysSinceEpoch(timestamp);
  if (isPrevDay) {
    daySinceEpoch = (parseInt(daySinceEpoch) - 1).toString();
  }
  const tokenStatsId = getAirDexPoolId(event)
    .concat("-")
    .concat(tokenUsageType)
    .concat("-")
    .concat(tokenAddress.toHexString())
    .concat("-")
    .concat(daySinceEpoch.toString());

  return tokenStatsId;
}

export function createLiquidityPool(
  event: ethereum.Event,
  inputTokenAddresses: [Address],
  inputTokenWeights: [BigDecimal]
): void {
  const dexPoolId = getAirDexPoolId(event);

  let dexPool = AirDEXPool.load(dexPoolId);
  if (!dexPool) {
    dexPool = new AirDEXPool(dexPoolId);
    let lpTokenNameArray: Array<string> = [];
    const inputTokenIds: Array<string> = [];
    inputTokenAddresses.forEach((inputTokenAddress) => {
      const token = getOrCreateToken(inputTokenAddress);
      inputTokenIds.push(token.id);
      if (token.name) {
        lpTokenNameArray.push(token.name);
      }
    });

    const lpToken = getOrCreateLPToken(event.address, inputTokenIds);

    dexPool.inputToken = inputTokenIds;
    dexPool.outputToken = lpToken.id;
    dexPool.weightage = inputTokenWeights;
    dexPool.save();
  }
}

export function addLiquidity(event: ethereum.Event, amounts: [BigInt]): void {
  const dexPoolId = getAirDexPoolId(event);
  const dexPool = AirDEXPool.load(dexPoolId);
  if (dexPool) {
    const convertedAmounts: Array<BigDecimal> = [];

    dexPool.inputToken.forEach((inputTokenId, index) => {
      const token = AirToken.load(inputTokenId);
      if (token) {
        const amount = amounts[index];
        const convertedAmount = convertTokenToDecimal(amount, token.decimals);
        convertedAmounts.push(convertedAmount);
      }
    });
  }
}

export function removeLiquidity(
  event: ethereum.Event,
  amount0: BigInt,
  amount1: BigInt
): void {}

export function swap(
  event: ethereum.Event,
  amount0: BigInt,
  amount1: BigInt,
  to: Address,
  from: Address,
  sqrtPriceX96: BigInt
): void {}

function getOrCreateToken(address: Address): AirToken {
  const tokenId = dataSource.network() + address;
  let token = AirToken.load(tokenId);
  if (!token) {
    token = new AirToken(tokenId);
    token.address = address.toHexString();

    const erc20Contract = ERC20.bind(address);
    const decimals = erc20Contract.try_decimals();
    if (!decimals.reverted) {
      token.decimals = decimals.value;
    }

    const name = erc20Contract.try_name();
    if (!name.reverted) {
      token.name = name.value;
    }

    const symbol = erc20Contract.try_symbol();
    if (!symbol.reverted) {
      token.symbol = symbol.value;
    }

    const totalSupply = erc20Contract.try_totalSupply();
    if (!totalSupply.reverted) {
      token.totalSupply = totalSupply.value;
    }

    const supportsInterfaceContract = SupportsInterface.bind(address);
    const isERC721 = supportsInterfaceContract.try_supportsInterface(
      Bytes.fromHexString(ERC721InterfaceId)
    );
    if (!isERC721.reverted) {
      token.standard = AirTokenStandardType.ERC721;
    } else {
      const isERC1155 = supportsInterfaceContract.try_supportsInterface(
        Bytes.fromHexString(ERC1155InterfaceId)
      );
      if (!isERC1155.reverted) {
        token.standard = AirTokenStandardType.ERC1155;
      } else {
        token.standard = AirTokenStandardType.ERC20;
      }
    }

    token.save();
  }
  return token;
}

export function getOrCreateLPToken(
  poolAddress: Address,
  inputTokenIds: Array<string>
): AirToken {
  const tokenId = dataSource.network().concat(poolAddress.toHexString());
  let token = AirToken.load(tokenId);
  // fetch info if null
  if (token === null) {
    token = new AirToken(tokenId);
    token.address = poolAddress.toHexString();

    const tokenName: Array<string> = [];

    inputTokenIds.forEach((inputTokenId) => {
      const token = AirToken.load(inputTokenId);
      if (token && token.name) {
        tokenName.push(token.name);
      }
    });

    token.symbol = tokenName.join("/");
    token.name = token.symbol + " LP";
    token.decimals = DEFAULT_DECIMALS;
    token.standard = AirTokenStandardType.ERC20;
    token.save();
  }
  return token;
}

function updateAirLiquidityPoolInputTokenStats(
  inputTokenAddress: Address,
  event: ethereum.Event
) {
  const tokenStatsId = getAirTokenStatsId(
    inputTokenAddress,
    AirTokenUsageType.LP,
    event
  );

  let tokenStats = AirLiquidityPoolInputTokenStats.load(tokenStatsId);
  if (tokenStats === null) {
    tokenStats = new AirLiquidityPoolInputTokenStats(tokenStatsId);

    const liquidityPoolStatId = getAirLiquidityPoolStatsId(event);
    tokenStats.liquidityPoolStatsRef = liquidityPoolStatId;

    const inputToken = getOrCreateToken(inputTokenAddress);
    tokenStats.token = inputToken.id;
    tokenStats.type = AirTokenUsageType.LP;
    tokenStats.walletCount = BIGINT_ZERO;
    tokenStats.tokenCount = BIGINT_ZERO;
    tokenStats.transactionCount = BIGINT_ZERO;
    tokenStats.volumeInUSD = BIGDECIMAL_ZERO;

    const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(tokenStatsId);
    tokenStats.dailyChange = dailyChangeStats.id;
  }

  tokenStats.walletCount = tokenStats.walletCount.plus(BIGINT_ONE);
  tokenStats.transactionCount = tokenStats.walletCount.plus(BIGINT_ONE);

  // TODO: Increment the volume.

  const prevDayTokenStatsId = getAirTokenStatsId(
    inputTokenAddress,
    AirTokenUsageType.LP,
    event,
    true
  );
  let prevTokenStats = AirLiquidityPoolInputTokenStats.load(
    prevDayTokenStatsId
  );
  if (prevTokenStats) {
    const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(tokenStatsId);
    dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
      tokenStats.walletCount.toBigDecimal(),
      prevTokenStats.walletCount.toBigDecimal()
    );
    dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
      tokenStats.tokenCount.toBigDecimal(),
      prevTokenStats.tokenCount.toBigDecimal()
    );
    dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
      tokenStats.transactionCount.toBigDecimal(),
      prevTokenStats.transactionCount.toBigDecimal()
    );
    dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
      tokenStats.volumeInUSD,
      prevTokenStats.volumeInUSD
    );
    dailyChangeStats.save();
  }
  tokenStats.save();
}

function updateAirLiquidityPoolOutputTokenStats(
  outputTokenAddress: Address,
  event: ethereum.Event
) {
  const tokenStatsId = getAirTokenStatsId(
    outputTokenAddress,
    AirTokenUsageType.LP,
    event
  );

  let tokenStats = AirLiquidityPoolOutputTokenStats.load(tokenStatsId);
  if (tokenStats === null) {
    tokenStats = new AirLiquidityPoolOutputTokenStats(tokenStatsId);

    const liquidityPoolStatId = getAirLiquidityPoolStatsId(event);
    tokenStats.liquidityPoolStatsRef = liquidityPoolStatId;

    const outputToken = getOrCreateToken(outputTokenAddress);
    tokenStats.token = outputToken.id;
    tokenStats.type = AirTokenUsageType.LP;
    tokenStats.walletCount = BIGINT_ZERO;
    tokenStats.tokenCount = BIGINT_ZERO;
    tokenStats.transactionCount = BIGINT_ZERO;
    tokenStats.volumeInUSD = BIGDECIMAL_ZERO;

    const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(tokenStatsId);
    tokenStats.dailyChange = dailyChangeStats.id;
  }

  tokenStats.walletCount = tokenStats.walletCount.plus(BIGINT_ONE);
  tokenStats.transactionCount = tokenStats.walletCount.plus(BIGINT_ONE);

  // TODO: Increment the volume.

  const prevDayTokenStatsId = getAirTokenStatsId(
    outputTokenAddress,
    AirTokenUsageType.LP,
    event,
    true
  );
  let prevTokenStats = AirLiquidityPoolInputTokenStats.load(
    prevDayTokenStatsId
  );
  if (prevTokenStats) {
    const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(tokenStatsId);
    dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
      tokenStats.walletCount.toBigDecimal(),
      prevTokenStats.walletCount.toBigDecimal()
    );
    dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
      tokenStats.tokenCount.toBigDecimal(),
      prevTokenStats.tokenCount.toBigDecimal()
    );
    dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
      tokenStats.transactionCount.toBigDecimal(),
      prevTokenStats.transactionCount.toBigDecimal()
    );
    dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
      tokenStats.volumeInUSD,
      prevTokenStats.volumeInUSD
    );
    dailyChangeStats.save();
  }
  tokenStats.save();
}

function getOrCreateAirEntityDailyChangeStats(
  tokenStatsId: string
): AirEntityDailyChangeStats {
  const dailyChangeStats = new AirEntityDailyChangeStats(tokenStatsId);
  dailyChangeStats.walletCountChangeInPercentage = BIGDECIMAL_ZERO;
  dailyChangeStats.tokenCountChangeInPercentage = BIGDECIMAL_ZERO;
  dailyChangeStats.transactionCountChangeInPercentage = BIGDECIMAL_ZERO;
  dailyChangeStats.volumeInUSDChangeInPercentage = BIGDECIMAL_ZERO;
  dailyChangeStats.save();
  return dailyChangeStats;
}

function getOrCreateAirLiquidityPoolTransaction(
  event: ethereum.Event
): AirLiquidityPoolTransaction {
  const lpTransactionEntityId = getAirLiquidityPoolTransactionId(event);
  let lpTransaction = AirLiquidityPoolTransaction.load(lpTransactionEntityId);
  if (lpTransaction === null) {
    lpTransaction = new AirLiquidityPoolTransaction(lpTransactionEntityId);

    const dexPoolId = getAirDexPoolId(event);
    lpTransaction.dexPool = dexPoolId;
    const liquidityPoolStatId = getAirLiquidityPoolStatsId(event);
    lpTransaction.liquidityPoolStatsRef = liquidityPoolStatId;
    lpTransaction.hash = event.block.hash.toHexString();
  }

  return lpTransaction;
}

function convertTokenToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: i32
): BigDecimal {
  if (exchangeDecimals == INT_ZERO) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BIGDECIMAL_ONE;
  for (let i = INT_ZERO; i < (decimals as i32); i = i + INT_ONE) {
    bd = bd.times(BIGDECIMAL_TEN);
  }
  return bd;
}

function calculatePercentage(val1: BigDecimal, val2: BigDecimal): BigDecimal {
  if (val2.equals(BIGDECIMAL_ZERO)) {
    return BIGDECIMAL_ZERO;
  } else {
    const percentage = val1.minus(val2).div(val2);
    return percentage;
  }
}
