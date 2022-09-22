import { PoolCreated } from "../../generated/Factory/Factory";
// import { Address } from "@graphprotocol/graph-ts";
// import { createLiquidityPool } from "../common/creators";
// import { NetworkConfigs } from "../../configurations/configure";
import { dex } from "../../modules/airstack";
import { updateAirMeta } from "../../modules/airstack/common";
import { Pool as PoolTemplate } from "../../generated/templates";
import { BigInt } from "@graphprotocol/graph-ts";

// Liquidity pool is created from the Factory contract.
// Create a pool entity and start monitoring events from the newly deployed pool contract specified in the subgraph.yaml.
export function handlePoolCreated(event: PoolCreated): void {
  // if (
  //   NetworkConfigs.getUntrackedPairs().includes(event.params.pool.toHexString())
  // ) {
  //   return;
  // }
  // createLiquidityPool(
  //   event,
  //   event.params.pool.toHexString(),
  //   event.params.token0.toHexString(),
  //   event.params.token1.toHexString(),
  //   event.params.fee
  // );

  dex.addDexPool(event.params.pool.toHexString(), BigInt.zero(), [
    event.params.token0.toHexString(),
    event.params.token1.toHexString(),
  ]);

  // Create and track the newly created pool contract based on the template specified in the subgraph.yaml file.
  PoolTemplate.create(event.params.pool);
  updateAirMeta(event);
}
