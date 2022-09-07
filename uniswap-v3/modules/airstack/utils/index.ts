import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { getUsdPrice } from "../../prices";

export function usdPrice(
  tokenAddress: string,
  decimal: i32,
  amount: BigInt
): BigDecimal {
  const formattedAmount = amount.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(decimal as u8)
      .toBigDecimal()
  );
  const volumeInUSD = getUsdPrice(
    Address.fromString(tokenAddress),
    formattedAmount
  );
  return volumeInUSD;
}
