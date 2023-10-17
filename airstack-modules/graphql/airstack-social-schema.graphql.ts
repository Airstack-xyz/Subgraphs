const schema = `#--Airstack Schemas--

enum AirProtocolType {
  SOCIAL
}

enum AirProtocolActionType {
  SOCIAL_REGISTRATION
  SOCIAL_PROFILE_OWNERSHIP_CHANGE
  SOCIAL_USER_OWNERSHIP_CHANGE
  SOCIAL_PROFILE_NAME_RENEWAL
  SOCIAL_PROFILE_RECOVERY_ADDRESS_CHANGE
  SOCIAL_USER_HOME_URL_CHANGE
  SOCIAL_USER_RECOVERY_ADDRESS_CHANGE
  SOCIAL_USER_DEFAULT_PROFILE_CHANGE
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
  id: ID! #<parentEntityId(chainId-socialUserId/chainId-tokenAddress-tokenId)-userHomeUrl/userRecoveryAddress/profileRecoveryAddress>
  name: String!
  value: String!
}

type AirSocialUser @entity {
  id: ID! #<chainId>-<socialUserId>
  socialUserId: String!
  address: AirAccount!
  extras: [AirExtra!] #Store recovery address & home URLs
  profiles: [AirSocialProfile!] 
  defaultProfile: AirSocialProfile # Store default Profile 
  createdAt: AirBlock!
  lastUpdatedIndex: BigInt!
  lastUpdatedAt: AirBlock!
}

type AirSocialProfile @entity {
  id: ID! #<chainId>-<tokenAddress>-<tokenId>
  name: String!
  tokenId: String!
  expiryTimestamp: BigInt!
  renewalCost: BigInt
  tokenAddress: AirToken!
  user: AirSocialUser!
  handle: AirSocialProfileHandle
  isDefault: Boolean!
  extras: [AirExtra!] #Store tokenUri
  metadataURI: String
  imageURI: String
  createdAt: AirBlock!
  lastUpdatedIndex: BigInt!
  lastUpdatedAt: AirBlock!
}

type AirSocialProfileHandle @entity {
  id: ID!
  name: String!
  namespace: String
  owner: AirAccount!
  tokenAddress: AirToken!
  tokenId: String!
  profile: AirSocialProfile
  extras: [AirExtra!] #Store tokenUri
  createdAt: AirBlock!
  lastUpdatedIndex: BigInt!
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

type AirSocialUserRegisteredTransaction implements AirTransaction @entity {
  id: ID! #<chainId>-<socialUserId>-<address>
  address: AirAccount! #socialUserId owner address
  user: AirSocialUser!
  profile: AirSocialProfile! @derivedfrom(field: "user") #socialUserId profile
  name: String! #not available in txn, but being set from token transfer event name registry - make it mandatory
  extras: [AirExtra!] #Store recovery address & home URLs
  profileExpiryTimestamp: BigInt!
  from: AirAccount! #keeping this as event.params.to address, is not available in the event data - 0x for mint
  to: AirAccount! #keeping this as contract address, is not available in the event data - owner address for mint/transfers
  tokenId: String!
  tokenAddress: AirToken!
  logOrCallIndex: BigInt!
  transactionHash: String!
  block: AirBlock!
  index: BigInt! #entity counter
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #SOCIAL_REGISTRATION
}

type AirSocialProfileOwnershipChangeTransaction implements AirTransaction @entity {
  id: ID! #<transactionHash-logOrCallIndex-tokenId>
  profileName: String!
  profile: AirSocialProfile!
  tokenId: String!
  tokenAddress: AirToken!
  from: AirAccount!
  to: AirAccount!
  transactionHash: String! 
  logOrCallIndex: BigInt!
  block: AirBlock!
  index: BigInt!
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #SOCIAL_PROFILE_OWNERSHIP_CHANGE
}

type AirSocialUserOwnershipChangeTransaction implements AirTransaction @entity {
  id: ID! #<transactionHash-logOrCallIndex-tokenId>
  socialUserId: String!
  tokenId: String!
  tokenAddress: AirToken!
  user: AirSocialUser!
  from: AirAccount!
  to: AirAccount!
  transactionHash: String! 
  logOrCallIndex: BigInt!
  block: AirBlock!
  index: BigInt!
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #SOCIAL_USER_OWNERSHIP_CHANGE
}

type AirSocialProfileRenewalTransaction implements AirTransaction @entity {
  id: ID! #<transactionHash>-<logOrCallIndex>-<tokenId>-<expiryTimestamp>
  expiryTimestamp: BigInt!
  renewalCost: BigInt!
  profile: AirSocialProfile!
  tokenId: String!
  tokenAddress: AirToken!
  from: AirAccount!
  to: AirAccount!
  transactionHash: String! 
  logOrCallIndex: BigInt!
  block: AirBlock!
  index: BigInt!
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #SOCIAL_PROFILE_NAME_RENEWAL
}

type AirSocialProfileRecoveryAddressChangeTransaction implements AirTransaction @entity {
  id: ID! #<transactionHash-logOrCallIndex-tokenId>
  oldRecoveryAddress: AirAccount
  newRecoveryAddress: AirAccount!
  profile: AirSocialProfile!
  tokenId: String!
  tokenAddress: AirToken!
  from: AirAccount!
  to: AirAccount!
  transactionHash: String! 
  logOrCallIndex: BigInt!
  block: AirBlock!
  index: BigInt!
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #SOCIAL_PROFILE_RECOVERY_ADDRESS_CHANGE
}

type AirSocialUserHomeUrlChangeTransaction implements AirTransaction @entity {
  id: ID! #<transactionHash-logOrCallIndex-tokenId>
  oldHomeUrl: String
  newHomeUrl: String!
  user: AirSocialUser!
  tokenId: String!
  tokenAddress: AirToken!
  from: AirAccount!
  to: AirAccount!
  transactionHash: String! 
  logOrCallIndex: BigInt!
  block: AirBlock!
  index: BigInt!
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #SOCIAL_USER_HOME_URL_CHANGE
}

type AirSocialUserRecoveryAddressChangeTransaction implements AirTransaction @entity {
  id: ID! #<transactionHash-logOrCallIndex-tokenId>
  oldRecoveryAddress: AirAccount
  newRecoveryAddress: AirAccount!
  user: AirSocialUser!
  tokenId: String!
  tokenAddress: AirToken!
  from: AirAccount!
  to: AirAccount!
  transactionHash: String! 
  logOrCallIndex: BigInt!
  block: AirBlock!
  index: BigInt!
  protocolType: AirProtocolType!  #SOCIAL
  protocolActionType: AirProtocolActionType!  #SOCIAL_USER_RECOVERY_ADDRESS_CHANGE
}

type AirSocialUserDefaultProfileChangeTransaction implements AirTransaction
  @entity {
  id: ID! #<transactionHash-logOrCallIndex-user.Id>
  oldDefaultProfile: AirSocialProfile
  newDefaultProfile: AirSocialProfile
  user: AirSocialUser!
  from: AirAccount!
  to: AirAccount!
  transactionHash: String!
  logOrCallIndex: BigInt!
  block: AirBlock!
  index: BigInt!
  protocolType: AirProtocolType! #SOCIAL
  protocolActionType: AirProtocolActionType! #SOCIAL_USER_DEFAULT_PROFILE_CHANGE
}
`

export default schema
