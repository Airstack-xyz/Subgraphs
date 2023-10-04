import {
  assert,
  beforeEach,
  clearStore,
  describe,
  log,
  test,
} from "matchstick-as"
import { AirDomain } from "../generated/schema"
import * as airstack from "../modules/airstack/domain-name"
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"

describe("testing trackSetPrimaryDomain", () => {
  beforeEach(() => {
    clearStore()
  })
  test("setting primary & changing it", () => {
    let hash = Bytes.fromHexString(
      "0x96aa65db90189eefaa6aed57fbbde1d367dbd1d8d16e3a71977712d4fbf61479"
    )
    let author = Address.fromString(
      "0x61C808D82A3Ac53231750daDc13c777b59310bD9"
    )
    let blockNo = BigInt.fromI32(3802330)
    let block = new ethereum.Block(
      hash,
      hash,
      hash,
      author,
      hash,
      hash,
      hash,
      blockNo,
      blockNo,
      blockNo,
      blockNo,
      blockNo,
      blockNo,
      blockNo,
      blockNo
    )
    let airDomain = airstack.domain.getOrCreateAirDomain("1", block)
    let resolverAdderss = Bytes.fromHexString(
      "0xEdcE883162179D4eD5Eb9BB2e7dccF494d75B3a0"
    )
    let airResolver = airstack.domain.getOrCreateAirResolver(
      "1",
      resolverAdderss,
      block
    )
    let resolvedAddress = Address.fromString(
      "0xFBb1b73C4f0BDa4f67dcA266ce6Ef42f520fBB98"
    )
    let airDomainAccount = airstack.domain.getOrCreateAirDomainAccount(
      resolvedAddress,
      block
    )
    airDomainAccount.save()

    airResolver.resolvedAddress = airDomainAccount.id
    airstack.domain.saveAirResolver(airResolver, block)
    airDomain.resolver = airResolver.id
    airstack.domain.saveAirDomain(airDomain, block)
    let txHash = Bytes.fromHexString(
      "0xf6284062b9995748829c4f29e2f9621d326857116c978c84a2d45c1c09ef6f12"
    )
    let logOrCallIndex = BigInt.fromI32(1)
    assert.fieldEquals("AirDomain", "1", "isPrimary", "false")
    airstack.domain.trackSetPrimaryDomain(
      txHash,
      logOrCallIndex,
      "1",
      resolvedAddress,
      block
    )

    assert.fieldEquals("AirDomain", "1", "isPrimary", "true")
    // setting another domain as primary

    let airDomain0 = airstack.domain.getOrCreateAirDomain("2", block)
    let resolverAdderss0 = Bytes.fromHexString(
      "0x83B391a2c7270E82feCF4D406680EAE72f0c5017"
    )
    let airResolver0 = airstack.domain.getOrCreateAirResolver(
      "2",
      resolverAdderss0,
      block
    )

    airResolver0.resolvedAddress = airDomainAccount.id
    airstack.domain.saveAirResolver(airResolver0, block)
    airDomain0.resolver = airResolver.id
    airstack.domain.saveAirDomain(airDomain0, block)
    let txHash0 = Bytes.fromHexString(
      "0x52108f1d33e5a412b775164448f370e1f4d80e5da63e12b48fa650c045982fa9"
    )
    let logOrCallIndex0 = BigInt.fromI32(2)
    assert.fieldEquals("AirDomain", "1", "isPrimary", "true")
    assert.fieldEquals("AirDomain", "2", "isPrimary", "false")
    airstack.domain.trackSetPrimaryDomain(
      txHash0,
      logOrCallIndex0,
      "2",
      resolvedAddress,
      block
    )

    assert.fieldEquals("AirDomain", "1", "isPrimary", "false")
    assert.fieldEquals("AirDomain", "2", "isPrimary", "true")
  })
})
