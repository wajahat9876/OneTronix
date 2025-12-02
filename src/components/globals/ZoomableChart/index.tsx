import { ms, vs } from "@utils/design/design";
import { SVGRenderer, SvgChart } from "@wuba/react-native-echarts";
import { LineChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { useEffect, useRef, useState } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";

echarts.use([
  SVGRenderer,
  LineChart,
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
]);

type ZoomChartProps = {
  data: any[];
  selectedParams: ("output" | "ac" | "battery" | "solar")[];
  ticks: number[];
};

export default function ZoomChart({
  data,
  selectedParams,
  ticks,
}: ZoomChartProps) {
  const chartRef = useRef<any>(null);
  const { width } = Dimensions.get("window");
  const ChartWidth = 390;
  const height = 350;
  const hoverValuesRef = useRef<Record<string, number>>({});
  const [legendValues, setLegendValues] = useState<Record<string, number>>({});
  const lastUpdate = useRef(Date.now());
  const maxY = Math.max(
    ...selectedParams.flatMap((param) => data.map((d) => d[param] + 1))
  );
  const handleHover = (values: Record<string, number>) => {
    const now = Date.now();
    if (now - lastUpdate.current > 50) {
      // 20 FPS throttle
      setLegendValues(values);
      lastUpdate.current = now;
    }
  };

  const paramColors: Record<string, { line: string; area: string[] }> = {
    ac: {
      line: "#F2597F",
      area: ["rgba(213,72,120,0.5)", "rgba(213,72,120,0.1)"],
    },
    output: {
      line: "#F7D102",
      area: ["rgba(247,209,2,0.2)", "rgba(247,209,2,0.05)"],
    },
    battery: {
      line: "#0770FF",
      area: ["rgba(58,77,233,0.5)", "rgba(58,77,233,0.1)"],
    },
    solar: {
      line: "purple",
      area: ["rgba(128,0,128,0.2)", "rgba(128,0,128,0.05)"],
    },
  };
  // const dataMin = Math.min(...data.map((d) => d.hour));
  // const dataMax = Math.max(...data.map((d) => d.hour));

  const option = {
    backgroundColor: "#fff",
    animation: true,
    grid: {
      top: 20,
      left: 0,
      right: 15,
      bottom: 40,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: false,
      min: 0,
      max: 24,
      axisLine: { show: true, lineStyle: { color: "#888", width: 1 } },
      axisTick: { show: true, lineStyle: { color: "#888" }, length: 3 },
      splitLine: { show: false },
      // 🔒 Prevent floating precision & auto-rounding when zooming
      scale: false,
      // 👇 Fix axis coordinate rounding issues that cause movement
      axisLabel: {
        fontFamily: "Ranade-Medium",
        showMinLabel: true,
        showMaxLabel: true,
        interval: 0,
        margin: 6,
        hideOverlap: false,
        rich: {
          time: { fontSize: 8, color: "#333" },
          period: { fontSize: 6, color: "#777", padding: [0, 0, 0, 2] },
        },
        formatter: (val: number) => {
          let hours = Math.floor(val);
          let minutes = Math.round((val - hours) * 60);
          const isPM = hours >= 12;
          let displayHour = hours % 12;
          if (displayHour === 0) displayHour = 12;
          const period = isPM ? "PM" : "AM";
          return `{time|${displayHour}:${minutes
            .toString()
            .padStart(2, "0")}} {period|${period}}`;
        },
      },
      // 🧱 Prevent x-axis from expanding when zooming
      axisPointer: { snap: true },
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

    // dataZoom: [
    //   {
    //     type: "inside",
    //     startValue: 0, // start at first hour
    //     // endValue: 100,
    //     minValueSpan: 0.5,
    //     zoomOnMouseWheel: true,
    //     moveOnMouseMove: true,
    //     moveOnMouseWheel: true,
    //     filterMode: "none",
    //     // throttle: 5,
    //     zoomLock: false, // allow pinch to zoom freely
    //   },
    // ],
    dataZoom: [
      {
        show: false,
        start: 0, // full view for daily
        end: 100,
        minValueSpan: 0.5,
        filterMode: "none",
      },
      {
        type: "inside",
        start: 0,
        end: 100,
        minValueSpan: 0.5,
      },
      {
        show: false,
        yAxisIndex: 0,
        filterMode: "empty",
        // width: "100%",
        // height: "80%",
        showDataShadow: false,
        left: "93%",
      },
    ],
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: { color: "#888", width: 0 },
        label: { show: false },
      },
      formatter: (params: any) => {
        const yValues: Record<string, number> = {};
        params.forEach((p: any) => {
          yValues[p.seriesName] = p.value[1];
          hoverValuesRef.current[p.seriesName] = p.value[1];
        });
        handleHover(yValues);
        return "";
      },
    },
    series: selectedParams.map((param) => ({
      name: param,
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: { width: 2, color: paramColors[param].line },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: paramColors[param].area[0] },
          { offset: 1, color: paramColors[param].area[1] },
        ]),
      },
      data: data.map((d) => [d.hour, d[param]]),
    })),
  };

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current, "light", {
        renderer: "svg",
        width: ChartWidth,
        height,
      });
      chart.setOption(option);
      return () => chart.dispose();
    }
  }, [width, ChartWidth, data, selectedParams]);

  return (
    <View style={{ width: ChartWidth, height, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ paddingHorizontal: 16, marginLeft: 10 }}>
        {selectedParams.map((param) => {
          const currentValue = legendValues[param];
          const value =
            currentValue !== undefined ? Number(currentValue).toFixed(1) : "--";
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
