import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AdminChanged,
  BeaconUpgraded,
  Closed,
  Initialized,
  NewBlockRange,
  NewExecutionDelegate,
  NewFeeRate,
  NewFeeRecipient,
  NewGovernor,
  NewOracle,
  NewPolicyManager,
  NonceIncremented,
  Opened,
  OrderCancelled,
  OrdersMatched,
  OwnershipTransferred,
  Upgraded
} from "../generated/BlurExchange/BlurExchange"

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address
): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = new Array()

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin)
    )
  )
  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminChangedEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = new Array()

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon))
  )

  return beaconUpgradedEvent
}

export function createClosedEvent(): Closed {
  let closedEvent = changetype<Closed>(newMockEvent())

  closedEvent.parameters = new Array()

  return closedEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createNewBlockRangeEvent(blockRange: BigInt): NewBlockRange {
  let newBlockRangeEvent = changetype<NewBlockRange>(newMockEvent())

  newBlockRangeEvent.parameters = new Array()

  newBlockRangeEvent.parameters.push(
    new ethereum.EventParam(
      "blockRange",
      ethereum.Value.fromUnsignedBigInt(blockRange)
    )
  )

  return newBlockRangeEvent
}

export function createNewExecutionDelegateEvent(
  executionDelegate: Address
): NewExecutionDelegate {
  let newExecutionDelegateEvent = changetype<NewExecutionDelegate>(
    newMockEvent()
  )

  newExecutionDelegateEvent.parameters = new Array()

  newExecutionDelegateEvent.parameters.push(
    new ethereum.EventParam(
      "executionDelegate",
      ethereum.Value.fromAddress(executionDelegate)
    )
  )

  return newExecutionDelegateEvent
}

export function createNewFeeRateEvent(feeRate: BigInt): NewFeeRate {
  let newFeeRateEvent = changetype<NewFeeRate>(newMockEvent())

  newFeeRateEvent.parameters = new Array()

  newFeeRateEvent.parameters.push(
    new ethereum.EventParam(
      "feeRate",
      ethereum.Value.fromUnsignedBigInt(feeRate)
    )
  )

  return newFeeRateEvent
}

export function createNewFeeRecipientEvent(
  feeRecipient: Address
): NewFeeRecipient {
  let newFeeRecipientEvent = changetype<NewFeeRecipient>(newMockEvent())

  newFeeRecipientEvent.parameters = new Array()

  newFeeRecipientEvent.parameters.push(
    new ethereum.EventParam(
      "feeRecipient",
      ethereum.Value.fromAddress(feeRecipient)
    )
  )

  return newFeeRecipientEvent
}

export function createNewGovernorEvent(governor: Address): NewGovernor {
  let newGovernorEvent = changetype<NewGovernor>(newMockEvent())

  newGovernorEvent.parameters = new Array()

  newGovernorEvent.parameters.push(
    new ethereum.EventParam("governor", ethereum.Value.fromAddress(governor))
  )

  return newGovernorEvent
}

export function createNewOracleEvent(oracle: Address): NewOracle {
  let newOracleEvent = changetype<NewOracle>(newMockEvent())

  newOracleEvent.parameters = new Array()

  newOracleEvent.parameters.push(
    new ethereum.EventParam("oracle", ethereum.Value.fromAddress(oracle))
  )

  return newOracleEvent
}

export function createNewPolicyManagerEvent(
  policyManager: Address
): NewPolicyManager {
  let newPolicyManagerEvent = changetype<NewPolicyManager>(newMockEvent())

  newPolicyManagerEvent.parameters = new Array()

  newPolicyManagerEvent.parameters.push(
    new ethereum.EventParam(
      "policyManager",
      ethereum.Value.fromAddress(policyManager)
    )
  )

  return newPolicyManagerEvent
}

export function createNonceIncrementedEvent(
  trader: Address,
  newNonce: BigInt
): NonceIncremented {
  let nonceIncrementedEvent = changetype<NonceIncremented>(newMockEvent())

  nonceIncrementedEvent.parameters = new Array()

  nonceIncrementedEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  nonceIncrementedEvent.parameters.push(
    new ethereum.EventParam(
      "newNonce",
      ethereum.Value.fromUnsignedBigInt(newNonce)
    )
  )

  return nonceIncrementedEvent
}

export function createOpenedEvent(): Opened {
  let openedEvent = changetype<Opened>(newMockEvent())

  openedEvent.parameters = new Array()

  return openedEvent
}

export function createOrderCancelledEvent(hash: Bytes): OrderCancelled {
  let orderCancelledEvent = changetype<OrderCancelled>(newMockEvent())

  orderCancelledEvent.parameters = new Array()

  orderCancelledEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )

  return orderCancelledEvent
}

export function createOrdersMatchedEvent(
  maker: Address,
  taker: Address,
  sell: ethereum.Tuple,
  sellHash: Bytes,
  buy: ethereum.Tuple,
  buyHash: Bytes
): OrdersMatched {
  let ordersMatchedEvent = changetype<OrdersMatched>(newMockEvent())

  ordersMatchedEvent.parameters = new Array()

  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("sell", ethereum.Value.fromTuple(sell))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("sellHash", ethereum.Value.fromFixedBytes(sellHash))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("buy", ethereum.Value.fromTuple(buy))
  )
  ordersMatchedEvent.parameters.push(
    new ethereum.EventParam("buyHash", ethereum.Value.fromFixedBytes(buyHash))
  )

  return ordersMatchedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}
