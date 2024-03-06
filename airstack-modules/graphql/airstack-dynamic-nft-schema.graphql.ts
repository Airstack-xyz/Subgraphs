const schema = `#--Airstack Schemas--

enum AirProtocolType {
    DYNAMIC_NFT
}

enum AirProtocolActionType {
    UPDATE
}

type AirBlock @entity {
    id: ID! #chain-number
    hash: String!
    number: BigInt!
    timestamp: BigInt!
}

type AirMeta @entity {
    id: ID! # air_meta
    network: String!
    schemaVersion: String!
    slug: String! # POAP ??
    name: String! # POAP
    version: String!
}

type AirToken @entity {
    id: ID!
    address: String!
}


type AirEntityCounter @entity {
    id: ID! #AIR_DYNAMIC_NFT_UPDATE_LAST_UPDATED_INDEX
    count: BigInt!
    createdAt: AirBlock!
    lastUpdatedAt: AirBlock!
}

interface AirTransaction {
    id: ID! 
    logOrCallIndex: BigInt!
    transactionHash: String! 
    block: AirBlock!
    index: BigInt!
    protocolType: AirProtocolType!  #SOCIAL
    protocolActionType: AirProtocolActionType!  #REGISTRATION
}

type AirDynamicNftUpdateTransaction implements AirTransaction @entity {
    id: ID! #<chainId>-<transactionHash>-<logOrCallIndex>
    nft: AirDynamicNFT!
    tokenId: String!
    tokenAddress: AirToken!
    logOrCallIndex: BigInt!
    transactionHash: String!
    block: AirBlock!
    index: BigInt! #entity counter
    protocolType: AirProtocolType!  #SOCIAL
    protocolActionType: AirProtocolActionType!  #SOCIAL_REGISTRATION
  }

type AirDynamicNFT @entity {
    id: ID!
    tokenId: String!
    tokenAddress: AirToken!
    createdAt: AirBlock!
    lastUpdatedAt: AirBlock!
    lastUpdatedIndex: BigInt! # gets updated on each update
}

type AirAccount @entity {
    id: ID!
    address: String!
    createdAt: AirBlock!
  }  
`

export default schema
