# Airstack Subgraphs

**Every day there are millions of blockchain transactions.**
**Airstack makes sense of them.**

[Here](https://app.airstack.xyz/) is a live example of how the Airstack entities are consumed.

## Introduction

Airstack is developing a Protocol and DAPP for browsing, discovering, and consuming on-chain data across projects and across blockchains. Our motivation for creating Airstack is to enable common ways to organize blockchain data and make it universally consumable.

This is a large and important problem to solve. On Ethereum based chains (EVMs) alone there are already more than 10 million daily transactions happening across thousands of protocols and dapps. Today those transactions exist in silos; there are no easy ways to query across projects and blockchains — to map relationship and behaviors, discover trends at the event level, and analyze product utility.

Airstack is building the tooling now to enable a decentralized web3 data network that will enable easy querying of data across projects and blockchains.

To do so, Airstack is helping standardize blockchain data, aggregating it, mapping relationships, and providing protocols and APIs to access it.

## What are Airstack Schema?

Airstack schemas are standardized schemas to access the data across projects and blockchains.
These schemas are for eight initial verticals, and it is intended that any dapp/protocol within those verticals could be indexed consistently by utilizing the Airstack schemas for Subgraph.

The 8 verticals defined for Airstack schemas are:

1. NFT Marketplaces (E.g. OpenSea, Looksrare)
2. NFT Projects (E.g. ENS, POAP, Nouns, Moonbirds, Apes)
3. Swaps (e.g. Quickswap, Uniswap, Sushiswap)
4. Defi (e.g. Aave or Compound)
5. Bridges (e.g. Hop)
6. Games (e.g. Sandbox)
7. DAOs
8. Social (e.g. Farcaster and Lens)
9. Catch all for Other Dapps (we anticipate that this will soon be broken out into additional verticals, e.g. Music, Publishing, Social)

## Getting Started

### 1. Prerequisite:

You already have a subgraph for Dapp/Protocol. And you intend to integrate Airstack schemas into the project.

### 2. Install Airstack package:
```npm
npm install  @airstack/subgraph-generator
```

### 3. Identify the vertical for the Dapp/Protocol:

Currently, we support eight verticals. Identify your project's vertical

Use the following command to add Airstack Schemas and ABIs in your project's `subgraph.yaml`

```npm
npx  @airstack/subgraph-generator <vertical>  --yaml <subgraph.yaml file path> --graphql <schema.graphql file path> --dataSourceNames <"name1, name2, ..."> --templates <"name1, name2"> 
```

`npx airstack <vertical>`
will add the required Airstack entities and the ABI files in your **subgraph.yaml** file

`--yaml <subgraph.yaml file path>`
provide the location of your project's **subgraph.yaml** file. This is an optional parameter.

`--graphql <subgraph.graphql file path>`
provide the location of your project's **schema.graphql** file. This is an optional parameter.

`--dataSourceNames <name1, name2, ...>` provide the **dataSource** name where Airstack entities will be added. This is an optional parameter. By default, the entities will be added in all the **dataSource** provided in the **subgraph.yaml**.

`--templates <name1, name2, ...>` provide the **teamplate** name where Airstack entities will be added. This is an optional parameter. By default, the entities will be added in all the **teamplate** provided in the **subgraph.yaml**.

Examples:

a. NFT Marketplace

```
npx @airstack/subgraph-generator nft-marketplace
```

b. DEX

```
npx @airstack/subgraph-generator dex --yaml "./subgraph.yaml" --dataSourceNames "Factory, Pair"
```

Following are the vertical Ids

NFT Marketplace: `nft-marketplace`<br/> NFT: `nft`Swap:`dex`<br/> Bridges: `bridge`<br/> DAO: `TBD`<br/> Defi: `TBD`<br/> Games: `TBD`<br/>

Integration of the Airstack schemas is done. Now, move to the vertical-specific section for further integration.

### 3. Code integration

#### a. NFT Marketplace

Track actions for NFT Marketplace.
Call the following functions from your subgraph mapping. An example implementation is [Here](https://github.com/Airstack-xyz).

1. NFT sale transactions

   ```ts
   function trackNFTSaleTransactions(
    chainID: string,
    txHash: string,
    txIndex: BigInt,
    NftSales: Sale[],
    protocolType: string,
    protocolActionType: string,
    timestamp: BigInt,
    blockHeight: BigInt,
    blockHash: string
   ): void;
   ```
   
   **chainID**: ID of the chain on which contract of the subgraph is deployed<br/>
   **txHash**: Transaction hash of the NFT transaction<br/>
   **txIndex**: Transaction Index of the NFT transaction<br/>
   **NFTSales**: Array of the Sale objects containing details of NFT sales<br/>
   **ProtocolType**: Protocol type<br/>
   **ProtocolActionType**: Protocol Action Type<br/>
   **Timestamp**: Timestamp of the block in which transaction happened<br/>
   **blockHeight**: Block height<br/>
   **blockHash**: Block hash<br/>

Supported protocol types are :-
  GENERIC
  EXCHANGE
  LENDING
  YIELD
  BRIDGE
  DAO
  NFT_MARKET_PLACE
  STAKING
  P2E #play to earn
  LAUNCHPAD

Supported protocol action types are :-
  ALL ##to track all action stats of a dapp
  ### NFT Marketplace/Tokens ###
  BUY
  SELL
  MINT
  BURN # TODO check this later
  ### NFT (ex: Poap) ###
  ATTEND
  ### P2E (NFT + Utility) ###
  EARN
  ### DEX ###
  SWAP
  ADD_LIQUIDITY
  REMOVE_LIQUIDITY
  ADD_TO_FARM
  REMOVE_FROM_FARM
  CLAIM_FARM_REWARD
  ### Lending ###
  LEND
  BORROW
  FLASH_LOAN
  ### Staking / Delegating ###
  STAKE
  RESTAKE
  UNSTAKE
  DELEGATE
  CLAIM_REWARDS

#### b. NFT Marketplace

Track actions for NFT Marketplaces.
Call the following function from your subgraph mapping. An example implementation is [Here](https://github.com/Airstack-xyz/Subgraphs)

1. Creation of NFT object
   ```ts
   NFT(
    Collection Address : Address,
    Standard: string, //ERC1155 or ERC721
    tokenId: BigInt,
    amount: BigInt
   )
   ```
2. Creation of NFT Sale object
   ```ts
   Sale(
    buyer: Address,
    seller: Address,
    nft: NFT,
    paymentAmount: BigInt,
    paymentToken: Address,
    protocolFees: BigInt,
    protocolFeesBeneficiary: Address,
    royaltyFees: BigInt,
    royaltyFeesBeneficiary: Address
   )
   ```

3. Use the trackNFTSaleTransactions function to process the data and store in Airstack schema
   ```ts
    trackNFTSaleTransactions(
        chainID: string,
        txHash: string,
        txIndex: BigInt,
        NftSales: Sale[],
        protocolType: string,
        protocolActionType: string,
        timestamp: BigInt,
        blockHeight: BigInt,
        blockHash: string
      ): void;
   ```

### 4. Development status of each vertical

⌛ = Prioritized<br/>
💬 = In discussion<br/>
🔨 = In progress implementation<br/>
✅ = Completed<br/>

| Vertical        | Status |
| --------------- | :----: |
| NFT Marketplace |   ✅   |
| Domain Name     |   ✅   |
| DEX             |   🔨   |
| Bridges         |   💬   |
| DAO             |   ⌛   |
| Defi            |   ⌛   |
| Games           |   ⌛   |


## To build the module

If you want to build the module yourself, please follow there steps.

1. Clone the repo
2. Run the command
   npm run build

   It will run all the necessary scripts.