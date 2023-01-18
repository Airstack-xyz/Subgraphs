const schema = `
#
# --Airstack Schemas--

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
  slug: String! #Opensea_V1
  name: String! # Opeasea V1
	version: String!
}

type AirEntityCounter @entity {
	id: ID! #AIR_DAILY_STATS_ACCOUNT
	count: BigInt!
	createdAt: AirBlock! 
	lastUpdatedAt: AirBlock!
}

type AirAccount @entity {
  id: ID!
  address: String!
	createdAt: AirBlock! 
}

type Domain @entity {
  id: ID!                                               # The namehash of the name
  name: String                                          # The human readable name, if known. Unknown portions replaced with hash in square brackets (eg, foo.[1234].eth)
  labelName: String                                     # The human readable label name (imported from CSV), if known
  labelhash: Bytes                                      # keccak256(labelName)
  tokenId: String!                                      # dec(labelHash)
  parent: Domain                                        # The namehash (id) of the parent name
  subdomains: [Domain!]! @derivedFrom(field: "parent")  # Can count domains from length of array
  subdomainCount: Int!                                  # The number of subdomains
  resolvedAddress: AirAccount                           # Address logged from current resolver, if any
  owner: AirAccount!
  # resolver: Resolver
  ttl: BigInt
  isPrimary: Boolean! #- NA
  createdAt: AirBlock!
	lastBlockNumber: AirBlock! #- NA
}

interface AirDomainEvent {
  blockNumber: AirBlock!
  transactionHash: String!
  tokenId: String! # dec(labelhash) - NA
  domain: Domain!
  index: BigInt! # - NA
}

type AirDomainTransferTransaction implements AirDomainEvent @entity {
  id: ID!
  from: AirAccount! # - NA
  to: AirAccount! # - NA
  blockNumber: AirBlock!
  transactionHash: String!
  tokenId: String! # dec(labelhash)  # - NA
  domain: Domain!
  index: BigInt! # - NA
}
# what is the diff b/w transfer and domain owner changed
type AirDomainOwnerChangedTransaction implements AirDomainEvent @entity {
  id: ID!
  previousOwner: AirAccount! # - NA
  newOwner: AirAccount! # - owner
  blockNumber: AirBlock!
  transactionHash: String!
  tokenId: String! # dec(labelhash)  # - NA
  domain: Domain!
  index: BigInt! # - NA
}

type AirDomainNewResolverTransaction implements AirDomainEvent @entity {
  id: ID!
  previousResolver: AirAccount! # - NA
  newOwnerResolver: AirAccount! # - resolver
  blockNumber: AirBlock!
  transactionHash: String!
  tokenId: String! # dec(labelhash)  # - NA
  domain: Domain!
  index: BigInt! # - NA
}

type AirDomainNewTTLTransaction implements AirDomainEvent @entity {
  id: ID!
  oldTTL: BigInt! # - NA
  newTTL: BigInt! # - ttl
  blockNumber: AirBlock!
  transactionHash: String!
  tokenId: String! # dec(labelhash)  # - NA
  domain: Domain!
  index: BigInt! # - NA
}

interface AirDomainRegistration  {
  cost: BigInt!
  paymentToken: AirAccount!
  registrant: AirAccount!
  expiryBlock: AirBlock!
  registrationBlock: AirBlock!
}

type AirNameRegisteredTransaction implements AirDomainEvent & AirDomainRegistration @entity {
  id: ID!
  blockNumber: AirBlock!
  transactionHash: String!
  tokenId: String! # dec(labelhash)  # - NA
  domain: Domain!
  index: BigInt! # - NA
  cost: BigInt!
  paymentToken: AirAccount! # - NA
  registrant: AirAccount!
  expiryBlock: AirBlock! # - expiryDate
  registrationBlock: AirBlock! # - blockNumber
}

type AirNameRenewedTransaction implements AirDomainEvent & AirDomainRegistration @entity {
	id: ID!
  blockNumber: AirBlock!
  transactionHash: String!
  tokenId: String! # dec(labelhash)  # - NA
  domain: Domain!
  index: BigInt! # - NA
  cost: BigInt!
  paymentToken: AirAccount! # - NA
  registrant: AirAccount!
  expiryBlock: AirBlock! # - expiryDate
  registrationBlock: AirBlock! # - blockNumber
}
#where is this coming from? NameChanged?
type AirPrimaryDomainTransaction implements AirDomainEvent @entity {
  id: ID!
  resolverAddress: String! #make sure toremove the old primary ens if changed
  blockNumber: AirBlock!
  transactionHash: String!
  tokenId: String! # dec(labelhash) # - NA
  domain: Domain! # - name
  index: BigInt! # - NA
}
`

export default schema;