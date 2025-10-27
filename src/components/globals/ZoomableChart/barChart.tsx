import { hs, ms, vs } from "@utils/design/design";
import { SVGRenderer, SvgChart } from "@wuba/react-native-echarts";
import { BarChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
  // const { width } = Dimensions.get("window");
  const width = 400;
  const height = 350;
  console.log(data, "===data");
  const [legendValues, setLegendValues] = useState<Record<string, number>>({});
  const paramColors: Record<string, { line: string; area: string[] }> = {
    ac: {
      line: "#0770FF",
      area: ["#0A84FF", "#0055CC"], // vivid blue gradient
    },
    output: {
      line: "#F7D102",
      area: ["#FFD700", "#C8A200"], // bright yellow/golden
    },
    battery: {
      line: "#F2597F",
      area: ["#FF4F81", "#C71B5C"], // stronger pink gradient
    },
    solar: {
      line: "#A020F0",
      area: ["#C44DFF", "#7A00CC"], // rich purple gradient
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
  let maxY = 0;

  // For each selected param, find its max from seriesData
  selectedParams.forEach((param) => {
    const localMax = Math.max(...seriesData[param]);
    if (localMax > maxY) {
      maxY = localMax;
    }
  });

  // Optionally round maxY to a clean value (like nearest 5, 10, etc.)
  if (maxY > 0) {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxY)));
    maxY = Math.ceil(maxY / magnitude) * magnitude; // e.g. 234 → 300
  }
  // Now series for ECharts
  const option = {
    backgroundColor: "#fff",
    animation: false,
    progressive: 2,
    progressiveThreshold: 1000,
    grid: { top: 20, left: -5, right: hs(50), bottom: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: { lineStyle: { color: "#888", width: 1 } },
      axisLabel: {
        showMinLabel: true, // 👈 always show day 1
        showMaxLabel: true, // 👈 always show last day
      },
      splitLine: { show: true },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: maxY,
      axisLine: {
        show: true,
        lineStyle: { color: "#888", width: 1 },
      },
      axisTick: {
        show: true,
        lineStyle: { color: "#888" },
        length: 1,
      },
      splitLine: { show: false },
      axisLabel: {
        fontSize: ms(10),
        color: "#333",
        formatter: (value: number) => {
          if (value === 0) return "0 kW";
          if (value === maxY) return `${value.toFixed(0)} kW`;
          return "";
        },
      },
      position: "left",
    },

    tooltip: {
      trigger: "axis",
      triggerOn: "mousemove|hold",
      show: false, // still true, tooltip works internally
      showDelay: 2000, // show after 2 seconds of hold
      hideDelay: 10,
      enterable: false,

      // Hide tooltip box completely
      backgroundColor: "transparent",
      borderWidth: 0,
      padding: 0,
      textStyle: { color: "transparent" }, // hides text

      // Hide vertical bar or area highlight
      axisPointer: {
        type: "none", // fully disables the shadow highlight line
      },
    },

    dataZoom: [
      {
        show: false,
        start: selectTab === 1 ? 0 : 0, // full view for daily
        end: 100,
        minValueSpan: selectTab === 3 ? 1.3 : 3,
      },
      {
        type: "inside",
        start: selectTab === 1 ? 0 : 0,
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
      barWidth: 9,
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
    // Ensure the chart container is mounted before initializing
    if (!chartRef.current) return;

    let chart: any;

    try {
      chart = echarts.init(chartRef.current, "light", {
        renderer: "svg",
        width,
        height,
      });

      chart.setOption(option);

      // Listen for tooltip updates
      chart.on("showTip", (params) => {
        if (!params || params.dataIndex == null) return;
        const dataIndex = params.dataIndex;
        const values: Record<string, number> = {};

        selectedParams.forEach((param) => {
          values[param] = seriesData[param][dataIndex] || 0;
        });

        setLegendValues(values);
      });

      chart.on("hideTip", () => {
        setLegendValues({});
      });
    } catch (err) {
      console.log("Chart init error:", err);
    }

    // Cleanup to avoid memory leaks
    return () => {
      if (chart && !chart.isDisposed()) {
        try {
          chart.dispose();
        } catch (e) {
          console.log("Dispose error:", e);
        }
      }
    };
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
