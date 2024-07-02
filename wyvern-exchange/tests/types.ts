import { Address, Bytes, BigInt, log } from "@graphprotocol/graph-ts"

export class WyvernInput {
    addrs: string[]
    uints: string[]
    feeMethodsSidesKindsHowToCalls: number[]
    calldataBuy: string
    calldataSell: string
    replacementPatternBuy: string
    replacementPatternSell: string
    staticExtradataBuy: string
    staticExtradataSell: string
    vs: number[]
    rssMetadata: string[]
}

export class AtomicMatchInput {
    addrs: Array<Address> = []
    uints: Array<BigInt> = []
    feeMethodsSidesKindsHowToCalls: Array<i32> = []
    calldataBuy: Bytes = Bytes.fromHexString("")
    calldataSell: Bytes = Bytes.fromHexString("")
    replacementPatternBuy: Bytes = Bytes.fromHexString("")
    replacementPatternSell: Bytes = Bytes.fromHexString("")
    staticExtradataBuy: Bytes = Bytes.fromHexString("")
    staticExtradataSell: Bytes = Bytes.fromHexString("")
    vs: Array<i32> = []
    rssMetadata: Array<Bytes> = []
    constructor(sample: WyvernInput) {
        for (let i = 0; i < sample.addrs.length; i++) {
            this.addrs.push(Address.fromString(sample.addrs[i]))
        }
        for (let i = 0; i < sample.uints.length; i++) {
            this.uints.push(BigInt.fromString(sample.uints[i]))
        }
        for (let i = 0; i < sample.feeMethodsSidesKindsHowToCalls.length; i++) {
            let temp = <i32>sample.feeMethodsSidesKindsHowToCalls[i]
            this.feeMethodsSidesKindsHowToCalls.push(temp)
        }
        this.calldataBuy = Bytes.fromHexString(sample.calldataBuy)
        this.calldataSell = Bytes.fromHexString(sample.calldataSell)
        this.replacementPatternBuy = Bytes.fromHexString(sample.replacementPatternBuy)
        this.replacementPatternSell = Bytes.fromHexString(sample.replacementPatternSell)
        this.staticExtradataBuy = Bytes.fromHexString(sample.staticExtradataBuy)
        this.staticExtradataSell = Bytes.fromHexString(sample.staticExtradataSell)
        for (let i = 0; i < sample.vs.length; i++) {
            let vsI32 = <i32>sample.vs[i]
            this.vs.push(vsI32)
        }
        for (let i = 0; i < sample.rssMetadata.length; i++) {
            this.rssMetadata.push(Bytes.fromHexString(sample.rssMetadata[i]))
        }
    }
}
