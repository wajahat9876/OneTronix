export interface IAmountProps {
  amount: string;
  isCredit: boolean;
  sign: string;
}
export interface IHomeTransactionsListProps {
  name: any;
  amount: string;
  balance: string;
  date: string;
  isCredit: boolean;
  currency: string;
  beneficiaryName?: any;
  tranactionNumber?: string;
}
