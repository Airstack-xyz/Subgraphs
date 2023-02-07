# SOCIAL vertical integration
### After module integration for SOCIAL vertical is done. Please call the below functions to track the transactions of the social vertical.
```
1. Track transaction when a AirProfile is transferred (eg: farcaster name/nft token transfer)
  trackAirProfileTransferTransaction(
    block: ethereum.Block,           #ethereum block object in subgraph
    fromAddress: string,             #address of the user who sent the profile //not sure if this is supposed to be used in current schema
    userAddress: string,             #address of the user who received the profile
    dappUserId: string,              #dapp user id of the air user who received the profile (eg: farcasterId)
    profileName: string,             #name of the profile transferred
    extras: AirExtraDataClass[],     #extra data of the profile transferred (eg: tokenUri for ERC721 token in farcaster)
  )
```
```
2. Track transaction when a air user is registered
  trackUserRegisteredTransaction(
    block: ethereum.Block,          #ethereum block object in subgraph
    userAddress: string,            #address of the user who registered the dappUserId (eg: farcasterId owner address)
    contractAddress: string,        #address of the contract which registered the dappUserId (eg: farcasterIdRegistry contract address)
    dappUserId: string,             #dapp user id of the air user who registered (eg: farcasterId)
    extras: AirExtraDataClass[],    #extra data of the profile transferred (eg: recoveryAddress and homeUrl in farcaster)
    logOrCallIndex: BigInt,         #log or call index - used to differentiate between multiple logs or calls in a single transaction
    transactionHash: string,        #transaction hash
  )
```