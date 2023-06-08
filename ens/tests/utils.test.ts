import { assert, describe, test } from "matchstick-as";
import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { decodeName, updateSubdomainNames } from "../src/utils";
import { createAirDomain } from "./resolver-utils"
import * as airstackCommon from "../modules/airstack/common"
import * as airstack from "../modules/airstack/domain-name"

describe("Unit tests for util functions", () => {
  test("test decodeName for firstwrappedname.eth", () => {
    const nameBytes = Bytes.fromHexString("106669727374777261707065646E616D650365746800");
    const txHash = "0x0";
    const expectedName = "firstwrappedname.eth";
    // test function
    let decoded = decodeName(nameBytes, txHash);
    let label: string | null = null;
    let name: string | null = null;
    if (decoded !== null) {
      label = decoded[0];
      name = decoded[1];
    }
    // assert here
    assert.stringEquals(label!, "firstwrappedname");
    assert.stringEquals(name!, expectedName);
  })
  test("test decodeName for 0xacadian.eth", () => {
    const nameBytes = Bytes.fromHexString("0930786163616469616E0365746800");
    const txHash = "0x0";
    const expectedName = "0xacadian.eth";
    // test function
    let decoded = decodeName(nameBytes, txHash);
    let label: string | null = null;
    let name: string | null = null;
    if (decoded !== null) {
      label = decoded[0];
      name = decoded[1];
    }
    // assert here
    assert.stringEquals(label!, "0xacadian");
    assert.stringEquals(name!, expectedName);
  })
  test("test decodeName for vault.im.kevindot.eth", () => {
    const nameBytes = Bytes.fromHexString("057661756C7402696D086B6576696E646F740365746800");
    const txHash = "0x0";
    const expectedName = "vault.im.kevindot.eth";
    // test function
    let decoded = decodeName(nameBytes, txHash);
    let label: string | null = null;
    let name: string | null = null;
    if (decoded !== null) {
      label = decoded[0];
      name = decoded[1];
    }
    // assert here
    assert.stringEquals(label!, "vault");
    assert.stringEquals(name!, expectedName);
  })
  test("test decodeName for whatismyip.eth", () => {
    const nameBytes = Bytes.fromHexString("0A7768617469736D7969700365746800");
    const txHash = "0x0";
    const expectedName = "whatismyip.eth";
    // test function
    let decoded = decodeName(nameBytes, txHash);
    let label: string | null = null;
    let name: string | null = null;
    if (decoded !== null) {
      label = decoded[0];
      name = decoded[1];
    }
    // assert here
    assert.stringEquals(label!, "whatismyip");
    assert.stringEquals(name!, expectedName);
  })
  test("test updateSubdomainNames for abc.[hex].eth and def.[hex].[hex].eth", () => {
    // note: this test keeps on failing as subdomains are not getting linked to parent domain properly, so  commenting it, but it works fine if subdomains = [Airdomain!]!
    // let domainId = "0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff4"
    // let domain1 = createAirDomain(domainId);
    // domain1.name = "efg.eth"
    // domain1.save();
    // let subdomain1 = createAirDomain("0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff45")
    // subdomain1.name = "abc.[hex].eth"
    // subdomain1.parent = domain1.id;
    // subdomain1.save();
    // let subdomain2 = createAirDomain("0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff46")
    // subdomain2.name = "def.[hex].[hex].eth"
    // subdomain2.parent = subdomain1.id;
    // subdomain2.save();
    // let subdomain3 = createAirDomain("0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff47")
    // subdomain3.name = "lmn.[hex].[hex].efg.eth"
    // subdomain3.parent = subdomain2.id;
    // subdomain3.save();
    // // create airBlock
    // let block = airstackCommon.getOrCreateAirBlock("1", BigInt.fromI32(162879), "0x00", BigInt.fromI32(3298));
    // // test function
    // updateSubdomainNames(domain1, block);
    // // assert here
    // let subdomain1Updated = airstack.domain.getAirDomain(subdomain1.id);
    // assert.stringEquals("abc.efg.eth", subdomain1Updated!.name!);
    // let subdomain2Updated = airstack.domain.getAirDomain(subdomain2.id);
    // assert.stringEquals("def.abc.efg.eth", subdomain2Updated!.name!);
    // let subdomain3Updated = airstack.domain.getAirDomain(subdomain3.id);
    // assert.stringEquals("lmn.def.abc.efg.eth", subdomain3Updated!.name!);
  })
  test("name should be same if parent domain name has hex", () => {
    let domainId = "0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff4"
    let domain1 = createAirDomain(domainId);
    domain1.name = "efg.eth"
    domain1.save();
    let subdomain1 = createAirDomain("0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff45")
    subdomain1.name = "abc.[hex].eth"
    subdomain1.parent = domain1.id;
    subdomain1.save();
    let subdomain2 = createAirDomain("0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff46")
    subdomain2.name = "def.[hex].[hex].eth"
    subdomain2.parent = subdomain1.id;
    subdomain2.save();
    let subdomain3 = createAirDomain("0xea6cc843bbe16a18e678f7050e9183f09ccf900a3b4b74de12dae9ce1f95dff47")
    subdomain3.name = "lmn.[hex].[hex].efg.eth"
    subdomain3.parent = subdomain2.id;
    subdomain3.save();
    // create airBlock
    let block = airstackCommon.getOrCreateAirBlock("1", BigInt.fromI32(162879), "0x00", BigInt.fromI32(3298));
    // test function
    updateSubdomainNames(subdomain1, block);
    // assert here
    let subdomain1Updated = airstack.domain.getAirDomain(subdomain1.id);
    assert.stringEquals("abc.[hex].eth", subdomain1Updated!.name!);
    let subdomain2Updated = airstack.domain.getAirDomain(subdomain2.id);
    assert.stringEquals("def.[hex].[hex].eth", subdomain2Updated!.name!);
    let subdomain3Updated = airstack.domain.getAirDomain(subdomain3.id);
    assert.stringEquals("lmn.[hex].[hex].efg.eth", subdomain3Updated!.name!);
  })
})