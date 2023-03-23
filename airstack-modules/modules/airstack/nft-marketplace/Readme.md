# NFT_MARKET_PLACE vertical integration
### After module integration for NFT_MARKET_PLACE vertical is done. Please call the below functions to track the transactions of the domain name vertical.

```
1. Track NFT trade transaction
  trackNFTSaleTransactions(
    chainID: string,                    #chain id of the network
    txHash: string,                     #transaction hash
    txIndex: BigInt,                    #transaction index - call or log index
    NftSales: Sale[],                   #array of Sale objects
    isBundle: boolean                   #indicates if it's a bundle sale or not
    protocolType: string,               #protocol type - SALE
    protocolActionType: string,         #protocol action type - ["BUY", "SELL"]
    timestamp: BigInt,                  #timestamp of the transaction block
    blockHeight: BigInt,                #block number of the transaction block
    blockHash: string                   #block hash of the transaction block
  )
```

## Class definitions for NFT trade transaction

```
class Sale {
  buyer: Address,                        #nft buyer address
  seller: Address,                       #nft seller address
  nft: NFT,                              #NFT class object
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
  standard: string,                     #nft standard - ["ERC721", "ERC1155"]
  tokenId: BigInt,                      #nft token id
  amount: BigInt                        #nft amount - 1 for ERC721 and n for ERC1155
}
```