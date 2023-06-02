import {
  Address,
  BigInt,
  Bytes,
} from "@graphprotocol/graph-ts";
import { ExchangeV1 } from "../generated/ExchangeV1/ExchangeV1";
import { ERC721 } from "../generated/ERC721Sale1/ERC721";
import { ERC721Sale } from "../generated/ERC721Sale1/ERC721Sale";
import { SecondarySaleFees } from "../generated/ExchangeV1/SecondarySaleFees";
import { nft } from "../modules/airstack";

export const INTERFACE_ID_FEES = Bytes.fromHexString("0xb7799584");
export const exchangeV1Address = Address.fromString("0xcd4ec7b66fbc029c116ba9ffb3e59351c20b5b06");
export const zeroAddress = Address.fromString("0x0000000000000000000000000000000000000000");
export const MINT_1155_DATA = "(uint256,string,uint256,(address,uint96)[],(address,uint96)[],bytes[])"
export const MINT_721_DATA = "(uint256,string,(address,uint96)[],(address,uint96)[],bytes[])";
export const DATA_1155_OR_721 = "(address,uint256)";
export const EMPTY_BYTES = Bytes.fromHexString("");
export const BYTES_ZERO = Bytes.fromI32(0);
export const DEFAULT_ORDER_TYPE = Bytes.fromHexString("0xffffffff");
export const BIGINT_ZERO = BigInt.fromI32(0);
export const ETHEREUM_MAINNET_ID = "1";

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

export function getRoyaltyDetails(
  tokenId: BigInt,
  tokenAddress: Address,
  restValue: BigInt,
  amount: BigInt,
): nft.CreatorRoyalty[] {
  // extract data from contract logic comes here
  let contractInstance = SecondarySaleFees.bind(tokenAddress);
  let supportsInterface = contractInstance.try_supportsInterface(INTERFACE_ID_FEES);
  let creatorRoyalties: nft.CreatorRoyalty[] = [];

  if (!supportsInterface.reverted && supportsInterface.value) {
    let royaltyRecipients = contractInstance.getFeeRecipients(tokenId);
    let royaltyAmounts = contractInstance.getFeeBps(tokenId);
    for (let i = 0; i < royaltyAmounts.length; i++) {
      let subFeeResponse = subFeeInBp(restValue, amount, royaltyAmounts[i]);
      creatorRoyalties.push(
        new nft.CreatorRoyalty(
          subFeeResponse.realFee,
          royaltyRecipients[i],
        )
      );
      royaltyAmounts[i] = subFeeResponse.realFee;
      restValue = subFeeResponse.newValue;
    }
  };
  return creatorRoyalties;
}

class SubFeeResponse {
  newValue: BigInt;
  realFee: BigInt;
}

function subFeeInBp(
  value: BigInt,
  total: BigInt,
  feeInBp: BigInt,
): SubFeeResponse {
  return subFee(value, bp(total, feeInBp));
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
    newValue = BIGINT_ZERO;
    realFee = value;
  }
  return { newValue, realFee };
}

function bp(value1: BigInt, value2: BigInt): BigInt {
  return value1.times(value2).div(BigInt.fromI32(10000));
}

class BeneficiaryDetails {
  beneficiaryFee: BigInt;
  beneficiary: Address;
  restValue: BigInt;
}

/**
 * @dev 
 * @param total total payment amount of payment asset
 * @param sellerFee seller fee in basis point
 * @param buyerFee buyer fee in basis point
 * @returns BeneficiaryDetails - beneficiaryFee, beneficiary, restValue
*/
export function getFeeBeneficiaryDetails(
  total: BigInt,
  sellerFee: BigInt,
  buyerFee: BigInt,
): BeneficiaryDetails {
  let subFeeInBpResponse = subFeeInBp(
    total,
    total,
    sellerFee
  );

  let buyerFeeValue = bp(total, buyerFee);
  let beneficiaryFee = buyerFeeValue.plus(subFeeInBpResponse.realFee);

  let contractInstance = ExchangeV1.bind(exchangeV1Address);
  let beneficiaryResult = contractInstance.try_beneficiary();

  let beneficiary: Address;

  if (!beneficiaryResult.reverted) {
    beneficiary = beneficiaryResult.value;
  } else {
    beneficiary = zeroAddress;
  }

  return {
    beneficiaryFee,
    beneficiary,
    restValue: subFeeInBpResponse.newValue,
  };
}

