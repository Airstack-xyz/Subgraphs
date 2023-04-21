import { ProfileCreatedInput, TransferInput, DefaultProfileSetInput } from './utils'

// 28471068 - profile gets created
export const profileCreated1: ProfileCreatedInput = {
  txHash: '0x2b75f630d40acd75fbeabb7ca5eba7afb7421f75faee2522751072d620aad991',
  profileId: '882',
  creator: '0x1eec6eccaa4625da3fa6cd6339dbcc2418710e8a',
  to: '0x34b1987af70a43a0647860bdda720ba3664740e8',
  handle: 'calvinchen.lens',
  imageURI: '',
  followModule: '0x0000000000000000000000000000000000000000',
  followModuleReturnData: '0x',
  followNFTURI: 'ipfs://Qme4K4swTuHQcemnaF9GqqMjaeUKuNcMVCZtkZLqNMXbLg',
  timestamp: '1652883426',
}
// 28471901 - owner sets it as default
export const setDefault2: DefaultProfileSetInput = {
  txHash: '0x6d15354c544f3669af9d4b2e40b3323a64d1da2e2d761dd6787f3cb65843a099',
  wallet: '0x34b1987af70a43a0647860bdda720ba3664740e8',
  profileId: '882',
  timestamp: '1652885144',
}
// 28474021 - decides to transfer profile(default profile sets as null automatically)
export const transfer3: TransferInput = {
  txHash: '0xc957dfbdc1f5c66a603d2ddc5e2fc82ee4c3b7d5da13499842117a5ef2d7221e',
  from: '0x34b1987af70a43a0647860bdda720ba3664740e8',
  to: '0xa0592643b2f033247b56aba944d362dd0d0e6f66',
  tokenId: '882',
}
