// import { log } from "@graphprotocol/graph-ts";
// import { _HelperStore } from "../../generated/schema";
import {
  Mint,
  Burn,
  Swap,
  Transfer,
  Sync,
} from "../../generated/templates/Pair/Pair";
import { dex } from "../../modules/airstack";

// Handle a mint event emitted from a pool contract. Considered a deposit into the given liquidity pool.
export function handleMint(event: Mint): void {
  dex.addLiquidity(
    event.address.toHexString(),
    [event.params.amount0, event.params.amount1],
    event.params.sender.toHexString(),
    event.address.toHexString(),
    event.block.hash.toHexString(),
    event.block.timestamp
  );
}

// Handle a burn event emitted from a pool contract. Considered a withdraw into the given liquidity pool.
export function handleBurn(event: Burn): void {
  // createWithdraw(event, event.params.amount0, event.params.amount1);
  // updateUsageMetrics(event, event.transaction.from, UsageType.WITHDRAW);
  // updateFinancials(event);
  // updatePoolMetrics(event);
}

// Handle a swap event emitted from a pool contract.
export function handleSwap(event: Swap): void {
  // createSwapHandleVolumeAndFees(
  //   event,
  //   event.params.to.toHexString(),
  //   event.params.sender.toHexString(),
  //   event.params.amount0In,
  //   event.params.amount1In,
  //   event.params.amount0Out,
  //   event.params.amount1Out
  // );
  // updateFinancials(event);
  // updatePoolMetrics(event);
  // updateUsageMetrics(event, event.transaction.from, UsageType.SWAP);
}
