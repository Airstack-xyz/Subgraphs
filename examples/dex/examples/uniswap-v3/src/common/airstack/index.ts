import { dataSource, ethereum } from "@graphprotocol/graph-ts";
import { AirDailyAggregateEntity } from "../../../generated/schema";
import { AirProtocolType } from "./constants";
import { getDayOpenTime, getDaysSinceEpoch } from "./datetime";

export function createAirAggregatedEntity(
  actionType: string,
  event: ethereum.Event,
  callback: () => string
): void {
  const startDayTimestamp = getDayOpenTime(event.block.timestamp);

  const eId = callback();

  const entityId = dataSource
    .network()
    .concat("-")
    .concat(AirProtocolType.EXCHANGE)
    .concat("-")
    .concat(actionType)
    .concat("-")
    .concat(event.address.toHexString())
    .concat("-")
    .concat(startDayTimestamp.toHexString())
    .concat(eId);

  //console.log("entityId: ", entityId);
}
