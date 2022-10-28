import { Address, BigInt } from "@graphprotocol/graph-ts";

import { EvInventory as EvInventoryEvent } from "../generated/X2Y2Exchange/X2Y2Exchange";
import * as airstack from "./modules/airstack";
import { getData, ItemData, X2Y2_OPTIONS } from "./x2y2-utils"

export function handleEvInventory(event: EvInventoryEvent): void {

    const data: ItemData = getData(event.params.item.data); 

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
        [data.contractAddress],
        data.tokenIds,    // Array of NFT IDs
        event.params.currency,  //paymentTokenAddress
        event.params.item.price,
        event.block.timestamp,
        event.block.number
    );

}
