import { Transfer } from "../generated/ExchangeV2/ExchangeV2";
import { TransferV2 } from "../generated/schema";
export function handleTransfer(event: Transfer): void {
  let transfer = TransferV2.load(event.transaction.hash.toHexString());
  if (!transfer) {
    transfer = new TransferV2(event.transaction.hash.toHexString());
  }
  let asset = event.params.asset;
  transfer.assetClass = asset.assetType.assetClass.toHexString();
  transfer.data = asset.assetType.data.toHexString();
  transfer.value = asset.value;
  transfer.transferDirection = event.params.transferDirection.toHexString();
  transfer.transferType = event.params.transferType.toHexString();
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.save();
}
