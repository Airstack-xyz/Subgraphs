# Airstack Subgraphs

### How to integrate the Airstack entities into your subgraphs. Follow the below steps.
These are the common steps for all the projects.
1. Identify the protocol of the project.
   The projects can belong to one of the following protocols.<br/>
   a. NFT marketplace<br/>
   b. DEX<br/>
   c. DAO <br/>
   d. Bridge<br/>
   e. Defi <br/>
   f. Staking<br/>
   g. P2E<br/>

2. Copy the following abi files into your project's `abis` folder.

   ```
     abis
       |
       |-common
             | - ERC20.json
             | - ERC721.json
             | - prices (all files and folders)

   ```

3. Copy the contents of `airstack-common-schema.graphql` file into your project's `schema.graphql` file.

4. Copy the `airstack` and `prices` modules into your project.
   ```
   modules/airstack
   modules/prices
   ```
5. Update the `subgraph.yaml` file to include the following.<br/>
   Add the common Airstack entities
   ```
     entities:
       - AirDailyAggregateEntity
       - AirDailyAggregateEntityStats
       - AirToken
       - AirDailyAggregateEntityAccount
       - AirAccount
   ```
   Add the following abis
   ```
     abis:
       - name: ERC721MetaData
         file: ./abis/common/ERC721.json
       - name: ERC20
         file: ./abis/common/ERC20.json
       - name: CurveRegistry
         file: ./abis/common/prices/Curve/Registry.json
       - name: ChainlinkOracle
         file: ./abis/common/prices/ChainLink.json
       - name: YearnLensContract
         file: ./abis/common/prices/YearnLens.json
       - name: UniswapFactory
         file: ./abis/common/prices/uniswap/Factory.json
       - name: UniswapFeeRouter
         file: ./abis/common/prices/uniswap/FeeRouter.json
       - name: UniswapPair
         file: ./abis/common/prices/uniswap/Pair.json
       - name: UniswapRouter
         file: ./abis/common/prices/uniswap/Router.json
       - name: SushiSwapRouter
         file: ./abis/common/prices/sushiswap/Factory.json
       - name: SushiSwapPair
         file: ./abis/common/prices/sushiswap/Pair.json
       - name: SushiSwapRouter
         file: ./abis/common/prices/sushiswap/Router.json
       - name: CurveFactory
         file: ./abis/common/prices/curve/Factory.json
       - name: CurvePoolRegistry
         file: ./abis/common/prices/curve/PoolRegistry.json
       - name: CurveRegistry
         file: ./abis/common/prices/curve/Registry.json
       - name: CalculationsCurve
         file: ./abis/common/prices/calculations/Curve.json
       - name: CalculationsSushiSwap
         file: ./abis/common/prices/calculations/SushiSwap.json
   ```
6. Now, you have added the common code to the project. From here, follow the protocol-specific steps.

### Integrate DEX

Please make sure that you have followed the above steps (1 to 6) mentioned in `How to integrate` section<br/><br/>

1. Copy the contents of `airstack-dex-schema.graphql` file in to your project's `schema.graphql` file. These are the DEX specific entities.
2. Update the `subgraph.yaml` file to include the following.<br/>
    Add the common Airstack entities


    ```
      entities:
        - AirDEXPool
        - AirLiquidityPoolStats
        - AirTokenStats
        - AirEntityDailyChangeStats
        - AirLiquidityPoolInputTokenStats
        - AirLiquidityPoolOutputTokenStats
        - AirLiquidityPoolTransaction
        - AirTokenTransfer
        - AirPoolFarmRewardStats
        - AirPoolFarmTransaction
        - AirDEXSwapStats
        - AirDEXSwapTransaction
    ```

3. From the mapping handler, call the `addDexPool` function when a new pool is added, the function is available at `modules/airstack/index.ts`

   ```ts
   export function addDexPool(
    poolAddress: string,
    fee: BigInt,
    inputTokens: Array<string>,
    weights: Array<BigDecimal> | null = null,
    outputToken: string | null = null
   ): void
   ```
4. From the mapping handler, call the `addLiquidity` function when liquidity is added, the function is available at `modules/airstack/index.ts`

   ```ts
   export function addLiquidity(
    poolAddress: string,
    inputAmounts: Array<BigInt>,
    from: string,
    to: string,
    hash: string,
    timestamp: BigInt
   ): void
   ```
5. From the mapping handler, call the `removeLiquidity` function when liquidity is removed, the function is available at `modules/airstack/index.ts`
    ```
    ```
6. From the mapping handler, call the `swapToken` function when the tokens are swapped, the function is available at `modules/airstack/index.ts`
    ```
    ```

### Integrating NFT Marketplace
Please make sure that you have followed the above steps (1 to 6) mentioned in `How to integrate` section<br/>
1. Copy the contents of `airstack-nftmarketplace-schema.graphql` file into your project's `schema.graphql` file. These are the NFT marketplace specific entities.
2. Update the `subgraph.yaml` file to include the following.<br/>
    Add the common Airstack entities


    ```
      entities:
        - AirNFTSaleStats
        - AirNFTSaleTransaction
    ```
3. From the mapping handler, call the `trackNFTSaleTransactions` function when a NFT sales take place, the function is available at `modules/airstack/index.ts`
    ```ts
    export function trackNFTSaleTransactions(
      txHash: string,
      fromArray: Address[],
      toArray: Address[],
      contractAddressArray: Address[],
      nftIdArray: BigInt[],
      paymentTokenAddress: Address,
      paymentAmount: BigInt,
      timestamp: BigInt
    ): void 
    ```
