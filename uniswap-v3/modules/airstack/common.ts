import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  dataSource,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";
import { getDayOpenTime, getDaysSinceEpoch } from "./utils/datetime";
import { AirInterfaceId, AirTokenStandardType, BIG_DECIMAL } from "./constants";

import {
  AirAccount,
  AirContract,
  AirDailyAggregateEntity,
  AirDailyAggregateEntityAccount,
  AirDailyAggregateEntityStats,
  AirEntityDailyChangeStats,
  AirMeta,
  AirToken,
} from "../../generated/schema";
import { ERC721MetaData } from "../../generated/templates/Pool/ERC721MetaData"; //../../generated/templates/Pool/ERC721MetaData";
import { ERC20 } from "../../generated/templates/Pool/ERC20";
import { getNetworkSchemaName } from "./utils/network";
import { calculatePercentage } from "./utils/maths";

export function getDailyAggregatedEntityId(
  contractAddress: string,
  protocolType: string,
  protocolActionType: string,
  timestamp: BigInt,
  appendId: string,
  daySinceEpoch: BigInt | null = null
): string {
  let entityId = dataSource
    .network()
    .concat("-")
    .concat(contractAddress)
    .concat("-")
    .concat(protocolType)
    .concat("-")
    .concat(protocolActionType)
    .concat("-")
    .concat(appendId);

  if (daySinceEpoch !== null) {
    entityId = entityId.concat(daySinceEpoch.toString());
  } else {
    entityId = entityId.concat(getDaysSinceEpoch(timestamp.toI32()));
  }
  return entityId;
}

export function getDailyAggregatedAccountId(
  dailyAggregatedEntityId: string,
  accountId: string
): string {
  return dailyAggregatedEntityId.concat("-").concat(accountId);
}

export function getAirDailyAggregateEntityStatsId(
  dailyAggregatedEntityId: string
): string {
  return dailyAggregatedEntityId.concat("-").concat("stats");
}

export function getOrCreateAirDailyAggregateEntityStats(
  id: string
): AirDailyAggregateEntityStats {
  let entity = AirDailyAggregateEntityStats.load(id);

  if (entity == null) {
    entity = new AirDailyAggregateEntityStats(id);
  }
  return entity as AirDailyAggregateEntityStats;
}

export function isAirDailyAggregateEntityAccountAvailable(id: string): boolean {
  let entity = AirDailyAggregateEntityAccount.load(id);
  return !(entity == null);
}

export function getOrCreateAirDailyAggregateEntityAccount(
  id: string,
  accountId: string
): AirDailyAggregateEntityAccount {
  let entity = AirDailyAggregateEntityAccount.load(id);

  if (entity == null) {
    entity = new AirDailyAggregateEntityAccount(id);
    entity.volumeInUSD = BigDecimal.zero();
    const account = getOrCreateAirAccount(accountId);
    account.save();
    entity.account = account.id;
  }
  return entity as AirDailyAggregateEntityAccount;
}

export function getAirTokenId(address: string): string {
  return dataSource
    .network()
    .concat("-")
    .concat(address);
}

function supportsInterface(
  contract: ERC721MetaData,
  interfaceId: string,
  expected: boolean = true
): boolean {
  let supports = contract.try_supportsInterface(
    Bytes.fromByteArray(Bytes.fromHexString(interfaceId))
  );
  return !supports.reverted && supports.value == expected;
}

export function getOrCreateAirToken(id: string): AirToken {
  let entity = AirToken.load(id); //todo add network
  if (entity == null) {
    entity = new AirToken(id);
    entity.address = id;
    entity.standard = AirTokenStandardType.ERC20;

    let contract = ERC721MetaData.bind(Address.fromString(id)); //todo should we do 1155?

    let supportsEIP165Identifier = supportsInterface(
      contract,
      AirInterfaceId.EIP165
    );
    let supportsEIP721Identifier = supportsInterface(
      contract,
      AirInterfaceId.EIP721
    );
    let supportsEIP1155Identifier = supportsInterface(
      contract,
      AirInterfaceId.EIP1155
    );
    let supportsNullIdentifierFalse = supportsInterface(
      contract,
      AirInterfaceId.Null,
      false
    );

    // TODO: Did not understand why supportsEIP165Identifier is needed?
    let supportsEIP721 =
      supportsEIP165Identifier &&
      supportsEIP721Identifier &&
      supportsEIP1155Identifier &&
      supportsNullIdentifierFalse;

    if (supportsEIP721) {
      entity.standard = AirTokenStandardType.ERC721;
    }
    //todo convert to enums
    if (!supportsEIP721) {
      let erc20Contract = ERC20.bind(Address.fromString(id));
      let decimals = erc20Contract.try_decimals();
      entity.decimals = 18;
      if (!decimals.reverted) {
        entity.standard = AirTokenStandardType.ERC20;
        entity.decimals = decimals.value.toI32();
      }

      let totalSupply = erc20Contract.try_totalSupply(); //todo double confirm
      if (!totalSupply.reverted) {
        entity.totalSupply = totalSupply.value;
      }
    }

    // todo handle base currency (check messari)
    let symbol = contract.try_symbol();
    if (!symbol.reverted) {
      entity.symbol = symbol.value;
    }

    let name = contract.try_name();
    if (!name.reverted) {
      entity.name = name.value;
    }
  }
  return entity as AirToken;
}

