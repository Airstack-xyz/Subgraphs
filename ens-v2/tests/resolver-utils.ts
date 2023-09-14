import { Address, Bytes, ethereum, BigInt, log } from "@graphprotocol/graph-ts"
import {
  AddrChanged,
  AddressChanged,
  TextChanged,
  TextChanged1,
} from "../generated/templates/ResolverTemplate/Resolver"
import { newMockEvent } from "matchstick-as"
//  -------------- AddrChanged  --------------
// event AddrChanged(bytes32 indexed node, address a);

export class AddrChangedInput {
  resolverAddress: string
  hash: string
  node: string
  a: string
}

export function getAddrChangedEvent(input: AddrChangedInput): AddrChanged {
  // preparing event params
  let node = new ethereum.EventParam(
    "node",
    ethereum.Value.fromBytes(Bytes.fromHexString(input.node))
  )
  let a = new ethereum.EventParam(
    "a",
    ethereum.Value.fromAddress(Address.fromString(input.a))
  )
  // initializing event variable
  let addrChanged = changetype<AddrChanged>(newMockEvent())
  // add parameteres as array
  addrChanged.parameters = [node, a]
  addrChanged.transaction.hash = Bytes.fromHexString(input.hash)
  addrChanged.address = Address.fromString(input.resolverAddress)
  return addrChanged
}

//  -------------- AddressChanged  --------------
// AddressChanged (index_topic_1 bytes32 node, uint256 coinType, bytes newAddress)

export class AddressChangedInput {
  resolverAddress: string
  hash: string
  node: string
  coinType: string
  newAddress: string
}

export function getAddressChangedEvent(
  input: AddressChangedInput
): AddressChanged {
  // preparing event params
  let node = new ethereum.EventParam(
    "node",
    ethereum.Value.fromBytes(Bytes.fromHexString(input.node))
  )

  let coinType = new ethereum.EventParam(
    "coinType",
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(input.coinType))
  )

  let newAddress = new ethereum.EventParam(
    "newAddress",
    ethereum.Value.fromBytes(Bytes.fromHexString(input.newAddress))
  )

  // initializing event variable
  let addressChanged = changetype<AddressChanged>(newMockEvent())
  // add parameteres as array
  addressChanged.parameters = [node, coinType, newAddress]
  addressChanged.transaction.hash = Bytes.fromHexString(input.hash)
  addressChanged.address = Address.fromString(input.resolverAddress)
  return addressChanged
}

//  -------------- TextChanged  --------------
// TextChanged (index_topic_1 bytes32 node, index_topic_2 string indexedKey, string key)

export class TextChangedInput {
  resolverAddress: string
  hash: string
  node: string
  indexedKey: string
  key: string
}

export function getTextChangedEvent(input: TextChangedInput): TextChanged {
  // preparing event params
  let node = new ethereum.EventParam(
    "node",
    ethereum.Value.fromBytes(Bytes.fromHexString(input.node))
  )
  let indexedKey = new ethereum.EventParam(
    "indexedKey",
    ethereum.Value.fromString(input.indexedKey)
  )
  let key = new ethereum.EventParam("key", ethereum.Value.fromString(input.key))
  // initializing event variable
  let textChanged = changetype<TextChanged>(newMockEvent())
  // add parameteres as array
  textChanged.parameters = [node, indexedKey, key]
  textChanged.transaction.hash = Bytes.fromHexString(input.hash)
  textChanged.address = Address.fromString(input.resolverAddress)
  return textChanged
}

//  -------------- TextChanged  --------------
// TextChanged (index_topic_1 bytes32 node, index_topic_2 string indexedKey, string key, string value)
export class TextChangedWithValueInput {
  resolverAddress: string
  hash: string
  node: string
  indexedKey: string
  key: string
  value: string
}

export function getTextChangedWithValueEvent(
  input: TextChangedWithValueInput
): TextChanged1 {
  // preparing event params
  let node = new ethereum.EventParam(
    "node",
    ethereum.Value.fromBytes(Bytes.fromHexString(input.node))
  )
  let indexedKey = new ethereum.EventParam(
    "indexedKey",
    ethereum.Value.fromString(input.indexedKey)
  )
  let key = new ethereum.EventParam("key", ethereum.Value.fromString(input.key))
  let value = new ethereum.EventParam(
    "value",
    ethereum.Value.fromString(input.value)
  )
  // initializing event variable
  let textChangedWithValue = changetype<TextChanged1>(newMockEvent())
  // add parameteres as array
  textChangedWithValue.parameters = [node, indexedKey, key, value]
  textChangedWithValue.transaction.hash = Bytes.fromHexString(input.hash)
  textChangedWithValue.address = Address.fromString(input.resolverAddress)
  return textChangedWithValue
}
