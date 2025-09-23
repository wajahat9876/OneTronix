import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

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
    ac: "#f97316",
    battery: "#4f8ef7",
    output: "#22c55e",
    solar: "#a855f7",
  };

  // Generate dummy multi-bar data based on selectedTab & selectedParams
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
      xValues = Array.from({ length: 12 }, (_, i) => i + 1); // months
    } else if (selectedTab === 3) {
      xValues = Array.from({ length: 6 }, (_, i) => 2020 + i); // years
    }

    xValues.forEach((x) => {
      selectedParams.forEach((param, index) => {
        // Find API entry for this x-axis value (for daily tab, match day)
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

        // Extract value from API or default to 0
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

  // Correct chart width based on number of groups

  return (
    <View style={styles.container}>
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
      <BarChart
        data={chartData}
        width={300}
        // scrollToEnd
        height={150}
        barWidth={18}
        spacing={5}
        // roundedTop
        // roundedBottom
        yAxisTextStyle={{ fontSize: 12, color: "gray" }}
        hideRules={false} // show background lines
        rulesType="solid" // solid or dashed
        rulesColor="#e0e0e0" // color of background lines
        rulesThickness={1} // thickness of lines
        xAxisThickness={1}
        xAxisColor="#ccc"
        yAxisThickness={1}
        yAxisColor="#ccc"
        noOfSections={3}
        maxValue={Math.max(...chartData.map((d) => d.value)) + 10}
        renderTooltip={(item: any) => {
          if (!item) return null; // safeguard
          console.log(item, "item");
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
    alignSelf: "center",
  },
  tooltip: {
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 5,
    marginBottom: 4,
  },
  dotText: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5, // makes it a circle
    marginRight: 6, // space between dot and text
  },
});
