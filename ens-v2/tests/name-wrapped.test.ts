import { assert, beforeEach, clearStore, describe, test } from "matchstick-as/assembly/index"
import {
    mockHandleNewOwner,
    mockHandleNewResolver,
    mockHandleNewTTL,
    mockHandleTransfer,
} from "./ens-registry-utils"
import {
    handleControllerChanged,
    handleNameUnwrapped,
    handleNameWrapped,
} from "../src/name-wrapper"
import { Bytes, crypto } from "@graphprotocol/graph-ts"
import {
    createControllerChangedEvent,
    createNameWrappedEvent,
    createNameUnwrappedEvent,
} from "./name-wrapped-utils"
import {
    controllerAdded,
    controllerAdded2,
    controllerRemoved,
    nameUnwrapped,
    nameWrapped,
} from "./name-wrapped-example"
import { childNewOwner, intialTransfer, rootNewOwner } from "./ens-old-example"
import { ETH_NODE } from "../src/utils"

describe("Testing namewrapper", () => {
    beforeEach(() => {
        clearStore()
    })
    test("testing controllerAdded ", () => {
        // controller added
        let controllerAddedEvent = createControllerChangedEvent(controllerAdded)
        handleControllerChanged(controllerAddedEvent)
        // won't add ControllerNameWrapperEntity - since controller is hardcoded
        assert.entityCount("ControllerNameWrapperEntity", 0)
    })
    test("testing controllerAdded with new controller", () => {
        // controller added
        let controllerAddedEvent = createControllerChangedEvent(controllerAdded2)
        handleControllerChanged(controllerAddedEvent)
        // adds ControllerNameWrapperEntity
        assert.entityCount("ControllerNameWrapperEntity", 1)
    })
    test("testing controllerRemoved ", () => {
        // controller added
        let controllerRemovedEvent = createControllerChangedEvent(controllerRemoved)
        handleControllerChanged(controllerRemovedEvent)
        assert.entityCount("ControllerNameWrapperRemoved", 1)
    })
    test("testing namewrapped", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)
        // newDomain 0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a
        mockHandleNewOwner(childNewOwner)

        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "name",
            "default.default"
        )
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "isNameWrapped",
            "false"
        )

        let nameWrappedEvent = createNameWrappedEvent(nameWrapped)
        handleNameWrapped(nameWrappedEvent)
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "name",
            "firstwrappedname.eth"
        )
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "fuses",
            nameWrapped.fuses
        )
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "isNameWrapped",
            "true"
        )
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "expiryDate",
            nameWrapped.expiry
        )
        let nameUnwrappedEvent = createNameUnwrappedEvent(nameUnwrapped)
        handleNameUnwrapped(nameUnwrappedEvent)
        assert.fieldEquals(
            "AirDomain",
            "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
            "isNameWrapped",
            "false"
        )
    })
})
