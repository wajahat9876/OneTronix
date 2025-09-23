import {
  BackdropBlur,
  DashPathEffect,
  Fill,
  Line,
  LinearGradient,
  Skia,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import * as React from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";

import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import {
  type SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  BarGroup,
  CartesianChart,
  getTransformComponents,
  setScale,
  setTranslate,
  useChartPressState,
  useChartTransformState,
} from "victory-native";

export type GraphDataItem = {
  day: number;
  low: number;
  high: number;
  temp: number;
};

type BarGraphProps = {
  segment: string;
  data: GraphDataItem[];
};

export default function BarGraph({ segment, data }: BarGraphProps) {
  const [groupWidth, setGroupWidth] = React.useState(0);
  const [chartBottom, setChartBottom] = React.useState(0);
  const [chartLeft, setChartLeft] = React.useState(0);
  const font = useFont(inter, 8);

  const safeData =
    Array.isArray(data) && data.length > 0
      ? data
      : [{ day: 0, low: 0, high: 0, temp: 0 }];

  const { state: pressState, isActive } = useChartPressState({
    x: safeData[0].day,
    y: {
      low: safeData[0].low,
      high: safeData[0].high,
      temp: safeData[0].temp,
    },
  });

  // transform state provided by victory-native API
  const transform = useChartTransformState();

  const screenWidth = Dimensions.get("window").width;

  // clamp params
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 2;
  const EPS = 0.008; // small epsilon to avoid tiny writes that cause flicker

  // IMPORTANT: Do not update viewport manually. Drive only matrix below.
  useAnimatedReaction(
    () => transform.state.matrix.value,
    (matrix) => {
      "worklet";
      if (!matrix) return;

      let { scaleX, translateX } = getTransformComponents(matrix);

      const clampedScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scaleX));

      const contentWidth = screenWidth * clampedScale;
      const maxTranslateX = 0;
      const minTranslateX = -Math.max(0, contentWidth - screenWidth);

      const clampedTranslateX = Math.max(
        minTranslateX,
        Math.min(maxTranslateX, translateX)
      );

      const SCALE_EPS = 0.01;
      const TRANS_EPS = 1;

      if (
        Math.abs(scaleX - clampedScale) > SCALE_EPS ||
        Math.abs(translateX - clampedTranslateX) > TRANS_EPS
      ) {
        const scaled = setScale(matrix, clampedScale, 1);
        const finalMatrix = setTranslate(scaled, clampedTranslateX, 0);
        transform.state.matrix.value = finalMatrix;
      }
    }
  );

  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  // Bar highlight (keeps using shared values and timing)
  const barGap = 5;
  const animConfig = { duration: 300 };
  const ttX = useSharedValue(0);
  const ttY = useSharedValue(0);
  const ttH = useDerivedValue(() => chartBottom - ttY.value + barGap);

  useAnimatedReaction(
    () => pressState.x.position.value,
    (val) => {
      ttX.value = withTiming(val - groupWidth / 2 - barGap, animConfig);
    }
  );
  useAnimatedReaction(
    () =>
      Math.min(
        pressState.y.low.position.value,
        pressState.y.high.position.value
      ),
    (val) => {
      ttY.value = withTiming(val - barGap, animConfig);
    }
  );

  const low$ = useTiming(pressState.y.low.position);
  const w1 = useDerivedValue(() => ttX.value - chartLeft + groupWidth / 2);
  const p1Low = useDerivedValue(() => vec(chartLeft, low$.value));
  const p2Low = useDerivedValue(() => vec(chartLeft + w1.value, low$.value));

  const high$ = useTiming(pressState.y.high.position);
  const w2 = useDerivedValue(() => ttX.value + groupWidth / 2 - barGap);
  const p1High = useDerivedValue(() => vec(chartLeft, high$.value));
  const p2High = useDerivedValue(() => vec(chartLeft + w2.value, high$.value));

  const tooltipClip = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.addRRect(
      Skia.RRectXY(
        Skia.XYWHRect(ttX.value, ttY.value, groupWidth + barGap * 2, ttH.value),
        3,
        3
      )
    );
    return p;
  });

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          data={safeData}
          xKey="day"
          yKeys={["low", "high", "temp"]}
          domain={{ y: [0] }}
          padding={{ left: 2, right: 10, bottom: 30, top: 15 }}
          domainPadding={{ left: 10, right: 10 }}
          axisOptions={{
            font,
            tickValues: monthDays,
            lineColor: "#d4d4d8",
            labelColor: "red",
          }}
          chartPressState={pressState}
          transformState={transform.state}
          onChartBoundsChange={({ bottom, left }) => {
            setChartBottom(bottom);
            setChartLeft(left);
          }}
        >
          {({ points, chartBounds }) => (
            <>
              {isActive && (
                <>
                  <Line
                    p1={p1Low}
                    p2={p2Low}
                    strokeWidth={StyleSheet.hairlineWidth}
                  >
                    <DashPathEffect intervals={[8, 4]} />
                  </Line>
                  <Line
                    p1={p1High}
                    p2={p2High}
                    strokeWidth={StyleSheet.hairlineWidth}
                  >
                    <DashPathEffect intervals={[8, 4]} />
                  </Line>
                </>
              )}
              <BarGroup
                chartBounds={chartBounds}
                betweenGroupPadding={0.4}
                withinGroupPadding={0.1}
                onBarSizeChange={({ groupWidth }) => {
                  setGroupWidth(groupWidth);
                }}
              >
                <BarGroup.Bar points={points.low} animate={{ type: "timing" }}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 540)}
                    colors={["#94cdec", "rgba(59,86,239,0.56)"]}
                  />
                </BarGroup.Bar>
                <BarGroup.Bar points={points.high} animate={{ type: "timing" }}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 500)}
                    colors={["#fb9da0", "rgba(244,46,46,0.56)"]}
                  />
                </BarGroup.Bar>
                <BarGroup.Bar points={points.temp} animate={{ type: "timing" }}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 500)}
                    colors={["#5f3e3fff", "rgba(22, 22, 22, 0.56)"]}
                  />
                </BarGroup.Bar>
              </BarGroup>
              {isActive && (
                <BackdropBlur clip={tooltipClip} blur={10}>
                  <Fill color="gray" opacity={0.3} />
                </BackdropBlur>
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: { flex: 1 },
  chart: { flex: 1 },
});

const useTiming = (val: SharedValue<number>) => {
  const value = useSharedValue(0);
  useAnimatedReaction(
    () => val.value,
    (v) => {
      value.value = withTiming(v, { duration: 300 });
    }
  );
  return value;
};
