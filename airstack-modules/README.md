# Airstack Subgraphs

## Introduction

Airstack is a web3 developer platform that provides powerful APIs for integrating on-chain and off-chain data into any application. With Airstack developers are able to easily connect their applications to the web3 ecosystem. 

Airstack enables GraphQL queries that combine on-chain and off-chain data from multiple sources in a single response. Our goal is to enable developers to query and integrate relevant web3 data, and serve it up to users without requiring heavy infrastructure or even a back-end. 

Airstack identity APIs map addresses and transactions across various sources, including: ENS, Farcaster, Lens, POAP, Dapps, and Marketplaces.

## Airstack Substreams & Subgraphs

Airstack is a pioneer in utilizing Substreams to index on-chain transactions faster than RPC-based solutions. Substreams are used for real-time indexing of on-chain events and for high volume blockchains such as Polygon. Airstack Substreams are hosted in-house on our infra.

Airstack deploys Subgraphs with custom schemas for indexing historical events and sales data from specific dapps, marketplaces and protocols. Airstack subgraphs are hosted in-house on our infra.

Airstack schemas for Substreams and Subgraphs define how events and transactions are indexed, aggregated, and consumed across projects in standard formats, enabling seamless querying of like data across projects and chains. Example verticals: NFT Marketplace, Social, DAOs, DeFi.

Airstack augments on-chain data with off-chain metadata from IPFS, dapps and marketplaces (for example NFT images and descriptions). Wherever possible we default to on-chain data.

Data is stored in the Airstack backend and optimized with parallel processing for fast GraphQL querying.

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

<ul>
<li> <b><i>npx airstack <vertical></i></b> will add the required Airstack entities and the module files in your <b>subgraph.yaml</b> file</li>
<li> <b><i>--yaml <subgraph.yaml file path></i></b> provide the location of your project's <b>subgraph.yaml</b> file. This is an optional parameter.</li>
<li> <b><i>--graphql <subgraph.graphql file path></i></b>provide the location of your project's <b>schema.graphql</b> file. This is an optional parameter.</li>
<li> <b><i>--dataSourceNames <name1, name2, ...></i></b> provide the <b>dataSource</b> name where Airstack entities will be added. This is an optional parameter. By default, the entities will be added in all the <b>dataSource</b> provided in the <b>subgraph.yaml</b>.
</li>
<li> <b><i>--templates <name1, name2, ...></i></b> provide the <b>template</b> name where Airstack entities will be added. This is an optional parameter. By default, the entities will be added in all the <b>template</b> provided in the <b>subgraph.yaml</b>.
</li>
</ul>










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
    isBundle, // boolean 
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
2. Run command`npx @airstack/subgraph-generator <vertical> --name <subgraph_name> --slug <subgraph_slug> --version <subgraph_version>`
3. Run the command
   `npm run build`