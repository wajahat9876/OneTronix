import { hs, ms, vs } from "@utils/design/design";
import { SvgChart, SVGRenderer } from "@wuba/react-native-echarts";
import { BarChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

echarts.use([
  SVGRenderer,
  BarChart,
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
]);

type BarChartProps = {
  data: { results: any[] };
  selectedParams: (
    | "Energy Purchased"
    | "Energy Consumed"
    | "Energy Charged"
    | "Energy Discharged"
    | "Solar Production"
  )[];
  selectTab: 1 | 2 | 3;
  selectedDate?: string;
};

export default function ZoomBarChart({
  data,
  selectedParams,
  selectTab,
  selectedDate,
}: BarChartProps) {
  const chartRef = useRef<any>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const CHART_WIDTH = hs(395);
  const height = vs(420);
  const [legendValues, setLegendValues] = useState<Record<string, number>>({});
  const [isChartReady, setIsChartReady] = useState(false);
  // Use refs to track current data to avoid stale closures
  const seriesDataRef = useRef<Record<string, number[]>>({});
  const selectedParamsRef = useRef<string[]>([]);

  const paramColors: Record<string, { line: string; area: string[] }> = {
    "Energy Purchased": {
      line: "#ff2e24",
      area: ["red", "#F7181A"],
    },
    "Energy Consumed": {
      line: "#2f2f2f",
      area: ["#2f2f2f", "#3C3C3C"],
    },
    "Energy Charged": {
      line: "#5ac3d8",
      area: ["#5ac3d8", "#5AC3D8"],
    },
    "Energy Discharged": {
      line: "#de9b14",
      area: ["#de9b14", "#EDB138"],
    },
    "Solar Production": {
      line: "#27c840",
      area: ["#27c840", "#08CF03"],
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
            param === "Energy Purchased"
              ? entry?.consumption?.dailyConsumption ?? 0
              : param === "Energy Consumed"
              ? entry?.production?.dailyProduction ?? 0
              : param === "Energy Charged"
              ? entry?.battery?.dailyCharging ?? 0
              : param === "Energy Discharged"
              ? entry?.battery?.dailyDischarging ?? 0
              : param === "Solar Production"
              ? entry?.grid?.dailyPurchase ?? 0
              : 0;
          resultSeries[param].push(value);
        });
      });
    } else if (selectTab === 2 && selectedDate) {
      const [yearStr] = selectedDate.split("T")[0].split("-");
      const year = Number(yearStr);

      resultXAxis.push(...Array.from({ length: 12 }, (_, i) => i + 1));
      resultXAxis.forEach((month) => {
        const entry = data?.results?.find((d) => {
          const date = new Date(d.createdAt);
          return date.getFullYear() === year && date.getMonth() + 1 === month;
        });

        selectedParams.forEach((param) => {
          const value =
            param === "Energy Purchased"
              ? entry?.consumption?.monthlyConsumption ?? 0
              : param === "Energy Consumed"
              ? entry?.production?.monthlyProduction ?? 0
              : param === "Energy Charged"
              ? entry?.battery?.monthlyCharging ?? 0
              : param === "Energy Discharged"
              ? entry?.battery?.monthlyDischarging ?? 0
              : param === "Solar Production"
              ? entry?.grid?.monthlyPurchase ?? 0
              : 0;
          resultSeries[param].push(value);
        });
      });
    }

    // } else if (selectTab === 2) {
    //   resultXAxis.push(...Array.from({ length: 12 }, (_, i) => i + 1));
    //   resultXAxis.forEach((month) => {
    //     const entry = data?.results?.find(
    //       (d) => new Date(d.createdAt).getMonth() + 1 === month
    //     );
    //     selectedParams.forEach((param) => {
    //       const value =
    //         param === "Energy Purchased"
    //           ? entry?.consumption?.monthlyConsumption ?? 0
    //           : param === "Energy Consumed"
    //           ? entry?.production?.monthlyProduction ?? 0
    //           : param === "Energy Charged"
    //           ? entry?.battery?.monthlyCharging ?? 0
    //           : param === "Energy Discharged"
    //           ? entry?.battery?.monthlyDischarging ?? 0
    //           : param === "Solar Production"
    //           ? entry?.grid?.monthlyPurchase ?? 0
    //           : 0;
    //       resultSeries[param].push(value);
    //     });
    //   });
    // }
    else if (selectTab === 3) {
      const yearsToShow = 3; // number of years to display
      const startYear = currentYear - (yearsToShow - 1);

      // Generate only the last 3 years
      resultXAxis.push(
        ...Array.from({ length: yearsToShow }, (_, i) => startYear + i)
      );

      resultXAxis.forEach((year) => {
        const entry = data?.results?.find(
          (d) => new Date(d.createdAt).getFullYear() === year
        );
        selectedParams.forEach((param) => {
          const value =
            param === "Energy Purchased"
              ? entry?.consumption?.yearlyConsumption ?? 0
              : param === "Energy Consumed"
              ? entry?.production?.yearlyProduction ?? 0
              : param === "Energy Charged"
              ? entry?.battery?.yearlyCharging ?? 0
              : param === "Energy Discharged"
              ? entry?.battery?.yearlyDischarging ?? 0
              : param === "Solar Production"
              ? entry?.grid?.yearlyPurchase ?? 0
              : 0;
          resultSeries[param].push(value);
        });
      });
    }

    // calculate maxY once
    // selectedParams.forEach((param) => {
    //   const localMax = Math.max(...resultSeries[param]);
    //   if (localMax > resultMaxY) resultMaxY = localMax;
    // });
    // if (resultMaxY > 0) {
    //   const magnitude = Math.pow(10, Math.floor(Math.log10(resultMaxY)));
    //   resultMaxY = Math.ceil(resultMaxY / magnitude) * magnitude;
    // }
    // let resultMaxY = 0;
    const selectedOnlyValues = selectedParams.flatMap(
      (param) => resultSeries[param] || []
    );
    resultMaxY = Math.max(...selectedOnlyValues, 0);

    if (selectTab === 1) {
      resultMaxY += 1;
    } else {
      resultMaxY += 10;
    }
    // Update refs with current data
    seriesDataRef.current = resultSeries;
    selectedParamsRef.current = selectedParams;

    return {
      xAxisData: resultXAxis,
      seriesData: resultSeries,
      maxY: resultMaxY,
    };
  }, [data, selectedParams, selectTab, selectedDate]);

  // Create stable event handlers using useCallback
  const handleShowTip = useCallback((params: any) => {
    if (!params || params.dataIndex == null) return;

    const dataIndex = params.dataIndex;

    const values: Record<string, number> = {};
    const currentSelectedParams = selectedParamsRef.current;
    const currentSeriesData = seriesDataRef.current;

    currentSelectedParams.forEach((param) => {
      values[param] = currentSeriesData[param]?.[dataIndex] || 0;
    });

    setLegendValues(values);
  }, []);

  const handleHideTip = useCallback(() => {
    setLegendValues({});
  }, []);

  const option = useMemo(
    () => ({
      backgroundColor: "#fff",
      barCategoryGap: "60%", // ⬅️ Increase this for more gap between categories (default is 20%-30%)
      barGap: "-20%",
      animation: false,
      grid: { top: 20, left: 0, right: hs(50), bottom: 40, containLabel: true },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLine: { lineStyle: { color: "#888", width: 1 } },
        axisLabel: {
          fontFamily: "Ranade-Medium",
          // fontFamily: "Ranade-Medium",
          showMinLabel: true,
          showMaxLabel: true,
          interval: 0,
          fontSize: selectTab === 1 ? 8 : 12,
        },
        splitLine: { show: true },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: maxY,
        splitNumber: 0.1,
        axisLine: { show: true, lineStyle: { color: "#888", width: 1 } },
        axisTick: { show: true, lineStyle: { color: "#888" }, length: 3 },
        splitLine: { show: true },
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
            if (value === 0) return "{unit|kWh}\n{value|" + value + "}";
            if (value === maxY)
              return "{unit|kWh}\n{value|" + value.toFixed(0) + "}";
            return "";
          },
        },
      },
      tooltip: {
        trigger: "axis",
        triggerOn: "mousemove|click",
        confine: true,
        formatter: () => "",
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 0,
        textStyle: { color: "transparent" },
        extraCssText: "display:none;",
        axisPointer: {
          type: "line", // changed from "shadow" to "line"
          lineStyle: {
            color: "gray", // blue color
            width: 1.5,
            type: "dashed", // make it dashed
          },
          label: { show: false },
        },
      },

      // tooltip: {
      //   trigger: "axis",
      //   triggerOn: "mousemove|click",
      //   confine: true,
      //   formatter: () => "",
      //   backgroundColor: "transparent",
      //   borderWidth: 0,
      //   padding: 0,
      //   textStyle: { color: "transparent" },
      //   extraCssText: "display:none;",
      //   axisPointer: {
      //     type: "shadow",
      //     shadowStyle: {
      //       color: "rgba(0, 122, 255, 0.15)",
      //     },
      //     label: { show: false },
      //   },
      // },
      dataZoom: [
        {
          type: "inside",
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: true,
          start: 0,
          end: 100, // show all days
          // start: selectTab === 1 ? 0 : 0,
          // end: selectTab === 1 ? (9 / xAxisData.length) * 100 : 80, // show first 10 days
        },
        {
          show: false,
          type: "slider",
          zoomLock: true, // disable manual zooming
          start: 0,
          end: 100, // show all days
          // start: selectTab === 1 ? 0 : 0,
          // end: selectTab === 1 ? (9 / xAxisData.length) * 100 : 100,
        },
      ],
      series: selectedParams.map((param) => ({
        name: param,
        type: "bar",
        barWidth:
          selectTab === 1
            ? 7
            : selectTab === 2
            ? 18
            : selectTab === 3
            ? hs(98)
            : 7,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: paramColors[param]?.area[0] ?? "#000" },
            { offset: 1, color: paramColors[param]?.area[1] ?? "#000" },
          ]),
        },
        emphasis: { itemStyle: { color: paramColors[param]?.line } },
        data: seriesData[param],
      })),
    }),
    [xAxisData, seriesData, maxY, selectedParams, selectTab]
  );

  useEffect(() => {
    // Safe initialization
    if (!chartRef.current) {
      return;
    }

    try {
      // Dispose existing chart if any
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
        // Remove event listeners before disposal
        chartInstanceRef.current.off("showTip");
        chartInstanceRef.current.off("hideTip");
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }

      // Initialize new chart
      const chart = echarts.init(chartRef.current, "light", {
        renderer: "svg",
        width: CHART_WIDTH,
        height,
      });

      chartInstanceRef.current = chart;
      chart.setOption(option);
      setIsChartReady(true);

      // Set up event listeners with stable callbacks
      chart.on("showTip", handleShowTip);
      chart.on("hideTip", handleHideTip);
    } catch (err) {
      console.log("Chart init error:", err);
      setIsChartReady(false);
    }

    // Cleanup function
    return () => {
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
        try {
          // Remove event listeners
          chartInstanceRef.current.off("showTip");
          chartInstanceRef.current.off("hideTip");
          chartInstanceRef.current.dispose();
          chartInstanceRef.current = null;
        } catch (e) {
          console.log("Chart dispose error:", e);
        }
      }
      setIsChartReady(false);
    };
  }, [CHART_WIDTH, height, handleShowTip, handleHideTip]);

  // Update chart when option changes
  useEffect(() => {
    if (
      chartInstanceRef.current &&
      !chartInstanceRef.current.isDisposed() &&
      isChartReady
    ) {
      try {
        // chartInstanceRef.current.setOption(option);
        chartInstanceRef.current.setOption(option, true);
      } catch (err) {
        console.log("Chart update error:", err);
      }
    }
  }, [option, isChartReady]);

  // Debug: log when seriesData changes
  useEffect(() => {
    Object.keys(seriesData).forEach((param) => {});
  }, [seriesData]);
  // useEffect(() => {
  //   if (!chartInstanceRef.current || !isChartReady) return;

  //   const chart = chartInstanceRef.current;

  //   // Find the last index that has non-zero data across all selected params
  //   let lastIndexWithData = 0;
  //   selectedParams.forEach((param) => {
  //     const series = seriesData[param];
  //     if (series && series.length > 0) {
  //       for (let i = series.length - 1; i >= 0; i--) {
  //         if (series[i] !== 0 && series[i] != null) {
  //           if (i > lastIndexWithData) lastIndexWithData = i;
  //           break;
  //         }
  //       }
  //     }
  //   });

  //   const dataZoom = (chart.getOption() as any).dataZoom?.[0];
  //   if (!dataZoom) return;

  //   const { start = 0, end = 100 } = dataZoom;
  //   const windowSize = end - start;
  //   const totalPoints = xAxisData.length;

  //   // Convert last index to percentage
  //   const lastDataPercent = ((lastIndexWithData + 1) / totalPoints) * 100;

  //   // Only shift if the last data is outside the current window
  //   if (lastDataPercent > end) {
  //     let newEnd = lastDataPercent;
  //     let newStart = newEnd - windowSize;
  //     if (newStart < 0) newStart = 0;
  //     if (newEnd > 100) newEnd = 100;

  //     chart.dispatchAction({
  //       type: "dataZoom",
  //       start: newStart,
  //       end: newEnd,
  //     });
  //   }
  // }, [seriesData, isChartReady, selectedParams, xAxisData]);
  useEffect(() => {
    setLegendValues({});
  }, [selectTab]);
  return (
    <View style={{ width: CHART_WIDTH, height, backgroundColor: "#fff" }}>
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
                  { backgroundColor: paramColors[param]?.line },
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
      {/* <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginRight: hs(50),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const chart = chartInstanceRef.current;
              if (chart) {
                const zoom = (chart.getOption() as any).dataZoom?.[0];
                if (!zoom) return;
                const { start = 0, end = 100 } = zoom;
                const windowSize = end - start;
                // ⬅ Slide Left
                if (start <= 0) return;
                const newStart = Math.max(0, start - 10);
                const newEnd = newStart + windowSize;

                chart.dispatchAction({
                  type: "dataZoom",
                  start: newStart,
                  end: newEnd,
                });
              }
            }}
          >
            <Text
              style={{
                padding: 8,
                borderRadius: 6,
                fontFamily: "Ranade-Medium",
                color: "black",
              }}
            >
              ◀
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const chart = chartInstanceRef.current;
              if (chart) {
                const zoom = (chart.getOption() as any).dataZoom?.[0];

                if (!zoom) return;

                const { start = 0, end = 100 } = zoom;
                const windowSize = end - start;

                // ▶ Slide Right
                if (end >= 100) return; // already at end
                const newEnd = Math.min(100, end + 10);
                const newStart = newEnd - windowSize;

                chart.dispatchAction({
                  type: "dataZoom",
                  start: newStart,
                  end: newEnd,
                });
              }
            }}
          >
            <Text
              style={{
                paddingVertical: 8,
                paddingHorizontal: 5,
                borderRadius: 6,
                fontFamily: "Ranade-Medium",
                color: "black",
              }}
            >
              ▶
            </Text>
          </TouchableOpacity>
        </View> */}

      <SvgChart ref={chartRef} style={{ height, width: CHART_WIDTH }} />
    </View>
  );
}

