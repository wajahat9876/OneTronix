/* eslint-disable import/order */
import Colors from "@src/constants/Colors";
import useFormatDate from "@src/hooks/useFormatDate";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";

const InvoiceTable: React.FC<any> = ({ data }) => {
  const { formatDate } = useFormatDate();
  return (
    <View style={styles.card}>
      <FlatList
        data={data}
        ListHeaderComponent={() => (
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerText]}>Date</Text>
            <Text style={[styles.cell, styles.headerText]}>Type</Text>
            <Text style={[styles.cell, styles.headerText]}>Status</Text>
            <Text style={[styles.cell, styles.headerText]}>Amount</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        contentContainerStyle={{ paddingBottom: vs(30) }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.cell, styles.dataText]}>
              {formatDate(item.date)}
            </Text>

            <Text style={[styles.cell, styles.dataText, { marginLeft: hs(5) }]}>
              {item.type}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.dataText,
                {
                  color: item.status === "Success" ? "green" : "red",
                  marginRight: hs(-8),
                },
              ]}
            >
              {item.status}
            </Text>
            <Text style={[styles.cell, styles.dataText]}>{item.amount}</Text>
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
    width: "98%",
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === "ios" ? 2 : 4,
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
    fontSize: ms(10),
  },
});

export default InvoiceTable;
