export class TransferClass {
    logIndex: string
    from: string
    to: string
    tokenId: string
}
export class EventTokenClass {
    logIndex: string
    eventId: string
    tokenId: string
}

class TransferAndEventToken {
    address: string
    hash: string
    transfer: TransferClass[]
    eventToken: EventTokenClass[]
}

// mint and transfer
export const mint: TransferAndEventToken = {
    address: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
    hash: "0x6955e3d671c3c5c0df50fce0b84197a701d9421d67f759bcf50a042e1259279f",
    transfer: [
        {
            logIndex: "1",
            from: "0x0000000000000000000000000000000000000000",
            to: "0x56cc6ed1191e230d01e9df018750e4eba9367a3b",
            tokenId: "4515",
        },
    ],
    eventToken: [
        {
            logIndex: "2",
            eventId: "69",
            tokenId: "4515",
        },
    ],
}
// transfer
export const transfer: TransferAndEventToken = {
    address: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
    hash: "0x010c1a09e33f8e1adf010b7064598f129f908afde93b752d89914e483d14baae",
    transfer: [
        {
            logIndex: "1",
            from: "0x56cc6ed1191e230d01e9df018750e4eba9367a3b",
            to: "0x7f29129ee109a4dd8358eb723356520d4aae05d0",
            tokenId: "4515",
        },
    ],
    eventToken: [],
}

export const mintEventToManyUsers: TransferAndEventToken = {
    address: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
    hash: "0x608020772b614ea608ed74851bbc692d02ad6f10169455a4a1d072ea5dec9be5",
    transfer: [
        {
            logIndex: "1",
            from: "0x0000000000000000000000000000000000000000",
            to: "0xf6b6f07862a02c85628b3a9688beae07fea9c863",
            tokenId: "73",
        },
        {
            logIndex: "3",
            from: "0x0000000000000000000000000000000000000000",
            to: "0x96d4f0e75ae86e4c46cd8e9d4ae2f2309bd6ec45",
            tokenId: "74",
        },
        {
            logIndex: "5",
            from: "0x0000000000000000000000000000000000000000",
            to: "0x9a5e4d421d72bc1835e6a7b9658ca1924d12d0e0",
            tokenId: "75",
        },
        {
            logIndex: "7",
            from: "0x0000000000000000000000000000000000000000",
            to: "0x3203b7a45b2af35c6bee7871a39f54d0dfdf777e",
            tokenId: "76",
        },
        {
            logIndex: "9",
            from: "0x0000000000000000000000000000000000000000",
            to: "0x8cb85b3fae649b1ce508dcd31dcb0b9023a1fb2d",
            tokenId: "77",
        },
        {
            logIndex: "11",
            from: "0x0000000000000000000000000000000000000000",
            to: "0x5e7b645d5bf86750cb1913122ba8a8545e2a9fd1",
            tokenId: "78",
        },
        {
            logIndex: "13",
            from: "0x0000000000000000000000000000000000000000",
            to: "0xe1f897c6480b62205fc58fad56f4996717d0d175",
            tokenId: "79",
        },
        {
            logIndex: "15",
            from: "0x0000000000000000000000000000000000000000",
            to: "0x97fe57660003e62662e45c48634b9cee2a50e2d6",
            tokenId: "80",
        },
        {
            logIndex: "17",
            from: "0x0000000000000000000000000000000000000000",
            to: "0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb",
            tokenId: "81",
        },
        {
            logIndex: "19",
            from: "0x0000000000000000000000000000000000000000",
            to: "0x1a0b8eb610ed3489b577892950bb6be36358167d",
            tokenId: "82",
        },
    ],
    eventToken: [
        {
            logIndex: "2",
            eventId: "1",
            tokenId: "73",
        },
        {
            logIndex: "4",
            eventId: "1",
            tokenId: "74",
        },
        {
            logIndex: "6",
            eventId: "1",
            tokenId: "75",
        },
        {
            logIndex: "8",
            eventId: "1",
            tokenId: "76",
        },
        {
            logIndex: "10",
            eventId: "1",
            tokenId: "77",
        },
        {
            logIndex: "12",
            eventId: "1",
            tokenId: "78",
        },
        {
            logIndex: "14",
            eventId: "1",
            tokenId: "79",
        },
        {
            logIndex: "16",
            eventId: "1",
            tokenId: "80",
        },
        {
            logIndex: "18",
            eventId: "1",
            tokenId: "81",
        },
        {
            logIndex: "20",
            eventId: "1",
            tokenId: "82",
        },
    ],
}
