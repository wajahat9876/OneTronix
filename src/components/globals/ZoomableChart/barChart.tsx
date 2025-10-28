import { hs, ms, vs } from "@utils/design/design";
import { SvgChart, SVGRenderer } from "@wuba/react-native-echarts";
import { BarChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

echarts.use([
  SVGRenderer,
  BarChart,
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
]);

type BarChartProps = {
  data: { results: any[] };
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
  const { width } = useWindowDimensions();
  // const width = 400;
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
  const { xAxisData, seriesData, maxY } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const resultXAxis: number[] = [];
    const resultSeries: Record<string, number[]> = {};
    let resultMaxY = 0;

    selectedParams.forEach((param) => (resultSeries[param] = []));

    if (selectTab === 1 && selectedDate) {
      const [yearStr, monthStr] = selectedDate.split("T")[0].split("-");
      const year = Number(yearStr);
      const month = Number(monthStr);
      const daysInMonth = new Date(year, month, 0).getDate();
      resultXAxis.push(...Array.from({ length: daysInMonth }, (_, i) => i + 1));

      resultXAxis.forEach((day) => {
        const entry = data?.results?.find(
          (d) => new Date(d.createdAt).getDate() === day
        );

        selectedParams.forEach((param) => {
          const value =
            param === "ac"
              ? entry?.consumption?.dailyConsumption ?? 0
              : param === "output"
              ? entry?.production?.dailyProduction ?? 0
              : param === "battery"
              ? entry?.battery?.dailyCharging ?? 0
              : param === "solar"
              ? entry?.grid?.dailyPurchase ?? 0
              : 0;
          resultSeries[param].push(value);
        });
      });
    } else if (selectTab === 2) {
      resultXAxis.push(...Array.from({ length: 12 }, (_, i) => i + 1));
      resultXAxis.forEach((month) => {
        const entry = data?.results?.find(
          (d) => new Date(d.createdAt).getMonth() + 1 === month
        );
        selectedParams.forEach((param) => {
          const value =
            param === "ac"
              ? entry?.consumption?.monthlyConsumption ?? 0
              : param === "output"
              ? entry?.production?.monthlyProduction ?? 0
              : param === "battery"
              ? entry?.battery?.monthlyCharging ?? 0
              : param === "solar"
              ? entry?.grid?.monthlyPurchase ?? 0
              : 0;
          resultSeries[param].push(value);
        });
      });
    } else if (selectTab === 3) {
      resultXAxis.push(
        ...Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i)
      );
      resultXAxis.forEach((year) => {
        const entry = data.results.find(
          (d) => new Date(d.createdAt).getFullYear() === year
        );
        selectedParams.forEach((param) => {
          const value =
            param === "ac"
              ? entry?.consumption?.yearlyConsumption ?? 0
              : param === "output"
              ? entry?.production?.yearlyProduction ?? 0
              : param === "battery"
              ? entry?.battery?.yearlyCharging ?? 0
              : param === "solar"
              ? entry?.grid?.yearlyPurchase ?? 0
              : 0;
          resultSeries[param].push(value);
        });
      });
    }

    // calculate maxY once
    selectedParams.forEach((param) => {
      const localMax = Math.max(...resultSeries[param]);
      if (localMax > resultMaxY) resultMaxY = localMax;
    });
    if (resultMaxY > 0) {
      const magnitude = Math.pow(10, Math.floor(Math.log10(resultMaxY)));
      resultMaxY = Math.ceil(resultMaxY / magnitude) * magnitude;
    }

    return {
      xAxisData: resultXAxis,
      seriesData: resultSeries,
      maxY: resultMaxY,
    };
  }, [data, selectedParams, selectTab, selectedDate]);
  // Now series for ECharts
  const option = useMemo(
    () => ({
      backgroundColor: "#fff",
      animation: false,
      // progressive: 20,
      // progressiveThreshold: 300,
      grid: { top: 20, left: 0, right: hs(40), bottom: 40, containLabel: true },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLine: { lineStyle: { color: "#888", width: 1 } },
        axisLabel: {
          fontFamily: "Ranade-Medium",
          showMinLabel: true, // 👈 always show day 1
          showMaxLabel: true, // 👈 always show last day
        },
        splitLine: { show: true },
      },

      yAxis: {
        type: "value",
        min: 0,
        max: maxY,
        axisLine: { show: true, lineStyle: { color: "#888", width: 1 } },
        axisTick: { show: true, lineStyle: { color: "#888" }, length: 3 },
        splitLine: { show: false },
        axisLabel: {
          fontFamily: "Ranade-Medium",
          color: "#333",
          padding: [0, 0, 5, 0],
          rich: {
            value: {
              fontSize: 11,
              lineHeight: 14,
              color: "#333",
            },
            unit: {
              fontSize: 8,
              lineHeight: 10,
              color: "#666",
            },
          },
          formatter: (value: number) => {
            if (value === 0) return "{unit|kW}\n{value|" + value + "}";
            if (value === maxY)
              return "{unit|kW}\n{value|" + value.toFixed(0) + "}";
            return "";
          },
        },
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
          filterMode: "none",
          width: 30,
          height: "80%",
          showDataShadow: false,
          left: "93%",
        },
      ],

      series: selectedParams.map((param) => ({
        name: param,
        type: "bar",
        barWidth: 7,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: paramColors[param].area[0] },
            { offset: 1, color: paramColors[param].area[1] },
          ]),
        },
        emphasis: { itemStyle: { color: paramColors[param].line } },
        data: seriesData[param],
      })),
    }),
    [xAxisData, seriesData, maxY, selectedParams]
  );
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
      <SvgChart ref={chartRef} style={{ height, width }} />
    </View>
  );
}

const styles = StyleSheet.create({
  dotText: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
});
