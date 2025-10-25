import { ms, vs } from "@utils/design/design";
import { SVGRenderer, SvgChart } from "@wuba/react-native-echarts";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";

echarts.use([SVGRenderer, LineChart, GridComponent, TooltipComponent]);

type ZoomChartProps = {
  data: any[];
  selectedParams: ("output" | "ac" | "battery" | "solar")[];
  ticks: number[];
};

export default function EmptyZoomChart({
  data,
  selectedParams,
  ticks,
}: ZoomChartProps) {
  const chartRef = useRef<any>(null);
  const { width } = Dimensions.get("window");
  const height = 350;
  const hoverValuesRef = useRef<Record<string, number>>({});
  const [legendValues, setLegendValues] = useState<Record<string, number>>({});
  const lastUpdate = useRef(Date.now());
  const maxY = data.length
    ? Math.max(
        ...selectedParams.flatMap((param) => data.map((d) => d[param] + 1))
      )
    : 1; // default max if no data
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

  const option = {
    backgroundColor: "#fff",
    animation: false,
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
      axisLine: { show: true, lineStyle: { color: "#888", width: 1 } },
      axisTick: { show: true, lineStyle: { color: "#888" }, length: 3 },
      splitLine: { show: false },
      min: 0,
      max: 24,
      axisLabel: {
        formatter: (val: number) => {
          let hours = Math.floor(val);
          let minutes = Math.round((val - hours) * 60);
          const isPM = hours >= 12;
          let displayHour = hours % 12;
          if (displayHour === 0) displayHour = 12;
          const period = isPM ? "PM" : "AM";
          return `${displayHour}:${minutes
            .toString()
            .padStart(2, "0")} {period|${period}}`;
        },
        textStyle: { fontSize: 11, color: "#333", fontFamily: "Excon-Regular" },
        rich: { period: { fontSize: 6, color: "#777", padding: [0, 0, 0, 2] } },
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: maxY,
      axisLine: { show: true, lineStyle: { color: "#888", width: 1 } },
      axisTick: { show: true, lineStyle: { color: "#888" }, length: 3 },
      splitLine: { show: false },
      axisLabel: {
        fontSize: 11,
        color: "#333",
        formatter: (value: number) => {
          if (value === 0) return "0 kW";
          if (value === maxY) return `${value.toFixed(0)} kW`;
          return ""; // hide intermediate values
        },
      },
    },
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: { color: "#888", width: 1 },
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
      data: [], // empty series if no data
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
  }, [width, data, selectedParams]);

  return (
    <View style={{ width, height, backgroundColor: "#fff" }}>
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
