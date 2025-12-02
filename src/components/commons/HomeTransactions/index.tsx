/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import useCapitalizeFirstWord from "@src/hooks/useCapitalizeFirst";
import useCurrencyFlag from "@src/hooks/useCurrencyFlag";
import { getRespValue } from "@utils/getRespValue";
import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
import { IAmountProps, IHomeTransactionsListProps } from "./types";

const formatDate = (dateString: any): any => {
  if (!dateString) return "";
  return moment(dateString).format("DD MMM YYYY");
};
const Amount = ({ amount, isCredit, sign }: IAmountProps) => {
  if (isCredit)
    return (
      <Text style={styles.txtCredit}>
        +{sign} {amount}
      </Text>
    );
  return (
    <Text style={styles.txtDebit}>
      -{sign} {amount}
    </Text>
  );
};
const HomeTransactionsList = ({
  name,
  amount,
  balance,
  date,
  isCredit,
  currency,
  beneficiaryName,
  tranactionNumber,
}: IHomeTransactionsListProps) => {
  const { getCurrencySymbol } = useCurrencyFlag();
  const { trimString, capitalizeFirstWord } = useCapitalizeFirstWord();
  return (
    <>
      <View style={styles.viewTrans}>
        <Text
          style={styles.txtAccount}
          // className="capitalize"
          numberOfLines={2}
        >
          {capitalizeFirstWord(name)}
        </Text>
        <Amount
          amount={amount}
          isCredit={isCredit}
          sign={getCurrencySymbol(currency)}
        />
      </View>

      <View style={styles.viewTrans}>
        <Text style={styles.directionTxt} numberOfLines={2}>
          {trimString(capitalizeFirstWord(beneficiaryName))}
        </Text>
        <Text style={styles.txtTrans}>
          {/* {getCurrencySymbol(currency)} {balance} */}
          {balance}
        </Text>
      </View>

      <View style={styles.viewTrans}>
        <Text style={styles.directionTxt} numberOfLines={2}>
          {tranactionNumber}
        </Text>
        <Text style={styles.directionTxt} numberOfLines={2}>
          {date}
        </Text>
      </View>
    </>
  );
};
const specialAccounts = [
  "operating account",
  "easy cash card expense",
  "easy cash card",
  "GBP FX Settlement Account - PagoNxt",
];
export const renderItem = ({
  item,
  activeCurrency,
}: {
  item: any;
  activeCurrency: any;
}) => {
  if (activeCurrency === 1) {
    switch (item?.transcationType) {
      case "feeDebit":
        return (
          <HomeTransactionsList
            key="fee_debit"
            name={`${"To: "}${"ECC"}`}
            amount={parseFloat(item?.amount?.instructedAmount).toFixed(2)}
            balance={parseFloat(item?.balance).toFixed(2)}
            isCredit={item?.debitCreditCode === "CRDT"}
            date={formatDate(item?.transactionTime)}
            currency={item?.amount?.currency}
            beneficiaryName=""
            tranactionNumber="ECC Charges"
          />
        );
      case "Credit":
        return (
          <HomeTransactionsList
            key="Credit"
            name={
              specialAccounts.some((acc) =>
                item?.counterpartAccount?.identification?.accountName
                  .toLowerCase()
                  .includes(acc.toLowerCase())
              )
                ? `${"From: "}${item?.counterpartAccount?.identification?.iban}`
                : item?.counterpartAccount?.identification?.accountName
            }
            amount={parseFloat(item?.amount?.instructedAmount).toFixed(2)}
            balance={parseFloat(item?.balance).toFixed(2)}
            isCredit={item?.debitCreditCode === "CRDT"}
            date={formatDate(item?.transactionTime)}
            currency={item?.amount?.currency}
            beneficiaryName={
              item?.transactionReference?.includes("-")
                ? item.transactionReference.split("-")[1]
                : item?.transactionReference
            }
            tranactionNumber={`${"Tx: "}${item?.transcationType}`}
          />
        );
      case "manualAdjustmentCredit":
        return (
          <HomeTransactionsList
            key="manualAdjustmentCredit"
            name="Manual Adjustment Credit"
            // name={
            //   specialAccounts.some(acc =>
            //     item?.counterpartAccount?.identification?.accountName
            //       .toLowerCase()
            //       .includes(acc.toLowerCase()),
            //   )
            //     ? `${'From: '}${item?.counterpartAccount?.identification?.iban}`
            //     : item?.counterpartAccount?.identification?.accountName
            // }
            amount={parseFloat(item?.amount?.instructedAmount).toFixed(2)}
            balance={parseFloat(item?.balance).toFixed(2)}
            isCredit={item?.debitCreditCode === "CRDT"}
            date={formatDate(item?.transactionTime)}
            currency={item?.amount?.currency}
            beneficiaryName={
              item?.transactionReference?.includes("-")
                ? item.transactionReference.split("-")[1]
                : item?.transactionReference
            }
            tranactionNumber={`${"Tx: "}${"Manual Adjustment Credit"}`}
          />
        );
      case "FXCredit":
        return (
          <HomeTransactionsList
            key="Credit"
            name={
              "Exchange"
              // specialAccounts.some(acc =>
              //   item?.counterpartAccount?.identification?.accountName
              //     .toLowerCase()
              //     .includes(acc.toLowerCase()),
              // )
              //   ? `${'From: '}${item?.counterpartAccount?.identification?.iban}`
              //   : item?.counterpartAccount?.identification?.accountName
            }
            amount={parseFloat(item?.amount?.instructedAmount).toFixed(2)}
            // amount={parseFloat(
            //   item?.entryType === 'fee' ? item?.feeAmount : item?.amount,
            // ).toFixed(2)}
            balance={parseFloat(item?.balance).toFixed(2)}
            isCredit={item?.debitCreditCode === "CRDT"}
            date={formatDate(item?.transactionTime)}
            currency={item?.amount?.currency}
            beneficiaryName={" "}
            tranactionNumber={`Tx: ${"FX Credit"}`}
          />
        );
      case "Debit":
        return (
          <HomeTransactionsList
            key="Debit"
            name={
              specialAccounts.some((acc) =>
                item?.counterpartAccount?.identification?.accountName
                  .toLowerCase()
                  .includes(acc.toLowerCase())
              )
                ? `${"To: "}${item?.counterpartAccount?.identification?.iban}`
                : item?.counterpartAccount?.identification?.accountName
            }
            // name={
            //   (item?.entryType === 'fee' && 'Transfer Fee') ||
            //   `${'To: '}${item?.beneficiary?.fullName} `
            // }
            amount={parseFloat(item?.amount?.instructedAmount).toFixed(2)}
            // amount={parseFloat(
            //   item?.entryType === 'fee' ? item?.feeAmount : item?.amount,
            // ).toFixed(2)}
            balance={parseFloat(item?.balance).toFixed(2)}
            isCredit={item?.direction === "credit"}
            date={formatDate(item?.transactionTime)}
            currency={item?.amount?.currency}
            beneficiaryName={
              item?.transactionReference?.includes("-")
                ? item.transactionReference.split("-")[1]
                : item?.transactionReference
            }
            tranactionNumber={`${"Tx: "}${item?.transcationType}`}
          />
        );
      case "FXDebit":
        return (
          <HomeTransactionsList
            key="Debit"
            name={
              "Exchange"
              // specialAccounts.some(acc =>
              //   item?.counterpartAccount?.identification?.accountName
              //     .toLowerCase()
              //     .includes(acc.toLowerCase()),
              // )
              //   ? `${'To: '}${item?.counterpartAccount?.identification?.iban}`
              //   : item?.counterpartAccount?.identification?.accountName
            }
            amount={parseFloat(item?.amount?.instructedAmount).toFixed(2)}
            // amount={parseFloat(
            //   item?.entryType === 'fee' ? item?.feeAmount : item?.amount,
            // ).toFixed(2)}
            balance={parseFloat(item?.balance).toFixed(2)}
            isCredit={item?.direction === "credit"}
            date={formatDate(item?.transactionTime)}
            currency={item?.amount?.currency}
            beneficiaryName={
              " "
              // item?.transactionReference?.includes('-')
              //   ? item.transactionReference.split('-')[1]
              //   : item?.transactionReference
            }
            tranactionNumber={`${"Tx: "}${"FX Debit"}`}
          />
        );

      default:
        return (
          <HomeTransactionsList
            key="manualAdjustment"
            name="Manual Adjustment"
            // name={
            //   specialAccounts.some(acc =>
            //     item?.counterpartAccount?.identification?.accountName
            //       .toLowerCase()
            //       .includes(acc.toLowerCase()),
            //   )
            //     ? `${'From: '}${item?.counterpartAccount?.identification?.iban}`
            //     : item?.counterpartAccount?.identification?.accountName
            // }
            amount={parseFloat(item?.amount?.instructedAmount).toFixed(2)}
            balance={parseFloat(item?.balance).toFixed(2)}
            isCredit={item?.debitCreditCode === "CRDT"}
            date={formatDate(item?.transactionTime)}
            currency={item?.amount?.currency}
            beneficiaryName={
              item?.transactionReference?.includes("-")
                ? item.transactionReference.split("-")[1]
                : item?.transactionReference
            }
            tranactionNumber={`${"Tx: "}${"Manual Adjustment"}`}
          />
        );
    }
  } else {
    switch (item?.transcationType) {
      case "feeDebit":
        return (
          <HomeTransactionsList
            key="fee_debit2"
            name={`To: ${"ECC"}`}
            beneficiaryName=""
            amount={parseFloat(item?.amount).toFixed(2)}
            // balance={parseFloat(item?.currentBalance).toFixed(2)}
            balance={" "}
            isCredit={
              item?.transcationType === "Credit" ||
              item?.transcationType === "FXCredit" ||
              item?.transcationType === "manualAdjustment" ||
              item?.transcationType === "manualAdjustmentCredit"
            }
            date={formatDate(item?.createdAt)}
            currency={item?.currency}
            tranactionNumber="ECC Charges"
          />
        );

      case "Credit":
        return (
          <HomeTransactionsList
            key="Credit"
            name={`From: ${item?.from?.IBAN}`}
            amount={parseFloat(item?.amount).toFixed(2)}
            // balance={parseFloat(item?.currentBalance).toFixed(2)}
            balance={" "}
            isCredit={
              item?.transcationType === "Credit" ||
              item?.transcationType === "FXCredit" ||
              item?.transcationType === "manualAdjustment" ||
              item?.transcationType === "manualAdjustmentCredit"
            }
            date={formatDate(item?.createdAt)}
            currency={item?.currency}
            beneficiaryName=""
            tranactionNumber={`${"Tx: "}${item?.transcationType}`}
          />
        );
      case "FXCredit":
        return (
          <HomeTransactionsList
            key="Credit"
            name={`From: ${item?.from?.IBAN}`}
            amount={parseFloat(item?.amount).toFixed(2)}
            // balance={parseFloat(item?.currentBalance).toFixed(2)}
            balance={" "}
            isCredit={
              item?.transcationType === "Credit" ||
              item?.transcationType === "FXCredit" ||
              item?.transcationType === "manualAdjustment" ||
              item?.transcationType === "manualAdjustmentCredit"
            }
            date={formatDate(item?.createdAt)}
            currency={item?.currency}
            beneficiaryName=""
            tranactionNumber={`${"Tx: "}${"FX Credit"}`}
          />
        );
      case "manualAdjustment":
        return (
          <HomeTransactionsList
            key="Credit"
            name="ECC Credit"
            amount={parseFloat(item?.amount).toFixed(2)}
            // balance={parseFloat(item?.currentBalance).toFixed(2)}
            balance={" "}
            isCredit={
              item?.transcationType === "Credit" ||
              item?.transcationType === "FXCredit" ||
              item?.transcationType === "manualAdjustment" ||
              item?.transcationType === "manualAdjustmentCredit"
            }
            date={formatDate(item?.createdAt)}
            currency={item?.currency}
            beneficiaryName=""
            tranactionNumber={`${"Tx: "}${"Manual Adjustment"}`}
          />
        );
      case "manualAdjustmentCredit":
        return (
          <HomeTransactionsList
            key="Creditsss"
            name="ECC Credit"
            amount={parseFloat(item?.amount).toFixed(2)}
            // balance={parseFloat(item?.currentBalance).toFixed(2)}
            balance={" "}
            isCredit={
              item?.transcationType === "Credit" ||
              item?.transcationType === "FXCredit" ||
              item?.transcationType === "manualAdjustment" ||
              item?.transcationType === "manualAdjustmentCredit"
            }
            date={formatDate(item?.createdAt)}
            currency={item?.currency}
            beneficiaryName=""
            tranactionNumber={`${"Tx: "}${"Manual Adjustment Credit"}`}
          />
        );

      case "Debit":
        return (
          <HomeTransactionsList
            key="fee_debit2"
            name={`To: ${item?.to?.IBAN}`}
            amount={parseFloat(item?.amount).toFixed(2)}
            // balance={parseFloat(item?.currentBalance).toFixed(2)}
            balance={" "}
            isCredit={
              item?.transcationType === "Credit" ||
              item?.transcationType === "FXCredit" ||
              item?.transcationType === "manualAdjustment" ||
              item?.transcationType === "manualAdjustmentCredit"
            }
            date={formatDate(item?.createdAt)}
            currency={item?.currency}
            beneficiaryName=""
            tranactionNumber={`${"Tx: "}${item?.transcationType}`}
          />
        );
      case "FXDebit":
        return (
          <HomeTransactionsList
            key="Debit"
            name={`To: ${item?.to?.IBAN}`}
            amount={parseFloat(item?.amount).toFixed(2)}
            // balance={parseFloat(item?.currentBalance).toFixed(2)}
            balance={" "}
            isCredit={
              item?.transcationType === "Credit" ||
              item?.transcationType === "FXCredit" ||
              item?.transcationType === "manualAdjustment" ||
              item?.transcationType === "manualAdjustmentCredit"
            }
            date={formatDate(item?.createdAt)}
            currency={item?.currency}
            beneficiaryName=""
            tranactionNumber={`${"Tx: "}${"FX Debit"}`}
          />
        );

      default:
        return (
          <HomeTransactionsList
            key="pppop"
            name=""
            amount={parseFloat(item?.amount).toFixed(2)}
            // balance={parseFloat(item?.balance).toFixed(2)}
            balance={" "}
            isCredit={item?.direction === "credit"}
            date={formatDate(item?.entryDateTime)}
            currency={item?.currency}
            tranactionNumber={`${"Tx: "}${item?.transcationType}`}
          />
        );
    }
  }
};
// default is for generic
const styles = StyleSheet.create({
  viewTrans: {
    flexDirection: "row",
    marginTop: 2,
    justifyContent: "space-between",
  },
  txtCredit: { color: "green", fontSize: getRespValue(16) },
  txtDebit: { color: "red", fontSize: getRespValue(16) },
  txtAccount: {
    color: "black",
    width: "70%",
    fontSize: getRespValue(16),
  },
  txtTrans: {
    marginTop: 5,
    color: "black",
    fontSize: getRespValue(16),
  },
  directionTxt: {
    marginTop: 5,
    color: "black",
    fontSize: getRespValue(16),
  },
});
