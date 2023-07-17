import { NewOwnerInput, NewResolverInput, NewTTLInput, TransferInput } from "./ens-registry-utils"

export const intialTransfer: TransferInput = {
    hash: "0xe120d656744084c3906a59013ec2bcaf35bda6b3cc770f2001acd4c15efbd353",
    node: "0x0000000000000000000000000000000000000000000000000000000000000000",
    owner: "0x8472D6206F381EbF71a174B9dE9E61b0e1962dA4",
    from: "0x8a582C1A18F7D381bf707cf0B535533016221398",
    logIndex: "1",
}

export const secondTransfer: TransferInput = {
    hash: "0xf10f37e848ca26fd12bbe373a1df8f6a96def9b1899c58689fc7c08bb022ad37",
    node: "0x0000000000000000000000000000000000000000000000000000000000000000",
    owner: "0x911143d946bA5d467BfC476491fdb235fEf4D667",
    from: "0x8472D6206F381EbF71a174B9dE9E61b0e1962dA4",
    logIndex: "1",
}

export const rootNewOwner: NewOwnerInput = {
    hash: "0x057a18943891fc4defd54ff6b18c4fa1e15b822f299f2f08117e4fd11d44f971",
    node: "0x0000000000000000000000000000000000000000000000000000000000000000",
    label: "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
    owner: "0x012233B3C8177F0778d910ED88170b82DE3bfe57",
    logIndex: "1",
}

export const childNewOwner: NewOwnerInput = {
    hash: "0x8184de99c6bcc93e408df23ff8fac56c4c948513de5ea6adf59af4668f0e4b5a",
    node: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    label: "0x0000d9107d07a44f64888c5ecc821b7a8f7059c5c2ee18edfd1c040103f291a4",
    owner: "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
    logIndex: "1",
}

export const newTTL: NewTTLInput = {
    hash: "0x355db3c952387389054604d569d1a51cb5206256f6c4fbef3a1cd522c4c7126c",
    logIndex: "1",
    node: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    ttl: "43200",
}

export const newResolver: NewResolverInput = {
    hash: "0x355db3c952387389054604d569d1a51cb5206256f6c4fbef3a1cd522c4c7126c",
    logIndex: "1",
    node: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    resolver: "0x19555A92A4C70B7CEb3b2B2b738d028A451DA85A",
}

export const childNewResolver: NewResolverInput = {
    hash: "0x355db3c952387389054604d569d1a51cb5206256f6c4fbef3a1cd522c4c7126d",
    logIndex: "1",
    node: "0xc62a5d9b5deabe6aa530dce528e6c8ae441d9862bd5f24a97414e2b5df24c16a",
    resolver: "0x19555A92A4C70B7CEb3b2B2b738d028A451DA85A",
}

