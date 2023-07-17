import { assert, beforeEach, clearStore, describe, test } from "matchstick-as/assembly/index"
import {
    mockHandleControllerAdded,
    mockHandleNameRegistered,
    mockHandleNameRenewed,
    mockHandleTokenTransfer,
} from "./ens-token-utils"
import {
    controllerAdded,
    controllerAlreadyThere,
    nameRegistered,
    nameRenewed,
    newOwner,
    transfer,
} from "./ens-token-example"
import { mockHandleNewOwner, mockHandleTransfer } from "./ens-registry-utils"
import { intialTransfer, rootNewOwner } from "./ens-old-example"

describe("Testing ens token", () => {
    beforeEach(() => {
        clearStore()
    })
    test("testing New Controller", () => {
        // create root
        mockHandleControllerAdded(controllerAdded)
        // // newOwner
        // mockHandleNewOwner(rootNewOwner)

        assert.fieldEquals(
            "ControllerEntity",
            controllerAdded.controller.toLowerCase(),
            "txHash",
            controllerAdded.hash.toLowerCase()
        )
    })
    test("testing Controller which is already tracked", () => {
        // create root
        mockHandleControllerAdded(controllerAlreadyThere)
        // // newOwner
        // mockHandleNewOwner(rootNewOwner)

        assert.entityCount("ControllerEntity", 0)
    })
    test("testing handleNameREgistered", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)
        // new owner related to nameRegistered
        mockHandleNewOwner(newOwner)

        // handle nameRegistered
        mockHandleNameRegistered(nameRegistered)
        assert.fieldEquals(
            "AirDomain",
            "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118",
            "tokenAddress",
            nameRegistered.tokenAddress
        )

        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118-".concat(
                nameRegistered.hash.toLowerCase()
            ),
            "hash",
            nameRegistered.hash
        )
        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118-".concat(
                nameRegistered.hash.toLowerCase()
            ),
            "isRenew",
            "false"
        )
    })
    test("testing handleNameRenewed", () => {
        // create root
        mockHandleTransfer(intialTransfer)
        // newOwner
        mockHandleNewOwner(rootNewOwner)
        // new owner related to nameRegistered
        mockHandleNewOwner(newOwner)

        // handle nameRegistered
        mockHandleNameRenewed(nameRenewed)

        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118-".concat(
                nameRegistered.hash.toLowerCase()
            ),
            "hash",
            nameRegistered.hash
        )
        assert.fieldEquals(
            "AirDomainRegistrationOrRenew",
            "0x14f992cdd302644816a275e88fea2816741a571484b5e679f41c6b3ea9621118-".concat(
                nameRegistered.hash.toLowerCase()
            ),
            "isRenew",
            "true"
        )
    })

    // test("testing handleTransfer", () => {
    //     // create root
    //     mockHandleTransfer(intialTransfer)
    //     // newOwner
    //     mockHandleNewOwner(rootNewOwner)
    //     // new owner related to nameRegistered
    //     mockHandleNewOwner(newOwner)

    //     // handle nameRegistered
    //     mockHandleTokenTransfer(transfer)
    // })
})
