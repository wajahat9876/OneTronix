import { ms } from "@utils/design/design";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type DataRowProps = {
  label: string;
  value: string | number | undefined;
  unit: string | number | undefined;
};

const DetailRow = ({ label, value, unit }: DataRowProps) => {
  return (
    <View style={styles.row}>
      <Text style={{ fontSize: ms(13), fontFamily: "Excon-Regular" }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: ms(12), fontFamily: "Ranade-Medium" }}>
          {value != null ? `${value} ` : "-"}
        </Text>
        <Text style={{ fontSize: ms(12), fontFamily: "Ranade-Medium" }}>
          {value != null ? `${unit}` : "-"}
        </Text>
      </View>
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
