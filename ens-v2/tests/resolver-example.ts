import {
    AddrChangedInput,
    AddressChangedInput,
    TextChangedInput,
    TextChangedWithValueInput,
} from "./resolver-utils"

export const resolverAddressSet: AddrChangedInput = {
    hash: "0x12f783f1a93611bdbd5121640763505d73bb5043e97424aae02233980e376c0a",
    resolverAddress: "0x19555A92A4C70B7CEb3b2B2b738d028A451DA85A",
    node: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    a: "0x1da022710dF5002339274AaDEe8D58218e9D6AB5",
}

export const resolverAddressSetChild: AddrChangedInput = {
    hash: "0x12f783f1a93611bdbd5121640763505d73bb5043e97424aae02233980e376c0b",
    resolverAddress: "0x19555A92A4C70B7CEb3b2B2b738d028A451DA85A",
    node: "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
    a: "0x1da022710dF5002339274AaDEe8D58218e9D6AB5",
}

export const multiCoin: AddressChangedInput = {
    hash: "0x12f783f1a93611bdbd5121640763505d73bb5043e97424aae02233980e376c0a",
    resolverAddress: "0x19555A92A4C70B7CEb3b2B2b738d028A451DA85A",
    node: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    coinType: "10",
    newAddress: "0x012233B3C8177F0778d910ED88170b82DE3bfe57",
}

export const trackExtra: TextChangedInput = {
    hash: "0x12f783f1a93611bdbd5121640763505d73bb5043e97424aae02233980e376c0a",
    resolverAddress: "0x19555A92A4C70B7CEb3b2B2b738d028A451DA85A",
    node: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    indexedKey: "0x0bd6c6a65df8c2d6e58b062a18992a34a5b2f44d945a7584f02fb710341b280d",
    key: "vnd.ethers",
}

export const trackExtraWithValue: TextChangedWithValueInput = {
    hash: "0x12f783f1a93611bdbd5121640763505d73bb5043e97424aae02233980e376c0a",
    resolverAddress: "0x19555A92A4C70B7CEb3b2B2b738d028A451DA85A",
    node: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    indexedKey: "0x0bd6c6a65df8c2d6e58b062a18992a34a5b2f44d945a7584f02fb710341b280d",
    key: "vnd.ethers",
    value: "value",
}
