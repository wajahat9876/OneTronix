import inter from "@assets/fonts/Poppins/Poppins-SemiBold.ttf";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import { hs, ms, vs } from "@utils/design/design";
import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import {
  BarGroup,
  CartesianChart,
  getTransformComponents,
  setScale,
  setTranslate,
  useChartPressState,
  useChartTransformState,
} from "victory-native";
import { BarToolTip } from "../GeneralTooltip/VictorBarTooltip";

const barColors: Record<string, string[]> = {
  ac: ["red", "white"],
  battery: ["blue", "white"],
  output: ["#F7D102", "white"],
  solar: ["purple", "white"],
};
interface Props {
  selectedDate: string;
  selectedTab?: number;
  selectedParams?: ("ac" | "battery" | "output" | "solar")[];
  setChartHeight?: (height: number) => void;
  datas: {
    results: any[];
  };
}

export default function VictoryBar({
  selectedDate,
  selectedTab,
  selectedParams,
  setChartHeight,
  datas,
}: Props) {
  const [data, setData] = React.useState<any[]>([]);
  const [ticks, setTicks] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!selectedDate) return;
    // 🔹 Extract year & month only (ignore time completely)
    const [year, month] = selectedDate.split("T")[0].split("-").map(Number);
    if (selectedTab === 1) {
      const daysInMonth = new Date(year, month, 0).getDate();
      const apiDayMap: Record<number, any> = {};

      datas?.results?.forEach((item) => {
        if (!item.createdAtPK) return;
        const day = new Date(item.createdAtPK).getDate();
        apiDayMap[day] = {
          ac: item?.consumption?.dailyConsumption || 0,
          battery: item?.battery?.dailyCharging || 0,
          output: item?.grid?.dailyPurchase || 0,
          solar: item?.production?.dailyProduction || 0,
        };
      });

      // NOTE: store x as midpoint (day + 0.5) so bars render between ticks (1 and 2)
      const generated = Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        const dayData = apiDayMap[day] || {
          ac: 0,
          battery: 0,
          output: 0,
          solar: 0,
        };
        return { x: day + 0.5, day, ...dayData }; // x is midpoint, keep 'day' for labels/ticks
      });

      setData(generated);
      setTicks(Array.from({ length: daysInMonth }, (_, i) => i + 1)); // ticks = integer days
    } else if (selectedTab === 2) {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const apiMonthMap: Record<number, any> = {};

      datas?.results?.forEach((item) => {
        if (!item.createdAtPK) return;
        const m = new Date(item.createdAtPK).getMonth() + 1;
        apiMonthMap[m] = {
          ac: item?.consumption?.monthlyConsumption || 0,
          battery: item?.battery?.monthlyCharging || 0,
          output: item?.grid?.monthlyPurchase || 0,
          solar: item?.production?.monthlyProduction || 0,
        };
      });

      const generated = months.map((m) => ({
        x: m + 0.5, // midpoint between 1–2, 2–3, ...
        label: m,
        ...(apiMonthMap[m] || { ac: 0, battery: 0, output: 0, solar: 0 }),
      }));

      setData(generated);
      setTicks(months);
    } else if (selectedTab === 3) {
      const startYear = 2020;
      const currentYear = new Date().getFullYear();
      const years = Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => startYear + i
      );
      const apiYearMap: Record<number, any> = {};

      datas?.results?.forEach((item) => {
        if (!item.createdAtPK) return;
        const y = new Date(item.createdAtPK).getFullYear();
        apiYearMap[y] = {
          ac: item?.consumption?.yearlyConsumption || 0,
          battery: item?.battery?.yearlyCharging || 0,
          output: item?.grid?.yearlyPurchase || 0,
          solar: item?.production?.yearlyProduction || 0,
        };
      });

      const generated = years.map((y) => ({
        x: y + 0.5, // midpoint between years
        label: y,
        ...(apiYearMap[y] || { ac: 0, battery: 0, output: 0, solar: 0 }),
      }));

      setData(generated);
      setTicks(years);
    }
  }, [selectedDate, selectedTab, datas]);

  const font = useFont(inter, 7);
  const fontY = useFont(inter, 7);
  // const [ticks, setTicks] = React.useState([
  //   0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30,
  // ]);

  const ticksShared = useSharedValue(ticks);

  const transformState = useChartTransformState({ scaleX: 1.1, scaleY: 1 });
  const state = transformState.state; // ✅ same instance

  const [width, setWidth] = React.useState(0);
  // const { state: toolState, isActive } = useChartPressState<{
  //   x: number;
  //   y: Record<"ac" | "battery" | "output" | "solar", number>;
  // }>({
  //   x: 0,
  //   y: { ac: 0, battery: 0, output: 0, solar: 0 },
  // });
  const { state: toolState, isActive } = useChartPressState<{
    x: number;
    y: Record<"ac" | "battery" | "output" | "solar", number>;
  }>({
    x: 0,
    y: { ac: 0, battery: 0, output: 0, solar: 0 },
  });

  const [lastToolState, setLastToolState] = React.useState<{
    x: { position: number; value: number };
    y: Record<
      "ac" | "battery" | "output" | "solar",
      { position: number; value: number }
    >;
  } | null>(null);

  // Save last tooltip state when active
  React.useEffect(() => {
    if (isActive && toolState?.x?.value) {
      setLastToolState({
        x: {
          position: toolState.x.position.value,
          value: toolState.x.value.value,
        },
        y: {
          ac: {
            position: toolState.y.ac.position.value,
            value: toolState.y.ac.value.value,
          },
          battery: {
            position: toolState.y.battery.position.value,
            value: toolState.y.battery.value.value,
          },
          output: {
            position: toolState.y.output.position.value,
            value: toolState.y.output.value.value,
          },
          solar: {
            position: toolState.y.solar.position.value,
            value: toolState.y.solar.value.value,
          },
        },
      });
    }
  }, [isActive, toolState]);

  const k = useSharedValue<any>(1);
  const tx = useSharedValue<any>(0);
  const ty = useSharedValue(0);

  // 👇 Track zoom & pan continuously (not just when gesture ends)
  useAnimatedReaction(
    () => {
      const vals = getTransformComponents(state.matrix.value);
      return { scaleX: vals.scaleX, translateX: vals.translateX };
    },
    ({ scaleX, translateX }) => {
      k.value = scaleX;
      tx.value = translateX;
    }
  );
  // 🔹 Reset zoom & pan when tab changes
  React.useEffect(() => {
    // Reset zoom and translation
    k.value = 1.1;
    tx.value = 0;
    setLastToolState(null);
    // Reset chart matrix to its default position
    state.matrix.value = setScale(setTranslate(state.matrix.value, 0, 0), 1, 1);
  }, [selectedTab]);

  // ✅ Apply zoom/pan limits + dynamic ticks
  useAnimatedReaction(
    () => ({ scaleX: k.value, translateX: tx.value }),
    ({ scaleX, translateX }) => {
      "worklet";

      const maxZoom = 6;
      const minZoom = 1;
      const clampedK = Math.max(Math.min(scaleX, maxZoom), minZoom);

      const pointWidth = width / data.length;
      const totalContentWidth = pointWidth * data.length * clampedK;

      // ✅ overscroll padding
      const leftOverscroll = -width * 0.09;
      const rightOverscroll = width * 0.1;

      const minTx = -(totalContentWidth - width) - rightOverscroll;
      const maxTx = leftOverscroll;

      // ✅ keep view centered relative to previous zoom
      const prevK = k.value;
      const zoomChanged = Math.abs(prevK - clampedK) > 0.001;

      let newTx = translateX;

      if (zoomChanged) {
        const centerXBefore = -translateX + width / 2;
        const scaleRatio = clampedK / prevK;
        const centerXAfter = centerXBefore * scaleRatio;
        newTx = -(centerXAfter - width / 2);
      }

      // ✅ clamp translation (ensure chart stays visible)
      newTx = Math.min(Math.max(newTx, minTx), maxTx);

      // ✅ apply transforms safely
      let m = setTranslate(state.matrix.value, newTx, 0);
      state.matrix.value = setScale(m, clampedK, 1);

      // ✅ update shared values
      k.value = clampedK;
      tx.value = newTx;

      // ✅ dynamic ticks (optional)
      const zoomLevel = Math.round(clampedK * 10) / 10;
      let newTicks: number[] = [];
      let totalPoints = data.length;

      // if (zoomLevel <= 1.5) {
      //   // ✅ Always include first and last tick
      //   const first = data[0]?.x ?? 0;
      //   const last = data[data.length - 1]?.x ?? 0;

      //   // ✅ Create spaced mid ticks safely
      //   const midTicks = Array.from(
      //     { length: Math.max(1, Math.floor(totalPoints / 3)) },
      //     (_, i) => {
      //       const index = i * Math.floor(totalPoints / 3);
      //       const value = data[index]?.x;
      //       return typeof value === "number" ? value : null;
      //     }
      //   ).filter((v): v is number => v !== null && !isNaN(v));

      //   // ✅ Combine and deduplicate while ensuring numeric type
      //   newTicks = Array.from(new Set([first, ...midTicks, last])).filter(
      //     (v): v is number => typeof v === "number" && !isNaN(v)
      //   );
      // } else {
      // newTicks = data
      //   .map((d) => d.x)
      //   .filter((v): v is number => typeof v === "number" && !isNaN(v));

      // if (JSON.stringify(ticksShared.value) !== JSON.stringify(newTicks)) {
      //   ticksShared.value = newTicks;
      //   runOnJS(setTicks)(newTicks);
      // }
    }
  );
  // ✅ Find max among all values across ac, battery, output, solar
  const selectedMaxY = React.useMemo(() => {
    if (data.length === 0) return 10; // fallback

    // Flatten all values from the 4 series
    const allValues = data.flatMap((d) => [
      d.ac || 0,
      d.battery || 0,
      d.output || 0,
      d.solar || 0,
    ]);

    // Find the highest value
    const maxVal = Math.max(...allValues);

    // Add small padding so bars don't touch top
    return Math.ceil(maxVal + maxVal * 0.1);
  }, [data]);
  const yTicks = React.useMemo(() => {
    if (selectedMaxY <= 0) return [0, 1, 2, 3]; // fallback
    const step = selectedMaxY / 4;
    return [
      Math.round(step), // first tick above 0
      Math.round(step * 2.5),
      // Math.round(step * 3),
      Math.round(selectedMaxY), // max value
    ];
  }, [selectedMaxY]);
  React.useEffect(() => {
    if (selectedParams) {
      if (selectedParams.length === 1) {
        setChartHeight?.(210);
      } else if (selectedParams.length === 2) {
        setChartHeight?.(250);
      } else if (selectedParams.length === 3) {
        setChartHeight?.(300);
      } else if (selectedParams.length === 4) {
        setChartHeight?.(400);
      }
    }
  }, [selectedParams]);

  return (
    <SafeAreaView style={styles.safeView}>
      {/* //Legend Text */}

      <View
        style={{
          paddingHorizontal: 16,
          marginLeft: hs(10),
        }}
      >
        {selectedParams?.map((param) => {
          const paramColors: Record<string, string> = {
            ac: "red",
            battery: "blue",
            output: "#F7D102",
            solar: "purple",
          };

          // Pick current or last value safely
          const currentValue = isActive
            ? toolState?.y?.[param]?.value?.value
            : lastToolState?.y?.[param]?.value;

          const value =
            currentValue !== undefined ? Number(currentValue).toFixed(1) : "--";

          return (
            <View
              key={param}
              style={[
                styles.dotText,
                {
                  marginRight: 6,
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
            >
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: paramColors[param], marginRight: 6 },
                ]}
              />
              <Text
                style={{
                  color: "#111",
                  fontSize: ms(11),
                  fontFamily: "monospace",
                  minWidth: 50,
                }}
              >
                {param.toUpperCase()}: {value}
              </Text>
            </View>
          );
        })}
      </View>

      <View
        style={styles.chart}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        <CartesianChart
          data={data}
          chartPressState={toolState}
          xKey="x"
          yKeys={["ac", "battery", "output", "solar"]}
          domain={{ y: [0, selectedMaxY] }}
          padding={{ left: 20, right: 20, bottom: 30, top: 20 }}
          domainPadding={{
            left: 40,
            right:
              selectedTab === 1
                ? k.value < 1.5
                  ? -55 * (1.5 - k.value) // gives slight space when zoomed out
                  : -5 * (k.value - 1.5)
                : selectedTab === 2
                ? -20 + k.value * 8 // slightly different scaling for tab 2
                : selectedTab === 3
                ? 20 + k.value * 5 // even smaller shift for tab 3
                : 0,

            top: 20,
            bottom: 0,
          }}
          axisOptions={{
            font,
            tickCount: { y: 5, x: 6 },
            lineColor: "#d4d4d8",
            labelColor: "#000",
          }}
          yAxis={[
            {
              domain: [yTicks[0], selectedMaxY], // start domain at first tick
              tickValues: yTicks, // explicitly show these 4 values
              font: fontY,
              lineWidth: 0,
              labelOffset: 1.5,
              labelColor: "black",
              tickCount: 3,
              formatYLabel: (n: number) => `${n.toFixed(0)} kW`,
            },
          ]}
          frame={{
            lineWidth: { top: 0.7, bottom: 0.7, left: 0.7, right: 0.7 },
          }}
          xAxis={{
            enableRescaling: false,
            font: font,
            tickValues: ticks,
            labelOffset: 1,
            lineWidth: 0.5,
            // tickCount: Number(ticks?.length),
            tickCount: ticks.length,
            labelColor: "black",

            formatXLabel: (value: any) => {
              if (selectedTab === 1) return `${value}`; // Day
              if (selectedTab === 2) return `${value}`; // Month
              if (selectedTab === 3) return `${value}`; // Year
              return value;
            },
          }}
          transformState={transformState.state}
          transformConfig={{
            pinch: { enabled: true, dimensions: "x" },
            pan: { enabled: true, dimensions: "x" },
          }}
        >
          {({ points, chartBounds }) => (
            <>
              <BarGroup
                chartBounds={chartBounds}
                betweenGroupPadding={0.4}
                withinGroupPadding={0.1}
                roundedCorners={{ topLeft: 4, topRight: 4 }}
              >
                {React.Children.toArray(
                  selectedParams?.map((param) => (
                    <BarGroup.Bar key={param} points={points[param]}>
                      <LinearGradient
                        start={vec(0, 0)}
                        end={vec(0, 540)}
                        colors={barColors[param]}
                      />
                    </BarGroup.Bar>
                  ))
                )}
              </BarGroup>
              {(isActive || lastToolState) && (
                <BarToolTip
                  width={1}
                  chartTop={chartBounds.top}
                  xPos={
                    isActive
                      ? toolState.x.position.value
                      : lastToolState?.x?.position ?? 0
                  }
                />
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: { flex: 1, backgroundColor: "transparent" },
  chart: {
    height: vs(360),
    marginHorizontal: 10,
    // backgroundColor: "red",
    borderRadius: 12,
    width: hs(375),
    marginLeft: -22,
    paddingBottom: vs(20),
  },
  optionsScrollView: { flex: 1 },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  dotText: { flexDirection: "row", alignItems: "center" },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5, // makes it a circle
    marginRight: 6, // space between dot and text
  },
});
