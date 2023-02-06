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

          For documentation and examples please check: https://github.com/Airstack-xyz/Subgraphs
        `);
        break;

      case Vertical.NftMarketplace:
        console.log(`
        Integration done. Please call the following functions.
        
        1. Track NFT trade transaction
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
        )

        For documentation and examples please check: https://github.com/Airstack-xyz/Subgraphs
        `);
        break;

      case Vertical.DomainName:
        console.log(`
        Integration done. Please call the following functions.

        1. Track domain owner change transaction
          trackDomainOwnerChangedTransaction(
            blockHeight: BigInt,
            blockHash: string,
            blockTimestamp: BigInt,
            logIndex: BigInt,
            chainId: string,
            newOwner: string,
            transactionHash: string,
            isMigrated: boolean,
            node: Bytes,
            label: Bytes,
            tokenAddress: string,
            fromOldRegistry: boolean,
          )

        2. Track domain transfer transaction
        trackDomainTransferTransaction(
          node: string,
          chainId: string,
          newOwnerAddress: string,
          blockHeight: BigInt,
          blockHash: string,
          blockTimestamp: BigInt,
          logIndex: BigInt,
          transactionHash: string,
          tokenAddress: string,
          fromOldRegistry: boolean,
        )

        3. Track domain new resolver transaction
        trackDomainNewResolverTransaction(
          resolver: string,
          node: string,
          chainId: string,
          blockHeight: BigInt,
          blockHash: string,
          blockTimestamp: BigInt,
          transactionHash: string,
          logIndex: BigInt,
          tokenAddress: string,
          fromOldRegistry: boolean,
        )

        4. Track domain new ttl transaction
        trackDomainNewTTLTransaction(
          node: string,
          newTTL: BigInt,
          chainId: string,
          blockHeight: BigInt,
          blockHash: string,
          blockTimestamp: BigInt,
          logIndex: BigInt,
          transactionHash: string,
          tokenAddress: string,
          fromOldRegistry: boolean,
        )

        5. Track name registered transaction
        trackNameRegisteredTransaction(
          transactionHash: string,
          blockHeight: BigInt,
          blockHash: string,
          blockTimestamp: BigInt,
          logIndex: BigInt,
          chainId: string,
          registrantAddress: string,
          expiryTimestamp: BigInt,
          cost: BigInt,
          paymentToken: string,
          labelId: BigInt,
          rootNode: ByteArray,
          tokenAddress: string,
        )

        6. Track name renewed transaction
        trackNameRenewedTransaction(
          transactionHash: string,
          blockHeight: BigInt,
          blockHash: string,
          blockTimestamp: BigInt,
          chainId: string,
          cost: BigInt | null,
          paymentToken: string,
          renewer: string,
          labelId: BigInt,
          rootNode: ByteArray,
          expiryTimestamp: BigInt,
          tokenAddress: string,
        )

        7. Track set name preimage transaction
        trackSetNamePreImage(
          name: string,
          label: Bytes,
          cost: BigInt,
          paymentToken: string,
          blockHeight: BigInt,
          blockHash: string,
          blockTimestamp: BigInt,
          chainId: string,
          rootNode: ByteArray,
          tokenAddress: string,
          transactionHash: string,
          renewer: string | null,
          expiryTimestamp: BigInt | null,
          fromRegistrationEvent: boolean,
        )

        8. Track addr(resolvedAddress) changed transaction
        trackAddrChangedTransaction(
          chainId: string,
          logIndex: BigInt,
          resolverAddress: string,
          addr: string,
          node: string,
          blockHeight: BigInt,
          blockHash: string,
          blockTimestamp: BigInt,
          transactionHash: string,
          tokenAddress: string,
        )

        9. Track resolver version changed transaction
        trackResolverVersionChange(
          chainId: string,
          blockHeight: BigInt,
          blockHash: string,
          blockTimestamp: BigInt,
          node: string,
          resolverAddress: string,
          tokenAddress: string,
        )

        10. Track set primary domain transaction
        trackSetPrimaryDomainTransaction(
          ensName: string,
          chainId: string,
          from: string,
          blockHeight: BigInt,
          blockHash: string,
          blockTimestamp: BigInt,
          transactionHash: string,
          tokenAddress: string,
        )

        For documentation and examples please check: https://github.com/Airstack-xyz/Subgraphs
        `
        );
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
