import React, { forwardRef } from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Text as SvgText } from "react-native-svg";

type DonutChartProps = {
  load?: number;
  grid?: number;
  battery?: number;
  solar?: number;
};

const DonutChart2 = forwardRef<View, DonutChartProps>(
  ({ load, grid, battery, solar }, ref) => {
    const labelMap: Record<string, string> = {
      load: "To Load",
      grid: "Grid",
      battery: "Battery",
      solar: "Solar",
    };

    const colorMap: Record<string, string> = {
      load: "#A8F7C8",
      grid: "#3b82f6",
      battery: "#5DB5AE",
      solar: "#f59e0b",
    };

    const entries = Object.entries({ load, grid, battery, solar }).filter(
      ([, v]) => v !== undefined
    );

    const total = entries.reduce((sum, [, v]) => sum + (v || 0), 0);

    // Build data with midAngle for alignment
    const data = (() => {
      let cumulative = 0;
      return entries.map(([key, value]) => {
        const val = value || 0;
        const percentage = total > 0 ? (val / total) * 100 : 0;
        const angle = (val / total) * 360;
        const midAngle = cumulative + angle / 2; // midpoint of slice
        cumulative += angle;

        return {
          value: val,
          color: colorMap[key],
          text: `${percentage.toFixed(1)}%`,
          label: labelMap[key],
          midAngle,
          labelLineConfig: {
            length: 25,
            tailLength: 18,
            color: colorMap[key],
            strokeWidth: 1.5,
          },
        };
      });
    })();

    return (
      <View ref={ref} style={{ alignItems: "center", padding: 20 }}>
        <PieChart
          donut
          radius={50}
          innerRadius={40}
          data={data || []}
          showText={false}
          focusOnPress={false}
          showExternalLabels
          labelLineConfig={{
            length: 25,
            tailLength: 18,
            color: "gray",
          }}
          externalLabelComponent={(item: any) => {
            const isLeft = item.midAngle > 90 && item.midAngle < 270;
            return (
              <SvgText
                fontSize={10}
                fontWeight="600"
                fill={item?.color ?? "#333"}
                textAnchor={isLeft ? "end" : "start"}
                dx={isLeft ? -0 : 8}
                dy={6}
              >
                {item?.text}
              </SvgText>
            );
          }}
          centerLabelComponent={() => (
            <Text style={{ fontSize: 13, fontWeight: "bold" }}>
              {total.toFixed(1)} kWh
            </Text>
          )}
        />

        {/* Legend */}
        <View style={{ marginTop: 12, alignItems: "flex-start" }}>
          {data.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: item.color,
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 12, color: "#333" }}>
                {item.label} ({item.value} kWh — {item.text})
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
);

DonutChart2.displayName = "DonutChart2"; // 👈 for devtools friendliness
export default DonutChart2;