const styles = StyleSheet.create({
  dotText: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
});
// //import { hs, ms, vs } from "@utils/design/design";
// import { SvgChart, SVGRenderer } from "@wuba/react-native-echarts";
// import { BarChart } from "echarts/charts";
// import {
//   DataZoomComponent,
//   GridComponent,
//   TooltipComponent,
// } from "echarts/components";
// import * as echarts from "echarts/core";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

// echarts.use([
//   SVGRenderer,
//   BarChart,
//   GridComponent,
//   DataZoomComponent,
//   TooltipComponent,
// ]);

// type BarChartProps = {
//   data: { results: any[] };
//   selectedParams: (
//     | "Energy Purchased"
//     | "Energy Consumed"
//     | "Energy Charged"
//     | "Energy Discharged"
//     | "Solar Production"
//   )[];
//   selectTab: 1 | 2 | 3;
//   selectedDate?: string; // For tab 1 daily mode
// };

// export default function ZoomBarChart({
//   data,
//   selectedParams,
//   selectTab,
//   selectedDate,
// }: BarChartProps) {
//   const chartRef = useRef<any>(null);
//   const { width } = useWindowDimensions();
//   // const width = 400;
//   const height = 350;

//   const [legendValues, setLegendValues] = useState<Record<string, number>>({});
//   const paramColors: Record<string, { line: string; area: string[] }> = {
//     "Energy Purchased": {
//       line: "#0770FF",
//       area: ["#0A84FF", "#0055CC"], // vivid blue gradient
//     },
//     "Energy Consumed": {
//       line: "#F7D102",
//       area: ["#FFD700", "#C8A200"], // bright yellow/golden
//     },
//     "Energy Charged": {
//       line: "#F2597F",
//       area: ["#FF4F81", "#C71B5C"], // stronger pink gradient
//     },
//     "Energy Discharged": {
//       line: "gray",
//       area: ["gray", "gray"], // rich purple gradient
//     },
//     "Solar Production": {
//       line: "black",
//       area: ["black", "black"], // rich purple gradient
//     },
//   };