export function getOrCreateAirContract(contractAddress: Address): AirContract {
  const contractAddressString = contractAddress.toHexString();
  let entity = AirContract.load(contractAddressString);

  if (entity == null) {
    entity = new AirContract(contractAddressString);
    entity.address = contractAddressString;
  }
  return entity as AirContract;
}

export function getOrCreateAirDailyAggregateEntity(
  blockNumber: BigInt,
  contractAddress: string,
  protocolType: string,
  protocolActionType: string,
  timestamp: BigInt,
  appendId: string,
  daySinceEpoch: BigInt | null = null
): AirDailyAggregateEntity {
  const id = getDailyAggregatedEntityId(
    contractAddress,
    protocolType,
    protocolActionType,
    timestamp,
    appendId,
    daySinceEpoch
  );

  let entity = AirDailyAggregateEntity.load(id);

  if (entity == null) {
    entity = new AirDailyAggregateEntity(id);
    entity.volumeInUSD = BigDecimal.zero();
    entity.tokenCount = BigInt.zero();
    entity.daySinceEpoch = BigInt.fromString(
      getDaysSinceEpoch(timestamp.toI32())
    );
    entity.startDayTimestamp = getDayOpenTime(timestamp);
    entity.walletCount = BigInt.zero();
    entity.transactionCount = BigInt.zero();
    entity.network = "MAINNET"; //getNetworkSchemaName(dataSource.network()); //"MAINNET"; //todo remove hardcode, check massari
    entity.updatedTimestamp = timestamp;
    entity.protocolType = protocolType;
    entity.protocolActionType = protocolActionType;

    const airContract = getOrCreateAirContract(
      Address.fromString(contractAddress)
    );
    airContract.save();
    entity.contract = airContract.id;
  }
  entity.blockHeight = blockNumber;
  return entity as AirDailyAggregateEntity;
}

export function getOrCreateAirEntityDailyChangeStats(
  entityId: string
): AirEntityDailyChangeStats {
  let dailyChangeStats = AirEntityDailyChangeStats.load(entityId);
  if (dailyChangeStats == null) {
    dailyChangeStats = new AirEntityDailyChangeStats(entityId);
    dailyChangeStats.walletCountChangeInPercentage = BIG_DECIMAL.ZERO;
    dailyChangeStats.tokenCountChangeInPercentage = BIG_DECIMAL.ZERO;
    dailyChangeStats.transactionCountChangeInPercentage = BIG_DECIMAL.ZERO;
    dailyChangeStats.volumeInUSDChangeInPercentage = BIG_DECIMAL.ZERO;
  }
  return dailyChangeStats;
}

export function getOrCreateAirAccount(accountAddress: string): AirAccount {
  let airAccount = AirAccount.load(accountAddress);
  if (airAccount == null) {
    airAccount = new AirAccount(accountAddress);
    airAccount.address = accountAddress;
  }
  return airAccount;
}

export function updateAirDailyAggregateEntityDailyChangePercentage(
  currentEntity: AirDailyAggregateEntity,
  prevEntity: AirDailyAggregateEntity
): void {
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

export function updateAirMeta(event: ethereum.Event): void {
  const entityId = "AirMeta";
  let airMeta = AirMeta.load(entityId);
  if (airMeta == null) {
    airMeta = new AirMeta(entityId);
  }

  airMeta.blockNumber = event.block.number;

  const daySinceEpoch = BigInt.fromString(
    getDaysSinceEpoch(event.block.timestamp.toI32())
  );
  airMeta.daySinceEpoch = daySinceEpoch;

  airMeta.save();
}
