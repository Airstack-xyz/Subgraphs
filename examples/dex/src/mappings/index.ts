// Liquidity pool is created from the Factory contract.
// Create a pool entity and start monitoring events from the newly deployed pool contract specified in the subgraph.yaml.
export function handlePoolCreated(event: PoolCreated): void {
  getOrCreateLiquidityPool(
    event.params.pool.toHexString(),
    [event.params.token0.toHexString(), event.params.token1.toHexString()],
    [BIGDECIMAL_ONE.div(BIGDECIMAL_TWO), BIGDECIMAL_ONE.div(BIGDECIMAL_TWO)],
    BigInt.fromI32(event.params.fee)
  );
}

export function handleMint(event: MintEvent): void {
  log.info("handleMint called", []);
  log.info("getting pool info for = {}", [event.address.toHexString()]);
  const dexPoolId = getAirDexPoolId(event.address.toHexString());
  log.info("dexPoolId = {}", [dexPoolId]);
  const dexPool = AirDEXPool.load(dexPoolId);

  if (dexPool) {
    log.info("dexPool.id = {}, ipt0:{}, ipt1={}, lpt={}", [
      dexPool.id,
      dexPool.inputToken[0],
      dexPool.inputToken[1],
      dexPool.outputToken,
    ]);
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

      log.info("Calling add liquidity function", []);
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
  log.info("handleBurn called", []);
  // createWithdraw(event, event.params.amount0, event.params.amount1);
  // updateUsageMetrics(event, event.transaction.from, UsageType.WITHDRAW);
  // updateFinancials(event);
  // updatePoolMetrics(event);
}

// Handle a swap event emitted from a pool contract.
export function handleSwap(event: SwapEvent): void {
  log.info("handleSwap called", []);
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
