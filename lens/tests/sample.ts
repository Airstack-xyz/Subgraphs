import { ProfileCreatedInput, TransferInput, DefaultProfileSetInput } from "./utils"

export const createProfile1: ProfileCreatedInput = {
  txHash: "0xf65efa18f44d9b6ef471ab88c8a30d6bb83e75cd5879ecfd31841aaa975bf29f",
  profileId: "62513",
  creator: "0x1eec6eccaa4625da3fa6cd6339dbcc2418710e8a",
  to: "0x002c870c58f0aed7605c70bc91cb1410bcb31385",
  handle: "bnbboost.lens",
  imageURI: "",
  followModule: "0x0000000000000000000000000000000000000000",
  followModuleReturnData: "0x",
  followNFTURI: "ipfs://QmZcp26HgUBGhzJLtXNREENzC5MeiKacZMjdeBzP8kTKnd",
  timestamp: "1661952838",
}
export const createProfile2: ProfileCreatedInput = {
  txHash: "0xcc657c4f99a2fb38c671e559612fca6d4469172eb66ff7b2bdab4f972b70b172",
  profileId: "62517",
  creator: "0x1eec6eccaa4625da3fa6cd6339dbcc2418710e8a",
  to: "0x002c870c58f0aed7605c70bc91cb1410bcb31385",
  handle: "bnb2ern.lens",
  imageURI: "",
  followModule: "0x0000000000000000000000000000000000000000",
  followModuleReturnData: "0x",
  followNFTURI: "ipfs://QmQdfNCbDuGHG5gMypuLqKcj71ekXXu7LRD3m4kzd7FBQT",
  timestamp: "1661954426",
}

// 28471068 - profile gets created
export const profileCreated1: ProfileCreatedInput = {
  txHash: "0x2b75f630d40acd75fbeabb7ca5eba7afb7421f75faee2522751072d620aad991",
  profileId: "882",
  creator: "0x1eec6eccaa4625da3fa6cd6339dbcc2418710e8a",
  to: "0x34b1987af70a43a0647860bdda720ba3664740e8",
  handle: "calvinchen.lens",
  imageURI: "",
  followModule: "0x0000000000000000000000000000000000000000",
  followModuleReturnData: "0x",
  followNFTURI: "ipfs://Qme4K4swTuHQcemnaF9GqqMjaeUKuNcMVCZtkZLqNMXbLg",
  timestamp: "1652883426",
}
// 28471901 - owner sets it as default
export const setDefault2: DefaultProfileSetInput = {
  txHash: "0x6d15354c544f3669af9d4b2e40b3323a64d1da2e2d761dd6787f3cb65843a099",
  wallet: "0x34b1987af70a43a0647860bdda720ba3664740e8",
  profileId: "882",
  timestamp: "1652885144",
}
// 28474021 - decides to transfer profile(default profile sets as null automatically)
export const transfer3: TransferInput = {
  txHash: "0xc957dfbdc1f5c66a603d2ddc5e2fc82ee4c3b7d5da13499842117a5ef2d7221e",
  from: "0x34b1987af70a43a0647860bdda720ba3664740e8",
  to: "0xa0592643b2f033247b56aba944d362dd0d0e6f66",
  tokenId: "882",
}

export const minting: ProfileCreatedInput = {
  txHash: "0xc9d99aace4a0861004bce3123c850d66248e5a0ac3c6c507a196411e5facd909",
  profileId: "4588",
  creator: "0x1eec6eccaa4625da3fa6cd6339dbcc2418710e8a",
  to: "0x8b4c757039677b382d2f4b90c4c9695c20b5491a",
  handle: "danielbrine111.lens",
  imageURI: "",
  followModule: "0x0000000000000000000000000000000000000000",
  followModuleReturnData: "0x",
  followNFTURI: "ipfs://QmRairzvvpjR39W7PHmoUBKTzpW46BfhMKKSXG4NLMiNcW",
  timestamp: "1652923149",
}
export const transferring: TransferInput = {
  txHash: "0x33b3bf37e5ec92726de84ee00a303498290e65c369f19e2053eacd2dbda2910e",
  from: "0x8b4c757039677b382d2f4b90c4c9695c20b5491a",
  to: "0x022824cdbe3854f922eedeb8c925fb2a8182b78c",
  tokenId: "4588",
}
export const settingDefault: DefaultProfileSetInput = {
  txHash: "0x0f8a5d79c52bf18fef26d4a88f13a9c21792fdeebd2cbea3fbf59ee66b34f2ab",
  wallet: "0x022824cdbe3854f922eedeb8c925fb2a8182b78c",
  profileId: "4588",
  timestamp: "1652934849",
}
export const transferringAgain: TransferInput = {
  txHash: "0xfc6f9a053f58e28828e8f2c811e05f3890da7b7547deb3e4f562496655bd489d",
  from: "0x022824cdbe3854f922eedeb8c925fb2a8182b78c",
  to: "0x894d1fce0d11afed2480ddf8985ce641a1201d29",
  tokenId: "4588",
}

export const mint1: ProfileCreatedInput = {
  txHash: "0xf222ab6032def5f3a70c3e4dc70f19c2d7c1f43ad232dd3344ce81eca19cb751",
  profileId: "9065",
  creator: "0x1eec6eccaa4625da3fa6cd6339dbcc2418710e8a",
  to: "0x9d0a6f388ce5d32b0df4fd43be32a8050ac210fd",
  handle: "sarastevens.lens",
  imageURI: "",
  followModule: "0x0000000000000000000000000000000000000000",
  followModuleReturnData: "0x",
  followNFTURI: "ipfs://QmTWLYzqQPkAc24PSGi7fSevh9SCvxQbBPzwzuNzSf1Su7",
  timestamp: "1653124784",
}

export const mint2: ProfileCreatedInput = {
  txHash: "0xff2f7539aca93c88f7c53032470fb7a6d91803e90fff19b67f427f58e59e1200",
  profileId: "9066",
  creator: "0x1eec6eccaa4625da3fa6cd6339dbcc2418710e8a",
  to: "0x9d0a6f388ce5d32b0df4fd43be32a8050ac210fd",
  handle: "hypnotherapy.lens",
  imageURI: "",
  followModule: "0x0000000000000000000000000000000000000000",
  followModuleReturnData: "0x",
  followNFTURI: "ipfs://QmcrAnpgszK4n3nSFTya1pzXyqUZvUUnf1KETJYivvyeEX",
  timestamp: "1653125002",
}
