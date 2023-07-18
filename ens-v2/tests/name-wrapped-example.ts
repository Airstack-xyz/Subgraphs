import { ControllerChangedInput, NameWrappedInput, NameUnwrappedInput } from "./name-wrapped-utils"

export const controllerAdded: ControllerChangedInput = {
    hash: "0x7417e9e1a03938bbc20ce99805e69d15690a864b6a7db14f8cbc982edc44e77e",
    controller: "0x253553366Da8546fC250F225fe3d25d0C782303b",
    bool: true,
}
export const controllerAdded2: ControllerChangedInput = {
    hash: "0x7417e9e1a03938bbc20ce99805e69d15690a864b6a7db14f8cbc982edc44e77e",
    controller: "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401",
    bool: true,
}
export const controllerRemoved: ControllerChangedInput = {
    hash: "0x7417e9e1a03938bbc20ce99805e69d15690a864b6a7db14f8cbc982edc44e77e",
    controller: "0x253553366Da8546fC250F225fe3d25d0C782303b",
    bool: false,
}
export const nameWrapped: NameWrappedInput = {
    hash: "0xcdfd894595e7d3b898cb9c58235f33e8286a46097c15ca18c1bffe59e6cc9a37",
    node: "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
    owner: "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
    name: "0x106669727374777261707065646E616D650365746800",
    fuses: "196608",
    expiry: "1719447755",
}

export const nameUnwrapped: NameUnwrappedInput = {
    hash: "0xcdfd894595e7d3b898cb9c58235f33e8286a46097c15ca18c1bffe59e6cc9a37",
    node: "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
    owner: "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
}
