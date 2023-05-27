# POAP vertical integration

### After module integration for POAP vertical is done. Please call the below functions to track POAP minting and transferring

```
1. Track POAP mint transactions
  trackPoapMintTransactions(
    block: ethereum.Block,          # block, ethereum block
    transactionHash: string,        # transaction hash
    logOrCallIndex: BigInt,         # transaction log or call index
    tokenAddress: Bytes,            # token address of POAP
    eventId: BigInt,                # eventId of POAP token
    tokenId: BigInt,                # tokenId of POAP token
    owner: Bytes                    # owner of POAP token
  )
```

```
2. Track POAP transfer transactions
  trackPoapTransferTransactions(
    block: ethereum.Block,          # block, ethereum block
    transactionHash: string,        # transaction hash
    logOrCallIndex: BigInt,         # transaction log or call index
    eventId: BigInt,                # eventId of POAP token
    tokenId: BigInt,                # tokenId of POAP token
    from: Bytes,                    # previous owner of POAP token
    to: Bytes                       # current owner of POAP token
  )
```

```
3. Track Base URI
  trackPoapBaseURI(
    block: ethereum.Block,          # block, ethereum block
    baseURI: string,                # transaction hash
  )
```
