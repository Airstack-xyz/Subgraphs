# SOCIAL vertical integration
### After module integration for SOCIAL vertical is done. Please call the below functions to track the transactions of the social vertical.

## Transaction tracking functions
```
1. Track transaction when a air user and profile is registered
  trackUserAndProfileRegisteredTransaction(
    blockNumber: BigInt,                        #block number of the user registration transaction
    blockHash: string,                          #block hash of the user registration transaction
    blockTimestamp: BigInt,                     #block timestamp of the user registration transaction
    transactionHash: string,                    #transaction hash of the user registration transaction
    logOrCallIndex: BigInt,                     #log or call index - used to differentiate between multiple logs or calls in a single transaction
    fromAddress: string,                        #address from which the profile token is transferred
    toAddress: string,                          #address to which the profile token is transferred
    tokenId: string,                            #token id of the profile token
    dappUserId: string,                         #dapp user id of the air user who registered (eg: farcasterId)
    profileName: string,                        #name of the profile (eg: farcasterProfileName)
    profileExtras: AirExtraDataClass[],         #extra data of the profile transferred (eg: tokenUri in farcaster)
    userExtras: AirExtraDataClass[],            #extra data of the profile transferred (eg: recoveryAddress and homeUrl in farcaster)
  )
```

## Supporting Classes
```
class AirExtraDataClass {
  name: string,                                 #name of the extra data (eg: "tokenUri","recoveryAddress","homeUrl" in farcaster)
  value: string,                                #value of the extra data (eg: values of tokenUri,recoveryAddress,homeUrl in farcaster)
}
```
