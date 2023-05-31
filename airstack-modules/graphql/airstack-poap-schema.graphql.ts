const schema = `#--Airstack Schemas--

enum AirProtocolType {
    POAP
}

enum AirProtocolActionType {
    MINT
    TRANSFER
}

type AirBlock @entity {
    id: ID! #chain-number
    hash: String!
    number: BigInt!
    timestamp: BigInt!
}
type AirToken @entity {
    id: ID!
    address: String!
}

type AirMeta @entity {
    id: ID! # air_meta
    network: String!
    schemaVersion: String!
    slug: String! # POAP ??
    name: String! # POAP
    version: String!
}
type AirAccount @entity {
    id: ID!
    address: String!
    createdAt: AirBlock!
}

type AirEntityCounter @entity {
    id: ID! #AIR_POAP_EVENT_ATTENDEE_LAST_UPDATED_INDEX
    count: BigInt!
    createdAt: AirBlock!
    lastUpdatedAt: AirBlock!
}

type AirPoapEvent @entity {
    id: ID!
    eventAttendee: [AirPoapEventAttendee!]! @derivedFrom(field: "event")
    createdAt: AirBlock!
    updatedAt: AirBlock!
    transferCount: BigInt!
    tokenMints: BigInt!
    lastUpdatedIndex: BigInt!
}

type AirPoapAttendee @entity {
    id: ID!
    address: AirAccount!
    createdAt: AirBlock!
    updatedAt: AirBlock!
    eventAttendee: [AirPoapEventAttendee!]! @derivedFrom(field: "owner")
    tokensOwned: BigInt!
    lastUpdatedIndex: BigInt!
}

type AirPoapEventAttendee @entity {
    id: ID!
    tokenId: String!
    tokenAddress: AirToken!
    owner: AirPoapAttendee!
    event: AirPoapEvent!
    mint: AirPoapMintTransaction! @derivedFrom(field: "eventAttendee")
    transfers: [AirPoapTransferTransaction!]! @derivedFrom(field: "eventAttendee")
    transferCount: BigInt!
    createdAt: AirBlock!
    updatedAt: AirBlock!
    mintOrder: BigInt!
    lastUpdatedIndex: BigInt! # gets updated on transfer or mint
}

type AirPoapMintTransaction @entity {
    id: ID!
    block: AirBlock!
    hash: String!
    lastUpdatedIndex: BigInt!
    protocolType: AirProtocolType! #POAP
    protocolActionType: AirProtocolActionType! #MINT
    eventAttendee: AirPoapEventAttendee!
    attendee: AirPoapAttendee!
}

type AirPoapTransferTransaction @entity {
    id: ID!
    block: AirBlock!
    hash: String!
    lastUpdatedIndex: BigInt!
    eventAttendee: AirPoapEventAttendee!
    from: AirPoapAttendee!
    to: AirPoapAttendee!
    protocolType: AirProtocolType! #POAP
    protocolActionType: AirProtocolActionType! #TRANSFER
}

type AirDataUpdate @entity {
    id: ID! # "BASE_URI"
    type: String!
    value: String!
    createdAt: AirBlock!
    updatedAt: AirBlock!
    lastUpdatedIndex: BigInt! # gets updated setBaseUri call
}
`

export default schema
