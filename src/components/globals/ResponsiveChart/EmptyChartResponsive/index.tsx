import { ms, vs } from "@utils/design/design";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Chart,
  HorizontalAxis,
  VerticalAxis,
} from "react-native-responsive-linechart";

interface PowerData {
  hour: number;
  Purchase: number;
  Charging: number;
  Discharging: number;
  Consumption: number;
  Solar: number;
}
interface EmptyChartProps {
  xMax?: number;
  yMax?: number;
  tickValues?: number[];
  selectedParams: (keyof PowerData)[];
}

export default function EmptyChart({
  xMax = 24,
  yMax = 10,
  tickValues = [0, 6, 12, 18, 24],
  selectedParams,
}: EmptyChartProps) {
  // ✅ stable formatter function
  const formatHourToAmPm = useCallback((hour: number) => {
    const hrs = Math.floor(hour) % 24;
    const suffix = hrs >= 12 ? "PM" : "AM";
    const displayHour = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${displayHour} ${suffix}`;
  }, []);

  // ✅ stable static objects
  const colors = useMemo(
    () => ({
      hour: "#000000",
      Purchase: "#ff2e24",
      Charging: "#5ac3d8",
      Discharging: "#de9b14",
      Consumption: "#2f2f2f",
      Solar: "#27c840",
    }),
    []
  );

  const paramDisplayNames = useMemo(
    () => ({
      Purchase: "Purchasing Power",
      Consumption: "Consumption Power",
      Charging: "Charging Power",
      Discharging: "Discharging Power",
      Solar: "Solar Power",
    }),
    []
  );

  const [legendValues] = useState<Record<string, number | undefined>>({});

  return (
    <View style={{ flex: 1, marginTop: 5 }}>
      <View style={{ paddingHorizontal: 16, marginLeft: 10 }}>
        {selectedParams.map((param) => {
          const value = legendValues[param] ?? "--";
          const displayName = paramDisplayNames[param] ?? param;
          return (
            <View
              key={param}
              style={[styles.dotText, { marginRight: 6, marginTop: vs(10) }]}
            >
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: colors[param] ?? "#000" },
                ]}
              />
              <Text
                style={{
                  color: "#111",
                  fontSize: ms(11),
                  fontFamily: "Ranade-Regular",
                }}
              >
                {displayName.toUpperCase()}: {value}
              </Text>
            </View>
          );
        })}
      </View>
      <Chart
        style={{ height: vs(370), width: "100%" }}
        data={[
          { x: -2, y: 15 },
          { x: -1, y: 10 },
          { x: 0, y: 12 },
          { x: 1, y: 7 },
          { x: 2, y: 6 },
          { x: 3, y: 8 },
          { x: 4, y: 10 },
          { x: 5, y: 8 },
          { x: 6, y: 12 },
          { x: 7, y: 14 },
          { x: 8, y: 12 },
          { x: 9, y: 13.5 },
          { x: 10, y: 18 },
        ]} // real data, not just [{x:0,y:0}]
        padding={{ left: 40, bottom: 20, right: 15, top: 20 }}
        xDomain={{ min: 0, max: xMax }}
        yDomain={{ min: 0, max: yMax }}
      >
        <VerticalAxis
          tickValues={[0, yMax]}
          theme={{
            grid: { stroke: { color: "#ccc", width: 0.5 } },
            axis: { stroke: { color: "gray", width: 1 } },
            ticks: { stroke: { color: "#ccc", width: 0.3 } },
            labels: {
              label: {
                fontSize: ms(10),
                fontFamily: "Ranade-Medium",
              },
              formatter: (v: number) => `${v} kW`,
            },
          }}
        />

        <HorizontalAxis
          tickValues={tickValues}
          theme={{
            grid: { stroke: { color: "#ccc", width: 0.5 } },
            axis: { stroke: { color: "gray", width: 1 } },
            ticks: { stroke: { color: "#ccc", width: 1 } },
            labels: {
              label: {
                rotation: 0,
                fontSize: ms(10),
                fontFamily: "Ranade-Medium",
              },
              formatter: formatHourToAmPm, // ✅ stable ref
            },
          }}
        />
      </Chart>
    </View>
  );
}

const styles = StyleSheet.create({
  dotText: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
});
