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
  AirAccount,
  AirContract,
  AirDailyAggregateEntity,
  AirDailyAggregateEntityAccount,
  AirDailyAggregateEntityStats,
  AirDEXPool,
  AirEntityDailyChangeStats,
  AirLiquidityPoolInputTokenStats,
  AirLiquidityPoolOutputTokenStats,
  AirLiquidityPoolStats,
  AirLiquidityPoolTransaction,
  AirToken,
  AirTokenTransfer,
} from "../../../../generated/schema";
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
import { getDayOpenTime, getDaysSinceEpoch } from "./datetime";

export function getAirDexPoolId(poolAddress: string): string {
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

function getAirLiquidityPoolStatsId(event: ethereum.Event): string {
  const timestamp = event.block.timestamp.toI32();
  let daySinceEpoch = getDaysSinceEpoch(timestamp);

  const entityId = getAirDexPoolId(event.address.toHexString())
    .concat("-ADD-LP-STATS-")
    .concat(daySinceEpoch.toString());

  return entityId;
}

function getAirLiquidityPoolTransactionId(event: ethereum.Event): string {
  const timestamp = event.block.timestamp.toI32();
  let daySinceEpoch = getDaysSinceEpoch(timestamp);

  const entityId = getAirDexPoolId(event.address.toHexString())
    .concat("-LP-TRANSACTION-")
    .concat(event.block.hash.toHexString())
    .concat("-")
    .concat(daySinceEpoch.toString());

  return entityId;
}

function getAirTokenStatsId(
  tokenAddress: string,
  tokenUsageType: string,
  event: ethereum.Event,
  isPrevDay: boolean = false
): string {
  const timestamp = event.block.timestamp.toI32();
  let daySinceEpoch = getDaysSinceEpoch(timestamp);
  if (isPrevDay) {
    daySinceEpoch = (parseInt(daySinceEpoch) - 1).toString();
  }
  const tokenStatsId = getAirDexPoolId(event.address.toHexString())
    .concat("-")
    .concat(tokenUsageType)
    .concat("-")
    .concat(tokenAddress)
    .concat("-")
    .concat(daySinceEpoch.toString());

  return tokenStatsId;
}

export function getOrCreateLiquidityPool(
  poolAddress: string,
  inputTokenAddresses: Array<string>,
  inputTokenWeights: Array<BigDecimal>,
  fee: BigInt
): AirDEXPool {
  const dexPoolId = getAirDexPoolId(poolAddress);

  let dexPool = AirDEXPool.load(dexPoolId);
  if (!dexPool) {
    dexPool = new AirDEXPool(dexPoolId);
    const lpTokenNameArray: Array<string> = [];
    const inputTokenIds: Array<string> = [];
    for (let index = 0; index < inputTokenAddresses.length; index++) {
      const inputTokenAddress = inputTokenAddresses[index];
      const token = getOrCreateToken(inputTokenAddress);
      inputTokenIds.push(token.id);
      if (token.name) {
        lpTokenNameArray.push(token.name!);
      }
    }

    const lpToken = getOrCreateLPToken(poolAddress, inputTokenIds);

    dexPool.inputToken = inputTokenIds;
    dexPool.outputToken = lpToken.id;
    dexPool.weightage = inputTokenWeights;
    dexPool.fee = fee;
    dexPool.save();
  }
  return dexPool;
}

export function addLiquidity(
  inputTokenTransfer: Array<AirTokenTransfer>,
  outputTokenTransfer: AirTokenTransfer,
  event: ethereum.Event
): void {
  const liquidityPoolStatId = getAirLiquidityPoolStatsId(event);
  let airLiquidityPoolStats = AirLiquidityPoolStats.load(liquidityPoolStatId);
  if (airLiquidityPoolStats === null) {
    airLiquidityPoolStats = new AirLiquidityPoolStats(liquidityPoolStatId);

    const dexPoolId = getAirDexPoolId(event.address.toHexString());
    airLiquidityPoolStats.dexPool = dexPoolId;
    airLiquidityPoolStats.walletCount = BIGINT_ZERO;
    airLiquidityPoolStats.tokenCount = BIGINT_ZERO;
    airLiquidityPoolStats.transactionCount = BIGINT_ZERO;
    airLiquidityPoolStats.volumeInUSD = BIGDECIMAL_ZERO;
    airLiquidityPoolStats.save();
  }

  for (let index = 0; index < inputTokenTransfer.length; index++) {
    const inputToken = inputTokenTransfer[index];
    const tokenId = inputToken.token;
    const token = AirToken.load(tokenId);
    if (token) {
      updateAirLiquidityPoolInputTokenStats(token.address, event);
    }
  }

  const outputTokenId = outputTokenTransfer.token;
  const outputToken = AirToken.load(outputTokenId);
  if (outputToken) {
    updateAirLiquidityPoolOutputTokenStats(outputToken.address, event);
  }

  getOrCreateAirLiquidityPoolTransaction(
    inputTokenTransfer,
    outputTokenTransfer,
    event
  );

  const aggregateEntity = getOrCreateAirDailyAggregateEntity(
    event.address.toHexString(),
    AirProtocolActionType.ADD_LIQUIDITY,
    event
  );

  const stats = getOrCreateAirDailyAggregateEntityStats(
    event.address.toHexString(),
    AirProtocolActionType.ADD_LIQUIDITY,
    event
  );
  stats.addPoolLiquidityStats = airLiquidityPoolStats.id;
  stats.save();

  // TODO: Add volume in USD
  getOrCreateAirDailyAggregateEntityAccount(
    aggregateEntity.id,
    outputTokenTransfer.to,
    aggregateEntity.walletCount,
    BIGDECIMAL_ZERO
  );
}

function getOrCreateAirDailyAggregateEntityAccount(
  dailyAggregatedEntityId: string,
  accountAddress: string,
  walletCount: BigInt,
  volumeInUSD: BigDecimal
): void {
  const entityId = dailyAggregatedEntityId.concat("-").concat(accountAddress);
  let entity = AirDailyAggregateEntityAccount.load(entityId);
  if (entity == null) {
    entity = new AirDailyAggregateEntityAccount(entityId);
    const account = getOrCreateAirAccount(accountAddress);
    entity.account = account.id;
    entity.dailyAggregatedEntity = dailyAggregatedEntityId;
    entity.volumeInUSD = volumeInUSD;
    entity.index = walletCount.plus(BIGINT_ONE);
    entity.save();
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
  to: string,
  from: string,
  sqrtPriceX96: BigInt
): void {}

function getOrCreateToken(address: string): AirToken {
  const tokenId = dataSource.network().concat(address);
  let token = AirToken.load(tokenId);
  if (!token) {
    token = new AirToken(tokenId);
    token.address = address;

    const erc20Contract = ERC20.bind(Address.fromString(address));
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

    const supportsInterfaceContract = SupportsInterface.bind(
      Address.fromString(address)
    );
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
  poolAddress: string,
  inputTokenIds: Array<string>
): AirToken {
  const tokenId = dataSource.network().concat(poolAddress);
  let token = AirToken.load(tokenId);
  // fetch info if null
  if (token === null) {
    token = new AirToken(tokenId);
    token.address = poolAddress;

    const tokenName: Array<string> = [];

    for (let index = 0; index < inputTokenIds.length; index++) {
      const inputTokenId = inputTokenIds[index];
      const token = AirToken.load(inputTokenId);
      if (token && token.name) {
        tokenName.push(token.name!);
      }
    }

    token.symbol = tokenName.join("/");
    token.name = token.symbol + " LP";
    token.decimals = DEFAULT_DECIMALS;
    token.standard = AirTokenStandardType.ERC20;
    token.save();
  }
  return token;
}

function updateAirLiquidityPoolInputTokenStats(
  inputTokenAddress: string,
  event: ethereum.Event
): void {
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
  outputTokenAddress: string,
  event: ethereum.Event
): void {
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
  entityId: string
): AirEntityDailyChangeStats {
  const dailyChangeStats = new AirEntityDailyChangeStats(entityId);
  dailyChangeStats.walletCountChangeInPercentage = BIGDECIMAL_ZERO;
  dailyChangeStats.tokenCountChangeInPercentage = BIGDECIMAL_ZERO;
  dailyChangeStats.transactionCountChangeInPercentage = BIGDECIMAL_ZERO;
  dailyChangeStats.volumeInUSDChangeInPercentage = BIGDECIMAL_ZERO;
  dailyChangeStats.save();
  return dailyChangeStats;
}

function getOrCreateAirLiquidityPoolTransaction(
  inputTokenTransfer: Array<AirTokenTransfer>,
  outputTokenTransfer: AirTokenTransfer,
  event: ethereum.Event
): AirLiquidityPoolTransaction {
  const lpTransactionEntityId = getAirLiquidityPoolTransactionId(event);
  let lpTransaction = AirLiquidityPoolTransaction.load(lpTransactionEntityId);
  if (lpTransaction === null) {
    lpTransaction = new AirLiquidityPoolTransaction(lpTransactionEntityId);

    const dexPoolId = getAirDexPoolId(event.address.toHexString());
    lpTransaction.dexPool = dexPoolId;
    const liquidityPoolStatId = getAirLiquidityPoolStatsId(event);
    lpTransaction.liquidityPoolStatsRef = liquidityPoolStatId;
    lpTransaction.hash = event.block.hash.toHexString();

    const inputTokenTransferEntityIds: Array<string> = [];
    for (let index = 0; index < inputTokenTransfer.length; index++) {
      const tokenTransfer = inputTokenTransfer[index];
      inputTokenTransferEntityIds.push(tokenTransfer.id);
    }
    // inputTokenTransfer.forEach((tokenTransfer: AirTokenTransfer) => {
    //   inputTokenTransferEntityIds.push(tokenTransfer.id);
    // });
    lpTransaction.inputTokenTransfers = inputTokenTransferEntityIds;
    lpTransaction.outputTokenTransfer = outputTokenTransfer.id;
    lpTransaction.save();
  }

  return lpTransaction;
}

export function getOrCreateAirTokenTransfer(
  tokenAddress: string,
  from: string,
  to: string,
  amount: BigInt,
  fee: BigInt,
  event: ethereum.Event
): AirTokenTransfer {
  const entityId = dataSource
    .network()
    .concat("-TOKEN-TRANSFER-")
    .concat(event.block.hash.toHexString())
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
    airTokenTransfer.from = fromAccount.id;

    const toAccount = getOrCreateAirAccount(to);
    airTokenTransfer.to = toAccount.id;

    airTokenTransfer.amount = amount;
    airTokenTransfer.fee = fee;

    const token = getOrCreateToken(tokenAddress);
    airTokenTransfer.token = token.id;
  }
  airTokenTransfer.save();

  return airTokenTransfer;
}

function getOrCreateAirAccount(accountAddress: string): AirAccount {
  const entityId = dataSource
    .network()
    .concat("-")
    .concat(accountAddress);

  let airAccount = AirAccount.load(entityId);
  if (airAccount === null) {
    airAccount = new AirAccount(entityId);
    airAccount.address = accountAddress;
    airAccount.save();
  }
  return airAccount;
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

function getAirDailyAggregateEntityId(
  contractAddress: string,
  protocolActionType: string,
  event: ethereum.Event,
  isPrevDay: boolean = false
): string {
  const timestamp = event.block.timestamp.toI32();
  const daySinceEpochString = getDaysSinceEpoch(timestamp);
  let daySinceEpoch = parseInt(daySinceEpochString);
  if (isPrevDay) {
    daySinceEpoch = daySinceEpoch - 1;
  }
  const entityId = dataSource
    .network()
    .concat("-")
    .concat(contractAddress)
    .concat(AirProtocolType.EXCHANGE)
    .concat("-")
    .concat(protocolActionType)
    .concat("-")
    .concat(daySinceEpoch.toString());

  return entityId;
}
function getOrCreateAirDailyAggregateEntity(
  contractAddress: string,
  protocolActionType: string,
  event: ethereum.Event
): AirDailyAggregateEntity {
  const timestamp = event.block.timestamp.toI32();
  let daySinceEpoch = getDaysSinceEpoch(timestamp);
  const entityId = getAirDailyAggregateEntityId(
    contractAddress,
    protocolActionType,
    event
  );

  let aggregateEntity = AirDailyAggregateEntity.load(entityId);
  if (aggregateEntity == null) {
    aggregateEntity = new AirDailyAggregateEntity(entityId);
    aggregateEntity.network = dataSource.network();

    const contractEntity = getOrCreateContract(contractAddress);
    aggregateEntity.contract = contractEntity.id;

    aggregateEntity.protocolType = AirProtocolType.EXCHANGE;
    aggregateEntity.protocolActionType = protocolActionType;

    aggregateEntity.daySinceEpoch = BigInt.fromString(daySinceEpoch);

    const startDayTimestamp = getDayOpenTime(event.block.timestamp);
    aggregateEntity.startDayTimestamp = startDayTimestamp;

    aggregateEntity.updatedTimestamp = event.block.timestamp;

    const stats = getOrCreateAirDailyAggregateEntityStats(
      contractAddress,
      protocolActionType,
      event
    );
    aggregateEntity.stats = stats.id;
    aggregateEntity.walletCount = BIGINT_ZERO;
    aggregateEntity.tokenCount = BIGINT_ZERO;
    aggregateEntity.transactionCount = BIGINT_ZERO;
    aggregateEntity.volumeInUSD = BIGDECIMAL_ZERO;

    const changeStats = getOrCreateAirEntityDailyChangeStats(entityId);
    aggregateEntity.dailyChange = changeStats.id;
  }

  aggregateEntity.walletCount = aggregateEntity.walletCount.plus(BIGINT_ONE);
  aggregateEntity.tokenCount = aggregateEntity.tokenCount.plus(BIGINT_ONE);
  aggregateEntity.transactionCount = aggregateEntity.transactionCount.plus(
    BIGINT_ONE
  );
  // TODO: add price oracle.
  aggregateEntity.volumeInUSD = aggregateEntity.volumeInUSD.plus(
    BIGDECIMAL_ZERO
  );

  const prevEntityId = getAirDailyAggregateEntityId(
    contractAddress,
    protocolActionType,
    event,
    true
  );

  const prevAggregatedEntity = AirDailyAggregateEntity.load(prevEntityId);

  if (prevAggregatedEntity) {
    const dailyChangeStats = getOrCreateAirEntityDailyChangeStats(entityId);
    dailyChangeStats.walletCountChangeInPercentage = calculatePercentage(
      aggregateEntity.walletCount.toBigDecimal(),
      prevAggregatedEntity.walletCount.toBigDecimal()
    );
    dailyChangeStats.tokenCountChangeInPercentage = calculatePercentage(
      aggregateEntity.tokenCount.toBigDecimal(),
      prevAggregatedEntity.tokenCount.toBigDecimal()
    );
    dailyChangeStats.transactionCountChangeInPercentage = calculatePercentage(
      aggregateEntity.transactionCount.toBigDecimal(),
      prevAggregatedEntity.transactionCount.toBigDecimal()
    );
    dailyChangeStats.volumeInUSDChangeInPercentage = calculatePercentage(
      aggregateEntity.volumeInUSD,
      prevAggregatedEntity.volumeInUSD
    );
    dailyChangeStats.save();
  }
  aggregateEntity.save();
  return aggregateEntity;
}

function getOrCreateContract(address: string): AirContract {
  const entityId = dataSource
    .network()
    .concat("-")
    .concat(address);

  let contractEntity = AirContract.load(entityId);
  if (contractEntity == null) {
    contractEntity = new AirContract(entityId);
    contractEntity.address = address;
    contractEntity.save();
  }
  return contractEntity;
}

function getOrCreateAirDailyAggregateEntityStats(
  contractAddress: string,
  protocolActionType: string,
  event: ethereum.Event
): AirDailyAggregateEntityStats {
  const entityId = getAirDailyAggregateEntityId(
    contractAddress,
    protocolActionType,
    event
  );

  let entity = AirDailyAggregateEntityStats.load(entityId);
  if (entity == null) {
    entity = new AirDailyAggregateEntityStats(entityId);
    entity.protocolActionType = protocolActionType;
    entity.save();
  }
  return entity;
}