//   // Build X-axis labels and map data
//   const { xAxisData, seriesData, maxY } = useMemo(() => {
//     const currentYear = new Date().getFullYear();
//     const resultXAxis: number[] = [];
//     const resultSeries: Record<string, number[]> = {};
//     let resultMaxY = 0;

//     selectedParams.forEach((param) => (resultSeries[param] = []));

//     if (selectTab === 1 && selectedDate) {
//       const [yearStr, monthStr] = selectedDate.split("T")[0].split("-");
//       const year = Number(yearStr);
//       const month = Number(monthStr);
//       const daysInMonth = new Date(year, month, 0).getDate();
//       resultXAxis.push(...Array.from({ length: daysInMonth }, (_, i) => i + 1));

//       resultXAxis.forEach((day) => {
//         const entry = data?.results?.find(
//           (d) => new Date(d.createdAt).getDate() === day
//         );

//         selectedParams.forEach((param) => {
//           const value =
//             param === "Energy Purchased"
//               ? entry?.consumption?.dailyConsumption ?? 0
//               : param === "Energy Consumed"
//               ? entry?.production?.dailyProduction ?? 0
//               : param === "Energy Charged"
//               ? entry?.battery?.dailyCharging ?? 0
//               : param === "Energy Discharged"
//               ? entry?.battery?.dailyDischarging ?? 0
//               : param === "Solar Production"
//               ? entry?.grid?.dailyPurchase ?? 0
//               : 0;
//           resultSeries[param].push(value);
//         });
//       });
//     } else if (selectTab === 2) {
//       resultXAxis.push(...Array.from({ length: 12 }, (_, i) => i + 1));
//       resultXAxis.forEach((month) => {
//         const entry = data?.results?.find(
//           (d) => new Date(d.createdAt).getMonth() + 1 === month
//         );
//         selectedParams.forEach((param) => {
//           const value =
//             param === "Energy Purchased"
//               ? entry?.consumption?.monthlyConsumption ?? 0
//               : param === "Energy Consumed"
//               ? entry?.production?.monthlyProduction ?? 0
//               : param === "Energy Charged"
//               ? entry?.battery?.monthlyCharging ?? 0
//               : param === "Energy Discharged"
//               ? entry?.battery?.monthlyDischarging ?? 0
//               : param === "Solar Production"
//               ? entry?.grid?.monthlyPurchase ?? 0
//               : 0;
//           resultSeries[param].push(value);
//         });
//       });
//     } else if (selectTab === 3) {
//       resultXAxis.push(
//         ...Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i)
//       );
//       resultXAxis.forEach((year) => {
//         const entry = data.results.find(
//           (d) => new Date(d.createdAt).getFullYear() === year
//         );
//         selectedParams.forEach((param) => {
//           const value =
//             param === "Energy Purchased"
//               ? entry?.consumption?.yearlyConsumption ?? 0
//               : param === "Energy Consumed"
//               ? entry?.production?.yearlyProduction ?? 0
//               : param === "Energy Charged"
//               ? entry?.battery?.yearlyCharging ?? 0
//               : param === "Energy Discharged"
//               ? entry?.battery?.yearlyDischarging ?? 0
//               : param === "Solar Production"
//               ? entry?.grid?.yearlyPurchase ?? 0
//               : 0;
//           resultSeries[param].push(value);
//         });
//       });
//     }

