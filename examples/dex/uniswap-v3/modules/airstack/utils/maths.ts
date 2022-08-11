import { BigDecimal } from "@graphprotocol/graph-ts";
import { BIG_DECIMAL } from "../constants";

export function calculatePercentage(
  val1: BigDecimal,
  val2: BigDecimal
): BigDecimal {
  if (val2.equals(BIG_DECIMAL.ZERO)) {
    return BIG_DECIMAL.ZERO;
  } else {
    const percentage = val1.minus(val2).div(val2);
    return percentage;
  }
}
