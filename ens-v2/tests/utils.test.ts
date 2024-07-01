import { log } from "@graphprotocol/graph-ts"
import { getLabelHash, getNameHashFromName } from "../src/utils"
import {
  assert,
  beforeEach,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index"

describe("Testing getLabelHash", () => {
  beforeEach(() => {
    clearStore()
  })
  test("testing eth ", () => {
    const expected =
      "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0"
    let labelHash = getLabelHash("eth")
    assert.stringEquals(labelHash, expected)
  })
  test("testing sharathkrml ", () => {
    const expected =
      "0x8e60bd7bd6a2886831b6d6ef4b70051b734b9caab02b0edca7b63f8385600063"
    let labelHash = getLabelHash("sharathkrml")
    assert.stringEquals(labelHash, expected)
  })
  test("testing drewharding ", () => {
    const expected =
      "0x9ffe28cd69766c71cd868806c2ce154a0aac098aad5ffcdaec467c3730ea47fc"
    let labelHash = getLabelHash("drewharding")
    assert.stringEquals(labelHash, expected)
  })
  test("testing rilxxlir ", () => {
    const expected =
      "0x00000425b4462e19460bedb4bccfcf16d270975ef882f03831bf3d40f7342355"
    let labelHash = getLabelHash("rilxxlir")
    assert.stringEquals(labelHash, expected)
  })
})

describe("Testing getNameHashFromName", () => {
  test("testing sharathkrml.eth ", () => {
    const expected =
      "0x34340678e46ee5b59e18bb2829172f786cc06ed6786861748d2b1e766bfc4326"
    let nameHash = getNameHashFromName("sharathkrml.eth")
    assert.stringEquals(nameHash, expected)
  })
  test("testing eth ", () => {
    const expected =
      "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
    let nameHash = getNameHashFromName("eth")
    assert.stringEquals(nameHash, expected)
  })
  test("testing vault.cyberkongz.eth ", () => {
    const expected =
      "0x72c644d46a1e6cc12ffc5de7dfcc5fcb13301d4c249da563d841f7e967804f86"
    let nameHash = getNameHashFromName("vault.cyberkongz.eth")
    assert.stringEquals(nameHash, expected)
  })
  test("testing sub2.b.a.test1⃣2⃣3⃣.eth ", () => {
    const expected =
      "0xa867275963a14b749da323f8284bc53c4f8ad06a9cf4d7a06b5ee2b3cc15fbf1"
    let nameHash = getNameHashFromName("sub2.b.a.test1⃣2⃣3⃣.eth")
    assert.stringEquals(nameHash, expected)
  })
})
