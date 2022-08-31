import { BigInt, log } from "@graphprotocol/graph-ts";
import { Pair } from "../../generated/templates";
import { PairCreated } from "../../generated/Factory/Factory";
import { dex } from "../../modules/airstack";
import { updateAirMeta } from "../../modules/airstack/common";

// Handle the creation of a new liquidity pool from the Factory contract
// Create the pool entity and track events from the new pool contract using the template specified in the subgraph.yaml
export function handlePairCreated(event: PairCreated): void {
  dex.addDexPool(event.params.pair.toHexString(), BigInt.zero(), [
    event.params.token0.toHexString(),
    event.params.token1.toHexString(),
  ]);

  // Create and track the newly created pool contract based on the template specified in the subgraph.yaml file.
  Pair.create(event.params.pair);
  updateAirMeta(event);
}
