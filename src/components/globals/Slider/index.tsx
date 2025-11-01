import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ZoomSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
}

export default function ZoomSlider({
  min = 1,
  max = 6,
  step = 1,
  value,
  onChange,
}: ZoomSliderProps) {
  const sliderWidth = 200; // total width of slider
  const [sliderValue, setSliderValue] = useState(value);
  const pan = useRef(new Animated.ValueXY()).current;

  // Calculate position based on value
  const valueToPosition = (val: number) =>
    ((val - min) / (max - min)) * sliderWidth;
  const positionToValue = (pos: number) =>
    Math.round(
      (Math.min(Math.max(pos, 0), sliderWidth) / sliderWidth) * (max - min) +
        min
    );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newValue = positionToValue(
          gestureState.dx + valueToPosition(sliderValue)
        );
        setSliderValue(newValue);
        onChange(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const newValue = positionToValue(
          gestureState.dx + valueToPosition(sliderValue)
        );
        setSliderValue(newValue);
        onChange(newValue);
      },
    })
  ).current;

  const knobPosition = valueToPosition(sliderValue);

  return (
    <View style={styles.container}>
      <View style={styles.track} />
      <Animated.View
        style={[styles.knob, { left: knobPosition - 15 }]} // knob width/2
        {...panResponder.panHandlers}
      />
      <Text style={styles.valueText}>Zoom: {sliderValue.toFixed(0)}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => onChange(Math.max(min, sliderValue - step))}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChange(Math.min(max, sliderValue + step))}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: "center",
  },
  track: {
    width: 200,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
  },
  knob: {
    position: "absolute",
    top: -8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#0770FF",
  },
  valueText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 10,
    gap: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
