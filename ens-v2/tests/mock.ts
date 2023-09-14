import { BigInt } from "@graphprotocol/graph-ts"
import {
  AirAccount,
  AirBlock,
  AirDomainAccount,
  AirLabelName,
} from "../generated/schema"

export function mockAirBlock(): AirBlock {
  let airBlock = new AirBlock("1-900000")
  airBlock.hash = "0xqwerty"
  airBlock.number = BigInt.fromString("900000")
  airBlock.timestamp = BigInt.fromString("900000")
  airBlock.save()
  return airBlock
}

export function mockAirLabelName(
  labelHash: string,
  labelName: string
): AirLabelName {
  let airBlock = mockAirBlock()
  let airLabelName = new AirLabelName(labelHash)
  airLabelName.name = labelName
  airLabelName.createdAt = airBlock.id
  airLabelName.lastUpdatedBlock = airBlock.id
  return airLabelName
}

export function mockAirDomainAccount(address: string): AirDomainAccount {
  let airBlock = mockAirBlock()

  let airAccount = new AirAccount("1-".concat(address))
  airAccount.address = address
  airAccount.createdAt = airBlock.id
  airAccount.save()

  let airDomainAccount = new AirDomainAccount("1-".concat(address))
  airDomainAccount.account = airAccount.id
  return airDomainAccount
}
