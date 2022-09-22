import {
  NameRegistered as ControllerNameRegisteredEvent,
} from "../generated/EthRegistrarController/EthRegistrarController";

import { NameRegistered as RegistrarNameRegisteredEvent} from "../generated/BaseRegistrar/BaseRegistrar";
import {
  BigInt,
  ByteArray,
  ethereum,
  log,
  Address,
  crypto,
  BigDecimal,
  ens
} from '@graphprotocol/graph-ts'

import * as airstack from "./modules/airstack"
import { ETH_ADDRESS, ZERO_ADDRESS } from "./modules/prices/common/constants";

const ENS_TOKEN_ADDRESS = Address.fromString("0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85");

export function handleNameRegisteredByController(event: ControllerNameRegisteredEvent): void {

  let txHash = event.transaction.hash;
  let label = event.params.label;
  let name = event.params.name;
  let owner = event.params.owner;
  let cost = event.params.cost;
  let expires = event.params.expires;
  const labelHash = crypto.keccak256(ByteArray.fromUTF8(name));

  let nftID = BigInt.fromByteArray(labelHash); //fix me

  log.info("ENS event tx {} label {} name {} owner {} cost {} expires {} label hash {} label converted {}", [
    txHash.toHexString(),
    label.toHexString(),
    name,
    owner.toHexString(),
    cost.toString(),
    expires.toString(),
    labelHash.toHexString(),
    nftID.toString()
  ]);

  const sellers = [ZERO_ADDRESS];
  const buyers = [owner];
  const nftContracts = [ENS_TOKEN_ADDRESS];
  const nftIds = [nftID];
  const paymentToken = ETH_ADDRESS;
  const paymentAmount = cost;
  const timestamp = event.block.timestamp;
  const displayContentTypes = ["TEXT"];
  const displayContentValues = [name];

  airstack.nft.trackNFTSaleTransactions(
    txHash.toHexString(),
    sellers,
    buyers,
    nftContracts,
    nftIds,
    paymentToken,
    paymentAmount,
    timestamp,
    event.block.number,
    displayContentTypes,
    displayContentValues
  );


}

