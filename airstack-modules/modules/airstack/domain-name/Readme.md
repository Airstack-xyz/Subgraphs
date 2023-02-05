        Integration for DOMAIN_NAME vertical done. Please call the following functions.

Below functions are used to track the transactions of the domain name vertical.
<!-- describe params in words -->
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