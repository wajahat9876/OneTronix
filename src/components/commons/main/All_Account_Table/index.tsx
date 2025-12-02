/* eslint-disable import/order */
import { useBusinessDetails } from "@/store/selectors/business/business";
import Colors from "@src/constants/Colors";
import useCurrencyFlag from "@src/hooks/useCurrencyFlag";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Define the data type
interface CurrencyBalance {
  actual?: number;
  available: number;
}

interface TransformedRow {
  currency: string;
  actual: number;
  available: number;
  status: string;
  iban: string;
}
const AllAccountTable: React.FC<any> = ({ data }) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const { getFlagImage } = useCurrencyFlag();
  const { getCurrencySymbol } = useCurrencyFlag();

  const transformedData: TransformedRow[] =
    businessData?.multiCurrencyAccounts?.map((account: any) => {
      const currency = account.currencyCode;
      const balanceData = data?.type?.[currency] as CurrencyBalance | undefined;

      return {
        currency,
        actual: balanceData?.actual ?? 0,
        available: balanceData?.available ?? 0,
        iban: businessData.IBAN ?? account?.iban ?? "N/A",
        status: account.approved ? "Approved" : "Pending",
      };
    }) ?? [];

  return (
    <View style={styles.card}>
      <FlatList
        data={transformedData}
        ListHeaderComponent={() => (
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerText]}>Account Type</Text>
            <Text style={[styles.cell, styles.headerText]}>IBAN</Text>
            <Text
              style={[styles.cell, styles.headerText, { marginLeft: hs(5) }]}
            >
              Status
            </Text>
            <Text style={[styles.cell, styles.headerText]}>Balance</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        contentContainerStyle={{ paddingBottom: vs(90) }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.cell, styles.flagContainer]}>
              <Image
                style={styles.flag}
                source={getFlagImage(item.currency)}
                resizeMode="contain"
              />
              <Text style={styles.dataText}>{item.currency}</Text>
            </View>
            <Text style={[styles.cell, styles.ibanText]}>
              {item.iban.toLocaleString()}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.dataText,
                { color: item.status === "Approved" ? "green" : "red" },
                { marginLeft: hs(5) },
              ]}
            >
              {item.status.toLocaleString()}
            </Text>

            <Text style={[styles.cell, styles.dataText]}>
              {`${getCurrencySymbol(
                item.currency
              )} ${item.available.toLocaleString()}`}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => `subAcc-${item.currency}-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: getRespValue(20),
    marginBottom: vs(20),
    marginTop: vs(8),
    shadowColor: "#000",
    width: "90%",
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === "ios" ? 2 : 0,
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: ms(5),
  },

  flag: {
    width: 20,
    height: 15,
    borderRadius: 2,
  },
  row: {
    flexDirection: "row",
    marginBottom: vs(10),
    padding: ms(8),
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  headerRow: {
    backgroundColor: Colors.light.theme.eccRedColor,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    textAlign: "center",
  },
  dataText: {
    color: "#000",
    alignSelf: "center",
    textAlign: "center",
    fontSize: ms(12),
  },

  ibanText: {
    color: "#000",
    fontSize: ms(10),
    alignSelf: "center",
  },
});

export default AllAccountTable;
