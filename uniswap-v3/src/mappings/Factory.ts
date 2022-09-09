import { PoolCreated } from "../../generated/Factory/Factory";
// import { Address } from "@graphprotocol/graph-ts";
// import { createLiquidityPool } from "../common/creators";
// import { NetworkConfigs } from "../../configurations/configure";
import { dex } from "../../modules/airstack";
import { updateAirMeta } from "../../modules/airstack/common";
import { Pool as PoolTemplate } from "../../generated/templates";
import { Address, BigInt } from "@graphprotocol/graph-ts";
// import { Temp } from "../../generated/schema";

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

  // let temp = Temp.load("temp");
  // if (temp === null) {
  //   temp = new Temp("temp");
  //   temp.isWhitelisted = BigInt.fromI32(1);
  //   temp.save();

  //   PoolTemplate.create(
  //     Address.fromString("0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8")
  //   );
  //   PoolTemplate.create(
  //     Address.fromString("0x655E25feD94ddb846601705ACE4349815E2A95D1")
  //   );
  // }

  updateAirMeta(event);
}