//     // calculate maxY once
//     selectedParams.forEach((param) => {
//       const localMax = Math.max(...resultSeries[param]);
//       if (localMax > resultMaxY) resultMaxY = localMax;
//     });
//     if (resultMaxY > 0) {
//       const magnitude = Math.pow(10, Math.floor(Math.log10(resultMaxY)));
//       resultMaxY = Math.ceil(resultMaxY / magnitude) * magnitude;
//     }

//     return {
//       xAxisData: resultXAxis,
//       seriesData: resultSeries,
//       maxY: resultMaxY,
//     };
//   }, [data, selectedParams, selectTab, selectedDate]);
//   console.log(xAxisData);
//   // Now series for ECharts
//   const option = useMemo(
//     () => ({
//       backgroundColor: "#fff",
//       animation: false,
//       // progressive: 20,
//       // progressiveThreshold: 300,
//       grid: { top: 20, left: 0, right: hs(40), bottom: 40, containLabel: true },
//       xAxis: {
//         type: "category",
//         data: xAxisData,
//         axisLine: { lineStyle: { color: "#888", width: 1 } },
//         axisLabel: {
//           fontFamily: "Ranade-Medium",
//           showMinLabel: true, // 👈 always show day 1
//           showMaxLabel: true, // 👈 always show last day
//         },
//         splitLine: { show: true },
//       },

