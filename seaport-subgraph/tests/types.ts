export class Offer {
  itemType: i32
  token: string
  identifier: string
  amount: string
}
export class Consideration {
  itemType: i32
  token: string
  identifier: string
  amount: string
  recipient: string
}
export class OrderFulfilledEventType {
  orderHash: string
  offerer: string
  zone: string
  recipient: string
  offer: Offer[]
  consideration: Consideration[]
}

export class AirNftTransactionExpectedResponse {
  constructor(
    public from: string,
    public to: string,
    public hash: string,
    public tokenId: string,
    public tokenAmount: string,
    public transactionToken: string,
    public paymentToken: string,
    public paymentAmount: string,
    public feeAmount: string,
    public feeBeneficiary: string
  ) {}
}
export class AirNftSaleRoyaltyExpectedResponse {
  constructor(public amount: string, public beneficiary: string) {}
}
