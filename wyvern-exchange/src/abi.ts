import { Address, BigInt, ByteArray, Bytes, crypto, ethereum } from "@graphprotocol/graph-ts"
import { ADDRESS_ZERO } from "@protofire/subgraph-toolkit"
import { log } from "matchstick-as"
// import { MissingFunctionSig, MissingTxns } from "../generated/schema"
import { BIGINT_ONE, BIG_INT_ZERO } from "../modules/airstack/common"

export namespace abi {
    export class Decoded_atomicize_Result {
        method: string
        addressList: Array<Address>
        transfers: Array<Decoded_TransferFrom_Result>
        constructor(
            _method: string,
            _addressList: Array<Address>,
            _transfers: Array<Decoded_TransferFrom_Result>
        ) {
            this.method = _method
            this.addressList = _addressList
            this.transfers = _transfers
        }
    }
    export class Decoded_Token {
        contract: Address
        tokenId: BigInt
        amount: BigInt

        constructor(_contract: Address, _tokenId: BigInt, _amount: BigInt) {
            this.contract = _contract
            this.tokenId = _tokenId
            this.amount = _amount
        }
    }
    export class Decoded_TransferFrom_Result {
        method: string
        from: Address
        to: Address
        tokens: Decoded_Token[]
        constructor(_method: string, _from: Address, _to: Address, _tokens: Decoded_Token[]) {
            this.method = _method
            this.from = _from
            this.to = _to
            this.tokens = _tokens
        }
    }

    export function checkFunctionSelector(functionSelector: string): boolean {
        log.info("@@checkFunctionSelector\n selector ( {} ) \n", [functionSelector])

        return (
            functionSelector == "0x23b872dd" ||
            functionSelector == "0xb88d4fde" || // safeTransferFrom(address,address,uint256,bytes)
            functionSelector == "0x23b872dd" ||
            functionSelector == "0x42842e0e" ||
            functionSelector == "0xf242432a" ||
            functionSelector == "0x00f24243" // 	safeTransferFrom(address from,address to,uint256 tokenId,bytes memory data)
        )
    }

    export function checkERC1155FunctionSelector(functionSelector: string): boolean {
        return functionSelector == "0xfe99049a" || functionSelector == "0x00fe9904"
    }
    /*
    `matchERC1155UsingCriteria(
       address from,
       address to,
       address token,
       uint256 tokenId,
       uint256 amount,
       bytes32 root,
       bytes32[] calldata proof
     )`
   */
    export function checkPhishing(functionSelector: string): boolean {
        return functionSelector == "0x7a7b6449"
    }
    export function checkENSFunctionSelector(functionSelector: string): boolean {
        return functionSelector == "0x1e59c529" //   register(string,address)
    }
    export function checkSafeTransferFrom(functionSelector: string): boolean {
        return functionSelector == "0x00b88d4f" || functionSelector == "0xb88d4fde" //   safeTransferFrom(address,address,uint256,bytes)
    }
    export function checkDelegateCall(functionSelector: string): boolean {
        return functionSelector == "0x00d6d2b6" || functionSelector == "0xd6d2b6ba" // delegate(address,bytes)
    }
    export function checkBatchTxn(functionSelector: string): boolean {
        return functionSelector == "0x7049e961"
    }
    export function checkMatchERC1155UsingCriteria(functionSelector: string): boolean {
        log.info("@@functionCheckMatchERC1155UsingCriteria\n selector ( {} ) \n", [
            functionSelector,
        ])
        return functionSelector == "0x96809f90" || functionSelector == "0x0096809f"
    }
    export function checkMatchERC721UsingCriteria(functionSelector: string): boolean {
        return functionSelector == "0xfb16a595" || functionSelector == "0x00fb16a5" // matchERC721UsingCriteria(address,address,address,uint256,bytes32,bytes32[])
    }
    export function checkEnjinCase(functionSelector: string): boolean {
        // transferFrom(address,address,uint256,uint256)
        return functionSelector == "0x00fe9904" || functionSelector == "0xfe99049a"
    }