//       yAxis: {
//         type: "value",
//         min: 0,
//         max: maxY,
//         axisLine: { show: true, lineStyle: { color: "#888", width: 1 } },
//         axisTick: { show: true, lineStyle: { color: "#888" }, length: 3 },
//         splitLine: { show: false },
//         axisLabel: {
//           fontFamily: "Ranade-Medium",
//           color: "#333",
//           padding: [0, 0, 5, 0],
//           rich: {
//             value: {
//               fontSize: 11,
//               lineHeight: 14,
//               color: "#333",
//             },
//             unit: {
//               fontSize: 8,
//               lineHeight: 10,
//               color: "#666",
//             },
//           },
//           formatter: (value: number) => {
//             if (value === 0) return "{value|" + value + "} {unit|kWh}";
//             if (value === maxY)
//               return "{value|" + value.toFixed(0) + "} {unit|kWh}";
//             return "";
//           },
//         },
//       },
//       tooltip: {
//         trigger: "axis",
//         triggerOn: "mousemove",
//         showDelay: 2000, // show only after holding 2s
//         enterable: false,
//         // ⛔️ completely hide tooltip UI
//         formatter: () => "", // return empty string → no box rendered
//         backgroundColor: "transparent",
//         borderWidth: 0,
//         padding: 0,
//         textStyle: { color: "transparent" },
//         extraCssText: "display:none;", // hide any residual DOM element

