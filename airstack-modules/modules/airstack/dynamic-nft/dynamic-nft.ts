import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

import {AirNFT, AirBlock, AirNftTokenURIUpdateTransaction } from "../../../generated/schema"

import { AIR_DYNAMIC_NFT_UPDATE_COUNTER_ID, AIR_DYNAMIC_NFT_UPDATE_TRANSACTION_COUNTER_ID} from "./utils"
import {
    updateAirEntityCounter,
    getOrCreateAirBlock,
    getOrCreateAirToken,
    getChainId,
} from "../common"

export namespace dynamicNft {
    /**
     * @dev this function is used to track dynamic nft updates
     * @param block ethereum block
     * @param tokenAddress nft token address
     * @param transactionHash transaction hash of transfer
     * @param tokenId nft token id
     * @param protocolType protocol type (eg: NFT_MARKET_PLACE)
     * @param protocolActionType protocol action type (eg: BUY/SELL)
     */
    export function trackDynamicNFTUpdates(
        block: ethereum.Block,
        tokenAddress: string,
        tokenId: string,
        transactionHash: string,
        logOrCallIndex: BigInt,
        tokenStandard: string,
        protocolType: string,
        protocolActionType: string
    ): void {
        const chainId = getChainId()
        let airBlock = getOrCreateAirBlock(
            chainId,
            block.number,
            block.hash.toHexString(),
            block.timestamp
        )
        airBlock.save()
        createOrUpdateAirNftTokenURIUpdateTransaction(
            chainId,
            airBlock,
            tokenAddress,
            tokenId,
            transactionHash,
            logOrCallIndex,
            tokenStandard,
            protocolType,
            protocolActionType,
        )
    }

/**
 *
 * @param chainId chaind id
 * @param block air block entity
 * @param tokenAddress nft token address
 * @param tokenId nft token id
 * @param protocolType protocol type (eg: NFT_MARKET_PLACE)
 * @param protocolActionType protocol action type (eg: BUY/SELL)
 */
function createOrUpdateAirNftTokenURIUpdateTransaction(
    chainId: string,
    block: AirBlock,
    tokenAddress: string,
    tokenId: string,
    transactionHash: string,
    logOrCallIndex: BigInt,
    tokenStandard: string,
    protocolType: string,
    protocolActionType: string,
): void {
    const id = GetAirNftTokenURIUpdateTransactionEntityId(chainId, transactionHash, logOrCallIndex)
    let entity = AirNftTokenURIUpdateTransaction.load(id)
    if (entity == null) {
        entity = new AirNftTokenURIUpdateTransaction(id)
        entity.block = block.id
        entity.transactionHash = transactionHash
        entity.logOrCallIndex = logOrCallIndex
        entity.protocolType = protocolType
        entity.protocolActionType = protocolActionType
        let nft = getOrCreateAirToken(chainId, tokenAddress)
        nft.save()
        entity.nft = nft.id
        entity.tokenAddress = nft.id
        entity.tokenId = tokenId
        entity.protocolType = protocolType
        entity.protocolActionType = protocolActionType
        let dynmaicNft = createOrUpdateAirDynamicNFTUpdate(chainId, block, tokenAddress, tokenId, tokenStandard)
        entity.nft = dynmaicNft.id
    }
    entity.index = updateAirEntityCounter(AIR_DYNAMIC_NFT_UPDATE_TRANSACTION_COUNTER_ID, block)
    entity.save()
}


/**
 *
 * @param chainId chaind id
 * @param block air block entity
 * @param tokenAddress nft token address
 * @param tokenId nft token id
 * @param protocolType protocol type (eg: NFT_MARKET_PLACE)
 * @param protocolActionType protocol action type (eg: BUY/SELL)
 */
function createOrUpdateAirDynamicNFTUpdate(
    chainId: string,
    block: AirBlock,
    tokenAddress: string,
    tokenId: string,
    tokenStandard: string,
): AirNFT {
    const id = GetAirDynamicNFTUpdateEntityId(chainId, tokenAddress, tokenId)
    let entity = AirNFT.load(id)
    if (entity == null) {
        entity = new AirNFT(id)
        entity.createdAt = block.id
        let nft = getOrCreateAirToken(chainId, tokenAddress)
        nft.save()
        entity.tokenAddress = nft.id
        entity.tokenId = tokenId
        entity.tokenStandard = tokenStandard
    }
    entity.lastUpdatedIndex = updateAirEntityCounter(AIR_DYNAMIC_NFT_UPDATE_COUNTER_ID, block)
    entity.lastUpdatedAt = block.id
    entity.save()
    return entity
}

/**
 * @dev this function returns id of AirDynamicNFTUpdateEntity
 * @param chainId
 * @param tokenAddress
 * @param tokenId
 * @returns AirDynamicNFTUpdateEntity id
 */
function GetAirNftTokenURIUpdateTransactionEntityId(
    chainId: string,
    transactionHash: string,
    logOrCallIndex: BigInt,
): string {
    return chainId
        .concat("-")
        .concat(transactionHash)
        .concat("-")
        .concat(logOrCallIndex.toString())
    }
}

/**
 * @dev this function returns id of AirDynamicNFTUpdateEntity
 * @param chainId
 * @param tokenAddress
 * @param tokenId
 * @returns AirDynamicNFTUpdateEntity id
 */
function GetAirDynamicNFTUpdateEntityId(
    chainId: string,
    tokenAddress: string,
    tokenId: string,
): string {
    return chainId
        .concat("-")
        .concat(tokenAddress)
        .concat("-")
        .concat(tokenId)
    }