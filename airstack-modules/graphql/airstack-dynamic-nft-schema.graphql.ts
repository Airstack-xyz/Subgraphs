const schema = `#--Airstack Schemas--

enum AirProtocolType {
    DYNAMIC_NFT
}

enum AirProtocolActionType {
    UPDATE
}

enum AirTokenStandardType {
    ERC1155
    ERC721
    ERC20
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
    id: ID!
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

type AirNftTokenURIUpdateTransaction implements AirTransaction @entity {
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

type AirNFT @entity {
    id: ID!
    tokenId: String!
    tokenAddress: AirToken!
    tokenStandard: AirTokenStandardType!
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