//         // ✅ only show the shadow highlight
//         axisPointer: {
//           type: "shadow",
//           shadowStyle: {
//             color: "rgba(0, 122, 255, 0.15)",
//           },
//           label: { show: false },
//         },
//       },

//       dataZoom: [
//         {
//           show: false,
//           start: selectTab === 1 ? 0 : 0, // full view for daily
//           end: 100,
//           minValueSpan: selectTab === 3 ? 1.3 : 3,
//         },
//         {
//           type: "inside",
//           start: selectTab === 1 ? 0 : 0,
//           end: 100,
//         },
//         {
//           show: false,
//           yAxisIndex: 0,
//           filterMode: "none",
//           width: 30,
//           height: "80%",
//           showDataShadow: false,
//           left: "93%",
//         },
//       ],

//       series: selectedParams.map((param) => ({
//         name: param,
//         type: "bar",
//         barWidth: 7,
//         itemStyle: {
//           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//             { offset: 0, color: paramColors[param]?.area[0] },
//             { offset: 1, color: paramColors[param]?.area[1] },
//           ]),
//         },
//         emphasis: { itemStyle: { color: paramColors[param]?.line } },
//         data: seriesData[param],
//       })),
//     }),
//     [xAxisData, seriesData, maxY, selectedParams]
//   );
//   useEffect(() => {
//     // Ensure the chart container is mounted before initializing
//     if (!chartRef.current) return;