    export function checkSharedStorefront(functionSelector: string): boolean {
        // mintFrom(address,address,uint256)
        return functionSelector == "0x6d5cb2f5"
    }
    export function checkCallDataFunctionSelector(callData: Bytes): boolean {
        let functionSelector = changetype<Bytes>(callData.subarray(0, 4)).toHexString()
        log.info("@@checkCallDataFunctionSelector\n selector ( {} ) \n data ( {} )", [
            functionSelector,
            callData.toHexString(),
        ])
        return checkFunctionSelector(functionSelector)
    }

    // took from https://etherscan.io/address/0x699c7f511c9e2182e89f29b3bfb68bd327919d17
    export function getEnsId(ensName: string): BigInt {
        const nameBytes = Bytes.fromUTF8(ensName)
        const hashBytes = crypto.keccak256(nameBytes)
        let decoded = ethereum
            .decode("(uint256)", Bytes.fromHexString(hashBytes.toHexString()))!
            .toTuple()
        return decoded[0].toBigInt()
    }

    export function decodeBatchNftData(
        buyCallData: Bytes,
        sellCallData: Bytes,
        replacementPattern: Bytes
    ): Decoded_atomicize_Result {
        /**
         *
         * atomicize(address[],uint256[],uint256[],bytes)
         *
         * The calldata input is formated as:
         * Format =>   METHOD_ID (atomicize)  |   ?   | ADDRESS_LIST_LENGTH | ADDRESS_LIST
         * Size   =>             X            | Y * 4 |          Y          |    Y * Z
         * ... continues ...
         * Format =>   ADDRESS_LIST_LENGTH |  ADDRESS_LIST
         * Size   =>           Y           |     Y * Z
         * ... continues ...
         * Format =>   VALUES_LIST_LENGTH  |  VALUES_LIST
         * Size   =>           Y           |     Y * Z
         * ... continues ...
         * Format =>   CALLDATAS_LENGTHS_LIST_LENGTH  |  CALLDATAS_LENGTHS_LIST
         * Size   =>                Y                 |        Y * Z
         * ... continues ...
         * Format => ... |  CALLDATAS_LENGTH  |  CALL_DATAS
         * Size   => ... |          Y         |     2 * L
         *
         *      Where :
         *          - X = 32 bits (8 hex chars) (4 Bytes)
         *          - Y = 256 bits (64 hex chars) (32 Bytes)
         *          - Z = value stored in "ADDRESS_LIST_LENGTH" section (amount of array entries),
         * 					each address has a "Y" length
         * 			- L = value stored in "CALLDATAS_LENGTH" section (amount of bytes),
         * 					the total length of the callDatas Bytes bundle
         */

        let mergedCallData = guardedArrayReplace(buyCallData, sellCallData, replacementPattern)
        return decodeAbi_Atomicize_Method(mergedCallData)
    }

