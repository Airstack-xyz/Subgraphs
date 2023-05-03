import { assert, describe, test } from "matchstick-as";
import { Bytes } from "@graphprotocol/graph-ts";
import { decodeName } from "../src/utils";

describe("Unit tests for util functions", () => {
  test("test decodeName", () => {
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
})