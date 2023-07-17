import { NewOwnerInput } from "./ens-registry-utils"
import {
    ControllerAddedInput,
    HandleNameRegisteredInput,
    HandleNameRenewed,
    TransferInput,
} from "./ens-token-utils"

export const controllerAdded: ControllerAddedInput = {
    hash: "0x12f783f1a93611bdbd5121640763505d73bb5043e97424aae02233980e376c0a",
    controller: "0x699C7F511C9e2182e89f29b3Bfb68bD327919D17",
}

export const controllerAlreadyThere: ControllerAddedInput = {
    hash: "0x12f783f1a93611bdbd5121640763505d73bb5043e97424aae02233980e376c0a",
    controller: "0xb22c1c159d12461ea124b0deb4b5b93020e6ad16",
}

export const newOwner: NewOwnerInput = {
    hash: "0x88bc13b084fea1313ee6f062087ae3bc20111b388f270c67f55bd107a166c667",
    logIndex: "1",
    node: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    label: "0x00000425b4462e19460bedb4bccfcf16d270975ef882f03831bf3d40f7342355",
    owner: "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
}

export const nameRegistered: HandleNameRegisteredInput = {
    hash: "0x88bc13b084fea1313ee6f062087ae3bc20111b388f270c67f55bd107a166c667",
    logIndex: "2",
    id: "28623488496754717353684115358536970508121247903592656443323269613101909",
    owner: "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
    expires: "1588550400",
    tokenAddress: "0xfac7bea255a6990f749363002136af6556b31e04",
}

export const nameRenewed: HandleNameRenewed = {
    hash: "0x88bc13b084fea1313ee6f062087ae3bc20111b388f270c67f55bd107a166c667",
    logIndex: "2",
    id: "28623488496754717353684115358536970508121247903592656443323269613101909",
    from: "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
    expires: "1588550400",
    tokenAddress: "0xfac7bea255a6990f749363002136af6556b31e04",
}

export const transfer: TransferInput = {
    hash: "0x88bc13b084fea1313ee6f062087ae3bc20111b388f270c67f55bd107a166c667",
    logIndex: "2",
    tokenId: "28623488496754717353684115358536970508121247903592656443323269613101909",
    from: "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
    to: "0xb22c1c159d12461ea124b0deb4b5b93020e6ad16",
    tokenAddress: "0xfac7bea255a6990f749363002136af6556b31e04",
}
