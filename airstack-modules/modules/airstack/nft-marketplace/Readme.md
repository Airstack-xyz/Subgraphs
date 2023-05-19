# NFT_MARKET_PLACE vertical integration

### After module integration for NFT_MARKET_PLACE vertical is done. Please call the below functions to track transactions of the nft sales.

```
1. Track NFT trade transaction
  trackNFTSaleTransactions(
    block: string,                      #block ethereum block
    transactionHash: string,            #transaction hash
    logOrCallIndex: BigInt,             #transaction index - call or log index
    sale: Sale,                         #sale object
    protocolType: string                #protocol type (eg: NFT_MARKET_PLACE)
    protocolActionType: string,         #protocol action type - ["BUY", "SELL"]
  )
```

## Class definitions for NFT trade transaction

```
class Sale {
  buyer: Address,                        #nft buyer address
  seller: Address,                       #nft seller address
  nft: NFT[],                            #array of NFT class object
  paymentAmount: BigInt,                 #payment amount in wei
  paymentToken: Address,                 #payment token address used for payment amount
  protocolFees: BigInt,                  #protocol fees in wei
  protocolFeesBeneficiary: Address,      #protocol fees beneficiary address
  royalties: CreatorRoyalty[]            #array of CreatorRoyalty class objects
}
```

```
class CreatorRoyalty {
  fee: BigInt,                           #royalty fee in wei
  beneficiary: Address                   #royalty beneficiary address
}
```

```
class NFT {
  collection: Address,                  #nft collection address
  tokenId: BigInt,                      #nft token id
  amount: BigInt                        #nft amount - 1 for ERC721 and n for ERC1155
}
```
