import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
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

export default function VictoryBar() {
  const [data] = React.useState(generateData(20));
  const font = useFont(inter, 12);

  const transformState = useChartTransformState({ scaleX: 1, scaleY: 1 });
  const [width, setWidth] = React.useState(0);

  const k = useSharedValue(1); // zoom
  const tx = useSharedValue(0); // pan

  // Apply zoom/pan limits
  useAnimatedReaction(
    () => (width > 0 ? transformState.state.matrix.value : null),
    (matrix) => {
      if (!matrix) return;
      ("worklet");
      const vals = getTransformComponents(matrix);

      const maxZoom = 5;
      const minZoom = 1;
      const clampedK = Math.min(Math.max(vals.scaleX, minZoom), maxZoom);

      const pointWidth = width / data.length;
      const totalContentWidth = pointWidth * data.length * clampedK;
      const leftOverscroll = 0;
      const maxRightTx = -(totalContentWidth - width);

      const clampedTx = Math.min(
        Math.max(vals.translateX, maxRightTx),
        leftOverscroll
      );

      let m = setTranslate(matrix, clampedTx, 0);
      transformState.state.matrix.value = setScale(m, clampedK, 1);

      k.value = clampedK;
      tx.value = clampedTx;
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
          domainPadding={{ left: 40, right: 40, top: 20 }}
          axisOptions={{
            font,
            tickCount: { y: 5, x: 6 },
            lineColor: "#d4d4d8",
            labelColor: "#000",
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
    height: 350,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  optionsScrollView: { flex: 1 },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
