import { Address, log } from "@graphprotocol/graph-ts";
import { CustomPriceType } from "../common/types";
import { ChainlinkOracle } from "../../../generated/templates/Pool/ChainlinkOracle";
import { polygonOracles as oracles } from "./oracles";
import { ERC20 } from "../../../generated/Factory/ERC20";
import { ZERO_ADDRESS } from "../common/constants";
import { CHAIN_LINK_USD_ADDRESS } from "../common/constants";

export function getChainLinkContract(asset: string): ChainlinkOracle {
  for (let i = 0; i < oracles.length; i++) {
    if (oracles[i][0] === asset) {
      return ChainlinkOracle.bind(Address.fromString(oracles[i][1]));
    }
  }
  return ChainlinkOracle.bind(ZERO_ADDRESS);
}

export function getTokenPriceFromChainLink(
  tokenAddr: Address
): CustomPriceType {
  const tokenContract = ERC20.bind(tokenAddr);
  const symbol = tokenContract.try_symbol();
  if (symbol.reverted) {
    return new CustomPriceType();
  }

  const chainLinkContract = getChainLinkContract(symbol.value);

  if (chainLinkContract._address === ZERO_ADDRESS) {
    return new CustomPriceType();
  }

  let result = chainLinkContract.try_latestRoundData();

  if (!result.reverted) {
    const decimals = tokenContract.try_decimals();
    if (decimals.reverted) {
      return new CustomPriceType();
    }
    return CustomPriceType.initialize(
      result.value.value1.toBigDecimal(),
      decimals.value.toI32()
    );
  }

  return new CustomPriceType();
}
