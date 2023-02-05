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
        Integration for DOMAIN_NAME vertical done. Please call the following functions.

        1. Track transaction when a domain owner is changed
          trackDomainOwnerChangedTransaction(
            block: ethereum.Block,
            transactionHash: string,
            logOrCallIndex: BigInt,
            domainId: string,
            parentDomainId: string,
            tokenId: string,
            label: string,
            labelName: string | null,
            name: string | null,
            newOwner: string,
            tokenAddress: string,
          )

        2. Track transaction when a domain is transferred
        trackDomainTransferTransaction(
          block: ethereum.Block,
          transactionHash: string,
          logOrCallIndex: BigInt,
          domainId: string,
          newOwnerAddress: string,
          tokenAddress: string,
        )

        3. Track transaction when a domain resolver is changed
        trackDomainNewResolverTransaction(
          block: ethereum.Block,
          transactionHash: string,
          logOrCallIndex: BigInt,
          domainId: string,
          resolver: string,
          tokenAddress: string,
        )

        4. Track transaction when a domain TTL is changed
        trackDomainNewTTLTransaction(
          block: ethereum.Block,
          transactionHash: string,
          logOrCallIndex: BigInt,
          domainId: string,
          newTTL: BigInt,
          tokenAddress: string,
        )

        5. Track transaction when a domain is registered
        trackNameRegisteredTransaction(
          block: ethereum.Block,
          transactionHash: string,
          logOrCallIndex: BigInt,
          domainId: string,
          registrantAddress: string,
          expiryTimestamp: BigInt,
          cost: BigInt,
          paymentToken: string,
          labelName: string | null,
          tokenAddress: string,
        )

        6. Track transaction when a domain is renewed
        trackNameRenewedTransaction(
          block: ethereum.Block,
          transactionHash: string,
          domainId: string,
          cost: BigInt | null,
          paymentToken: string,
          renewer: string,
          expiryTimestamp: BigInt,
          tokenAddress: string,
        )

        7. Track controller transaction when a domain is renewed or registered
        trackNameRenewedOrRegistrationByController(
          block: ethereum.Block,
          transactionHash: string,
          domainId: string,
          name: string,
          label: Bytes,
          cost: BigInt,
          paymentToken: string,
          renewer: string | null,
          expiryTimestamp: BigInt | null,
          fromRegistrationEvent: boolean,
          tokenAddress: string, 
        )

        8. Track transaction when a domain's resolved address is changed
        function trackResolvedAddressChangedTransaction(
          block: ethereum.Block,
          transactionHash: string,
          logOrCallIndex: BigInt,
          domainId: string,
          resolverAddress: string,
          resolvedAddress: string,
          tokenAddress: string,
        )

        9. Track transaction when a domain's resolver version is changed
        trackResolverVersionChange(
          block: ethereum.Block,
          domainId: string,
          resolverAddress: string,
          tokenAddress: string,
        )

        10. Track transaction when an resolved address's primary domain is changed
        trackSetPrimaryDomainTransaction(
          block: ethereum.Block,
          transactionHash: string,
          domainName: string,
          from: string,
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
