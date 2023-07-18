import {
    NameRegisteredInput as NameRegisteredInputController,
    NameRenewedInput as NameRenewedInputController,
} from "./eth-registrar-controller-utils"

export const nameRegistered3: NameRegisteredInputController = {
    controller: "0xB22c1C159d12461EA124b0deb4b5b93020E6Ad16",
    hash: "0x88bc13b084fea1313ee6f062087ae3bc20111b388f270c67f55bd107a166c667",
    name: "brad",
    label: "0x0000d9107d07a44f64888c5ecc821b7a8f7059c5c2ee18edfd1c040103f291a4",
    cost: "844720972735487587",
    owner: "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
    expires: "1588550400",
    logIndex: "3",
}

export const nameRenewed: NameRenewedInputController = {
    controller: "0xB22c1C159d12461EA124b0deb4b5b93020E6Ad16",
    hash: "0x88bc13b084fea1313ee6f062087ae3bc20111b388f270c67f55bd107a166c667",
    name: "brad",
    label: "0x0000d9107d07a44f64888c5ecc821b7a8f7059c5c2ee18edfd1c040103f291a4",
    cost: "26267604241048992",
    from: "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
    expires: "1620107352",
    logIndex: "3",
}
