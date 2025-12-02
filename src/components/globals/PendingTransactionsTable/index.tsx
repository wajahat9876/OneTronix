import useformatdata from "@hooks/useFormatDate";
import Colors from "@src/constants/Colors";
import useCapitalizeFirstWord from "@src/hooks/useCapitalizeFirst";
import useCurrencyFlag from "@src/hooks/useCurrencyFlag";
import { ms, vs } from "@utils/design/design";
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

const PendingTransactionsTable: React.FC<{
  data: any[];
  headers: { label: string; key: string }[];
}> = ({ data, headers }) => {
  const { getFlagImage, getCurrencySymbol } = useCurrencyFlag();
  const { formatDate, formatTime } = useformatdata();
  const { capitalizeFirstWord } = useCapitalizeFirstWord();

  return (
    <View style={styles.card}>
      <FlatList
        data={data}
        ListHeaderComponent={() => (
          <View style={[styles.row, styles.headerRow]}>
            {headers.map((header) => (
              <Text key={header.key} style={[styles.cell, styles.headerText]}>
                {header.label}
              </Text>
            ))}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pending exchange data found</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(90) }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {headers.map((header) => {
              const value = item[header.key];

              if (["buyCurrency", "sellCurrency"].includes(header.key)) {
                return (
                  <View
                    key={header.key}
                    style={[styles.cell, styles.flagContainer]}
                  >
                    <Image
                      source={getFlagImage(value)}
                      style={styles.flag}
                      resizeMode="contain"
                    />
                    <Text style={styles.dataText}>{value}</Text>
                  </View>
                );
              }

              if (header.key === "status") {
                return (
                  <View key={header.key} style={styles.cell}>
                    <Text
                      style={[
                        styles.dataText,
                        { color: value === "pending" ? "red" : "green" },
                      ]}
                    >
                      {capitalizeFirstWord(value?.toString() || "")}
                    </Text>
                  </View>
                );
              }

              if (header.key === "sellAmount" || header.key === "buyAmount") {
                const currency =
                  header.key === "sellAmount"
                    ? item.sellCurrency
                    : item.buyCurrency;
                return (
                  <View key={header.key} style={styles.cell}>
                    <Text style={styles.dataText}>
                      {getCurrencySymbol(currency)}
                      {value}
                    </Text>
                  </View>
                );
              }

              if (header.key === "updatedAt") {
                return (
                  <Text key={header.key} style={[styles.cell, styles.dateText]}>
                    {formatDate(value)}, {formatTime(value)}
                  </Text>
                );
              }

              return (
                <Text key={header.key} style={[styles.cell, styles.dataText]}>
                  {value ?? "-"}
                </Text>
              );
            })}
          </View>
        )}
        keyExtractor={(item, index) => `pending-${item.currency}-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: getRespValue(10),
    marginBottom: vs(20),
    marginTop: vs(8),
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === "ios" ? 2 : 0,
  },
  row: {
    flexDirection: "row",
    marginBottom: vs(8),
    paddingHorizontal: ms(4),
    paddingVertical: ms(6),
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  headerRow: {
    backgroundColor: Colors.light.theme.eccRedColor,
  },
  cell: {
    flex: 1,
    paddingHorizontal: ms(4),
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: ms(10),
    textAlign: "center",
  },
  dataText: {
    color: "#000",
    fontSize: ms(10),
    textAlign: "center",
  },
  dateText: {
    color: "#000",
    fontSize: ms(9),
    textAlign: "center",
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 20,
    height: 15,
    borderRadius: 2,
  },
  emptyContainer: {
    paddingVertical: vs(20),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  emptyText: {
    color: "#999",
    fontSize: ms(14),
    textAlign: "center",
  },
});

export default PendingTransactionsTable;
