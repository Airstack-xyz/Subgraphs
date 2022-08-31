import { NetworkSchemaName, NetworkName } from "../constants";

export function getNetworkName(networkSchemaName: string): string {
  if (networkSchemaName === NetworkSchemaName.ARBITRUM_ONE) {
    return NetworkName.ARBITRUM_ONE;
  } else if (networkSchemaName === NetworkSchemaName.AVALANCHE) {
    return NetworkName.AVALANCHE;
  } else if (networkSchemaName === NetworkSchemaName.AURORA) {
    return NetworkName.AURORA;
  } else if (networkSchemaName === NetworkSchemaName.BSC) {
    return NetworkName.BSC;
  } else if (networkSchemaName === NetworkSchemaName.CELO) {
    return NetworkName.CELO;
  } else if (networkSchemaName === NetworkSchemaName.MAINNET) {
    return NetworkName.MAINNET;
  } else if (networkSchemaName === NetworkSchemaName.FANTOM) {
    return NetworkName.FANTOM;
  } else if (networkSchemaName === NetworkSchemaName.FUSE) {
    return NetworkName.FUSE;
  } else if (networkSchemaName === NetworkSchemaName.MOONBEAM) {
    return NetworkName.MOONBEAM;
  } else if (networkSchemaName === NetworkSchemaName.MOONRIVER) {
    return NetworkName.MOONRIVER;
  } else if (networkSchemaName === NetworkSchemaName.NEAR_MAINNET) {
    return NetworkName.NEAR_MAINNET;
  } else if (networkSchemaName === NetworkSchemaName.OPTIMISM) {
    return NetworkName.OPTIMISM;
  } else if (networkSchemaName === NetworkSchemaName.MATIC) {
    return NetworkName.MATIC;
  } else if (networkSchemaName === NetworkSchemaName.XDAI) {
    return NetworkName.XDAI;
  }
  return networkSchemaName;
}

export function getNetworkSchemaName(networkName: string): string {
  if (networkName === NetworkSchemaName.ARBITRUM_ONE) {
    return NetworkSchemaName.ARBITRUM_ONE;
  } else if (networkName === NetworkName.AVALANCHE) {
    return NetworkSchemaName.AVALANCHE;
  } else if (networkName === NetworkName.AURORA) {
    return NetworkSchemaName.AURORA;
  } else if (networkName === NetworkName.BSC) {
    return NetworkSchemaName.BSC;
  } else if (networkName === NetworkName.CELO) {
    return NetworkSchemaName.CELO;
  } else if (networkName === NetworkName.MAINNET) {
    return NetworkSchemaName.MAINNET;
  } else if (networkName === NetworkName.FANTOM) {
    return NetworkSchemaName.FANTOM;
  } else if (networkName === NetworkName.FUSE) {
    return NetworkSchemaName.FUSE;
  } else if (networkName === NetworkName.MOONBEAM) {
    return NetworkSchemaName.MOONBEAM;
  } else if (networkName === NetworkName.MOONRIVER) {
    return NetworkSchemaName.MOONRIVER;
  } else if (networkName === NetworkName.NEAR_MAINNET) {
    return NetworkSchemaName.NEAR_MAINNET;
  } else if (networkName === NetworkName.OPTIMISM) {
    return NetworkSchemaName.OPTIMISM;
  } else if (networkName === NetworkName.MATIC) {
    return NetworkSchemaName.MATIC;
  } else if (networkName === NetworkName.XDAI) {
    return NetworkSchemaName.XDAI;
  }
  return networkName;
}
