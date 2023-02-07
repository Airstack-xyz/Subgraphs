const schema = `
#
# --Airstack Schemas--
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
	id: ID! #AIR_DAILY_STATS_ACCOUNT - confirm that once - AIR_USER_REGISTERED_TRANSACTION_ENTITY_COUNTER
	count: BigInt!
	createdAt: AirBlock! 
	lastUpdatedAt: AirBlock!
}

type AirAccount @entity {
  id: ID!
  address: String!
	createdAt: AirBlock!
}

type AirExtraData @entity {
  id: ID! #<chainId-dappUserId-homeUrl/recoveryAddress>
  name: String!
  value: String!
  user: AirUser!
}

type AirUser @entity {
 id: ID! #<chainId>-<dappUserId>
 address: AirAccount!
 extras: [AirExtraData!] @derivedFrom(field: "user") #Store recovery address & home URLs
 profiles: [AirProfile!] @derivedFrom(field: "user")
 createdAt: AirBlock!
}

type AirProfile @entity {
  id: ID! #<chainId>-<dappUserId>-<name>
  name: String!
  # should we store from address here? - can get it from name registry transfer event
  user: AirUser!
  extras: [AirExtraData!] #Store tokenUri
  createdAt: AirBlock!
}

interface AirTransaction {
	id: ID! 
  from: AirAccount!
  logOrCallIndex: BigInt!
  to: AirAccount!
  hash: String! 
  block: AirBlock!
  index: BigInt!
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #REGISTRATION
}

type AirUserRegisteredTransaction implements AirTransaction @entity {
  id: ID! #<chainId>-<dappUserId>-<txnHash>-<logOrCallIndex>
  address: AirAccount! #dappUserId owner address
  user: AirUser!
  # profile: AirProfile! @derivedfrom(field: "user") - moved to air user, cannot create a profile in user registered transaction, it will be a part of air user entity
  name: String #not available in txn, but being set from token transfer event name registry
  extras: [AirExtraData!] #Store recovery address & home URLs
  from: AirAccount! #keeping this as event.params.to address, is not available in the event data
  to: AirAccount! #keeping this as contract address, is not available in the event data
  logOrCallIndex: BigInt!
  hash: String! #txn hash
  block: AirBlock!
  index: BigInt! #entity counter
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #REGISTRATION
}
`;

export default schema;
