import {ClearedDiedHarvest, HarvestedPlot, ClearedHarvest, StakedCrop} from "../../generated/PlotActions/PlotActions"
import * as airstack from "../../modules/airstack/dynamic-nft/dynamic-nft"
import * as utils from "../../modules/airstack/dynamic-nft/utils"
import { PLOT_NFT_ADDRESS } from "../constants"

export function handleClearDiedHarvest(event: ClearedDiedHarvest): void {
    airstack.dynamicNft.trackDynamicNFTUpdates(event.block, PLOT_NFT_ADDRESS.toHexString(), event.params.plotId.toString(), event.transaction.hash.toHexString(), event.logIndex, utils.AirTokenStandardType.ERC721, utils.AirProtocolType.DYNAMIC_NFT, utils.AirProtocolActionType.UPDATE)
}

export function handleHarvestPlot(event: HarvestedPlot): void {
    airstack.dynamicNft.trackDynamicNFTUpdates(event.block, PLOT_NFT_ADDRESS.toHexString(), event.params.plotId.toString(), event.transaction.hash.toHexString(), event.logIndex, utils.AirTokenStandardType.ERC721, utils.AirProtocolType.DYNAMIC_NFT, utils.AirProtocolActionType.UPDATE)
}

export function handleStaked(event: StakedCrop): void {
    airstack.dynamicNft.trackDynamicNFTUpdates(event.block, PLOT_NFT_ADDRESS.toHexString(), event.params.plotId.toString(), event.transaction.hash.toHexString(), event.logIndex, utils.AirTokenStandardType.ERC721, utils.AirProtocolType.DYNAMIC_NFT, utils.AirProtocolActionType.UPDATE)
}

export function handleClearedHarvest(event: ClearedHarvest): void {
    airstack.dynamicNft.trackDynamicNFTUpdates(event.block, PLOT_NFT_ADDRESS.toHexString(), event.params.plotId.toString(), event.transaction.hash.toHexString(), event.logIndex, utils.AirTokenStandardType.ERC721, utils.AirProtocolType.DYNAMIC_NFT, utils.AirProtocolActionType.UPDATE)
}
