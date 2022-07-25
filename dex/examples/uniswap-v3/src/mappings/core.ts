// import { log } from '@graphprotocol/graph-ts'
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { AirDEXPool, AirToken, AirTokenTransfer } from "../../generated/schema";
import {
  Burn as BurnEvent,
  Initialize,
  Mint as MintEvent,
  Swap as SwapEvent,
  SetFeeProtocol,
} from "../../generated/templates/Pool/Pool";
import {
  addLiquidity,
  getOrCreateAirTokenTransfer,
} from "../common/airstack/dex";
import { UsageType } from "../common/constants";
import {
  createDeposit,
  createWithdraw,
  createSwapHandleVolumeAndFees,
} from "../common/creators";
import {
  updatePrices,
  updatePoolMetrics,
  updateProtocolFees,
  updateUsageMetrics,
  updateFinancials,
} from "../common/updateMetrics";

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
  const dexPool = AirDEXPool.load(event.address.toHexString());
  if (dexPool) {
    const inputTokenTransfers: Array<AirTokenTransfer> = [];
    const inputToken0 = AirToken.load(dexPool.inputToken[0]);
    if (inputToken0) {
      const inputToken0Transfer = getOrCreateAirTokenTransfer(
        inputToken0.address,
        event.transaction.from.toHexString(),
        event.address.toHexString(),
        event.params.amount0,
        dexPool.fee,
        event
      );
      inputTokenTransfers.push(inputToken0Transfer);
    }

    const inputToken1 = AirToken.load(dexPool.inputToken[1]);
    if (inputToken1) {
      const inputToken1Transfer = getOrCreateAirTokenTransfer(
        inputToken1.address,
        event.transaction.from.toHexString(),
        event.address.toHexString(),
        event.params.amount1,
        dexPool.fee,
        event
      );
      inputTokenTransfers.push(inputToken1Transfer);
    }

    const outputToken = AirToken.load(dexPool.outputToken);
    if (outputToken) {
      const outputTokenTransfer = getOrCreateAirTokenTransfer(
        outputToken.address,
        event.address.toHexString(),
        event.transaction.from.toHexString(),
        event.params.amount,
        BigInt.fromI32(0),
        event
      );
      addLiquidity(inputTokenTransfers, outputTokenTransfer, event);
    }
  }
  // createDeposit(event, event.params.amount0, event.params.amount1);
  // updateUsageMetrics(event, event.params.sender, UsageType.DEPOSIT);
  // updateFinancials(event);
  // updatePoolMetrics(event);
}

// Handle a burn event emitted from a pool contract. Considered a withdraw into the given liquidity pool.
export function handleBurn(event: BurnEvent): void {
  // createWithdraw(event, event.params.amount0, event.params.amount1);
  // updateUsageMetrics(event, event.transaction.from, UsageType.WITHDRAW);
  // updateFinancials(event);
  // updatePoolMetrics(event);
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
}
