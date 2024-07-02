# DYNAMIC_NFT vertical integration

### After module integration for DYNAMIC_NFT vertical is done. Please call the below functions to track transactions of the token uri updates.

```
1. Track Dynamic NFT Update transaction
trackDynamicNFTUpdates(
        block: ethereum.Block,
        tokenAddress: string,
        tokenId: string,
        transactionHash: string,
        logOrCallIndex: BigInt,
        tokenStandard: string,
        protocolType: string,
        protocolActionType: string
    )
```

## Class definitions for Dynamic NFT update transaction

```
class AirNftTokenURIUpdateTransaction {
    id: ID!
    nft: AirNFT!
    tokenId: String!
    tokenAddress: AirToken!
    logOrCallIndex: BigInt!
    transactionHash: String!
    block: AirBlock!
    index: BigInt! #entity counter
    protocolType: AirProtocolType!  #SOCIAL
    protocolActionType: AirProtocolActionType!  #SOCIAL_REGISTRATION
  }
```

```
class AirNFT {
    id: ID!
    tokenId: String!
    tokenAddress: AirToken!
    tokenStandard: AirTokenStandardType!
    createdAt: AirBlock!
    lastUpdatedAt: AirBlock!
    lastUpdatedIndex: BigInt! # gets updated on each update
}
```

