import { ERC721MetaData } from "../generated/ExchangeV1/ERC721MetaData";
import { ERC1155MetaData } from "../generated/ExchangeV1/ERC1155MetaData";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/ExchangeV1/ERC20";

export function isNFT(nftAddress: Address): boolean {
  let erc721contract = ERC721MetaData.bind(nftAddress);
  let supportsEIP721Identifier = erc721contract.try_supportsInterface(
    Bytes.fromByteArray(Bytes.fromHexString("0x80ac58cd"))
  );
  if (supportsEIP721Identifier.reverted) {
    return false;
  }
  return true;
}
