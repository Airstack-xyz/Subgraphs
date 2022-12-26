#! /usr/bin/env node

import { Vertical } from "../src/constants";
import { integrate } from "../src/integrate";

const args = process.argv.slice(2);

if (args.length == 0) {
  console.error("Please enter at least the vertical type");
  process.exit(1); //an error occurred
}

const vertical: string = args[0];
let graphql: string = "./schema.graphql";
let yaml: string = "./subgraph.yaml";
let dataSources: Array<string> | undefined = undefined;
let templates: Array<string> | undefined = undefined;

const START_INDEX = 1;
for (let index = START_INDEX; index < args.length; index++) {
  const paramString = args[index];
  if (paramString.toLowerCase() === "--yaml") {
    if (args.length - START_INDEX < index + 1) {
      console.error("Please enter yaml file path");
      process.exit(1);
    }
    const val = args[index + 1];
    if (val.startsWith("--")) {
      console.error("Invalid value for --yaml");
      process.exit(1);
    }
    yaml = val;
  } else if (paramString.toLowerCase() === "--graphql") {
    if (args.length - START_INDEX < index + 1) {
      console.error("Please enter yaml file path");
      process.exit(1);
    }
    const val = args[index + 1];
    if (val.startsWith("--")) {
      console.error("Invalid value for --graphql");
      process.exit(1);
    }
    graphql = val;
  } else if (paramString.toLowerCase() === "--datasourcenames") {
    if (args.length - START_INDEX < index + 1) {
      console.error("Please enter dataSource value");
      process.exit(1);
    }
    const val = args[index + 1];
    if (val.startsWith("--")) {
      console.error("Invalid value for --dataSourceNames");
      process.exit(1);
    }
    dataSources = val.split(",");
  } else if (paramString.toLowerCase() === "--templates") {
    if (args.length - START_INDEX < index + 1) {
      console.error("Please enter template value");
      process.exit(1);
    }
    const val = args[index + 1];
    if (val.startsWith("--")) {
      console.error("Invalid value for --templates");
      process.exit(1);
    }
    templates = val.split(",");
  }
}

integrate(vertical, yaml, graphql, dataSources, templates)
  .then(() => {
    switch (vertical) {
      case Vertical.Dex:
        console.log(`
        Integration done. Please call the following functions.
        1. Add pool
        
          function addDexPool(
            poolAddress: string,
            fee: BigInt,
            inputTokens: Array<string>,
            weights: Array<BigDecimal> | null = null,
            outputToken: string | null = null
          ): void

        2. Add pool

          function swap(
            poolAddress: string,
            inputAmounts: Array<BigInt>,
            outputAmounts: Array<BigInt>,
            inputTokenIndex: i32,
            outputTokenIndex: i32,
            from: string,
            to: string,
            hash: string,
            logIndex: BigInt,
            timestamp: BigInt,
            blockNumber: BigInt
          ): void

          For documentation and examples please check: https://github.com/Airstack-xyz/airstack-subgraph/tree/task/npx-scripts
        `);
        break;
    
      case Vertical.NftMarketplace:
        console.log(`
        Integration done. Please call the following functions.
        1. Track NFT trade
        
        function trackNFTSaleTransactions(
          chainID: string,
          txHash: string,
          txIndex: BigInt,
          NftSales: Sale[],
          transactionType: string,
          protocolType: string,
          protocolActionType: string,
          timestamp: BigInt,
          blockHeight: BigInt,
          blockHash: string
      ): void

        For documentation and examples please check: https://github.com/Airstack-xyz/airstack-subgraph/tree/task/npx-scripts
        `);
        break;
    
      default:
        break;
    }
    process.exit(0); //no errors occurred
  })
  .catch(() => {
    console.error("Integration failed");
    process.exit(1);
  });
