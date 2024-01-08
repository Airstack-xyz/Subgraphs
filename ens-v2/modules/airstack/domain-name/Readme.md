# DOMAIN_NAME vertical integration
### After module integration for DOMAIN_NAME vertical is done. Please call the below functions to track the transactions of the domain name vertical.
```
1. Track transaction when a domain owner is changed
  trackDomainOwnerChangedTransaction(
    block: ethereum.Block,            #ethereum block object in subgraph
    transactionHash: string,          #transaction hash
    logOrCallIndex: BigInt,           #log or call index - used to differentiate between multiple logs or calls in a single transaction
    domainId: string,                 #air domain entity id - needs to be unique for each domain
    parentDomainId: string,           #air domain entity id for parent domain - needs to be unique for each domain
    tokenId: string,                  #ERC721 token id - keccack256(labelHash) - needs to be unique for each token
    labelHash: string,                #hex value of a label
    labelName: string | null,         #label name - eg: 'airswap' in airswap.eth
    name: string | null,              #domain name - eg: 'airswap.eth'
    newOwner: string,                 #new owner address
    tokenAddress: string,             #token address for ERC721 token
  )
```
```
2. Track transaction when a domain is transferred
  trackDomainTransferTransaction(
    block: ethereum.Block,            #ethereum block object in subgraph
    transactionHash: string,          #transaction hash
    logOrCallIndex: BigInt,           #log or call index - used to differentiate between multiple logs or calls in a single transaction
    domainId: string,                 #air domain entity id - needs to be unique for each domain
    newOwnerAddress: string,          #address to which the domain is transferred
    tokenAddress: string,             #token address for ERC721 token
  )
```
```
3. Track transaction when a domain resolver is changed
  trackDomainNewResolverTransaction(
    block: ethereum.Block,            #ethereum block object in subgraph
    transactionHash: string,          #transaction hash
    logOrCallIndex: BigInt,           #log or call index - used to differentiate between multiple logs or calls in a single transaction
    domainId: string,                 #air domain entity id - needs to be unique for each domain
    resolver: string,                 #new resolver address linked to the domain
    tokenAddress: string,             #token address for ERC721 token
  )
```
```
4. Track transaction when a domain TTL is changed
  trackDomainNewTTLTransaction(
    block: ethereum.Block,            #ethereum block object in subgraph
    transactionHash: string,          #transaction hash
    logOrCallIndex: BigInt,           #log or call index - used to differentiate between multiple logs or calls in a single transaction
    domainId: string,                 #air domain entity id - needs to be unique for each domain
    newTTL: BigInt,                   #new TTL value for the domain
    tokenAddress: string,             #token address for ERC721 token
  )
```
```
5. Track transaction when a domain is registered
  trackNameRegisteredTransaction(
    block: ethereum.Block,            #ethereum block object in subgraph
    transactionHash: string,          #transaction hash
    logOrCallIndex: BigInt,           #log or call index - used to differentiate between multiple logs or calls in a single transaction
    domainId: string,                 #air domain entity id - needs to be unique for each domain
    registrantAddress: string,        #address which registered the domain
    expiryTimestamp: BigInt,          #unix time at which domain expires
    cost: BigInt,                     #cost of domain registration in wei
    paymentToken: string,             #address of token used for registration cost
    labelName: string | null,         #label name - eg: 'airswap' in airswap.eth
    tokenAddress: string,             #token address for ERC721 token
  )
```
```
6. Track transaction when a domain is renewed
  trackNameRenewedTransaction(
    block: ethereum.Block,            #ethereum block object in subgraph
    transactionHash: string,          #transaction hash
    domainId: string,                 #air domain entity id - needs to be unique for each domain
    cost: BigInt | null,              #cost of domain renewal in wei
    paymentToken: string,             #address of token used for renewal cost
    renewer: string,                  #address which renewed the domain
    expiryTimestamp: BigInt,          #unix time at which domain expires
    tokenAddress: string,             #token address for ERC721 token
  )
```
```
7. Track controller transaction when a domain is renewed or registered
  trackNameRenewedOrRegistrationByController(
    block: ethereum.Block,            #ethereum block object in subgraph
    transactionHash: string,          #transaction hash
    domainId: string,                 #air domain entity id - needs to be unique for each domain
    name: string,                     #domain name - eg: 'airswap.eth'
    label: Bytes,                     #hex value of a label
    cost: BigInt,                     #cost of domain registration or renewal in wei
    paymentToken: string,             #address of token used for registration or renewal cost
    renewer: string | null,           #address which renewed the domain
    expiryTimestamp: BigInt | null,   #unix time at which domain expires
    fromRegistrationEvent: boolean,   #true if the transaction is from a registration event
    tokenAddress: string,             #token address for ERC721 token 
  )
```
```
8. Track transaction when a domain's resolved address is changed
  trackResolvedAddressChangedTransaction(
    block: ethereum.Block,            #ethereum block object in subgraph
    transactionHash: string,          #transaction hash
    logOrCallIndex: BigInt,           #log or call index - used to differentiate between multiple logs or calls in a single transaction
    domainId: string,                 #air domain entity id - needs to be unique for each domain
    resolverAddress: string,          #address of the resolver contract
    resolvedAddress: string,          #address which the domain resolves to
    tokenAddress: string,             #token address for ERC721 token
  )
```
```
9. Track transaction when a domain's resolver version is changed
  trackResolverVersionChange(
    block: ethereum.Block,            #ethereum block object in subgraph
    domainId: string,                 #air domain entity id - needs to be unique for each domain
    resolverAddress: string,          #address of the resolver contract
    tokenAddress: string,             #token address for ERC721 token
  )
```
```
10. Track transaction when an resolved address's primary domain is changed
  trackSetPrimaryDomainTransaction(
    block: ethereum.Block,            #ethereum block object in subgraph
    transactionHash: string,          #transaction hash
    domainName: string,               #domain name - eg: 'airswap.eth'
    from: string,                     #address which changed its primary domain to the domainName
    tokenAddress: string,             #token address for ERC721 token
  )
```