import { EvInventory as EvInventoryEvent } from "../generated/X2Y2Exchange/X2Y2Exchange";
import * as airstack from "./modules/airstack";
import { BigInt, Address } from "@graphprotocol/graph-ts";
import { decodeTokens, X2Y2_OPTIONS, Token, getTokenIds } from "./x2y2-utils"

export function handleEvInventory(event: EvInventoryEvent): void {

    const tokens: Array<Token> = decodeTokens(event.params.item.data);
    const collectionAddr: Address = tokens[0].address;
    const tokenIds: Array<BigInt> = getTokenIds(tokens);

    const buyer: Address =
        event.params.detail.op == X2Y2_OPTIONS.COMPLETE_BUY_OFFER
            ? event.params.maker
            : event.params.taker

    const seller: Address =
        event.params.detail.op == X2Y2_OPTIONS.COMPLETE_BUY_OFFER
            ? event.params.taker
            : event.params.maker

    airstack.nft.trackNFTSaleTransactions(
        event.transaction.hash.toHexString(),
        [seller], //from
        [buyer], //to
        [collectionAddr],
        tokenIds,    // Array of NFT IDs
        event.params.currency,  //paymentTokenAddress
        event.params.item.price,
        event.block.timestamp,
        event.block.number
    );

}
