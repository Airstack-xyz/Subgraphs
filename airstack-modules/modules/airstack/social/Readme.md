# SOCIAL vertical integration

### After module integration for SOCIAL vertical is done. Please call the below functions to track the transactions of the social vertical.

## Transaction tracking functions

```
1. Track user and profile registration transaction
  trackSocialUserAndProfileRegisteredTransaction(
    block: BigInt,                              #ethereum block of the user registration transaction
    transactionHash: string,                    #transaction hash of the user registration transaction
    logOrCallIndex: BigInt,                     #log or call index - used to differentiate between multiple logs or calls in a single transaction
    from: string,                               #profile token sender address
    to: string,                                 #profile token receiver address
    tokenId: string,                            #token id of the profile token - ERC721
    tokenAddress: string,                       #token address of the profile token - ERC721
    dappUserId: string,                         #dapp user id of the air user who registered (eg: farcasterId)
    userExtras: AirExtraData[],                 #extra data of the profile transferred (eg: recoveryAddress and homeUrl in farcaster)
    profileName: string,                        #name of the profile (eg: farcasterProfileName)
    profileExtras: AirExtraData[],              #extra data of the profile transferred (eg: tokenUri in farcaster)
    profileExpiryTimestamp: BigInt,             #expiry timestamp of the profile
  )
```

```
2. Track user ownership change transaction
  trackSocialUserOwnershipChangeTransaction(
    block: ethereum.Block,                     #ethereum block of the user ownership change transaction
    transactionHash: string,                   #transaction hash of the user ownership change transaction
    logOrCallIndex: BigInt,                    #log or call index - used to differentiate between multiple logs or calls in a single transaction
    from: string,                              #user token sender address
    to: string,                                #user token receiver address
    tokenId: string,                           #token id of the user token - ERC721 (eg: farcasterId)
    tokenAddress: string,                      #token address of user token
    socialUserId: string,                      #user id from respective dapp (eg: farcasterId)
  )
```

```
3. Track profile ownership change transaction
  trackSocialProfileOwnershipChangeTransaction(
    block: ethereum.Block,                     #ethereum block of the profile ownership change transaction
    transactionHash: string,                   #transaction hash of the profile ownership change transaction
    logOrCallIndex: BigInt,                    #log or call index - used to differentiate between multiple logs or calls in a single transaction
    from: string,                              #profile token sender address
    to: string,                                #profile token receiver address
    tokenId: string,                           #token id of the profile token - ERC721 (eg: farcaster profile token id)
    tokenAddress: string,                      #token address of profile token
    oldSocialUserId: string,                   #user id from respective dapp (eg: farcasterId of from address)
    newSocialUserId: string,                   #user id from respective dapp (eg: farcasterId of to address)
  )
```

```
4. Track user home url change transaction
  trackSocialUserHomeUrlChangeTransaction(
    block: ethereum.Block,                     #ethereum block of the user ownership change transaction
    transactionHash: string,                   #transaction hash of the user ownership change transaction
    logOrCallIndex: BigInt,                    #log or call index - used to differentiate between multiple logs or calls in a single transaction
    from: string,                              #user token sender address
    to: string,                                #user token receiver address
    tokenId: string,                           #token id of the user token - ERC721 (eg: farcasterId)
    tokenAddress: string,                      #token address of user token
    socialUserId: string,                      #user id from respective dapp (eg: farcasterId)
    homeUrl: string,                           #updated home url of the user
  )
```

```
5. Track user recovery address change transaction
  trackSocialUserRecoveryAddressChangeTransaction(
    block: ethereum.Block,                     #ethereum block of the user ownership change transaction
    transactionHash: string,                   #transaction hash of the user ownership change transaction
    logOrCallIndex: BigInt,                    #log or call index - used to differentiate between multiple logs or calls in a single transaction
    from: string,                              #user token sender address
    to: string,                                #user token receiver address
    tokenId: string,                           #token id of the user token - ERC721 (eg: farcasterId)
    tokenAddress: string,                      #token address of user token
    socialUserId: string,                      #user id from respective dapp (eg: farcasterId)
    recoveryAddress: string,                   #updated recovery address of the user
  )
```

```
6. Track profile recovery address change transaction
  trackSocialProfileRecoveryAddressChangeTransaction(
    block: ethereum.Block,                     #ethereum block of the profile ownership change transaction
    transactionHash: string,                   #transaction hash of the profile ownership change transaction
    logOrCallIndex: BigInt,                    #log or call index - used to differentiate between multiple logs or calls in a single transaction
    from: string,                              #profile token sender address
    to: string,                                #profile token receiver address
    tokenId: string,                           #token id of the profile token - ERC721 (eg: farcaster profile token id)
    tokenAddress: string,                      #token address of profile token
    recoveryAddress: string,                   #updated recovery address of the profile
  )
```

```
7. Track profile renewal transaction
  trackSocialProfileRenewalTransaction(
    block: ethereum.Block,                     #ethereum block of the profile ownership change transaction
    transactionHash: string,                   #transaction hash of the profile ownership change transaction
    logOrCallIndex: BigInt,                    #log or call index - used to differentiate between multiple logs or calls in a single transaction
    from: string,                              #profile token sender address
    to: string,                                #profile token receiver address
    tokenId: string,                           #token id of the profile token - ERC721 (eg: farcaster profile token id)
    tokenAddress: string,                      #token address of profile token
    expiryTimestamp: BigInt,                   #updated expiry timestamp of the profile
    renewalCost: BigInt,                       #renewal cost of the profile
  )
```

```
8. Track default profile change transaction
  trackSocialUserDefaultProfileChange(
    block: ethereum.Block,                     #ethereum block of the profile ownership change transaction
    transactionHash: string,                   #transaction hash of the profile ownership change transaction
    logOrCallIndex: BigInt,                    #log or call index - used to differentiate between multiple logs or calls in a single transaction
    from: string,                              #intiator of the transaction
    to: string,                                #contract address
    tokenId: string,                           #token id of the profile token
    tokenAddress: string,                      #token address of profile token
    socialUserId: string                       #user id from respective dapp
  )
## Supporting Classes
```

class AirExtraData {
name: string, #name of the extra data (eg: "profileTokenUri","userRecoveryAddress","profileRecoveryAddress","userHomeUrl" in farcaster)
value: string, #value of the extra data (eg: values of profileTokenUri,userRecoveryAddress,profileRecoveryAddress,userHomeUrl in farcaster)
}

```

```
