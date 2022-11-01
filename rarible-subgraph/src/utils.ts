import {
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";
import { HasSecondarySaleFees } from "../generated/ExchangeV1/HasSecondarySaleFees";

export const INTERFACE_ID_FEES = Address.fromString("0xb7799584");

export namespace AirProtocolType {
  export const GENERIC = "GENERIC";
  export const EXCHANGE = "EXCHANGE";
  export const LENDING = "LENDING";
  export const YIELD = "YIELD";
  export const BRIDGE = "BRIDGE";
  export const DAO = "DAO";
  export const NFT_MARKET_PLACE = "NFT_MARKET_PLACE";
  export const STAKING = "STAKING";
  export const P2E = "P2E";
  export const LAUNCHPAD = "LAUNCHPAD";
}

export namespace AirProtocolActionType {
  export const ALL = "ALL";
  export const BUY = "BUY";
  export const SELL = "SELL";
  export const MINT = "MINT";
  export const BURN = "BURN";
  export const ATTEND = "ATTEND";
  export const EARN = "EARN";
  export const SWAP = "SWAP";
  export const ADD_LIQUIDITY = "ADD_LIQUIDITY";
  export const REMOVE_LIQUIDITY = "REMOVE_LIQUIDITY";
  export const ADD_TO_FARM = "ADD_TO_FARM";
  export const REMOVE_FROM_FARM = "REMOVE_FROM_FARM";
  export const CLAIM_FARM_REWARD = "CLAIM_FARM_REWARD";
  export const LEND = "LEND";
  export const BORROW = "BORROW";
  export const FLASH_LOAN = "FLASH_LOAN";
  export const STAKE = "STAKE";
  export const RESTAKE = "RESTAKE";
  export const UNSTAKE = "UNSTAKE";
  export const DELEGATE = "DELEGATE";
  export const CLAIM_REWARDS = "CLAIM_REWARDS";
}

interface RoyaltyDetails {
  royaltyAmount: BigInt[],
  royaltyRecipients: Address[],
}

export function getRoyaltyDetails(
  tokenId: BigInt,
  tokenAddress: Address,
): RoyaltyDetails {
  // extract data from contract logic comes here
  let contractInstance = HasSecondarySaleFees.bind(tokenAddress);
  let supportsInterface = contractInstance.try_supportsInterface(INTERFACE_ID_FEES);

  if (!supportsInterface.reverted && supportsInterface.value) {
    let royaltyRecipients = contractInstance.getFeeRecipients(tokenId);
    let royaltyAmount = contractInstance.getFeeBps(tokenId);

    return {
      royaltyAmount,
      royaltyRecipients,
    };
  }

  return {
    royaltyAmount: [],
    royaltyRecipients: [],
  }
}

interface SubFeeResponse {
  newValue: BigInt,
  realFee: BigInt,
}

function subFeeInBp(
  value: BigInt,
  total: BigInt,
  feeInB: BigInt,
): SubFeeResponse {
  return subFee(value, total.times(feeInB).div(new BigInt(10000)));
}

function subFee(
  value: BigInt,
  fee: BigInt
): SubFeeResponse {
  let newValue: BigInt;
  let realFee: BigInt;
  if (value > fee) {
    newValue = value.minus(fee);
    realFee = fee;
  } else {
    newValue = new BigInt(0);
    realFee = value;
  }
  return { newValue, realFee };
}

interface BeneficiaryDetails {
  beneficiaryFee: BigInt,
  beneficiary: Address
}

export function getFeeBeneficiaryDetails(
  total: BigInt,
  sellerFee: BigInt,
  buyerFee: BigInt,
): BeneficiaryDetails {
  let SubFeeInBpResponse = subFeeInBp(
    total,
    total,
    sellerFee
  );
  // SubFeeInBpResponse.newValue is not required to be used
  let buyerFeeValue = total.times(buyerFee).div(new BigInt(10000));
  let beneficiaryFee = buyerFeeValue.plus(SubFeeInBpResponse.realFee);
  // TODO: think if this address should be fetched from the contract everytime?
  let beneficiary: Address = new Address(0xe627243104A101Ca59a2c629AdbCd63a782E837f);
  return {
    beneficiaryFee,
    beneficiary,
  };
}