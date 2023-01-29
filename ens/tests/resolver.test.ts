import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach
} from "matchstick-as/assembly/index"
import { handleAddrChanged, handleVersionChanged } from "../src/resolver"
import { getHandleAddrChangedEvent, getHandleVersionChangedEvent } from "./resolver-utils"

describe("Unit tests for resolver hanlders", () => {
  afterEach(() => {
    clearStore()
  })

  test("Test handleAddrChanged", () => {
    let event = getHandleAddrChangedEvent();
    handleAddrChanged(event)
    // assert here
  })

  test("test handleVersionChanged", () => {
    let event = getHandleVersionChangedEvent();
    handleVersionChanged(event)
    // assert here
  })

})