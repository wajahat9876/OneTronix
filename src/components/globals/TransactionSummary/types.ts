export interface ITransactionDetails {
  //   accountId: string;
  accountId: string;
  amount: any;
  currency: string;
  direction: string;
  transactionNumber: string;
  beneficiary: { fullName?: string; account: { accountNumber?: string } };
  feeAmount?: any;
  feeCurrency?: string;
  transferDate?: string;
  status?: string;
  totalAmount?: any;
  entryDateTime?: any;
  balance?: string;
  sellCurrency?: string;
  sellAmount?: string;
  rate?: string;
  entryType?: string;
  buyCurrency?: string;
  buyAmount?: string;
  from?: { IBAN: string };
  to?: { IBAN: string };
  transactionReference?: string;
  transactionTime?: string;
  counterpartAccount: { identification: { accountName: string; iban: string } };
  senderAccount?: {
    accountHolderName?: string;
    accountNumber?: string;
  };
  createdAt?: string;
  currentBalance?: string;
  transcationType?: string;
}

export interface IDetailsRow {
  left?: string;
  right?: string;
}
