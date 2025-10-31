import { ms, vs } from "@utils/design/design";
import React, { useState } from "react";
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
  xMax?: number; // optional, default 24
  yMax?: number; // optional, default 10
  tickValues?: number[];
  selectedParams: (keyof PowerData)[];
}

export default function EmptyChart({
  xMax = 24,
  yMax = 10,
  tickValues = [0, 6, 12, 18, 24],
  selectedParams,
}: EmptyChartProps) {
  const formatHourToAmPm = (hour: number) => {
    const hrs = Math.floor(hour) % 24;
    const suffix = hrs >= 12 ? "PM" : "AM";
    const displayHour = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${displayHour} ${suffix}`;
  };
  const colors: Record<keyof PowerData, string> = {
    hour: "#000000",
    Purchase: "#0770FF",
    Charging: "#F2597F",
    Discharging: "gray",
    Consumption: "#F7D102",
    Solar: "#A020F0",
  };

  const [legendValues, setLegendValues] = useState<
    Record<string, number | undefined>
  >({});
  const paramDisplayNames: Record<string, string> = {
    Purchase: "Purchasing Power",
    Consumption: "Consumption Power",
    Charging: "Charging Power",
    Discharging: "Discharging Power",
    Solar: "Solar Power",
  };
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
                {displayName}: {value}
              </Text>
            </View>
          );
        })}
      </View>
      <Chart
        style={{ height: vs(370), width: "100%" }}
        data={[{ x: 0, y: 0 }]} // placeholder point
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
              formatter: (v: number) => formatHourToAmPm(v),
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