//     let chart: any;

//     try {
//       chart = echarts.init(chartRef.current, "light", {
//         renderer: "svg",
//         width,
//         height,
//       });

//       chart.setOption(option);

//       // Listen for tooltip updates
//       chart.on("showTip", (params) => {
//         if (!params || params.dataIndex == null) return;
//         const dataIndex = params.dataIndex;
//         const values: Record<string, number> = {};

//         selectedParams.forEach((param) => {
//           values[param] = seriesData[param][dataIndex] || 0;
//         });

//         setLegendValues(values);
//       });

//       chart.on("hideTip", () => {
//         setLegendValues({});
//       });
//     } catch (err) {
//       console.log("Chart init error:", err);
//     }

//     // Cleanup to avoid memory leaks
//     return () => {
//       if (chart && !chart.isDisposed()) {
//         try {
//           chart.dispose();
//         } catch (e) {
//           console.log("Dispose error:", e);
//         }
//       }
//     };
//   }, [width, data, selectedParams, selectTab]);

//   return (
//     <View style={{ width, height, backgroundColor: "#fff" }}>
//       <View style={{ paddingHorizontal: 16, marginLeft: 10 }}>
//         {selectedParams.map((param) => {
//           const value = legendValues[param] ?? "--";
//           return (
//             <View
//               key={param}
//               style={[styles.dotText, { marginRight: 6, marginTop: vs(10) }]}
//             >
//               <View
//                 style={[
//                   styles.colorDot,
//                   { backgroundColor: paramColors[param]?.line },
//                 ]}
//               />
//               <Text
//                 style={{
//                   color: "#111",
//                   fontSize: ms(11),
//                   fontFamily: "Ranade-Regular",
//                 }}
//               >
//                 {param.toUpperCase()}: {value}
//               </Text>
//             </View>
//           );
//         })}
//       </View>
//       <SvgChart ref={chartRef} style={{ height, width }} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   dotText: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
//   colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
// });
