import { ms } from "@utils/design/design";
import React, { forwardRef } from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Text as SvgText } from "react-native-svg";

type DonutChartProps = {
  load?: number;
  grid?: number;
  battery?: number;
  solar?: number;
  type?: "Production" | "Consumption";
  selectedTab?: number;
};

const DonutChart2 = forwardRef<View, DonutChartProps>(
  ({ load, grid, battery, solar, type, selectedTab }, ref) => {
    const labelMap: Record<string, string> = {
      load: type === "Production" ? "to Load" : "from Load",
      grid: type === "Production" ? "to Grid" : "from Grid",
      battery: type === "Production" ? "to Battery" : "from Battery",
      solar: type === "Production" ? "to Solar" : "from Solar",
    };

    const colorMap: Record<string, string> = {
      load: "#27c840",
      grid: "#ff2e24",
      battery: "#787878",
      solar: "#27c840",
    };

    const entries = Object.entries({ load, grid, battery, solar }).filter(
      ([, v]) => v !== undefined
    );

    const total = entries.reduce((sum, [, v]) => sum + (v || 0), 0);

    // control gap size here
    const gapRatio = 0.0; // 0% gap for 15% use 0.3
    const gapValue = total * gapRatio || 0;

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
          radius={85}
          innerRadius={68}
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
            <View
              style={{
                alignItems: "center", // 👈 horizontal center
                justifyContent: "center", // 👈 vertical center
              }}
            >
              {type === "Production" ? (
                <Text
                  style={{
                    fontSize: ms(9),
                    textAlign: "center", // 👈 extra alignment for text
                    fontFamily: "Excon-Regular",
                  }}
                >
                  {selectedTab === 0
                    ? "Daily Production"
                    : selectedTab === 1
                    ? "Monthly Production"
                    : selectedTab === 2
                    ? "Yearly Production"
                    : selectedTab === 3
                    ? "Total Production"
                    : ""}
                </Text>
              ) : type === "Consumption" ? (
                <Text
                  style={{
                    fontSize: ms(9),
                    textAlign: "center", // 👈 extra alignment for text
                    fontFamily: "Excon-Regular",
                  }}
                >
                  {selectedTab === 0
                    ? "Daily Consumption"
                    : selectedTab === 1
                    ? "Monthly Consumption"
                    : selectedTab === 2
                    ? "Yearly Consumption"
                    : selectedTab === 3
                    ? "Total Consumption"
                    : ""}
                </Text>
              ) : (
                ""
              )}

              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "Excon-Medium",
                }}
              >
                {total === 0 ? "No Data" : `${total.toFixed(1)} kWh`}
              </Text>
            </View>
          )}
          // initialAngle={79.29} // ✅ rotate chart so white gap is at the bottom
        />

        {/* Legend */}
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {total > 0 ? (
            entries.map(([key, value], index) => (
              <View
                key={index}
                style={{
                  alignItems: "center",
                  marginHorizontal: 10,
                  marginBottom: 14,
                }}
              >
                {/* Dot + Label in same row */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: colorMap[key],
                      marginRight: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: ms(9),
                      color: "#333",
                      fontWeight: "500",
                      fontFamily: "Excon-Regular",
                    }}
                  >
                    {labelMap[key]}
                  </Text>
                </View>

                {/* Value directly below label */}
                <Text
                  style={{
                    fontSize: ms(11),
                    color: "#666",
                    marginTop: 3,
                    marginLeft: 20,
                    fontFamily: "Excon-Medium",
                  }}
                >
                  {value} kWh
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
