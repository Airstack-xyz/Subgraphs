import { ERC721MetaData } from "../generated/ExchangeV1/ERC721MetaData";
import { ERC1155MetaData } from "../generated/ExchangeV1/ERC1155MetaData";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/ExchangeV1/ERC20";
import { ZERO_ADDRESS } from "./modules/prices/common/constants";

export function isNFT(nftAddress: Address): boolean {
  if (nftAddress == ZERO_ADDRESS) {
    return false;
  }
  let erc721contract = ERC721MetaData.bind(nftAddress);
  let supportsEIP721Identifier = erc721contract.try_supportsInterface(
    Bytes.fromByteArray(Bytes.fromHexString("0x80ac58cd"))
  );
  if (supportsEIP721Identifier.reverted) {
    return false;
  }
  if (supportsEIP721Identifier.value) {
    return true;
  } else {
    let erc1155contract = ERC1155MetaData.bind(nftAddress);
    let supportsEIP1155Identifier = erc1155contract.try_supportsInterface(
      Bytes.fromByteArray(Bytes.fromHexString("0xd9b67a26"))
    );
    if (supportsEIP1155Identifier.reverted) {
      return false;
    } else {
      return supportsEIP1155Identifier.value;
    }
  }
}
