import Diagram from "@assets/icons/diagram.png";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

const HouseDiagram = ({
  solar = 230,
  home = 446,
  grid = 142,
  battery = 34,
}) => {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={Diagram} style={styles.image} resizeMode="contain" />

      {/* SVG overlay for lines */}
      <Svg style={StyleSheet.absoluteFill}>
        {/* Line to Solar */}
        <Line
          x1="250"
          y1="80"
          x2="310"
          y2="30"
          stroke="black"
          strokeWidth="1.5"
        />
        <Circle cx="310" cy="30" r="3" fill="black" />

        {/* Line to Home */}
        <Line
          x1="100"
          y1="150"
          x2="50"
          y2="50"
          stroke="black"
          strokeWidth="1.5"
        />
        <Circle cx="50" cy="50" r="3" fill="black" />

        {/* Line to Batteries */}
        <Line
          x1="180"
          y1="260"
          x2="100"
          y2="320"
          stroke="black"
          strokeWidth="1.5"
        />
        <Circle cx="100" cy="320" r="3" fill="black" />

        {/* Line to Grid */}
        <Line
          x1="220"
          y1="200"
          x2="350"
          y2="300"
          stroke="black"
          strokeWidth="1.5"
        />
        <Circle cx="350" cy="300" r="3" fill="black" />
      </Svg>

      {/* Labels */}
      <View style={[styles.label, { top: 0, left: 315 }]}>
        <Text style={styles.labelTitle}>Solar</Text>
        <Text style={styles.labelValue}>{solar} kW</Text>
      </View>

      <View style={[styles.label, { top: 18, left: 20 }]}>
        <Text style={styles.labelTitle}>Home</Text>
        <Text style={styles.labelValue}>{home} kW</Text>
      </View>

      <View style={[styles.label, { bottom: 15, left: 45 }]}>
        <Text style={styles.labelTitle}>Batteries</Text>
        <Text style={styles.labelValue}>{battery} kW</Text>
      </View>

      <View style={[styles.label, { bottom: 6, right: 20 }]}>
        <Text style={styles.labelTitle}>Grid</Text>
        <Text style={styles.labelValue}>{grid} kW</Text>
      </View>
    </View>
  );
};

export default HouseDiagram;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 380,
    height: 340,
  },
  label: {
    position: "absolute",
    alignItems: "center",
  },
  labelTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "black",
  },
  labelValue: {
    fontSize: 12,
    color: "#555",
  },
});
