import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import {
  BarGroup,
  CartesianChart,
  getTransformComponents,
  setScale,
  setTranslate,
  useChartTransformState,
} from "victory-native";

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
  datas: {
    results: any[];
  };
}

export default function VictoryBar({
  selectedDate,
  selectedTab,
  selectedParams,
  datas,
}: Props) {
  const [data, setData] = React.useState<any[]>([]);
  const [ticks, setTicks] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!selectedDate) return;
    // 🔹 Extract year & month only (ignore time completely)
    const [year, month] = selectedDate.split("T")[0].split("-").map(Number);
    if (selectedTab === 1) {
      // ✅ 1. Number of days in the selected month
      const daysInMonth = new Date(year, month, 0).getDate();

      // ✅ 2. Create a lookup from your API data
      const apiDayMap: Record<
        number,
        { ac: number; battery: number; output: number; solar: number }
      > = {};

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

      // ✅ 3. Generate full month data (fill missing days with 0)
      const generated = Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        const dayData = apiDayMap[day] || {
          ac: 0,
          battery: 0,
          output: 0,
          solar: 0,
        };
        return { x: day, ...dayData };
      });

      setData(generated);

      // ✅ 4. Compute evenly spaced ticks for the first render
      const totalPoints = generated.length;
      if (totalPoints > 0) {
        const first = generated[0].x;
        const last = generated[generated.length - 1].x;

        // Divide roughly into 4 parts → gives 1, 8, 16, 24, 31 (for 31 days)
        const step = Math.ceil(totalPoints / 4);
        const midTicks = Array.from({ length: 3 }, (_, i) => {
          const index = (i + 1) * step;
          const value = generated[index]?.x;
          return typeof value === "number" ? value : null;
        }).filter((v): v is number => v !== null && !isNaN(v));

        const dividedTicks = Array.from(
          new Set([first, ...midTicks, last])
        ).filter((v): v is number => typeof v === "number" && !isNaN(v));

        setTicks(dividedTicks); // ✅ nice clean spacing
      }
    } else if (selectedTab === 2) {
      // 🔹 Monthly view (months 1–12)
      const months = Array.from({ length: 12 }, (_, index) => index + 1);

      // ✅ Create lookup table from API data by month
      const apiMonthMap: Record<
        number,
        { ac: number; battery: number; output: number; solar: number }
      > = {};

      datas?.results?.forEach((item) => {
        if (!item.createdAtPK) return;
        const month = new Date(item.createdAtPK).getMonth() + 1; // 1–12

        apiMonthMap[month] = {
          ac: item?.consumption?.monthlyConsumption || 0,
          battery: item?.battery?.monthlyCharging || 0,
          output: item?.grid?.monthlyPurchase || 0,
          solar: item?.production?.monthlyProduction || 0,
        };
      });

      // ✅ Generate complete 12-month dataset (fill missing with 0)
      const generated = months.map((month) => {
        const monthData = apiMonthMap[month] || {
          ac: 0,
          battery: 0,
          output: 0,
          solar: 0,
        };
        return { x: month, ...monthData };
      });

      setData(generated);
      setTicks(months);
    } else if (selectedTab === 3) {
      // 🔹 Yearly view (from 2020 to current year)
      const startYear = 2020;
      const currentYear = new Date().getFullYear();
      const years = Array.from(
        { length: currentYear - startYear + 1 },
        (_, index) => startYear + index
      );

      // ✅ Create lookup from API data by year
      const apiYearMap: Record<
        number,
        { ac: number; battery: number; output: number; solar: number }
      > = {};

      datas?.results?.forEach((item) => {
        if (!item.createdAtPK) return;
        const year = new Date(item.createdAtPK).getFullYear();

        apiYearMap[year] = {
          ac: item?.consumption?.yearlyConsumption || 0,
          battery: item?.battery?.yearlyCharging || 0,
          output: item?.grid?.yearlyPurchase || 0,
          solar: item?.production?.yearlyProduction || 0,
        };
      });

      // ✅ Generate full year data (fill missing with 0)
      const generated = years.map((year) => {
        const yearData = apiYearMap[year] || {
          ac: 0,
          battery: 0,
          output: 0,
          solar: 0,
        };
        return { x: year, ...yearData };
      });

      setData(generated);
      setTicks(years);
    }
  }, [selectedDate, selectedTab, datas]);

  const font = useFont(inter, 7);
  // const [ticks, setTicks] = React.useState([
  //   0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30,
  // ]);

  const ticksShared = useSharedValue(ticks);

  const transformState = useChartTransformState({ scaleX: 1.1, scaleY: 1 });
  const state = transformState.state; // ✅ same instance

  const [width, setWidth] = React.useState(0);

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
    k.value = 1;
    tx.value = 0;

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
      const leftOverscroll = -width * 0.1;
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

      if (zoomLevel <= 1.5) {
        // ✅ Always include first and last tick
        const first = data[0]?.x ?? 0;
        const last = data[data.length - 1]?.x ?? 0;

        // ✅ Create spaced mid ticks safely
        const midTicks = Array.from(
          { length: Math.max(1, Math.floor(totalPoints / 3)) },
          (_, i) => {
            const index = i * Math.floor(totalPoints / 3);
            const value = data[index]?.x;
            return typeof value === "number" ? value : null;
          }
        ).filter((v): v is number => v !== null && !isNaN(v));

        // ✅ Combine and deduplicate while ensuring numeric type
        newTicks = Array.from(new Set([first, ...midTicks, last])).filter(
          (v): v is number => typeof v === "number" && !isNaN(v)
        );
      } else {
        newTicks = data
          .map((d) => d.x)
          .filter((v): v is number => typeof v === "number" && !isNaN(v));
      }

      if (JSON.stringify(ticksShared.value) !== JSON.stringify(newTicks)) {
        ticksShared.value = newTicks;
        runOnJS(setTicks)(newTicks);
      }
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

  return (
    <SafeAreaView style={styles.safeView}>
      <View
        style={styles.chart}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 16,
            marginTop: 10,
            justifyContent: "center",
          }}
        >
          {selectedParams?.map((param) => {
            const paramColors: Record<string, string> = {
              ac: "red",
              battery: "blue",
              output: "#F7D102",
              solar: "purple",
            };

            return (
              <View key={param} style={[styles.dotText, { marginRight: 12 }]}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: paramColors[param] },
                  ]}
                />
                <Text style={{ color: "#111", fontSize: 10 }}>
                  {param.toUpperCase()}
                </Text>
              </View>
            );
          })}
        </View>

        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["ac", "battery", "output", "solar"]}
          domain={{ y: [0, selectedMaxY] }}
          padding={{ left: 20, right: 20, bottom: 30, top: 20 }}
          domainPadding={{ left: 80, right: 40, top: 20 }}
          axisOptions={{
            font,
            tickCount: { y: 5, x: 6 },
            lineColor: "#d4d4d8",
            labelColor: "#000",
          }}
          xAxis={{
            enableRescaling: false,

            font: font,
            tickValues: ticks,
            labelOffset: 1,
            lineWidth: 0.3,
            // tickCount: Number(ticks?.length),
            tickCount: ticks.length,
            labelColor: "gray",
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
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: { flex: 1, backgroundColor: "#fafafa" },
  chart: {
    height: 280,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 360,
    marginLeft: -8,
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
