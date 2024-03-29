const schema = `
#
# --Airstack Schemas--

enum AirNetwork {
  ARBITRUM_ONE
  ARWEAVE_MAINNET
  AURORA
  AVALANCHE
  BOBA
  BSC # aka BNB Chain
  CELO
  COSMOS
  CRONOS
  MAINNET # Ethereum Mainnet
  FANTOM
  FUSE
  HARMONY
  JUNO
  MOONBEAM
  MOONRIVER
  NEAR_MAINNET
  OPTIMISM
  OSMOSIS
  matic # aka Polygon
  XDAI # aka Gnosis Chain
}

enum AirProtocolType {
  GENERIC
  EXCHANGE
  LENDING
  YIELD
  BRIDGE
  DAO
  NFT_MARKET_PLACE
  STAKING
  P2E #play to earn
  LAUNCHPAD
}

enum AirTokenStandardType {
  ERC1155
  ERC721
  ERC20
}

enum AirTokenUsageType {
  LP
  REWARD
  STAKE
  MINT
  GENERIC
}

enum AirProtocolActionType {
  ### NFT Marketplace/Tokens ###
  BUY
  SELL
  MINT
  BURN # TODO check this later
  ### NFT (ex: Poap) ###
  ATTEND

  ### P2E (NFT + Utility) ###
  EARN

  ### DEX ###
  SWAP
  ADD_LIQUIDITY
  REMOVE_LIQUIDITY
  ADD_TO_FARM
  REMOVE_FROM_FARM
  CLAIM_FARM_REWARD

  ### Lending ###
  LEND
  BORROW
  FLASH_LOAN

  ### Staking / Delegating ###
  STAKE
  RESTAKE
  UNSTAKE
  DELEGATE
  CLAIM_REWARDS
}

type AirExtraData @entity {
  id: ID!
  name: String!
  value: String!
}

interface AirEntityStats {
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

type AirDailyAggregateEntity implements AirEntityStats @entity {
  id: ID!
  network: AirNetwork!
  contract: AirContract!
  protocolType: AirProtocolType!
  protocolActionType: AirProtocolActionType!
  daySinceEpoch: BigInt!
  startDayTimestamp: BigInt!
  updatedTimestamp: BigInt!
  accounts: [AirDailyAggregateEntityAccount!]
    @derivedFrom(field: "dailyAggregatedEntity")
  stats: AirDailyAggregateEntityStats!
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  blockHeight: BigInt!
  extraData: [AirExtraData!]
}

type AirDailyAggregateEntityStats @entity {
  id: ID!
  protocolActionType: AirProtocolActionType!

  #### NFT Market Place
  # buyStats: AirNFTSaleStats
  # sellStats: AirNFTSaleStats
  # mintStats: AirNFTSaleStats
  # giftStats: AirNFTSaleStats

  ##### DEX #####
  addPoolLiquidityStats: AirLiquidityPoolStats
  removePoolLiquidityStats: AirLiquidityPoolStats
  farmPoolRewardStats: AirPoolFarmRewardStats
  swapStats: AirDEXSwapStats

  #### Bridge
  #transferStats: AirstackBridgeTransferStats

  ### Staking status
  #stakingStats: AirstackStakingStats
  #unstakingStats: AirstackUnStakingStats

  ### Lending/Borrowing
  #lendStats: AirstackLendStats
  #borrowStats: AirstackBorrowStats
  #flashLoanStats: AirstackFlashLoanStats

  ### DAO Stats
  #proposalStats: AirstackProposalStats

  ### P2E Stats
  #earnStats: AirstackEarnStats

  ### Social Network Dapps ###
}

type AirToken @entity {
  id: ID!
  address: String!
  standard: AirTokenStandardType!
  name: String
  symbol: String
  decimals: Int
  totalSupply: BigInt
}

#TODO check if this to be moved to NFT setction
type AirTokenMetadata @entity {
  id: ID!
  displayContentType: AirTokenDisplayType!
  displayContent: String
}

type AirDailyAggregateEntityAccount @entity {
  id: ID!
  account: AirAccount!
  dailyAggregatedEntity: AirDailyAggregateEntity!
  volumeInUSD: BigDecimal!
  index: BigInt! # incrementer for pagination purpose
}

type AirAccount @entity {
  id: ID!
  address: String!
  dailyAggregatedEntities: [AirDailyAggregateEntityAccount!]
    @derivedFrom(field: "account")
}

interface AirTokenStats implements AirEntityStats @entity {
  id: ID!
  #entityStat: AirEntityStats! # for reference
  token: AirToken!
  type: AirTokenUsageType!
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

type AirEntityDailyChangeStats @entity {
  id: ID!
  walletCountChangeInPercentage: BigDecimal!
  tokenCountChangeInPercentage: BigDecimal!
  transactionCountChangeInPercentage: BigDecimal!
  volumeInUSDChangeInPercentage: BigDecimal!
}

type AirContract @entity {
  id: ID!
  address: String!
}

type AirDEXPool @entity {
  id: ID!
  poolAddress: String!
  inputToken: [AirToken!]!
  tokenBalances:[BigInt!]!
  weightage: [BigDecimal!]!
  outputToken: AirToken!
  fee: BigInt!
}

type AirLiquidityPoolStats implements AirEntityStats @entity {
  id: ID!
  dexPool: AirDEXPool!
  # IMP: Please add the references carefully. This can be very specific in the actual implementation
  inputTokensStats: [AirLiquidityPoolInputTokenStats!]!
    @derivedFrom(field: "liquidityPoolStatsRef")
  outputTokenStats: [AirLiquidityPoolOutputTokenStats!]!
    @derivedFrom(field: "liquidityPoolStatsRef")
  transactions: [AirLiquidityPoolTransaction!]!
    @derivedFrom(field: "liquidityPoolStatsRef")
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

type AirLiquidityPoolInputTokenStats implements AirTokenStats @entity {
  id: ID!
  liquidityPoolStatsRef: AirLiquidityPoolStats! # for reference
  token: AirToken!
  type: AirTokenUsageType!
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

type AirLiquidityPoolOutputTokenStats implements AirTokenStats @entity {
  id: ID!
  liquidityPoolStatsRef: AirLiquidityPoolStats! # for reference
  token: AirToken!
  type: AirTokenUsageType!
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

type AirLiquidityPoolTransaction @entity {
  id: ID!
  dexPool: AirDEXPool!
  liquidityPoolStatsRef: AirLiquidityPoolStats! # for reference
  hash: String!
  inputTokenTransfers: [AirTokenTransfer!]!
  outputTokenTransfer: AirTokenTransfer!
}

type AirTokenTransfer @entity {
  id: ID!
  token: AirToken!
  from: AirAccount!
  to: AirAccount!
  amount: BigInt!
  fee: BigInt
}

type AirPoolFarmRewardStats implements AirEntityStats @entity {
  id: ID!
  dexPool: AirDEXPool!
  # IMP: Please add the references carefully. This can be very specific in the actual implementation
  inputTokenStats: [AirTokenStats!]
  outputTokensStats: [AirTokenStats!]
  transactions: [AirPoolFarmTransaction!]!
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

enum FarmTransactionType {
  STAKE
  UNSTAKE
  CLAIM
}

type AirPoolFarmTransaction @entity {
  id: ID!
  hash: String!
  type: FarmTransactionType!
  inputToken: AirToken
  outputToken: AirToken
  inputAmount: BigInt
  outputAmount: BigInt
}

type AirDEXSwapStats implements AirEntityStats @entity {
  id: ID!
  dexPool: AirDEXPool!
  inputTokensStats: [AirSwapInputTokenStats!]!
    @derivedFrom(field: "swapStatsRef")
  outputTokenStats: [AirSwapOutputTokenStats!]!
    @derivedFrom(field: "swapStatsRef")
  transactions: [AirDEXSwapTransaction!]! @derivedFrom(field: "swapStatsRef")
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

type AirSwapInputTokenStats implements AirTokenStats @entity {
  id: ID!
  swapStatsRef: AirDEXSwapStats! # for reference
  token: AirToken!
  type: AirTokenUsageType!
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

type AirSwapOutputTokenStats implements AirTokenStats @entity {
  id: ID!
  swapStatsRef: AirDEXSwapStats! # for reference
  token: AirToken!
  type: AirTokenUsageType!
  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

type AirDEXSwapTransaction @entity {
  id: ID!
  dexPool: AirDEXPool!
  swapStatsRef: AirDEXSwapStats! # for reference
  hash: String!
  inputTokenTransfer: AirTokenTransfer!
  outputTokenTransfer: AirTokenTransfer!
}

enum AirTokenDisplayType {
  IMAGE
  VIDEO
  AUDIO
  TEXT_IMAGE
  TEXT
}
enum AirNFTTransactionType {
  SALE
  MINT
  GIFT
}

type AirNFTSaleStats implements AirEntityStats @entity {
  id: ID!
  token: AirToken!
  # todo: Please check if the derived from can work here.
  transactions: [AirNFTSaleTransaction!]! @derivedFrom(field: "saleStat")

  walletCount: BigInt!
  tokenCount: BigInt!
  transactionCount: BigInt! # number of transactions (not unique)
  volumeInUSD: BigDecimal! # call price oracle and get the data and +
  dailyChange: AirEntityDailyChangeStats!
  extraData: [AirExtraData!]
}

type AirNFTSaleTransaction @entity {
  id: ID!
  hash: String!
  saleStat: AirNFTSaleStats!
  type: AirNFTTransactionType!
  to: AirAccount! #Buyer
  from: AirAccount! #Seller
  transactionToken: AirToken!
  paymentToken: AirToken
  tokenId: BigInt!
  paymentAmount: BigInt
  fees: BigInt
  tokenMetadata: AirTokenMetadata
}

type AirMeta @entity{
  id: ID!
  daySinceEpoch: BigInt!
  blockNumber: BigInt!
}
`;

export default schema;
