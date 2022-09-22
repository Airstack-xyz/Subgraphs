import { log } from "@graphprotocol/graph-ts";
import {
  Burn as BurnEvent,
  Initialize,
  Mint as MintEvent,
  Swap as SwapEvent,
  SetFeeProtocol,
} from "../../generated/templates/Pool/Pool";
// import { UsageType } from "../common/constants";
// import {
//   createDeposit,
//   createWithdraw,
//   createSwapHandleVolumeAndFees,
// } from "../common/creators";
// import {
//   updatePrices,
//   updatePoolMetrics,
//   updateProtocolFees,
//   updateUsageMetrics,
//   updateFinancials,
// } from "../common/updateMetrics";
import { dex } from "../../modules/airstack";
import { updateAirMeta } from "../../modules/airstack/common";
import {
  BIGINT_NEG_ONE,
  BIGINT_ZERO,
} from "../../modules/prices/common/constants";

// Emitted when a given liquidity pool is first created.
export function handleInitialize(event: Initialize): void {
  // updatePrices(event, event.params.sqrtPriceX96);
  // updatePoolMetrics(event);
}

// Update the fees colected by the protocol.
export function handleSetFeeProtocol(event: SetFeeProtocol): void {
  // updateProtocolFees(event);
}

// Handle a mint event emitted from a pool contract. Considered a deposit into the given liquidity pool.
export function handleMint(event: MintEvent): void {
  // createDeposit(event, event.params.amount0, event.params.amount1);
  // updateUsageMetrics(event, event.params.sender, UsageType.DEPOSIT);
  // updateFinancials(event);
  // updatePoolMetrics(event);

  dex.addLiquidity(
    event.address.toHexString(),
    [event.params.amount0, event.params.amount1],
    event.transaction.from.toHexString(),
    event.address.toHexString(),
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.block.timestamp,
    event.block.number
  );
  updateAirMeta(event);
  dex.updatePoolReserve(event.address.toHexString(), [
    event.params.amount0,
    event.params.amount1,
  ]);
}

// Handle a burn event emitted from a pool contract. Considered a withdraw into the given liquidity pool.
export function handleBurn(event: BurnEvent): void {
  // createWithdraw(event, event.params.amount0, event.params.amount1);
  // updateUsageMetrics(event, event.transaction.from, UsageType.WITHDRAW);
  // updateFinancials(event);
  // updatePoolMetrics(event);

  dex.updatePoolReserve(event.address.toHexString(), [
    event.params.amount0.times(BIGINT_NEG_ONE),
    event.params.amount1.times(BIGINT_NEG_ONE),
  ]);
}

// Handle a swap event emitted from a pool contract.
export function handleSwap(event: SwapEvent): void {
  // createSwapHandleVolumeAndFees(
  //   event,
  //   event.params.amount0,
  //   event.params.amount1,
  //   event.params.recipient,
  //   event.params.sender,
  //   event.params.sqrtPriceX96
  // );
  // updateFinancials(event);
  // updatePoolMetrics(event);
  // updateUsageMetrics(event, event.transaction.from, UsageType.SWAP);

  const inputTokenIndex = event.params.amount0 > BIGINT_ZERO ? 0 : 1;
  const outputTokenIndex = event.params.amount0 > BIGINT_ZERO ? 1 : 0;
  //, outputTokenIndex, inputTokenAmount, outputTokenAmount;

  const inAmount0 =
    event.params.amount0 < BIGINT_ZERO
      ? event.params.amount0.times(BIGINT_NEG_ONE)
      : event.params.amount0;
  const inAmount1 =
    event.params.amount1 < BIGINT_ZERO
      ? event.params.amount1.times(BIGINT_NEG_ONE)
      : event.params.amount1;
  dex.swap(
    event.address.toHexString(),
    [inAmount0, inAmount1],
    [inAmount0, inAmount1],
    inputTokenIndex,
    outputTokenIndex,
    event.params.sender.toHexString(),
    event.params.recipient.toHexString(),
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.block.timestamp,
    event.block.number
  );
  updateAirMeta(event);

  dex.updatePoolReserve(event.address.toHexString(), [
    event.params.amount0,
    event.params.amount1,
  ]);
}
