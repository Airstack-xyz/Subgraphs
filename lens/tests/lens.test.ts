import { Bytes, log } from '@graphprotocol/graph-ts'
import { assert, describe, test } from 'matchstick-as/assembly/index'
import { getDefaultProfileSet, getProfileCreatedEvent, getTransferEvent } from './utils'
import { profileCreated1, setDefault2, transfer3 } from './sample'
import { handleDefaultProfileSet, handleProfileCreated, handleTransfer } from '../src/mappings'

describe('Testing minting,setting default profile,transferring & automatic unsetting', () => {
  test('Testing minting,setting default profile,transferring & automatic unsetting', () => {
    let profileCreatedEvent = getProfileCreatedEvent(profileCreated1)

    handleProfileCreated(profileCreatedEvent)
    let defaultProfileSetEvent = getDefaultProfileSet(setDefault2)
    handleDefaultProfileSet(defaultProfileSetEvent)

    let transferEvent = getTransferEvent(transfer3)

    handleTransfer(transferEvent)
  })
})
