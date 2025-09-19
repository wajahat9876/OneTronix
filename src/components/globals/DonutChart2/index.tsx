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

    // Build data
    const data = (() => {
      if (total === 0) {
        // fallback slice so empty donut still shows
        return [
          {
            value: 1,
            color: "#e5e7eb", // light gray for empty chart
            label: "No Data",
            text: "0%",
          },
        ];
      }

      let cumulative = 0;
      return entries.map(([key, value]) => {
        const val = value || 0;
        const percentage = (val / total) * 100;
        const angle = (val / total) * 360;
        const midAngle = cumulative + angle / 2;
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
          data={data}
          showText={false}
          focusOnPress={false}
          showExternalLabels={total > 0} // hide labels if no data
          labelLineConfig={{
            length: 25,
            tailLength: 18,
            color: "gray",
          }}
          externalLabelComponent={(item: any) => {
            if (!item.midAngle) return null;
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
              {total === 0 ? "No Data" : `${total.toFixed(1)} kWh`}
            </Text>
          )}
        />

        {/* Legend */}
        <View style={{ marginTop: 12, alignItems: "flex-start" }}>
          {total > 0 ? (
            data.map((item, index) => (
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
            ))
          ) : (
            <Text style={{ fontSize: 12, color: "#666" }}>
              No breakdown available
            </Text>
          )}
        </View>
      </View>
    );
  }
);

DonutChart2.displayName = "DonutChart2";
export default DonutChart2;
