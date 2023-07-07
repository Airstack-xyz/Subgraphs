import { NewOwnerInput, NewResolverInput, NewTTLInput, TransferInput } from "./ens-registry-utils"
import { HashRegisteredInput } from "./registrar-utils"

export const rootNewOwner: NewOwnerInput = {
    hash: "0x42fb22d354c395b27108562182cd4ce405b7d5cfe39c33cce76abc00555f85d7",
    node: "0x0000000000000000000000000000000000000000000000000000000000000000",
    label: "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
    owner: "0x6090a6e47849629b7245dfa1ca21d94cd15878ef",
}
export const newOwner1: NewOwnerInput = {
    hash: "0x0006246668fda03eba48f397d4264987dabbad20cf90327a2043a1e2a75a5d8e",
    node: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    owner: "0x94048Eb0dB0CcB7D38219F28ED6522937B339aaf",
    label: "0xacbbc8075afef36994c3c4c800de0a3beff1c651319b0aecb0211b4c5ef54ee8",
}
export const hashRegistered1: HashRegisteredInput = {
    hash: "0x0006246668fda03eba48f397d4264987dabbad20cf90327a2043a1e2a75a5d8e",
    ensHash: "0xacbbc8075afef36994c3c4c800de0a3beff1c651319b0aecb0211b4c5ef54ee8",
    owner: "0x94048Eb0dB0CcB7D38219F28ED6522937B339aaf",
    value: "10000000000000000",
    registrationDate: "1506556772",
}
export const newTTL1: NewTTLInput = {
    hash: "0x355db3c952387389054604d569d1a51cb5206256f6c4fbef3a1cd522c4c7126c",
    node: "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
    ttl: "43200",
}

export const newResolverInput1: NewResolverInput = {
    hash: "0x06eec6bcb07c316aa7c06235a04374fcb5c1f1ac82c910dd316cc087dd6b9887",
    node: "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
    resolver: "0x19555a92a4c70b7ceb3b2b2b738d028a451da85a",
}
export const transferInput1: TransferInput = {
    hash: "0x99f5671f2726d881c61679c13498e291f342abeb7d17f9843056a340efdd217d",
    node: "0x3417e17f002e1553910afbbf73d445e8aca85be452df4b647762e7fc37e98b79",
    owner: "0x6eb3adf37652b65facc2b84c278376cef77482a8",
}