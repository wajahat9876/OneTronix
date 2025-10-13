import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
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

const generateData = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    x: index + 1,
    y: 10 + Math.floor(40 * Math.random()),
    z: 30 + Math.floor(20 * Math.random()),
    w: 5 + Math.floor(45 * Math.random()),
  }));

interface Props {
  selectedDate: string;
  selectedTab?: number;
}

export default function VictoryBar({ selectedDate, selectedTab }: Props) {
  const [data, setData] = React.useState<any[]>([]);
  const [ticks, setTicks] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!selectedDate) return;
    // 🔹 Extract year & month only (ignore time completely)
    const [year, month] = selectedDate.split("T")[0].split("-").map(Number);
    if (selectedTab === 1) {
      // 🔹 Get correct number of days in that month
      const daysInMonth = new Date(year, month, 0).getDate();
      // 🔹 Generate data for all days in that month
      const generated = Array.from({ length: daysInMonth }, (_, index) => ({
        x: index + 1,
        y: 10 + Math.floor(40 * Math.random()),
        z: 30 + Math.floor(20 * Math.random()),
        w: 5 + Math.floor(45 * Math.random()),
      }));

      setData(generated);
      setTicks(generated.map((d) => d.x));
    } else if (selectedTab === 2) {
      // 🔹 Monthly view (months 1–12)
      const generated = Array.from({ length: 12 }, (_, index) => ({
        x: index + 1,
        y: 10 + Math.floor(40 * Math.random()),
        z: 30 + Math.floor(20 * Math.random()),
        w: 5 + Math.floor(45 * Math.random()),
      }));
      setData(generated);
      setTicks(generated.map((d) => d.x));
    } else if (selectedTab === 3) {
      // 🔹 Yearly view (e.g. 2020–2025)
      const startYear = 2020;
      const endYear = 2025;
      const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, index) => startYear + index
      );
      const generated = years.map((year) => ({
        x: year,
        y: 10 + Math.floor(40 * Math.random()),
        z: 30 + Math.floor(20 * Math.random()),
        w: 5 + Math.floor(45 * Math.random()),
      }));
      setData(generated);
      setTicks(years);
    }
  }, [selectedDate, selectedTab]);

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
        // ✅ Show fewer ticks, but always include first and last
        const midTicks = Array.from(
          { length: Math.ceil(totalPoints / 3) }, // adjust density
          (_, i) => data[i * 3]?.x
        ).filter(Boolean);

        const first = data[0]?.x;
        const last = data[data.length - 1]?.x;

        // ✅ Ensure first & last are always visible and unique
        newTicks = Array.from(new Set([first, ...midTicks, last]));
      } else {
        // ✅ Show all ticks when zoomed in
        newTicks = data.map((d) => d.x);
      }

      if (JSON.stringify(ticksShared.value) !== JSON.stringify(newTicks)) {
        ticksShared.value = newTicks;
        runOnJS(setTicks)(newTicks);
      }
    }
  );

  return (
    <SafeAreaView style={styles.safeView}>
      <View
        style={styles.chart}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["y", "z", "w"]}
          domain={{ y: [0, 60] }}
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
              if (selectedTab === 2) return `M${value}`; // Month
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
              <BarGroup.Bar points={points.y}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 540)}
                  colors={["#f472b6", "#be185d90"]}
                />
              </BarGroup.Bar>
              <BarGroup.Bar points={points.z}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 500)}
                  colors={["#c084fc", "#7c3aed90"]}
                />
              </BarGroup.Bar>
              <BarGroup.Bar points={points.w}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 500)}
                  colors={["#a5f3fc", "#0891b290"]}
                />
              </BarGroup.Bar>
            </BarGroup>
          )}
        </CartesianChart>
      </View>

      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      />
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
});
