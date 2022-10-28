import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";

export class ItemData{
    constructor(
        public readonly contractAddress: Address,
        public readonly tokenIds: Array<BigInt>
    ) {

    }
}

export function getData(data: Bytes): ItemData {
    let decoded = ethereum.decode("(address,uint256)[]", data);
    let contractAddress: Address;
    let tokens: Array<BigInt> = [];
    if (!decoded) {
        log.warning("failed to decode {}", [data.toHexString()]);
    } else {
        let pairs = decoded.toArray();
        contractAddress = pairs[0].toTuple()[0].toAddress();
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i].toTuple();
            tokens.push(pair[1].toBigInt());
        }
    }

    return new ItemData(contractAddress,tokens);
}

export namespace X2Y2_OPTIONS {
    export const COMPLETE_SELL_OFFER = 1;
    export const COMPLETE_BUY_OFFER = 2;
}
