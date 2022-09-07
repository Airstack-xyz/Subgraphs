import { Mint, Burn, Swap, Sync } from "../../generated/templates/Pair/Pair";
import { dex } from "../../modules/airstack";
import { updateAirMeta } from "../../modules/airstack/common";
import { BIGINT_ZERO } from "../../modules/prices/common/constants";

// Handle a mint event emitted from a pool contract. Considered a deposit into the given liquidity pool.
export function handleMint(event: Mint): void {
  dex.addLiquidity(
    event.address.toHexString(),
    [event.params.amount0, event.params.amount1],
    event.params.sender.toHexString(),
    event.address.toHexString(),
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.block.timestamp,
    event.block.number
  );
  updateAirMeta(event);
}

// Handle a burn event emitted from a pool contract. Considered a withdraw into the given liquidity pool.
export function handleBurn(event: Burn): void {}

export function handleSync(event: Sync): void {
  dex.syncPoolReserve(event.address.toHexString(), [
    event.params.reserve0,
    event.params.reserve1,
  ]);
}

// Handle a swap event emitted from a pool contract.
export function handleSwap(event: Swap): void {
  const inputTokenIndex = event.params.amount0Out == BIGINT_ZERO ? 0 : 1;
  const outputTokenIndex = event.params.amount0Out == BIGINT_ZERO ? 1 : 0;

  dex.swap(
    event.address.toHexString(),
    [event.params.amount0In, event.params.amount1In],
    [event.params.amount0Out, event.params.amount1Out],
    inputTokenIndex,
    outputTokenIndex,
    event.params.sender.toHexString(),
    event.params.to.toHexString(),
    event.transaction.hash.toHexString(),
    event.logIndex,
    event.block.timestamp,
    event.block.number
  );
  updateAirMeta(event);
}
