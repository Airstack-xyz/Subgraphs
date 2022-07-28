import { Address } from "@graphprotocol/graph-ts";
import { CustomPriceType } from "../common/types";
import { ChainlinkOracle } from "../../../generated/Airstack/ChainlinkOracle";
import { polygonOracles as oracles } from "./oracles";
import { ERC20 } from "../../../generated/Airstack/ERC20";
import {
  CHAIN_LINK_CONTRACT_ADDRESS,
  CHAIN_LINK_USD_ADDRESS,
  ZERO_ADDRESS,
} from "../common/constants";

// export function getChainLinkContract(
//   asset: string,
//   network: string
// ): ChainlinkOracle {
//   for (let i = 0; i < oracles.length; i++) {
//     if (oracles[i][0] === asset) {
//       return ChainlinkOracle.bind(Address.fromString(oracles[i][1]));
//     }
//   }
//   return ChainlinkOracle.bind(ZERO_ADDRESS);
// }

export function getChainLinkContract(network: string): ChainlinkOracle {
  return ChainlinkOracle.bind(CHAIN_LINK_CONTRACT_ADDRESS.get(network));
}

export function getTokenPriceFromChainLink(
  tokenAddr: Address,
  network: string
): CustomPriceType {
  const chainLinkContract = getChainLinkContract(network);

  if (!chainLinkContract) {
    return new CustomPriceType();
  }

  let result = chainLinkContract.try_latestRoundData(
    tokenAddr,
    CHAIN_LINK_USD_ADDRESS
  );

  if (!result.reverted) {
    let decimals = chainLinkContract.try_decimals(
      tokenAddr,
      CHAIN_LINK_USD_ADDRESS
    );

    if (decimals.reverted) {
      new CustomPriceType();
    }

    return CustomPriceType.initialize(
      result.value.value1.toBigDecimal(),
      decimals.value
    );
  }

  return new CustomPriceType();
}
