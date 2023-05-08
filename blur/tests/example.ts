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
      beneficiary: {
        address: "0xcc8f3cd409b9be605ff7926b60f5ab37d6ea46ef",
      },
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
  sellHash:
    "0xb622fe256b754dbffaa778297f867ad5bc33035ed964cc02fe1c1944eaa5e5a6",
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
export const expectedOutput2: ExpectedOutput = {
  hash: "0xddfbb2fab1d7567611fde604c5f837578b0bdf1cd26a03d933ccafeb09cb5888",
  from: { address: "0x5f0bcc59ef72fbbd12d3d45976ee3e62887bb91c" },
  to: { address: "0xe1749558e716eedc94c5651ea78d921432724cea" },
  nfts: [
    {
      tokenId: "3667",
      tokenAmount: "1",
      tokenAddress: {
        address: "0x3235ba66bc9ff27efea7021112d593a92433668d",
      },
    },
  ],
  paymentToken: {
    address: "0x0000000000a39bb272e79075ade125fd351887ac",
  },
  paymentAmount: "20000000000000000",
  royalties: [
    {
      amount: "200000000000000",
      beneficiary: {
        address: "0x837ec5e5b8bd970d168b26f7b06f8d4e12747102",
      },
    },
  ],
  feeAmount: "0",
  feeBeneficiary: {
    address: "0x0000000000000000000000000000000000000000",
  },
}

export const sample2: OrderMatchedInput = {
  hash: "0xddfbb2fab1d7567611fde604c5f837578b0bdf1cd26a03d933ccafeb09cb5888",
  maker: "0xe1749558e716eedc94c5651ea78d921432724cea",
  taker: "0x5f0bcc59ef72fbbd12d3d45976ee3e62887bb91c",
  sell: {
    trader: "0x5f0bcc59ef72fbbd12d3d45976ee3e62887bb91c",
    side: 1,
    matchingPolicy: "0x0000000000b92d5d043faf7cecf7e2ee6aaed232",
    collection: "0x3235ba66bc9ff27efea7021112d593a92433668d",
    tokenId: "3667",
    amount: "1",
    paymentToken: "0x0000000000a39bb272e79075ade125fd351887ac",
    price: "20000000000000000",
    listingTime: "1670247385",
    expirationTime: "1670251045",
    fees: [
      {
        rate: 100,
        recipient: "0x837ec5e5b8bd970d168b26f7b06f8d4e12747102",
      },
    ],
    salt: "182409287283553749665970217272194833686",
    extraParams: "0x01",
  },
  sellHash:
    "0x57804a984af800ed21124ddf1ced3ceadf9ed08cdce40986f78438504459943e",
  buy: {
    trader: "0xe1749558e716eedc94c5651ea78d921432724cea",
    side: 0,
    matchingPolicy: "0x0000000000b92d5d043faf7cecf7e2ee6aaed232",
    collection: "0x3235ba66bc9ff27efea7021112d593a92433668d",
    tokenId: "0",
    amount: "1",
    paymentToken: "0x0000000000a39bb272e79075ade125fd351887ac",
    price: "20000000000000000",
    listingTime: "1670238156",
    expirationTime: "1701774156",
    fees: [],
    salt: "80945410961933228460078542969501319966",
    extraParams: "0x01",
  },
  buyHash: "0x3f592c4568fe6a7b8090f998ee15b110a24408ff61a7e47e24ad10b18d88a45f",
}
