import {
  TakerAsk as TakerAskEvent,
  TakerBid as TakerBidEvent,
} from "../generated/LooksRareExchange/LooksRareExchange";
import * as airstack from "./modules/airstack";

export function handleTakerAsk(event: TakerAskEvent): void {
  // makerAsk - wishes to sell NFT for ERC20 tokens
  // takerBid - Buys NFT for ERC20
  // event TakerAsk(
  //     bytes32 orderHash, // bid hash of the maker order
  //     uint256 orderNonce, // user order nonce
  //     address indexed taker, // sender address for the taker ask order // to
  //     address indexed maker, // maker address of the initial bid order // from
  //     address indexed strategy, // strategy that defines the execution
  //     address currency, // currency address
  //     address collection, // collection address
  //     uint256 tokenId, // tokenId transferred
  //     uint256 amount, // amount of tokens transferred
  //     uint256 price // final transacted price
  // );
  airstack.nft.trackNFTSaleTransactions(
    event.transaction.hash.toHexString(),
    [event.params.maker],
    [event.params.taker],
    [event.params.collection],
    [event.params.tokenId],
    event.params.currency,
    event.params.price,
    event.block.timestamp
  );
}

export function handleTakerBid(event: TakerBidEvent): void {
  // makerAsk - wishes to sell NFT for ERC20 tokens
  // takerBid - Buys NFT for ERC20
  //  emit TakerBid(
  //           askHash,
  //           makerAsk.nonce,
  //           takerBid.taker, //to
  //           makerAsk.signer, //from
  //           makerAsk.strategy,
  //           makerAsk.currency,
  //           makerAsk.collection,
  //           tokenId,
  //           amount,
  //           takerBid.price
  //       );
  //  event TakerBid(
  //       bytes32 orderHash, // ask hash of the maker order
  //       uint256 orderNonce, // user order nonce
  //       address indexed taker, // to
  //       address indexed maker, // from
  //       address indexed strategy, // strategy that defines the execution
  //       address currency, // currency address
  //       address collection, // collection address
  //       uint256 tokenId, // tokenId transferred
  //       uint256 amount, // amount of tokens transferred
  //       uint256 price // final transacted price
  //   );

  airstack.nft.trackNFTSaleTransactions(
    event.transaction.hash.toHexString(),
    [event.params.maker],
    [event.params.taker],
    [event.params.collection],
    [event.params.tokenId],
    event.params.currency,
    event.params.price,
    event.block.timestamp
  );
}
