import { SVGRenderer, SvgChart } from "@wuba/react-native-echarts";
import { LineChart } from "echarts/charts";
import { DataZoomComponent, GridComponent } from "echarts/components";
import * as echarts from "echarts/core";
import React, { useEffect, useRef } from "react";
import { Dimensions, View } from "react-native";

echarts.use([SVGRenderer, LineChart, GridComponent, DataZoomComponent]);

export default function ZoomChart() {
  const chartRef = useRef<any>(null);
  const { width } = Dimensions.get("window");
  const height = 350;

  // Generate fake time-series data
  let base = +new Date(2016, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let valueBase = Math.random() * 300;
  let valueBase2 = Math.random() * 50;
  const data: [string, number][] = [];
  const data2: [string, number][] = [];

  for (let i = 1; i < 100; i++) {
    const now = new Date((base += oneDay));
    const dayStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join(
      "-"
    );
    valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
    valueBase <= 0 && (valueBase = Math.random() * 300);
    data.push([dayStr, valueBase]);
    valueBase2 = Math.round((Math.random() - 0.5) * 20 + valueBase2);
    valueBase2 <= 0 && (valueBase2 = Math.random() * 50);
    data2.push([dayStr, valueBase2]);
  }

  const option = {
    backgroundColor: "#fff",
    xAxis: {
      type: "time",
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      splitLine: { show: false },
    },
    grid: {
      top: 40,
      left: 15,
      right: 15,
      bottom: 30,
    },
    // ✅ Enable zoom by pinch and drag only — no bars
    dataZoom: [
      {
        type: "inside",
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: true,
        filterMode: "none",
        throttle: 50,
      },
    ],
    tooltip: { show: false }, // 🚫 disable popup tooltip
    series: [
      {
        type: "line",
        smooth: true,
        symbol: "none",
        sampling: "lttb",
        itemStyle: { color: "#0770FF" },
        lineStyle: { width: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(58,77,233,0.5)" },
            { offset: 1, color: "rgba(58,77,233,0.1)" },
          ]),
        },
        data,
      },
      {
        type: "line",
        smooth: true,
        symbol: "none",
        sampling: "lttb",
        itemStyle: { color: "#F2597F" },
        lineStyle: { width: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(213,72,120,0.5)" },
            { offset: 1, color: "rgba(213,72,120,0.1)" },
          ]),
        },
        data: data2,
      },
    ],
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
  }, [width]);

  return (
    <View style={{ width, height }}>
      <SvgChart ref={chartRef} style={{ flex: 1 }} />
    </View>
  );
}
