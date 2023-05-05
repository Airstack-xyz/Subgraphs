import { Address, Bytes, BigInt, log, ethereum } from '@graphprotocol/graph-ts'
import { ProfileCreated, Transfer, DefaultProfileSet } from '../generated/LensHub/LensHub'
import { newMockEvent } from 'matchstick-as'
//  -------------- EVENT  --------------
// event ProfileCreated(
//     uint256 indexed profileId,
//     address indexed creator,
//     address indexed to,
//     string handle,
//     string imageURI,
//     address followModule,
//     bytes followModuleReturnData,
//     string followNFTURI,
//     uint256 timestamp
// );
export class ProfileCreatedInput {
  txHash: string
  profileId: string
  creator: string
  to: string
  handle: string
  imageURI: string
  followModule: string
  followModuleReturnData: string
  followNFTURI: string
  timestamp: string
}

export function getProfileCreatedEvent(input: ProfileCreatedInput): ProfileCreated {
  //   preparing event params
  let profileId = new ethereum.EventParam(
    'profileId',
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(input.profileId)),
  )
  let creator = new ethereum.EventParam('creator', ethereum.Value.fromAddress(Address.fromString(input.creator)))
  let to = new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(input.to)))
  let handle = new ethereum.EventParam('handle', ethereum.Value.fromString(input.handle))
  let imageURI = new ethereum.EventParam('imageURI', ethereum.Value.fromString(input.imageURI))
  let followModule = new ethereum.EventParam(
    'followModule',
    ethereum.Value.fromAddress(Address.fromString(input.followModule)),
  )

  let followModuleReturnData = new ethereum.EventParam(
    'followModuleReturnData',
    ethereum.Value.fromBytes(Bytes.fromHexString(input.followModuleReturnData)),
  )
  let followNFTURI = new ethereum.EventParam('followNFTURI', ethereum.Value.fromString(input.followNFTURI))
  let timestamp = new ethereum.EventParam(
    'timestamp',
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(input.timestamp)),
  )
  //   initializing event variable
  let profileCreatedEvent = changetype<ProfileCreated>(newMockEvent())
  //   add parameteres as array
  profileCreatedEvent.parameters = [
    profileId,
    creator,
    to,
    handle,
    imageURI,
    followModule,
    followModuleReturnData,
    followNFTURI,
    timestamp,
  ]
  profileCreatedEvent.transaction.hash = Bytes.fromHexString(input.txHash)

  return profileCreatedEvent
}

//  -------------- EVENT  --------------
// event Transfer(
//     address from,
//     address to,
//     uint256 tokenId,
// );
export class TransferInput {
  txHash: string
  from: string
  to: string
  tokenId: string
}
export function getTransferEvent(input: TransferInput): Transfer {
  let from = new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.fromString(input.from)))
  let to = new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(input.to)))
  let tokenId = new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(BigInt.fromString(input.tokenId)))
  //   initializing event variable
  let transferEvent = changetype<Transfer>(newMockEvent())
  //   add parameteres as array
  transferEvent.parameters = [from, to, tokenId]
  transferEvent.transaction.hash = Bytes.fromHexString(input.txHash)
  return transferEvent
}
//  -------------- EVENT  --------------
// event DefaultProfileSet(
//    address indexed wallet,
//    uint256 indexed profileId,
//    uint256 timestamp
// )
export class DefaultProfileSetInput {
  txHash: string
  wallet: string
  profileId: string
  timestamp: string
}

export function getDefaultProfileSet(input: DefaultProfileSetInput): DefaultProfileSet {
  let wallet = new ethereum.EventParam('wallet', ethereum.Value.fromAddress(Address.fromString(input.wallet)))
  let profileId = new ethereum.EventParam(
    'profileId',
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(input.profileId)),
  )
  let timestamp = new ethereum.EventParam(
    'timestamp',
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(input.timestamp)),
  )
  //   initializing event variable
  let defaultProfileSetEvent = changetype<DefaultProfileSet>(newMockEvent())
  //   add parameteres as array
  defaultProfileSetEvent.parameters = [wallet, profileId, timestamp]
  defaultProfileSetEvent.transaction.hash = Bytes.fromHexString(input.txHash)
  return defaultProfileSetEvent
}