    export function decodeAbi_Atomicize_Method(_callData: Bytes): Decoded_atomicize_Result {
        let dataWithoutFunctionSelector: Bytes = changetype<Bytes>(_callData.subarray(4))
        // As function encoding is not handled yet by the lib, we first need to reach the offset of where the
        // actual params are located. As they are all dynamic we can just fetch the offset of the first param
        // and then start decoding params from there as known sized types
        let offset: i32 = ethereum
            .decode("uint256", changetype<Bytes>(dataWithoutFunctionSelector))!
            .toBigInt()
            .toI32()

        // Get the length of the first array. All arrays must have same length so fetching only this one is enough
        let arrayLength: i32 = ethereum
            .decode("uint256", changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset)))!
            .toBigInt()
            .toI32()
        offset += 1 * 32

        // Now that we know the size of each params we can decode them one by one as know sized types
        // function atomicize(address[] addrs,uint256[] values,uint256[] calldataLengths,bytes calldatas)
        let decodedAddresses: Address[] = ethereum
            .decode(
                `address[${arrayLength}]`,
                changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset))
            )!
            .toAddressArray()

        offset += arrayLength * 32

        offset += 1 * 32
        // We don't need those values, just move the offset forward
        // let decodedValues: BigInt[] = ethereum.decode(
        //   `uint256[${arrayLength}]`,
        //   changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset))
        // )!.toBigIntArray();
        offset += arrayLength * 32

        offset += 1 * 32
        let decodedCalldataIndividualLengths = ethereum
            .decode(
                `uint256[${arrayLength}]`,
                changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset))
            )!
            .toBigIntArray()
            .map<i32>((e) => e.toI32())
        offset += arrayLength * 32

        let decodedCallDatasLength = ethereum
            .decode("uint256", changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset)))!
            .toBigInt()
            .toI32()
        offset += 1 * 32

        let callDatas: Bytes = changetype<Bytes>(
            dataWithoutFunctionSelector.subarray(offset, offset + decodedCallDatasLength)
        )
        let addressList = new Array<Address>()
        let transfersList = new Array<abi.Decoded_TransferFrom_Result>()

        let calldataOffset = 0
        for (let i = 0; i < decodedAddresses.length; i++) {
            let callDataLength = decodedCalldataIndividualLengths[i]
            let calldata: Bytes = changetype<Bytes>(
                callDatas.subarray(calldataOffset, calldataOffset + callDataLength)
            )

            // Sometime the call data is not a transferFrom (ie: https://etherscan.io/tx/0xe8629bfc57ab619a442f027c46d63e1f101bd934232405fa8e8eaf156bfca848)
            // Ignore if not transferFrom
            if (checkCallDataFunctionSelector(calldata)) {
                addressList.push(decodedAddresses[i])

                // log.info("decodedAddresses--> {}", [decodedAddresses[i].toHexString()])
                let decoded = abi.decodeAbi_transferFrom_Method(calldata)
                if (decoded != null) {
                    transfersList.push(decoded)
                    log.debug("decoded len {}", [decoded.tokens.length.toString()])
                }
            }

            calldataOffset += callDataLength
        }
        let functionSelector = Bytes.fromUint8Array(_callData.subarray(0, 4))
            .toHex()
            .slice(2)

        return new Decoded_atomicize_Result(functionSelector, addressList, transfersList)
    }

    export function decodeSingleNftData(
        txHash: string,
        buyCallData: Bytes,
        sellCallData: Bytes,
        replacementPattern: Bytes
        // blockNo: BigInt
    ): Decoded_TransferFrom_Result | null {
        /**
         *
         * transferFrom(address,address,uint256)
         *
         * The calldata input is formated as:
         * Format =>  METHOD_ID (transferFrom) | FROM | TO | TOKEN_ID
         * Size   =>             X             |   Y  |  Y |    Y
         *      Where :
         *          - X = 32 bits (8 hex chars) (4 Bytes)
         *          - Y = 256 bits (64 hex chars) (32 Bytes)
         *
         *
         */

        // todo Debug this call
        log.info("Before guarded Array replacement, txhash {} {} {} {}", [
            txHash,
            buyCallData.toHexString(),
            sellCallData.toHexString(),
            replacementPattern.toHexString(),
        ])
        let mergedCallData = guardedArrayReplace(buyCallData, sellCallData, replacementPattern)
        return decodeAbi_transferFrom_Method(mergedCallData, txHash)
    }

    export function decodeAbi_transferFrom_Method(
        callData: Bytes,
        txHash: string = "dummy"
    ): Decoded_TransferFrom_Result | null {
        /**
         * callData as bytes doesn't have a trailing 0x but represents a hex string
         * first 4 Bytes cointains 8 hex chars for the function selector
         * 0.5 Bytes == 4 bits == 1 hex char
         */

        let functionSelector = changetype<Bytes>(callData.subarray(0, 4)).toHexString()

        let dataWithoutFunctionSelector = Bytes.fromUint8Array(callData.subarray(4))

        if (dataWithoutFunctionSelector.equals(ByteArray.fromHexString("0x"))) {
            log.warning("Issue with decoding", [])
            throw new Error("")
        }
        log.debug("hash {} functionSelector {}", [txHash, functionSelector.toString()])
        if (checkFunctionSelector(functionSelector)) {
            let decoded = ethereum
                .decode("(address,address,uint256)", dataWithoutFunctionSelector)!
                .toTuple()

            let functionSelector = Bytes.fromUint8Array(callData.subarray(0, 4))
                .toHex()
                .slice(2)
            let senderAddress = decoded[0].toAddress()
            let recieverAddress = decoded[1].toAddress()
            let tokenId = decoded[2].toBigInt()
            log.info("functionSelector {} decoded data txHash {} {} {} {}", [
                functionSelector,
                txHash,
                senderAddress.toHexString(),
                recieverAddress.toHexString(),
                tokenId.toString(),
            ])
            let tokens = new Array<Decoded_Token>()
            let token = new Decoded_Token(Address.zero(), tokenId, BigInt.fromI64(1))
            tokens.push(token)
            return new Decoded_TransferFrom_Result(
                functionSelector,
                senderAddress,
                recieverAddress,
                tokens
            )
        } else if (checkMatchERC1155UsingCriteria(functionSelector)) {
            /*
			//    address from,
			//    address to,
			//    address token,
			//    uint256 tokenId,
			//    uint256 amount,
			//    bytes32 root,
			//    bytes32[] calldata proof

			*/

            let dataWithoutFunctionSelector = Bytes.fromUint8Array(callData.subarray(5))
            let decoded = ethereum
                .decode("(address,address,address,uint256,uint256)", dataWithoutFunctionSelector)!
                .toTuple()

            let functionSelector = Bytes.fromUint8Array(callData.subarray(0, 4))
                .toHex()
                .slice(2)
            let senderAddress = decoded[0].toAddress()
            let recieverAddress = decoded[1].toAddress()
            let contract = decoded[2].toAddress()
            let tokenId = decoded[3].toBigInt()
            let amount = decoded[4].toBigInt()
            log.info(
                "ERC1155  txHash {} \n senderAddress {} \n recieverAddress {} \n tokenId {} \n contract {} amount {} functionSelector {}",
                [
                    txHash,
                    senderAddress.toHexString(),
                    recieverAddress.toHexString(),
                    tokenId.toString(),
                    contract.toHexString(),
                    amount.toString(),
                    functionSelector,
                ]
            )
            let tokens = new Array<Decoded_Token>()
            let token = new Decoded_Token(contract, tokenId, amount)
            tokens.push(token)
            return new Decoded_TransferFrom_Result(
                functionSelector,
                senderAddress,
                recieverAddress,
                tokens
            )
        } else if (checkMatchERC721UsingCriteria(functionSelector)) {
            // address from,
            // address to,
            // IERC721 token,
            // uint256 tokenId,
            // bytes32 root,
            // bytes32[] calldata proof
            let dataWithoutFunctionSelector = Bytes.fromUint8Array(callData.subarray(5))
            let decoded = ethereum
                .decode("(address,address,address,uint256)", dataWithoutFunctionSelector)!
                .toTuple()

            let functionSelector = Bytes.fromUint8Array(callData.subarray(0, 4))
                .toHex()
                .slice(2)
            let senderAddress = decoded[0].toAddress()
            let recieverAddress = decoded[1].toAddress()
            let contract = decoded[2].toAddress()
            let tokenId = decoded[3].toBigInt()
            log.info(
                "ERC721 txHash {} \n senderAddress {} \n recieverAddress {} \n tokenId {} \n contract {} functionSelector {}",
                [
                    txHash,
                    senderAddress.toHexString(),
                    recieverAddress.toHexString(),
                    tokenId.toString(),
                    contract.toHexString(),
                    functionSelector,
                ]
            )
            let tokens = new Array<Decoded_Token>()
            let token = new Decoded_Token(contract, tokenId, BIGINT_ONE)
            tokens.push(token)
            return new Decoded_TransferFrom_Result(
                functionSelector,
                senderAddress,
                recieverAddress,
                tokens
            )
        } else if (checkENSFunctionSelector(functionSelector)) {
            // hash 0xa360c37342d9f4dc76039ddda2c1ac3e1d5290aadc9ae73dda1df397482e2aa6
            let contract = Address.fromString("0xfac7bea255a6990f749363002136af6556b31e04") //TODO: verify with future txns

            let prefixStr = "0x0000000000000000000000000000000000000000000000000000000000000020"
            let fixedData = prefixStr + dataWithoutFunctionSelector.toHexString().substring(2)
            let decoded = ethereum
                .decode("(string,address)", Bytes.fromHexString(fixedData))!
                .toTuple()
            let ensName = decoded[0].toString()
            let recieverAddress = decoded[1].toAddress()
            let tokenId = getEnsId(ensName)

            let tokens = new Array<Decoded_Token>()
            let token = new Decoded_Token(contract, tokenId, BIGINT_ONE)
            tokens.push(token)
            return new Decoded_TransferFrom_Result(
                functionSelector,
                Address.fromString(ADDRESS_ZERO),
                recieverAddress,
                tokens
            )
        } else if (checkSharedStorefront(functionSelector)) {
            let contract = Address.fromString("0x5fbef9fcb449d56154980e52e165d9650b9f6ec2") //TODO: verify with future txns

            let decoded = ethereum
                .decode("(address,address,uint256)", dataWithoutFunctionSelector)!
                .toTuple()
            let from = decoded[0].toAddress()
            let to = decoded[1].toAddress()
            let tokenId = decoded[2].toBigInt()
            log.debug("checkSharedStorefront txHash {} from {} to {} tokenId {}", [
                txHash,
                from.toHexString(),
                to.toHexString(),
                tokenId.toString(),
            ])
            let tokens = new Array<Decoded_Token>()
            let token = new Decoded_Token(contract, tokenId, BIGINT_ONE)
            tokens.push(token)
            return new Decoded_TransferFrom_Result(functionSelector, from, to, tokens)
        } else if (checkEnjinCase(functionSelector)) {
            let contract = Address.fromString("0x8562c38485B1E8cCd82E44F89823dA76C98eb0Ab") //TODO: verify with future txns
            let dataWithoutFunctionSelectorStr = "0x" + callData.toHexString().split("fe99049a")[1]
            let decoded = ethereum
                .decode(
                    "(address,address,uint256,uint256)",
                    Bytes.fromHexString(dataWithoutFunctionSelectorStr)
                )!
                .toTuple()
            let from = decoded[0].toAddress()
            let to = decoded[1].toAddress()
            let tokenId = decoded[2].toBigInt()
            let openseaAmt = decoded[3].toBigInt()
            if (openseaAmt.gt(BigInt.fromI64(1))) {
                log.debug("nonNftcase txHash {} has some issue with openseaAmt {} ", [
                    txHash,
                    openseaAmt.toString(),
                ])
                throw new Error("")
            }
            log.debug("checkEnjinCase txHash {} from {} to {} tokenId {}", [
                txHash,
                from.toHexString(),
                to.toHexString(),
                tokenId.toString(),
            ])
            let tokens = new Array<Decoded_Token>()
            let token = new Decoded_Token(contract, tokenId, BIGINT_ONE)
            tokens.push(token)

            return new Decoded_TransferFrom_Result(functionSelector, from, to, tokens)
        } else if (checkSafeTransferFrom(functionSelector)) {
            let dataWithoutFunctionSelectorStr = "0x" + callData.toHexString().split("b88d4fde")[1]
            let decoded = ethereum
                .decode(
                    "(address,address,uint256)",
                    Bytes.fromHexString(dataWithoutFunctionSelectorStr)
                )!
                .toTuple()
            let from = decoded[0].toAddress()
            let to = decoded[1].toAddress()
            let tokenId = decoded[2].toBigInt()
            log.debug("checkSafeTransferFrom txhash {} from {} to {} tokenId {} ", [
                txHash,
                from.toHexString(),
                to.toHexString(),
                tokenId.toString(),
            ])
            let tokens = new Array<Decoded_Token>()
            let token = new Decoded_Token(Address.zero(), tokenId, BIGINT_ONE)
            tokens.push(token)
            return new Decoded_TransferFrom_Result(functionSelector, from, to, tokens)
        } else if (checkDelegateCall(functionSelector)) {
            let dataWithoutFunctionSelectorStr = "0x" + callData.toHexString().substring(212)
            log.error("checkDelegateCall txhash {} dataWithoutFunctionSelectorStr {} ", [
                txHash,
                dataWithoutFunctionSelectorStr,
            ])
            let decoded = ethereum
                .decode(
                    "(address,address,address,address,address,address,address,uint256)",
                    Bytes.fromHexString(dataWithoutFunctionSelectorStr)
                )!
                .toTuple()

            let from = decoded[0].toAddress()
            let to = decoded[1].toAddress()
            let contract = decoded[5].toAddress()
            let tokenId = decoded[7].toBigInt()

            log.error("checkDelegateCall txhash {} from {} to {} contract {} tokenId {} ", [
                txHash,
                from.toHexString(),
                to.toHexString(),
                contract.toHexString(),
                tokenId.toString(),
            ])
            let tokens = new Array<Decoded_Token>()
            let token = new Decoded_Token(contract, tokenId, BIGINT_ONE)
            tokens.push(token)
            return new Decoded_TransferFrom_Result(functionSelector, from, to, tokens)
        } else if (checkBatchTxn(functionSelector)) {
            let dataWithoutFunctionSelectorStr = "0x" + callData.toHexString().substring(74)

            let decoded = ethereum
                .decode(
                    "(address,address,uint256)",
                    Bytes.fromHexString(dataWithoutFunctionSelectorStr)
                )!
                .toTuple()
            let from = decoded[0].toAddress()
            let to = decoded[1].toAddress()
            let arrayLen = decoded[2].toBigInt()
            let encodedTokenArray = dataWithoutFunctionSelectorStr.substring(194)
            let tokens = new Array<Decoded_Token>()
            for (let i = 0; i < arrayLen.toI64(); i++) {
                let encoded = encodedTokenArray.substring(i * 128, i * 128 + 128)
                let decoded = ethereum
                    .decode("(address,uint256)", Bytes.fromHexString("0x" + encoded))!
                    .toTuple()
                let tokenAddress = decoded[0].toAddress()
                let tokenId = decoded[1].toBigInt()
                let token = new Decoded_Token(tokenAddress, tokenId, BIGINT_ONE)
                tokens.push(token)
            }
            return new Decoded_TransferFrom_Result(functionSelector, from, to, tokens)
        } else if (checkPhishing(functionSelector)) {
            log.error("phishing case,txHash {}", [txHash])
            return null
        } else {
            log.error(
                `We dont understanding decoding {} functionSelector {} dataWithoutFunctionSelector {} callData {}`,
                [txHash, functionSelector, dataWithoutFunctionSelector.toHex(), callData.toHex()]
            )
            throw new Error("")
        }
    }

    export function guardedArrayReplace(_array: Bytes, _replacement: Bytes, _mask: Bytes): Bytes {
        // Sometime the replacementPattern is empty, meaning that both arrays (buyCallData and sellCallData) are identicall and
        // no merging is necessary. In such a case randomly return the first array (buyCallData)
        if (_mask.length == 0) {
            return _array
        }

        // copies Bytes Array to avoid buffer overwrite
        let array = Bytes.fromUint8Array(_array.slice(0))
        let replacement = Bytes.fromUint8Array(_replacement.slice(0))
        let mask = Bytes.fromUint8Array(_mask.slice(0))

        array.reverse()
        replacement.reverse()
        mask.reverse()

        let bigIntgArray = BigInt.fromUnsignedBytes(array)
        let bigIntReplacement = BigInt.fromUnsignedBytes(replacement)
        let bigIntMask = BigInt.fromUnsignedBytes(mask)

        // array |= replacement & mask;
        bigIntReplacement = bigIntReplacement.bitAnd(bigIntMask)
        bigIntgArray = bigIntgArray.bitOr(bigIntReplacement)
        return changetype<Bytes>(Bytes.fromBigInt(bigIntgArray).reverse())
    }
}