/**
 * @dev this function is used to get token owner of an erc721 token
 * @param tokenAddress erc721 token contract address
 * @param tokenId erc721 token id
 * @returns 
 */
export function getTokenOwnerErc721(
  tokenAddress: Address,
  tokenId: BigInt,
): Address {
  let contractInstance = ERC721.bind(tokenAddress);
  let ownerResult = contractInstance.try_ownerOf(tokenId);
  if (!ownerResult.reverted) {
    return ownerResult.value;
  } else {
    return zeroAddress;
  }
}

/**
 * @dev this function is used to get protocol fee details of erc721 token
 * @param exchangeAddress exchange contract address
 * @param total transaction value amount
 * @param sellerFee seller fee in basis point
 * @returns protocol beneficiary fee details
 */
export function getProtocolFeeDetails(
  exchangeAddress: Address,
  total: BigInt,
  sellerFee: BigInt,
): BeneficiaryDetails {
  let subFeeInBpResponse = subFee(total, bp(total, sellerFee));
  const buyerFeeAndBeneficiaryAddress = getBuyerFeeAndBeneficiaryAddressFromExchange(exchangeAddress);
  const buyerFeeValue = bp(total, buyerFeeAndBeneficiaryAddress.buyerFee);
  const beneficiaryFee = buyerFeeValue.plus(subFeeInBpResponse.realFee);
  return {
    beneficiaryFee,
    beneficiary: buyerFeeAndBeneficiaryAddress.beneficiary,
    restValue: subFeeInBpResponse.newValue,
  }
}

/**
 * dev this class has beneficiary and buyer fee details
 */
class BuyerAndBeneficiaryAddress {
  beneficiary: Address;
  buyerFee: BigInt;
}

/**
 * @dev this function is used to get buyer fee and protocol beneficiary address from exchange contract
 * @param exchangeAddress exchange contract address
 * @returns buyer and beneficiary address
 */
export function getBuyerFeeAndBeneficiaryAddressFromExchange(
  exchangeAddress: Address,
): BuyerAndBeneficiaryAddress {
  let contractInstance = ERC721Sale.bind(exchangeAddress);
  let beneficiaryResult = contractInstance.try_beneficiary();
  let buyerFeeResult = contractInstance.try_buyerFee();

  let beneficiary: Address;
  let buyerFee: BigInt;

  if (!beneficiaryResult.reverted) {
    beneficiary = beneficiaryResult.value;
  } else {
    beneficiary = zeroAddress;
  }

  if (!buyerFeeResult.reverted) {
    buyerFee = buyerFeeResult.value;
  } else {
    buyerFee = BIGINT_ZERO;
  }

  return {
    beneficiary,
    buyerFee,
  };
}

/**
 * @dev this function is used to get royalty details for erc1155Sale1 transaction
 * @param tokenId erc1155 token id
 * @param tokenAddress erc1155 token contract address
 * @param total total payment amount of payment asset
 * @returns creator royalty details
 */
export function getRoyaltyDetailsErc1155Sale1(
  tokenId: BigInt,
  tokenAddress: Address,
  total: BigInt,
): nft.CreatorRoyalty[] {
  // extract data from contract logic comes here
  let contractInstance = SecondarySaleFees.bind(tokenAddress);
  let supportsInterface = contractInstance.try_supportsInterface(INTERFACE_ID_FEES);
  let creatorRoyalties: nft.CreatorRoyalty[] = [];

  if (!supportsInterface.reverted && supportsInterface.value) {
    let royaltyRecipients = contractInstance.getFeeRecipients(tokenId);
    let royaltyAmounts = contractInstance.getFeeBps(tokenId);
    for (let i = 0; i < royaltyAmounts.length; i++) {
      let royaltyFee = bp(total, royaltyAmounts[i]);
      creatorRoyalties.push(
        new nft.CreatorRoyalty(
          royaltyFee,
          royaltyRecipients[i],
        )
      );
      total = total.minus(royaltyFee);
    }
  };
  return creatorRoyalties;
}