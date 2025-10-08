import { ms } from "@utils/design/design";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  label1: string | number;
  value1: string | number;
  label2: string | number;
  value2: string | number;
  unit1: string | number;
  unit2: string | number;
  icon1?: any; // optional icon (ImageSourcePropType)
  icon2?: any;
};

const ExchangeBlock: React.FC<Props> = ({
  title,
  value1,
  value2,
  icon1,
  label1,
  label2,
  unit1,
  unit2,
  icon2,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <View style={styles.header}>
          {icon1 && <Image source={icon1} style={styles.icon} />}

          <Text style={styles.label}>{label1}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.value}>{value1}</Text>
            <Text style={styles.unit}>{unit1}</Text>
          </View>
        </View>
        <View style={styles.header}>
          {icon2 && <Image source={icon2} style={styles.icon} />}
          <Text style={styles.label}> {label2}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.value}>{value2}</Text>
            <Text style={styles.unit}>{unit2}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ExchangeBlock;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 10,
  },
  header: {
    width: "49%",
    backgroundColor: "#F3F3F3",
    padding: 20,
    borderRadius: 10,
  },
  label: { fontFamily: "Excon-medium", fontSize: ms(9) },
  value: { fontFamily: "Ranade-Medium", fontSize: ms(33) },
  unit: {
    fontFamily: "Ranade-Medium",
    fontSize: ms(13),
    marginTop: 20,
    color: "#5A5B5B",
  },
  row: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    // alignItems: "center",
  },
  icon: {
    width: 47,
    height: 32,
    marginRight: 6,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontFamily: "excon-regular",
    fontSize: ms(13),
    marginBottom: 15,
  },
  value1: {
    fontSize: ms(12),
    fontWeight: "600",
  },
  value2: {
    fontSize: ms(11),
    color: "#666",
  },
});
