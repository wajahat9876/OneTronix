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
      load: "#F5192C",
      grid: "#3b82f6",
      battery: "#AF1520",
      solar: "#F7D102",
    };

    const entries = Object.entries({ load, grid, battery, solar }).filter(
      ([, v]) => v !== undefined
    );

    const total = entries.reduce((sum, [, v]) => sum + (v || 0), 0);

    // control gap size here
    const gapRatio = 0.3; // 15% gap
    const gapValue = total * gapRatio || 1;

    const data =
      total === 0
        ? [
            {
              value: 1,
              color: "#e5e7eb",
              label: "No Data",
              text: "0%",
            },
          ]
        : [
            ...entries.map(([key, value]) => {
              const val = value || 0;
              const percentage = (val / total) * 100;
              return {
                value: val,
                color: colorMap[key],
                text: `${percentage.toFixed(1)}%`,
                label: labelMap[key],
              };
            }),
            {
              value: gapValue,
              color: "#ffffff", // bottom space always white
              label: "Gap",
              text: "",
            },
          ];

    return (
      <View ref={ref} style={{ alignItems: "center", padding: 20 }}>
        <PieChart
          donut
          radius={76}
          innerRadius={70}
          data={data.map((item) => ({
            ...item,
            labelLineConfig: {
              length: 2,
              thickness: 1,
              color: item.color, // ✅ match line color with slice/text color
            },
          }))}
          showText={false}
          focusOnPress={false}
          showExternalLabels={true}
          labelLineConfig={{
            length: 12,
            thickness: 1,
            color: "black",
          }}
          externalLabelComponent={(item: any) =>
            item.label !== "Gap" ? (
              <SvgText
                alignmentBaseline="middle"
                fontSize={10}
                fontWeight="600"
                fill={item?.color ?? "#333"}
                textAnchor="start"
                dy={0}
                dx={-5}
              >
                {item?.text}
              </SvgText>
            ) : null
          }
          centerLabelComponent={() => (
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                marginTop: total ? 90 : 0,
              }}
            >
              {total === 0 ? "No Data" : `${total.toFixed(1)} kWh`}
            </Text>
          )}
          initialAngle={79.29} // ✅ rotate chart so white gap is at the bottom
        />

        {/* Legend */}
        <View style={{ marginTop: 12, alignItems: "flex-start" }}>
          {total > 0 ? (
            entries.map(([key, value], index) => (
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
                    backgroundColor: colorMap[key],
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 12, color: "#333" }}>
                  {labelMap[key]} ({value} kWh)
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
