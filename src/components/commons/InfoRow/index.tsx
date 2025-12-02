import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InfoRowProps {
  label: string;
  value: string | number | null;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.separator} />
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  label: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Excon-Medium",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Excon-Regular",
  },
  separator: {
    borderBottomWidth: 0.5,
    marginTop: 10,
    opacity: 0.2,
    marginBottom: 10,
  },
});

export default InfoRow;
