import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
} from "matchstick-as/assembly/index"

import {
    handleNewOwner,
    handleNewResolver,
    handleNewTTL,
    handleTransfer,
} from "../src/ens-registry"
import {
    createNewOwnerEvent,
    createNewResolverEvent,
    createNewTTLEvent,
    createTransferEvent,
} from "./ens-registry-utils"
import { newOwner, newResolver, newTTL, transfer } from "./ens-registry-example"
import { getNameHash } from "../src/utils"
import { Bytes, log } from "@graphprotocol/graph-ts"

describe("Testing ens registry", () => {
    test("getNameHash", () => {
        let nodeStr = "93CDEB708B7545DC668EB9280176169D1C33CFD8ED6F04690A0BCC88A93FC4AE"
        let labelStr = "00000425B4462E19460BEDB4BCCFCF16D270975EF882F03831BF3D40F7342355"
        let hash = getNameHash(Bytes.fromHexString(nodeStr), Bytes.fromHexString(labelStr))
        log.debug("hash {}", [hash])
    })
    test("testing Transfer", () => {
        const transferEvent = createTransferEvent(transfer)
        handleTransfer(transferEvent)
    })
    test("testing NewOwner", () => {
        const newOwnerEvent = createNewOwnerEvent(newOwner)
        handleNewOwner(newOwnerEvent)
    })
    test("testing NewResolver", () => {
        const NewResolverEvent = createNewResolverEvent(newResolver)
        handleNewResolver(NewResolverEvent)
    })
    test("testing NewTTL", () => {
        const newTTLEvent = createNewTTLEvent(newTTL)
        handleNewTTL(newTTLEvent)
    })
})
