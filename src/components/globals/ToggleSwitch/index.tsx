import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ToggleSwitchProps {
  label?: string;
  value: boolean | undefined;
  onValueChange: (newValue: boolean) => void;
  containerStyle?: ViewStyle;
  labelStyle?: any;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  value,
  onValueChange,
  containerStyle,
  labelStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

      <TouchableOpacity
        style={[
          styles.toggleContainer,
          value ? styles.toggleOn : styles.toggleOff,
        ]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View
          style={[styles.circle, value ? styles.circleOn : styles.circleOff]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ToggleSwitch;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    fontFamily: "Excon-Regular",
  },
  toggleContainer: {
    width: 50,
    height: 28,
    borderRadius: 20,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  toggleOn: {
    backgroundColor: "#4CAF50",
    justifyContent: "flex-end",
  },
  toggleOff: {
    backgroundColor: "#ccc",
    justifyContent: "flex-start",
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 15,
    backgroundColor: "white",
  },
  circleOn: {
    shadowColor: "#4CAF50",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  circleOff: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});
