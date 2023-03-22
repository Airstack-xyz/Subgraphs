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
npm install @airstack/subgraph-generator
```

### 3. Identify the vertical for the Dapp/Protocol:

We support

-   NFT Marketplace: `nft-marketplace`
-   Domain Name: `domain-name`
-   DEX: `dex`
-   Bridges: `TBD`
-   DAO: `TBD`
-   Defi: `TBD`
-   Games: `TBD`

Use the following command to add Airstack Schemas and Modules in your project

```npm
npx  @airstack/subgraph-generator <vertical>  --yaml <subgraph.yaml file path> --graphql <schema.graphql file path> --dataSourceNames <"name1, name2, ..."> --templates <"name1, name2">
```

`npx airstack <vertical>`
will add the required Airstack entities and the module files in your **subgraph.yaml** file

`--yaml <subgraph.yaml file path>`
provide the location of your project's **subgraph.yaml** file. This is an optional parameter.

`--graphql <subgraph.graphql file path>`
provide the location of your project's **schema.graphql** file. This is an optional parameter.

`--dataSourceNames <name1, name2, ...>` provide the **dataSource** name where Airstack entities will be added. This is an optional parameter. By default, the entities will be added in all the **dataSource** provided in the **subgraph.yaml**.

`--templates <name1, name2, ...>` provide the **template** name where Airstack entities will be added. This is an optional parameter. By default, the entities will be added in all the **template** provided in the **subgraph.yaml**.

Examples:

a. NFT Marketplace

```
npx @airstack/subgraph-generator nft-marketplace
```

#### Terminal will prompt these questions

```sh
Enter the name of the subgraph:
Enter the version of the subgraph:
Enter the slug of the subgraph:
```

Integration of the Airstack schemas is done. Now, move to the vertical-specific section for further integration.

### 3. Code integration

#### Example: NFT Marketplace

1. Import `airstack` modules

```ts
import * as airstack from "../modules/airstack/nft-marketplace"
```

2. Creation of NFT object

```ts
let nft = new airstack.nft.NFT(
    collectionAddress, // Address
    standard, // string "ERC721" or "ERC1155"
    tokenId, // BigInt
    amount // BigInt 1 for "ERC721" , n for "ERC1155"
)
```

3. Creation of royalties array

```ts
let royalties = new Array<airstack.nft.CreatorRoyalty>()
let royalty = new airstack.nft.CreatorRoyalty(
    fee, // BigInt
    beneficiary // Address
)
royalties.push(royalty)
```

4. Creation of NFT Sales array

```ts
let allSales = new Array<airstack.nft.Sale>()
let sale = new airstack.nft.Sale(
    buyer, // Address
    seller, // Address
    nft, // airstack.nft.NFT
    paymentAmount, // BigInt
    paymentToken, // Address
    protocolFees, // BigInt
    protocolFeesBeneficiary, // Address
    royalties // airstack.nft.CreatorRoyalty[]
)
allSales.push(sale)
```

5. Use the trackNFTSaleTransactions function to process the data and store in Airstack schema

```ts
airstack.nft.trackNFTSaleTransactions(
    chainId, //  string eg: for mainnet: 1
    txHash, // string eg: event.transaction.hash.toHexString()
    txIndex, //string eg: event.transaction.index
    allSales, // airstack.nft.Sale[]
    protocolType, // string eg: "NFT_MARKET_PLACE"
    protocolActionType, //string eg: "SELL"
    timestamp, // BigInt eg: event.block.timestamp
    blockHeight, // BigInt eg: event.block.number
    blockHash // string eg: event.block.hash.toHexString()
)
```

## Development status of each vertical

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
   `npm run build`
