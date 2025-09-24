import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BarChart } from "react-native-gifted-charts";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const screenWidth = Dimensions.get("window").width;

type BarGraphProps = {
  selectedTab: number;
  date: Date;
  selectedParams: ("ac" | "battery" | "output" | "solar")[];
  data: any[];
};

export default function BarGraph2({
  selectedTab,
  date,
  selectedParams,
  data,
}: BarGraphProps) {
  const colors: Record<string, string> = {
    ac: "red",
    battery: "blue",
    output: "#F7D102",
    solar: "#8C11BA",
  };

  // chartData logic (same as yours)
  const chartData = useMemo(() => {
    const result: any[] = [];
    let xValues: number[] = [];

    if (selectedTab === 1) {
      const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      xValues = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    } else if (selectedTab === 2) {
      xValues = Array.from({ length: 12 }, (_, i) => i + 1);
    } else if (selectedTab === 3) {
      xValues = Array.from({ length: 6 }, (_, i) => 2020 + i);
    }

    xValues.forEach((x) => {
      selectedParams.forEach((param, index) => {
        const apiEntry = data.find((d) => {
          if (selectedTab === 1) {
            return new Date(d.createdAt).getDate() === x;
          } else if (selectedTab === 2) {
            return new Date(d.createdAt).getMonth() + 1 === x;
          } else if (selectedTab === 3) {
            return new Date(d.createdAt).getFullYear() === x;
          }
          return false;
        });

        let value = 0;
        if (apiEntry) {
          switch (param) {
            case "ac":
              value = apiEntry?.grid?.dailyPurchase || 0;
              break;
            case "battery":
              value = apiEntry?.battery?.dailyCharging || 0;
              break;
            case "output":
              value = apiEntry?.consumption?.dailyConsumption || 0;
              break;
            case "solar":
              value = apiEntry?.production?.dailyProduction || 0;
              break;
          }
        }

        result.push({
          value,
          label: index === 0 ? x.toString() : "",
          spacing: index === selectedParams.length - 1 ? 4 : 2,
          frontColor: colors[param],
          labelWidth: 25,
          showValuesOnTopOfBars: true,
          valueSuffix: ` ${param}`,
          labelTextStyle: { color: "gray", fontSize: 12 },
          param,
        });
      });
    });

    return result;
  }, [selectedTab, date, selectedParams, data]);

  // 🔹 Zoom values
  const scale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      // clamp scale between min and max
      if (scale.value < 1) scale.value = withSpring(1);
      if (scale.value > 1.2) scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Legends */}
      <View
        style={{
          flexDirection: "row",
          marginBottom: 8,
          justifyContent: "center",
        }}
      >
        {selectedParams.map((param) => (
          <View
            key={param}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 6,
            }}
          >
            <View
              style={[styles.colorDot, { backgroundColor: colors[param] }]}
            />
            <Text style={{ fontSize: 12, color: "#333" }}>
              {param.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      {/* Zoomable chart */}
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={animatedStyle}>
          <BarChart
            data={chartData}
            width={300}
            height={150}
            barWidth={18}
            spacing={5}
            yAxisTextStyle={{ fontSize: 12, color: "gray" }}
            hideRules={false}
            rulesType="solid"
            rulesColor="#e0e0e0"
            rulesThickness={1}
            xAxisThickness={1}
            xAxisColor="#ccc"
            yAxisThickness={1}
            yAxisColor="#ccc"
            noOfSections={3}
            maxValue={Math.max(...chartData.map((d) => d.value)) + 10}
            renderTooltip={(item: any) => {
              if (!item) return null;
              return (
                <View
                  style={{
                    backgroundColor: "#333",
                    padding: 6,
                    borderRadius: 4,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {item.value} {item.param?.toUpperCase()}
                  </Text>
                </View>
              );
            }}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
});
