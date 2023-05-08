class Fee {
  rate: i32
  recipient: string
}
enum Side {
  Buy = 0,
  Sell,
}
export class OrderInput {
  trader: string
  side: Side
  matchingPolicy: string
  collection: string
  tokenId: string
  amount: string
  paymentToken: string
  price: string
  listingTime: string
  expirationTime: string
  fees: Fee[]
  salt: string
  extraParams: string
}
export class OrderMatchedInput {
  hash: string
  maker: string
  taker: string
  sell: OrderInput
  sellHash: string
  buy: OrderInput
  buyHash: string
}
export class EthereumAddress {
  address: string
}
export class NFT {
  tokenId: string
  tokenAmount: string
  tokenAddress: EthereumAddress
}
export class Royalty {
  amount: string
  beneficiary: EthereumAddress
}
export class ExpectedOutput {
  hash: string
  from: EthereumAddress
  to: EthereumAddress
  nfts: NFT[]
  paymentToken: EthereumAddress
  paymentAmount: string
  royalties: Royalty[]
  feeAmount: string
  feeBeneficiary: EthereumAddress
}

export const expectedOutput1: ExpectedOutput = {
  hash: "0x000266c0a8904b3047dfab75698ff61be54a055aea90b19b531ca1d3d50ec0f7",
  from: { address: "0x918b37f52d9606b90c78c716a31bfd02dffcc5d1" },
  to: { address: "0x4e4e611104cbc11c3490279fd14a3f38dbc61e5b" },
  nfts: [
    {
      tokenId: "5352",
      tokenAmount: "1",
      tokenAddress: {
        address: "0xf75140376d246d8b1e5b8a48e3f00772468b3c0c",
      },
    },
  ],
  paymentToken: {
    address: "0x0000000000000000000000000000000000000000",
  },
  paymentAmount: "119900000000000000",
  royalties: [
    {
      amount: "4796000000000000",
      beneficiary: { address: "0xcc8f3cd409b9be605ff7926b60f5ab37d6ea46ef" },
    },
  ],
  feeAmount: "0",
  feeBeneficiary: {
    address: "0x0000000000000000000000000000000000000000",
  },
}

export const sample1: OrderMatchedInput = {
  hash: "0x000266c0a8904b3047dfab75698ff61be54a055aea90b19b531ca1d3d50ec0f7",
  maker: "0x918b37f52d9606b90c78c716a31bfd02dffcc5d1",
  taker: "0x4e4e611104cbc11c3490279fd14a3f38dbc61e5b",
  sell: {
    trader: "0x918b37f52d9606b90c78c716a31bfd02dffcc5d1",
    side: 1, // sell
    matchingPolicy: "0x00000000006411739da1c40b106f8511de5d1fac",
    collection: "0xf75140376d246d8b1e5b8a48e3f00772468b3c0c",
    tokenId: "5352",
    amount: "1",
    paymentToken: "0x0000000000000000000000000000000000000000",
    price: "119900000000000000",
    listingTime: "1666214211",
    expirationTime: "1668806210",
    fees: [
      {
        rate: 400,
        recipient: "0xcc8f3cd409b9be605ff7926b60f5ab37d6ea46ef",
      },
    ],
    salt: "166948742092558330862365866791783007234",
    extraParams: "0x",
  },
  sellHash: "0xb622fe256b754dbffaa778297f867ad5bc33035ed964cc02fe1c1944eaa5e5a6",
  buy: {
    trader: "0x4e4e611104cbc11c3490279fd14a3f38dbc61e5b",
    side: 0, // buy
    matchingPolicy: "0x00000000006411739da1c40b106f8511de5d1fac",
    collection: "0xf75140376d246d8b1e5b8a48e3f00772468b3c0c",
    tokenId: "5352",
    amount: "1",
    paymentToken: "0x0000000000000000000000000000000000000000",
    price: "119900000000000000",
    listingTime: "1666219212",
    expirationTime: "1666226412",
    fees: [],
    salt: "9138198043096302291532955727218458299",
    extraParams: "0x",
  },
  buyHash: "0xfb7e46c75d5e5cd2b8c695c2a484dde6663b1a0a6124b6089d78cbd9fbf72d04",
}
