import { ms, vs } from "@utils/design/design";
import { SVGRenderer, SvgChart } from "@wuba/react-native-echarts";
import { BarChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

echarts.use([
  SVGRenderer,
  BarChart,
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
]);

type BarChartProps = {
  data: any[];
  selectedParams: ("output" | "ac" | "battery" | "solar")[];
  selectTab: 1 | 2 | 3;
  selectedDate?: string; // For tab 1 daily mode
};

export default function ZoomBarChart({
  data,
  selectedParams,
  selectTab,
  selectedDate,
}: BarChartProps) {
  const chartRef = useRef<any>(null);
  const { width } = Dimensions.get("window");
  const height = 350;
  console.log(data, "===data");
  const [legendValues, setLegendValues] = useState<Record<string, number>>({});

  const paramColors: Record<string, { line: string; area: string[] }> = {
    ac: {
      line: "#0770FF",
      area: ["rgba(58,77,233,0.5)", "rgba(58,77,233,0.1)"],
    },
    output: {
      line: "#F7D102",
      area: ["rgba(247,209,2,0.2)", "rgba(247,209,2,0.05)"],
    },
    battery: {
      line: "#F2597F",
      area: ["rgba(213,72,120,0.5)", "rgba(213,72,120,0.1)"],
    },
    solar: {
      line: "purple",
      area: ["rgba(128,0,128,0.2)", "rgba(128,0,128,0.05)"],
    },
  };

  // Build X-axis labels and map data
  let xAxisData: number[] = [];
  let seriesData: Record<string, number[]> = {};
  const currentYear = new Date().getFullYear();

  // Initialize seriesData
  selectedParams.forEach((param) => {
    seriesData[param] = [];
  });

  if (selectTab === 1 && selectedDate) {
    // Extract year & month from string YYYY-MM-DD format
    const [yearStr, monthStr] = selectedDate.split("T")[0].split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    // Number of days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    xAxisData = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    xAxisData.forEach((day) => {
      const entry = data.results.find((d) => {
        const entryDay = new Date(d.createdAt).getDate();
        return entryDay === day;
      });

      selectedParams.forEach((param) => {
        if (!entry) {
          seriesData[param].push(0);
        } else {
          switch (param) {
            case "ac":
              seriesData[param].push(entry.consumption?.dailyConsumption || 0);
              break;
            case "output":
              seriesData[param].push(entry.production?.dailyProduction || 0);
              break;
            case "battery":
              seriesData[param].push(entry.battery?.dailyCharging || 0);
              break;
            case "solar":
              seriesData[param].push(entry.grid?.dailyPurchase || 0);
              break;
            default:
              seriesData[param].push(0);
          }
        }
      });
    });
  } else if (selectTab === 2) {
    // Monthly data
    xAxisData = Array.from({ length: 12 }, (_, i) => i + 1);

    xAxisData.forEach((month) => {
      const entry = data.results.find((d) => {
        const entryMonth = new Date(d.createdAt).getMonth() + 1;
        return entryMonth === month;
      });

      selectedParams.forEach((param) => {
        if (!entry) {
          seriesData[param].push(0);
        } else {
          switch (param) {
            case "ac":
              seriesData[param].push(
                entry.consumption?.monthlyConsumption || 0
              );
              break;
            case "output":
              seriesData[param].push(entry.production?.monthlyProduction || 0);
              break;
            case "battery":
              seriesData[param].push(entry.battery?.monthlyCharging || 0);
              break;
            case "solar":
              seriesData[param].push(entry.grid?.monthlyPurchase || 0);
              break;
            default:
              seriesData[param].push(0);
          }
        }
      });
    });
  } else if (selectTab === 3) {
    // Yearly data
    xAxisData = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

    xAxisData.forEach((year) => {
      const entry = data.results.find((d) => {
        const entryYear = new Date(d.createdAt).getFullYear();
        return entryYear === year;
      });

      selectedParams.forEach((param) => {
        if (!entry) {
          seriesData[param].push(0);
        } else {
          switch (param) {
            case "ac":
              seriesData[param].push(entry.consumption?.yearlyConsumption || 0);
              break;
            case "output":
              seriesData[param].push(entry.production?.yearlyProduction || 0);
              break;
            case "battery":
              seriesData[param].push(entry.battery?.yearlyCharging || 0);
              break;
            case "solar":
              seriesData[param].push(entry.grid?.yearlyPurchase || 0);
              break;
            default:
              seriesData[param].push(0);
          }
        }
      });
    });
  }

  // Now series for ECharts
  const option = {
    backgroundColor: "#fff",
    grid: { top: 20, left: 0, right: 20, bottom: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: { lineStyle: { color: "#888" } },
    },
    yAxis: { type: "value", axisLine: { lineStyle: { color: "#888" } } },
    tooltip: { show: false },
    dataZoom: [
      {
        show: false,
        start: 0,
        end: 100,
      },
      {
        type: "inside",
        start: 94,
        end: 100,
      },
      {
        show: false,
        yAxisIndex: 0,
        filterMode: "empty",
        width: 30,
        height: "80%",
        showDataShadow: false,
        left: "93%",
      },
    ],
    series: selectedParams.map((param) => ({
      name: param,
      type: "bar",
      barWidth: 12,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: paramColors[param].area[0] },
          { offset: 1, color: paramColors[param].area[1] },
        ]),
      },
      emphasis: { itemStyle: { color: paramColors[param].line } },
      data: seriesData[param],
    })),
  };

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current, "light", {
        renderer: "svg",
        width,
        height,
      });
      chart.setOption(option);
      return () => chart.dispose();
    }
  }, [width, data, selectedParams, selectTab]);

  return (
    <View style={{ width, height, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal: 16, marginLeft: 10 }}>
        {selectedParams.map((param) => {
          const value = legendValues[param] ?? "--";
          return (
            <View
              key={param}
              style={[styles.dotText, { marginRight: 6, marginTop: vs(10) }]}
            >
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: paramColors[param].line },
                ]}
              />
              <Text
                style={{
                  color: "#111",
                  fontSize: ms(11),
                  fontFamily: "Ranade-Regular",
                }}
              >
                {param.toUpperCase()}: {value}
              </Text>
            </View>
          );
        })}
      </View>
      <SvgChart ref={chartRef} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  dotText: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
});
