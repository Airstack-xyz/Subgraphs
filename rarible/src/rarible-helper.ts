import {
  Address,
  BigInt,
  Bytes,
  ethereum,
  TypedMap,
} from "@graphprotocol/graph-ts";
export const ERC20 = "ERC20";
export const ETH = "ETH";
export const ERC721 = "ERC721";
export const ERC1155 = "ERC1155";
export const COLLECTION = "COLLECTION";
export const CRYPTOPUNKS = "CRYPTOPUNKS";
export const classMap = new TypedMap<string, string>();
classMap.set("0xaaaebeba", ETH);
classMap.set("0x8ae85d84", ERC20);
classMap.set("0x73ad2146", ERC721);
classMap.set("0x973bb640", ERC1155);
classMap.set("0xf63c2825", COLLECTION);
classMap.set("0x3e6b89d4", CRYPTOPUNKS);
export function getClass(assetClass: Bytes): string | null {
  return classMap.get(assetClass.toHexString());
}
export function getDecodedAddress(data: Bytes): Address {
  let decodedTuple = ethereum.decode("(address)", data)!.toTuple();
  return decodedTuple[0].toAddress();
}
