import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const BIGINT_ZERO = BigInt.zero();
export const BIGDECIMAL_HUNDRED = BigInt.fromI32(100).toBigDecimal();

export const EXCHANGE_ADDRESS = Address.fromString(
    "0x00000000006c3852cbef3e08e8df289169ede581"
  );
  export const WETH_ADDRESS = Address.fromString(
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  );
  export const ERC721_INTERFACE_IDENTIFIER = "0x80ac58cd";
  export const ERC1155_INTERFACE_IDENTIFIER = "0xd9b67a26";
  

export namespace SeaportItemType {
    export const NATIVE = 0;
    export const ERC20 = 1;
    export const ERC721 = 2;
    export const ERC1155 = 3;
    export const ERC721_WITH_CRITERIA = 4;
    export const ERC1155_WITH_CRITERIA = 5;
}

export function isERC721(itemType: i32): boolean {
    return (
      itemType == SeaportItemType.ERC721 ||
      itemType == SeaportItemType.ERC721_WITH_CRITERIA
    );
}

export function isERC1155(itemType: i32): boolean {
    return (
      itemType == SeaportItemType.ERC1155 ||
      itemType == SeaportItemType.ERC1155_WITH_CRITERIA
    );
}

export namespace NftStandard {
    export const ERC721 = "ERC721";
    export const ERC1155 = "ERC1155";
    export const UNKNOWN = "UNKNOWN";
}

export function isMoney(itemType: i32): boolean {
    return (
      itemType == SeaportItemType.NATIVE || itemType == SeaportItemType.ERC20
    );
}

export function isOpenSeaFeeAccount(address: Address): boolean {
    const OPENSEA_WALLET_ADDRESS = Address.fromString(
      "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073"
    );
    const OPENSEA_FEES_ACCOUNT = Address.fromString(
      "0x8de9c5a032463c561423387a9648c5c7bcc5bc90"
    );
    // This can be found https://github.com/web3w/seaport-js/blob/399fa568c04749fd8f96829fa7a6b73d1e440458/src/contracts/index.ts#L30
    const OPENSEA_ETHEREUM_FEE_COLLECTOR = Address.fromString(
      "0x0000a26b00c1F0DF003000390027140000fAa719"
    );
    
    return (
      address == OPENSEA_WALLET_ADDRESS ||
      address == OPENSEA_FEES_ACCOUNT ||
      address == OPENSEA_ETHEREUM_FEE_COLLECTOR
    );
}

// export class Sale {
//     constructor(
//       public readonly buyer: Address,
//       public readonly seller: Address,
//       public readonly nft: NFT,
//       public readonly money: BigInt,
//       public readonly protocolFees: BigInt,
//       public readonly protocolFeesBeneficiary: Address,
//       public readonly royaltyFees: BigInt,
//       public readonly royaltyFeesBeneficiary: Address
//     ) {}
// }

// export class NFT {
//     constructor(
//       public readonly collection: Address,
//       public readonly standard: string,
//       public readonly tokenId: BigInt,
//       public readonly amount: BigInt
//     ) {}
// }
  
// export class Money {
//     constructor(public readonly amount: BigInt) {}
// }
  
// export class Fees {
//     constructor(
//       public readonly protocolFee: BigInt,
//       public readonly protocolFeeBeneficiary: Address,
//       public readonly royaltyItems: Array<royaltyItem>,
//     ) {}
// }

// export class royaltyItem{
//     constructor(
//         public readonly royaltyAmount: BigInt,
//         public readonly royaltyBeneficiary: Address,
//     ) {}
// }