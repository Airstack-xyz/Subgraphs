import { NewOwnerInput, NewResolverInput, NewTTLInput, TransferInput } from "./ens-registry-utils"

export const transfer: TransferInput = {
    hash: "0xe120d656744084c3906a59013ec2bcaf35bda6b3cc770f2001acd4c15efbd353",
    node: "0x0000000000000000000000000000000000000000000000000000000000000000",
    owner: "0x8472d6206f381ebf71a174b9de9e61b0e1962da4",
}
export const newOwner: NewOwnerInput = {
    hash: "0x057a18943891fc4defd54ff6b18c4fa1e15b822f299f2f08117e4fd11d44f971",
    node: "0x0000000000000000000000000000000000000000000000000000000000000000",
    owner: "0x012233b3c8177f0778d910ed88170b82de3bfe57",
    label: "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0",
}
export const newResolver: NewResolverInput = {
    hash: "0x06eec6bcb07c316aa7c06235a04374fcb5c1f1ac82c910dd316cc087dd6b9887",
    node: "0x695aa64baaa579534f5944589c3db6c251510fbc57b6326539b6452fab5a4eb8",
    resolver: "0x19555a92a4c70b7ceb3b2b2b738d028a451da85a",
}
export const newTTL: NewTTLInput = {
    hash: "0x355db3c952387389054604d569d1a51cb5206256f6c4fbef3a1cd522c4c7126c",
    node: "0xc054c44458d6216a00ea55ce5a59366fa36f6f77f32540c9e9a525f6d609e50b",
    ttl: "43200",
}
