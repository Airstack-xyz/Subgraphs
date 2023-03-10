const schema = `#--Airstack Schemas--

enum AirProtocolType {
  SOCIAL
}

enum AirProtocolActionType {
  REGISTRATION
}

type AirBlock @entity {
 id: ID! #chainId-number
 hash: String!
 number: BigInt!
 timestamp: BigInt!
}

type AirMeta @entity {
  id: ID! # AIR_META
  network: String!
  schemaVersion: String!
  slug: String! #Farcaster
  name: String! # Farcaster V1
	version: String!
}

type AirEntityCounter @entity {
	id: ID! #AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER
	count: BigInt!
	createdAt: AirBlock! 
	lastUpdatedAt: AirBlock!
}

type AirAccount @entity {
  id: ID!
  address: String!
	createdAt: AirBlock!
}

type AirToken @entity {
  id: ID!
  address: String!
}

type AirExtra @entity {
  id: ID! #<chainId-dappUserId-homeUrl/recoveryAddress>
  name: String!
  value: String!
}

type AirUser @entity {
  id: ID! #<chainId>-<dappUserId>
  dappUserId: String!
  address: AirAccount!
  extras: [AirExtra!] #Store recovery address & home URLs
  profiles: [AirProfile!] @derivedFrom(field: "user")
  createdAt: AirBlock!
  lastUpdatedAt: AirBlock!
}

type AirProfile @entity {
  id: ID! #<chainId>-<dappUserId>-<name>
  name: String!
  tokenId: String!
  tokenAddress: AirToken!
  user: AirUser!
  extras: [AirExtra!] #Store tokenUri
  createdAt: AirBlock!
  lastUpdatedAt: AirBlock!
}

interface AirTransaction {
	id: ID! 
  from: AirAccount!
  logOrCallIndex: BigInt!
  to: AirAccount!
  transactionHash: String! 
  block: AirBlock!
  index: BigInt!
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #REGISTRATION
}

type AirUserRegisteredTransaction implements AirTransaction @entity {
  id: ID! #<chainId>-<dappUserId>-<address>
  address: AirAccount! #dappUserId owner address
  user: AirUser!
  profile: AirProfile! @derivedfrom(field: "user") #dappUserId profile
  name: String! #not available in txn, but being set from token transfer event name registry - make it mandatory
  extras: [AirExtra!] #Store recovery address & home URLs
  from: AirAccount! #keeping this as event.params.to address, is not available in the event data - 0x for mint
  to: AirAccount! #keeping this as contract address, is not available in the event data - owner address for mint/transfers
  tokenId: String!
  tokenAddress: AirToken!
  logOrCallIndex: BigInt!
  transactionHash: String!
  block: AirBlock!
  index: BigInt! #entity counter
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #REGISTRATION
}
`;

export default schema;