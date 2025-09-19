import React from "react";
import { StyleSheet, Text, View } from "react-native";

type DataRowProps = {
  label: string;
  value: string | number | undefined;
};

const DetailRow = ({ label, value }: DataRowProps) => {
  return (
    <View style={styles.row}>
      <Text style={{ fontSize: 12 }}>{label}</Text>
      <Text style={{ fontSize: 12 }}>
        {value != null ? `${value} kWh` : "-"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 4,
  },
});

export default DetailRow;
