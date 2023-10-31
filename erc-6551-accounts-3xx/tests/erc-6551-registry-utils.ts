import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { AccountCreated } from "../generated/ERC6551Registry/ERC6551Registry"

export function createAccountCreatedEvent(
  account: Address,
  implementation: Address,
  chainId: BigInt,
  tokenContract: Address,
  tokenId: BigInt,
  salt: BigInt
): AccountCreated {
  let accountCreatedEvent = changetype<AccountCreated>(newMockEvent())

  accountCreatedEvent.parameters = new Array()

  accountCreatedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  accountCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )
  accountCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  accountCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenContract",
      ethereum.Value.fromAddress(tokenContract)
    )
  )
  accountCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  accountCreatedEvent.parameters.push(
    new ethereum.EventParam("salt", ethereum.Value.fromUnsignedBigInt(salt))
  )

  return accountCreatedEvent
}
