import {
  Address,
  BigInt,
  dataSource,
  log,
} from "@graphprotocol/graph-ts";

import {
  AirAccount,
  AirEntityCounter,
  AirToken,
  AirBlock,
  AirMeta
} from "../../generated/schema";

import { AIR_META_ID, BIGINT_ONE, SUBGRAPH_SCHEMA_VERSION, SUBGRAPH_VERSION, SUBGRAPH_NAME, SUBGRAPH_SLUG, processNetwork } from "./utils";

export namespace domain {
  export function trackAirDomainTransferTransaction(): void {

  }

  export function updateAirEntityCounter(
    chainId: string,
    id: string,
    block: AirBlock,
  ): BigInt {
    let entity = AirEntityCounter.load(id);
    if (entity == null) {
      entity = new AirEntityCounter(id);
      entity.count = BIGINT_ONE;
      entity.createdAt = block.id;
      entity.lastUpdatedAt = block.id;
      createAirMeta(SUBGRAPH_SLUG, SUBGRAPH_NAME);
    } else {
      entity.count = entity.count.plus(BIGINT_ONE);
      entity.lastUpdatedAt = block.id;
    }

    entity.save();
    return entity.count;
  }

  export function createAirMeta(
    slug: string,
    name: string
  ): void {
    let meta = AirMeta.load(AIR_META_ID);
    if (meta == null) {
      meta = new AirMeta(AIR_META_ID);
      meta.network = processNetwork(dataSource.network());
      meta.schemaVersion = SUBGRAPH_SCHEMA_VERSION;
      meta.version = SUBGRAPH_VERSION;
      meta.slug = slug;
      meta.name = name;
      meta.save();
    }
  }

  export function getOrCreateAirBlock(
    chainId: string,
    blockHeight: BigInt,
    blockHash: string,
    blockTimestamp: BigInt
  ): AirBlock {
    let id = chainId.concat("-").concat(blockHeight.toString());

    let block = AirBlock.load(id);
    if (block == null) {
      block = new AirBlock(id);
      block.hash = blockHash;
      block.number = blockHeight;
      block.timestamp = blockTimestamp
      block.save()
    }
    return block as AirBlock;
  }

  export function getOrCreateAirToken(chainID: string, address: string): AirToken {
    let entity = AirToken.load(chainID + "-" + address);
    if (entity == null) {
      entity = new AirToken(chainID + "-" + address);
      entity.address = address;
      entity.save();
    }
    return entity as AirToken;
  }

  export function getOrCreateAirAccount(chainID: string, address: string): AirAccount {
    let entity = AirAccount.load(chainID + "-" + address);
    if (entity == null) {
      entity = new AirAccount(chainID + "-" + address);
      entity.address = address;
    }
    return entity as AirAccount;
  }

}