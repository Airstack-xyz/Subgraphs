import { store, Bytes, BigInt } from '@graphprotocol/graph-ts';
import { Transfer, nft } from '../generated/nft/nft';
import { ContractInteraction, ContractInteractionLifetimeCount, ContractInteractionDaily } from '../generated/schema';
import { getDayOpenTime, getDaysSinceEpoch } from './common/utils/datetime';

// import { log } from '@graphprotocol/graph-ts';


let ZERO = BigInt.zero();
let ONE = BigInt.fromI32(1);

export function handleTransfer(event: Transfer): void {
    let id = event.transaction.hash.toHex() + '-' +event.logIndex.toString();

    const contractInteraction = new ContractInteraction(id);

    const contractAddress = event.transaction.to;
    if(contractAddress !== null) {
      contractInteraction.contract = contractAddress === null ? '' : contractAddress.toHexString();
      contractInteraction.owner = event.transaction.from.toHexString();
      contractInteraction.blockNumber = event.block.number;
      contractInteraction.timestamp = event.block.timestamp;
      contractInteraction.save();

      let contractInteractionLifetimeCount = ContractInteractionLifetimeCount.load(contractInteraction.contract);

      if(contractInteractionLifetimeCount == null) {
        contractInteractionLifetimeCount = new ContractInteractionLifetimeCount(contractInteraction.contract);
        contractInteractionLifetimeCount.count = BigInt.zero();
      }

      contractInteractionLifetimeCount.count = contractInteractionLifetimeCount.count.plus(ONE);
      contractInteractionLifetimeCount.save();


      const daysSinceEpoch = getDaysSinceEpoch(event.block.timestamp.toI32());

      const dailyContractInteractionId = contractInteraction.contract + '-' + daysSinceEpoch;

      let contractInteractionDaily = ContractInteractionDaily.load(dailyContractInteractionId);

      if(contractInteractionDaily == null) {
        contractInteractionDaily = new ContractInteractionDaily(dailyContractInteractionId);
        contractInteractionDaily.contract = contractInteraction.contract;
        contractInteractionDaily.daySinceEpoch = daysSinceEpoch;
        contractInteractionDaily.startDayTimestamp = getDayOpenTime(event.block.timestamp);
        contractInteractionDaily.count = ZERO;
      }

      contractInteractionDaily.count = contractInteractionDaily.count.plus(ONE);
      contractInteractionDaily.save();
    }
 
}
