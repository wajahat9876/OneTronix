/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/require-default-props */
import Logo from "@assets/eccLogo/ecc small icon.svg";
import { getRespValue } from "@utils/getRespValue";
import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IDetailsRow, ITransactionDetails } from "./types";

const DetailsRow = ({ left, right }: IDetailsRow) => {
  return (
    <View style={styles.wrapView}>
      <Text style={styles.subHeading}>{left}</Text>
      <Text style={styles.txt}>{right}</Text>
    </View>
  );
};
const specialAccounts = [
  "operating account",
  "easy cash card expense",
  "easy cash card",
  "GBP FX Settlement Account - PagoNxt",
];
export const RenderItem = ({
  transactionDetails,
  activeCurrency,
}: {
  transactionDetails: ITransactionDetails;
  activeCurrency: any;
}) => {
  const formatDate = (dateString: any): any => {
    if (!dateString) return "";
    return moment(dateString).format("DD MMM YYYY");
  };
  const formatTime = (dateString: any): any => {
    if (!dateString) return "";
    return moment(dateString).format("hh:mm A"); // 12-hour format with AM/PM
  };

  if (activeCurrency === 1) {
    switch (transactionDetails?.transcationType) {
      case "feeDebit": {
        return (
          <>
            <DetailsRow left="Name" right="ECC Charges" />
            <DetailsRow
              left="Reference"
              right={
                transactionDetails?.transactionReference?.includes("-")
                  ? transactionDetails.transactionReference.split("-")[1]
                  : transactionDetails?.transactionReference
              }
            />

            <DetailsRow left="Transfer Type" right="Debit" />

            <DetailsRow
              left="Amount:"
              right={`${parseFloat(
                transactionDetails?.amount?.instructedAmount
              ).toFixed(2)} ${transactionDetails?.amount?.currency}`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Balance:"
              right={`${parseFloat(transactionDetails?.balance ?? "0").toFixed(
                2
              )} ${transactionDetails?.amount?.currency}`}
            />
          </>
        );
      }
      case "Credit": {
        const accountName =
          transactionDetails?.counterpartAccount?.identification?.accountName ??
          "";
        const isSpecialAccount = specialAccounts.some((acc) =>
          accountName.toLowerCase().includes(acc.toLowerCase())
        );
        const displayName = isSpecialAccount
          ? transactionDetails?.counterpartAccount?.identification?.iban
          : accountName;
        return (
          <>
            {isSpecialAccount ? (
              <>
                <DetailsRow left="From" right={displayName} />
                <DetailsRow
                  left="Reference"
                  right={
                    transactionDetails?.transactionReference?.includes("-")
                      ? transactionDetails.transactionReference.split("-")[1]
                      : transactionDetails?.transactionReference
                  }
                />
              </>
            ) : (
              <DetailsRow left="Name" right={accountName} />
            )}

            <DetailsRow left="Transfer Type" right="Credit" />

            <DetailsRow
              left="Amount:"
              right={`${parseFloat(
                transactionDetails?.amount?.instructedAmount
              ).toFixed(2)} ${transactionDetails?.amount?.currency}`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Balance:"
              right={`${parseFloat(transactionDetails?.balance ?? "0").toFixed(
                2
              )} ${transactionDetails?.amount?.currency}`}
            />
          </>
        );
      }
      case "FXCredit": {
        const accountName =
          transactionDetails?.counterpartAccount?.identification?.accountName ??
          "";
        const isSpecialAccount = specialAccounts.some((acc) =>
          accountName.toLowerCase().includes(acc.toLowerCase())
        );
        const displayName = isSpecialAccount
          ? transactionDetails?.counterpartAccount?.identification?.iban
          : accountName;
        return (
          <>
            {/* {isSpecialAccount ? (
              <>
                <DetailsRow left="From" right={displayName} />
                <DetailsRow
                  left="Reference"
                  right={
                    transactionDetails?.transactionReference?.includes('-')
                      ? transactionDetails.transactionReference.split('-')[1]
                      : transactionDetails?.transactionReference
                  }
                />
              </>
            ) : (
              <DetailsRow left="Name" right={accountName} />
            )} */}

            <DetailsRow left="Transfer Type" right="Exchange" />

            <DetailsRow
              left="Amount:"
              right={`${parseFloat(
                transactionDetails?.amount?.instructedAmount
              ).toFixed(2)} ${transactionDetails?.amount?.currency}`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Balance:"
              right={`${parseFloat(transactionDetails?.balance ?? "0").toFixed(
                2
              )} ${transactionDetails?.amount?.currency}`}
            />
          </>
        );
      }
      case "manualAdjustmentCredit": {
        const accountName =
          transactionDetails?.counterpartAccount?.identification?.accountName ??
          "";
        const isSpecialAccount = specialAccounts.some((acc) =>
          accountName.toLowerCase().includes(acc.toLowerCase())
        );
        const displayName = isSpecialAccount
          ? transactionDetails?.counterpartAccount?.identification?.iban
          : accountName;
        return (
          <>
            {/* {isSpecialAccount ? (
              <>
                <DetailsRow left="From" right={displayName} />
                <DetailsRow
                  left="Reference"
                  right={transactionDetails?.transactionReference}
                />
              </>
            ) : (
              <DetailsRow left="Name" right={accountName} />
            )} */}
            <DetailsRow
              left="Reference"
              right={
                transactionDetails?.transactionReference?.includes("-")
                  ? transactionDetails.transactionReference.split("-")[1]
                  : transactionDetails?.transactionReference
              }
            />
            <DetailsRow left="Transfer Type" right="Manual Adjustment Credit" />

            <DetailsRow
              left="Amount:"
              right={`${parseFloat(
                transactionDetails?.amount?.instructedAmount
              ).toFixed(2)} ${transactionDetails?.amount?.currency}`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Balance:"
              right={`${parseFloat(transactionDetails?.balance ?? "0").toFixed(
                2
              )} ${transactionDetails?.amount?.currency}`}
            />
          </>
        );
      }
      case "manualAdjustment": {
        const accountName =
          transactionDetails?.counterpartAccount?.identification?.accountName ??
          "";
        const isSpecialAccount = specialAccounts.some((acc) =>
          accountName.toLowerCase().includes(acc.toLowerCase())
        );
        const displayName = isSpecialAccount
          ? transactionDetails?.counterpartAccount?.identification?.iban
          : accountName;
        return (
          <>
            {/* {isSpecialAccount ? (
              <>
                <DetailsRow left="From" right={displayName} />
                <DetailsRow
                  left="Reference"
                  right={transactionDetails?.transactionReference}
                />
              </>
            ) : (
              <DetailsRow left="Name" right={accountName} />
            )} */}
            <DetailsRow
              left="Reference"
              right={
                transactionDetails?.transactionReference?.includes("-")
                  ? transactionDetails.transactionReference.split("-")[1]
                  : transactionDetails?.transactionReference
              }
            />
            <DetailsRow left="Transfer Type" right="Manual Adjustment" />

            <DetailsRow
              left="Amount:"
              right={`${parseFloat(
                transactionDetails?.amount?.instructedAmount
              ).toFixed(2)} ${transactionDetails?.amount?.currency}`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Balance:"
              right={`${parseFloat(transactionDetails?.balance ?? "0").toFixed(
                2
              )} ${transactionDetails?.amount?.currency}`}
            />
          </>
        );
      }
      case "FXDebit": {
        const accountName =
          transactionDetails?.counterpartAccount?.identification?.accountName ??
          "";
        const isSpecialAccount = specialAccounts.some((acc) =>
          accountName.toLowerCase().includes(acc.toLowerCase())
        );
        const displayName = isSpecialAccount
          ? transactionDetails?.counterpartAccount?.identification?.iban
          : accountName;
        return (
          <>
            {/* {isSpecialAccount ? (
              <>
                <DetailsRow left="To" right={displayName} />
                <DetailsRow
                  left="Reference"
                  right={
                    transactionDetails?.transactionReference?.includes('-')
                      ? transactionDetails.transactionReference.split('-')[1]
                      : transactionDetails?.transactionReference
                  }
                />
              </>
            ) : (
              <DetailsRow left="Name" right={accountName} />
            )} */}

            <DetailsRow left="Transfer Type" right="Exchange" />

            <DetailsRow
              left="Amount:"
              right={`${parseFloat(
                transactionDetails?.amount?.instructedAmount
              ).toFixed(2)} ${transactionDetails?.amount?.currency}`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Balance:"
              right={`${parseFloat(transactionDetails?.balance ?? "0").toFixed(
                2
              )} ${transactionDetails?.amount?.currency}`}
            />
          </>
        );
      }
      case "Debit": {
        const accountName =
          transactionDetails?.counterpartAccount?.identification?.accountName ??
          "";
        const isSpecialAccount = specialAccounts.some((acc) =>
          accountName.toLowerCase().includes(acc.toLowerCase())
        );
        const displayName = isSpecialAccount
          ? transactionDetails?.counterpartAccount?.identification?.iban
          : accountName;
        return (
          <>
            {isSpecialAccount ? (
              <>
                <DetailsRow left="To" right={displayName} />
                <DetailsRow
                  left="Reference"
                  right={
                    transactionDetails?.transactionReference?.includes("-")
                      ? transactionDetails.transactionReference.split("-")[1]
                      : transactionDetails?.transactionReference
                  }
                />
              </>
            ) : (
              <DetailsRow left="Name" right={accountName} />
            )}

            <DetailsRow left="Transfer Type" right="Debit" />

            <DetailsRow
              left="Amount:"
              right={`${parseFloat(
                transactionDetails?.amount?.instructedAmount
              ).toFixed(2)} ${transactionDetails?.amount?.currency}`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.transactionTime)}
            />
            <DetailsRow
              left="Balance:"
              right={`${parseFloat(transactionDetails?.balance ?? "0").toFixed(
                2
              )} ${transactionDetails?.amount?.currency}`}
            />
          </>
        );
      }

      default:
        return (
          <>
            <DetailsRow left="Sender:" right="Easy E-Money" />

            <DetailsRow
              left="Send Amount:"
              right={`${parseFloat(transactionDetails?.amount).toFixed(2)} ${
                transactionDetails?.currency
              }`}
            />
            <DetailsRow
              left="Balance:"
              right={`${parseFloat(transactionDetails?.balance ?? "0").toFixed(
                2
              )} ${transactionDetails?.currency}`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.entryDateTime)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.entryDateTime)}
            />
            <DetailsRow
              left="Transaction Type:"
              right={transactionDetails?.direction}
            />
            {/* generic ma fee type wala kam krna ha  */}
            {/* <DetailsRow
            left="Fee Type:"
            right={`${parseFloat(transactionDetails?.totalAmount).toFixed(2)} ${
              transactionDetails?.currency
            }`}
          /> */}
          </>
        );
    }
  } else {
    switch (transactionDetails?.transcationType) {
      case "feeDebit":
        return (
          <>
            {/* <DetailsRow left="Name" right="ECC Charges" /> */}
            <DetailsRow left="Transfer Type" right="ECC Charges" />

            <DetailsRow
              left="Amount:"
              right={`${parseFloat(transactionDetails?.amount).toFixed(2)} ${
                transactionDetails?.currency
              }`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.createdAt)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.createdAt)}
            />
            {/* <DetailsRow
              left="Balance:"
              right={`${parseFloat(
                transactionDetails?.currentBalance ?? '0',
              ).toFixed(2)} ${transactionDetails?.currency}`}
            /> */}
          </>
        );
      case "Credit":
        return (
          <>
            <DetailsRow left="From" right={transactionDetails?.from?.IBAN} />
            <DetailsRow left="Transfer Type" right="Credit" />
            <DetailsRow
              left="Amount:"
              right={`${parseFloat(transactionDetails?.amount).toFixed(2)} ${
                transactionDetails?.currency
              }`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.createdAt)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.createdAt)}
            />
            {/* <DetailsRow
              left="Balance:"
              right={`${parseFloat(
                transactionDetails?.currentBalance ?? '0',
              ).toFixed(2)} ${transactionDetails?.currency}`}
            /> */}
          </>
        );
      case "FXCredit":
        return (
          <>
            <DetailsRow left="From" right={transactionDetails?.from?.IBAN} />
            <DetailsRow left="Transfer Type" right="Exchange" />

            <DetailsRow
              left="Amount:"
              right={`${parseFloat(transactionDetails?.amount).toFixed(2)} ${
                transactionDetails?.currency
              }`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.createdAt)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.createdAt)}
            />
            {/* <DetailsRow
              left="Balance:"
              right={`${parseFloat(
                transactionDetails?.currentBalance ?? '0',
              ).toFixed(2)} ${transactionDetails?.currency}`}
            /> */}
          </>
        );
      case "manualAdjustmentCredit":
        return (
          <>
            {/* <DetailsRow left="From" right={transactionDetails?.from?.IBAN} /> */}
            <DetailsRow left="Transfer Type" right="Manual Adjustment Credit" />
            <DetailsRow
              left="Amount:"
              right={`${parseFloat(transactionDetails?.amount).toFixed(2)} ${
                transactionDetails?.currency
              }`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.createdAt)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.createdAt)}
            />
            {/* <DetailsRow
              left="Balance:"
              right={`${parseFloat(
                transactionDetails?.currentBalance ?? '0',
              ).toFixed(2)} ${transactionDetails?.currency}`}
            /> */}
          </>
        );
      case "manualAdjustment":
        return (
          <>
            {/* <DetailsRow left="From" right={transactionDetails?.from?.IBAN} /> */}
            <DetailsRow left="Transfer Type" right="Manual Adjustment" />
            <DetailsRow
              left="Amount:"
              right={`${parseFloat(transactionDetails?.amount).toFixed(2)} ${
                transactionDetails?.currency
              }`}
            />

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.createdAt)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.createdAt)}
            />
            {/* <DetailsRow
              left="Balance:"
              right={`${parseFloat(
                transactionDetails?.currentBalance ?? '0',
              ).toFixed(2)} ${transactionDetails?.currency}`}
            /> */}
          </>
        );
      case "Debit":
        return (
          <>
            <DetailsRow left="To" right={transactionDetails?.to?.IBAN} />
            <DetailsRow left="Transfer Type" right="Debit" />
            <DetailsRow
              left="Amount:"
              right={`${parseFloat(transactionDetails?.amount).toFixed(2)} ${
                transactionDetails?.currency
              }`}
            />
            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.createdAt)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.createdAt)}
            />
            {/* <DetailsRow
              left="Balance:"
              right={`${parseFloat(
                transactionDetails?.currentBalance ?? '0',
              ).toFixed(2)} ${transactionDetails?.currency}`}
            /> */}
          </>
        );
      case "FXDebit":
        return (
          <>
            <DetailsRow left="To" right={transactionDetails?.to?.IBAN} />
            <DetailsRow left="Transfer Type" right="Exchange" />
            <DetailsRow
              left="Amount:"
              right={`${parseFloat(transactionDetails?.amount).toFixed(2)} ${
                transactionDetails?.currency
              }`}
            />
            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.createdAt)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.createdAt)}
            />
            {/* <DetailsRow
              left="Balance:"
              right={`${parseFloat(
                transactionDetails?.currentBalance ?? '0',
              ).toFixed(2)} ${transactionDetails?.currency}`}
            /> */}
          </>
        );

      default:
        return (
          <>
            <DetailsRow left="Sender:" right="ECC" />

            <DetailsRow
              left="Send Amount:"
              right={`${parseFloat(transactionDetails?.amount).toFixed(2)} ${
                transactionDetails?.currency
              }`}
            />
            {/* <DetailsRow
              left="Balance:"
              right={`${parseFloat(transactionDetails?.balance ?? '0').toFixed(
                2,
              )} ${transactionDetails?.currency}`}
            /> */}

            <DetailsRow
              left="Date:"
              right={formatDate(transactionDetails?.entryDateTime)}
            />
            <DetailsRow
              left="Time:"
              right={formatTime(transactionDetails?.entryDateTime)}
            />
            <DetailsRow
              left="Transaction Type:"
              right={transactionDetails?.direction}
            />
            {/* generic ma fee type wala kam krna ha  */}
            {/* <DetailsRow
            left="Fee Type:"
            right={`${parseFloat(transactionDetails?.totalAmount).toFixed(2)} ${
              transactionDetails?.currency
            }`}
          /> */}
          </>
        );
    }
  }
};
const TransactionSummary = ({
  transactionDetails,
  activeCurrency,
}: {
  transactionDetails: ITransactionDetails;
  activeCurrency: any;
}) => {
  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 5 }}>
      <View style={styles.mainContainer}>
        <Logo />
        <Text
          style={{
            fontSize: 18,
            marginBottom: 50,
            marginTop: getRespValue(20),
          }}
        >
          Transaction Details
        </Text>
      </View>
      <RenderItem
        transactionDetails={transactionDetails}
        activeCurrency={activeCurrency}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    marginTop: getRespValue(20),
  },
  wrapView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: getRespValue(20),
    marginBottom: getRespValue(20),
  },
  subHeading: { fontSize: getRespValue(18) },
  txt: { marginLeft: 10, fontSize: getRespValue(18) },
  closeBtn: {
    position: "absolute",
    bottom: 2,
  },
});

export default TransactionSummary;
