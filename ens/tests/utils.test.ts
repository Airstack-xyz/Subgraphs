import { assert, describe, test } from "matchstick-as";
import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { decodeName } from "../src/utils";
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
})