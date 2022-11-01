import {
  Address,
  BigInt,
  Bytes,
} from "@graphprotocol/graph-ts";
import { HasSecondarySaleFees } from "../generated/ExchangeV1/HasSecondarySaleFees";

export const INTERFACE_ID_FEES = Bytes.fromI64(0xb7799584);

export enum AirProtocolType {
  GENERIC = "GENERIC",
  EXCHANGE = "EXCHANGE",
  LENDING = "LENDING",
  YIELD = "YIELD",
  BRIDGE = "BRIDGE",
  DAO = "DAO",
  NFT_MARKET_PLACE = "NFT_MARKET_PLACE",
  STAKING = "STAKING",
  P2E = "P2E",
  LAUNCHPAD = "LAUNCHPAD",
}

export enum AirProtocolActionType {
  ALL = "ALL",
  BUY = "BUY",
  SELL = "SELL",
  MINT = "MINT",
  BURN = "BURN",
  ATTEND = "ATTEND",
  EARN = "EARN",
  SWAP = "SWAP",
  ADD_LIQUIDITY = "ADD_LIQUIDITY",
  REMOVE_LIQUIDITY = "REMOVE_LIQUIDITY",
  ADD_TO_FARM = "ADD_TO_FARM",
  REMOVE_FROM_FARM = "REMOVE_FROM_FARM",
  CLAIM_FARM_REWARD = "CLAIM_FARM_REWARD",
  LEND = "LEND",
  BORROW = "BORROW",
  FLASH_LOAN = "FLASH_LOAN",
  STAKE = "STAKE",
  RESTAKE = "RESTAKE",
  UNSTAKE = "UNSTAKE",
  DELEGATE = "DELEGATE",
  CLAIM_REWARDS = "CLAIM_REWARDS",
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