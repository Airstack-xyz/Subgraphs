import { ethereum, log, Bytes, BigInt, Address } from "@graphprotocol/graph-ts";

export class Token {
    constructor(
        public readonly address: Address,
        public readonly tokenId: BigInt
    ) { }
}

export function decodeTokens(data: Bytes): Array<Token> {
    let decoded = ethereum.decode("(address,uint256)[]", data);
    let result: Array<Token> = [];
    if (!decoded) {
        log.warning("failed to decode {}", [data.toHexString()]);
    } else {
        let pairs = decoded.toArray();
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i].toTuple();
            result.push(new Token(pair[0].toAddress(), pair[1].toBigInt()));
        }
    }
    return result;
}

export function getTokenIds(tokens: Array<Token>): Array<BigInt> {
    let result: Array<BigInt> = [];

    for (let i = 0; i < tokens.length; i++) {
        result.push(tokens[i].tokenId);
    }

    return result;
}

export namespace X2Y2_OPTIONS {
    export const COMPLETE_SELL_OFFER = 1;
    export const COMPLETE_BUY_OFFER = 2;
}
