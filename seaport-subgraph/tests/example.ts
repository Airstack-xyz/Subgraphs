import { OrderFulfilledEventType } from "./types"

// hash : 0x000000dfb557b6c661360094194d2523e1c0ad1033903efcf15d2d56c5212171
export const batchTransfer: OrderFulfilledEventType = {
  orderHash: "0xc8f020f13eef9620e0dfa5579e4dbf81c7e05eb810dabf228a72f84a56e85647",
  offerer: "0x05fb51ae421bdd4a8d8d8357b16bc8db8c059f9f",
  zone: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
  recipient: "0x66f59e9a3329a9100fe59b487f71644f1849e480",
  offer: [
    {
      itemType: 2,
      token: "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
      identifier: "8977",
      amount: "1",
    },
    {
      itemType: 2,
      token: "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
      identifier: "8976",
      amount: "1",
    },
    {
      itemType: 2,
      token: "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
      identifier: "8974",
      amount: "1",
    },
    {
      itemType: 2,
      token: "0xb9d9455ea8ba8e244b3ea9d46ba106642cb99b97",
      identifier: "8975",
      amount: "1",
    },
  ],
  consideration: [
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "9250000000000",
      recipient: "0x05fb51ae421bdd4a8d8d8357b16bc8db8c059f9f",
    },
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "250000000000",
      recipient: "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
    },
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "500000000000",
      recipient: "0x7d82c0fc40d417ef89870a2c08d1a3c6a1315703",
    },
  ],
}
export const singleNftOffer: OrderFulfilledEventType = {
  orderHash: "0x76a40418e959d17642b0e510095d08d6a352132615e72d12837abb179b6ab728",
  offerer: "0xa26edf96b6a921a9f4b2c961e3db573547a5d701",
  zone: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
  recipient: "0x39327ba65a22701d8563d9f3a7d001bd83f147d1",
  offer: [
    {
      itemType: 3,
      token: "0xa604060890923ff400e8c6f5290461a83aedacec",
      identifier: "73470577800278525308063113538359163815840392689226212689732198568968744599562",
      amount: "1",
    },
  ],
  consideration: [
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "9550000000000000",
      recipient: "0xa26edf96b6a921a9f4b2c961e3db573547a5d701",
    },
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "250000000000000",
      recipient: "0x0000a26b00c1f0df003000390027140000faa719",
    },
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "200000000000000",
      recipient: "0xa26edf96b6a921a9f4b2c961e3db573547a5d701",
    },
  ],
}
// hash : 0x4808f58fa27b662f60012163d8587a7f51bbf544c8b36329382c7c4abceef0cf
export const multiEvent1: OrderFulfilledEventType = {
  orderHash: "0x04003783d04cd8d7b36d3737d62036bdc7ef381ddd3d6212ce93ddcd55956699",
  offerer: "0x7e8dbf5d60f93b91d2e59abd326840772bb073d8",
  zone: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
  recipient: "0x0000000000000000000000000000000000000000",
  offer: [
    {
      itemType: 1,
      token: "0x6b175474e89094c44da98b954eedeac495271d0f",
      identifier: "0",
      amount: "10000000000000000000",
    },
  ],
  consideration: [
    {
      itemType: 2,
      token: "0x515dc98b0c660bdcb1ad656473907b4d1900ba1b",
      identifier: "0",
      amount: "1",
      recipient: "0x7e8dbf5d60f93b91d2e59abd326840772bb073d8",
    },
    {
      itemType: 1,
      token: "0x6b175474e89094c44da98b954eedeac495271d0f",
      identifier: "0",
      amount: "250000000000000000",
      recipient: "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
    },
  ],
}
export const multiEvent2: OrderFulfilledEventType = {
  orderHash: "0xf26682f7fa170bccd2fc941733fcd9ab2e615f579f45e099e2024d905a598a89",
  offerer: "0xaf3e4a9126729ba97da99df29ae7f7e53d1c4a1a",
  zone: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
  recipient: "0x0000000000000000000000000000000000000000",
  offer: [
    {
      itemType: 2,
      token: "0x515dc98b0c660bdcb1ad656473907b4d1900ba1b",
      identifier: "0",
      amount: "1",
    },
  ],
  consideration: [
    {
      itemType: 1,
      token: "0x6b175474e89094c44da98b954eedeac495271d0f",
      identifier: "0",
      amount: "4875000000000000000",
      recipient: "0xaf3e4a9126729ba97da99df29ae7f7e53d1c4a1a",
    },
    {
      itemType: 1,
      token: "0x6b175474e89094c44da98b954eedeac495271d0f",
      identifier: "0",
      amount: "125000000000000000",
      recipient: "0x8de9c5a032463c561423387a9648c5c7bcc5bc90",
    },
  ],
}
// hash: 0x00022378fc4e138a01aa0b007a82468f6868c4a9d3ab2992d0c6a157ecf58c3d
export const multipleRoyalties1: OrderFulfilledEventType = {
  orderHash: "0x09325b3c7e38084fa0c060c57931b4401a00f2b14d8ea45f1d99ee11cfc7ed78",
  offerer: "0xc1ef02f7b0d81fb5c55d6097c18b4d6592184b64",
  zone: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
  recipient: "0x0000000000000000000000000000000000000000",
  offer: [
    {
      itemType: 2,
      token: "0xb18380485f7ba9c23deb729bedd3a3499dbd4449",
      identifier: "2243",
      amount: "1",
    },
  ],
  consideration: [
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "75850000000000000",
      recipient: "0xc1ef02f7b0d81fb5c55d6097c18b4d6592184b64",
    },
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "2050000000000000",
      recipient: "0x0000a26b00c1f0df003000390027140000faa719",
    },
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "4100000000000000",
      recipient: "0xa394070c35090b57342b3064c6ba7f4082eba122",
    },
    {
      itemType: 2,
      token: "0xb18380485f7ba9c23deb729bedd3a3499dbd4449",
      identifier: "2243",
      amount: "1",
      recipient: "0xd91095ec5a892a1b7e42030f01868e86ef0fd935",
    },
  ],
}

export const multipleRoyalties2: OrderFulfilledEventType = {
  orderHash: "0xda3ff554aa4d1a5dc6fef2b5de50bc9b0955b4fb7b9c7e6d642c2c59a81c9d6c",
  offerer: "0xd91095ec5a892a1b7e42030f01868e86ef0fd935",
  zone: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
  recipient: "0x0000000000000000000000000000000000000000",
  offer: [
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifier: "0",
      amount: "82000000000000000",
    },
  ],
  consideration: [],
}
// hash: 0x6a31c5444516a53c6a8e1ffd7ff81a697b6e59f737b814810df1de5b21b79c48
export const offersToken: OrderFulfilledEventType = {
  orderHash: "0x8d2553ff70345ee30ec505c8b099696ebd7dae2af0d1cce60a8f7c5952a28441",
  offerer: "0x3b52ad533687ce908ba0485ac177c5fb42972962",
  zone: "0x9b814233894cd227f561b78cc65891aa55c62ad2",
  recipient: "0xf5a48858f6895674c3937bd059d4b0a4ea0a63c6",
  offer: [
    {
      itemType: 1,
      token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      identifier: "0",
      amount: "100000",
    },
  ],
  consideration: [
    {
      itemType: 2,
      token: "0x3f53082981815ed8142384edb1311025ca750ef1",
      identifier: "30",
      amount: "1",
      recipient: "0x3b52ad533687ce908ba0485ac177c5fb42972962",
    },
    {
      itemType: 1,
      token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      identifier: "0",
      amount: "2500",
      recipient: "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
    },
  ],
}
