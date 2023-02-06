import {
  CancelRecovery as CancelRecoveryEvent,
  ChangeHome as ChangeHomeEvent,
  ChangeRecoveryAddress as ChangeRecoveryAddressEvent,
  ChangeTrustedCaller as ChangeTrustedCallerEvent,
  DisableTrustedOnly as DisableTrustedOnlyEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Register as RegisterEvent,
  RequestRecovery as RequestRecoveryEvent,
  Transfer as TransferEvent
} from "../generated/FarcasteIdRegistry/FarcasteIdRegistry"
import {
  CancelRecovery,
  ChangeHome,
  ChangeRecoveryAddress,
  ChangeTrustedCaller,
  DisableTrustedOnly,
  OwnershipTransferred,
  Register,
  RequestRecovery,
  Transfer
} from "../generated/schema"

export function handleCancelRecovery(event: CancelRecoveryEvent): void {
  let entity = new CancelRecovery(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.by = event.params.by
  entity.id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangeHome(event: ChangeHomeEvent): void {
  let entity = new ChangeHome(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.id = event.params.id
  entity.url = event.params.url

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangeRecoveryAddress(
  event: ChangeRecoveryAddressEvent
): void {
  let entity = new ChangeRecoveryAddress(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.id = event.params.id
  entity.recovery = event.params.recovery

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangeTrustedCaller(
  event: ChangeTrustedCallerEvent
): void {
  let entity = new ChangeTrustedCaller(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.trustedCaller = event.params.trustedCaller

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDisableTrustedOnly(event: DisableTrustedOnlyEvent): void {
  let entity = new DisableTrustedOnly(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRegister(event: RegisterEvent): void {
  let entity = new Register(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.id = event.params.id
  entity.recovery = event.params.recovery
  entity.url = event.params.url

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestRecovery(event: RequestRecoveryEvent): void {
  let entity = new RequestRecovery(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
