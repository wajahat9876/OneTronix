import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import {
  multiply4,
  scale,
  translate,
  useFont,
} from "@shopify/react-native-skia";
import * as React from "react";
import { useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import {
  Area,
  CartesianChart,
  getTransformComponents,
  Line,
  setScale,
  setTranslate,
  useChartTransformState,
} from "victory-native";

export const PanZoom = () => {};

export default function PanZoomPage() {
  const font = useFont(inter, 12);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const { state } = useChartTransformState();

  const k = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const onePointOffset = width / DATA.length;
  useAnimatedReaction(
    () => {
      return state.panActive.value || state.zoomActive.value;
    },
    (cv, pv) => {
      if (!cv && pv) {
        const vals = getTransformComponents(state.matrix.value);
        k.value = vals.scaleX;
        tx.value = vals.translateX;
        ty.value = vals.translateY;

        // k.value = withTiming(1);
        // tx.value = withTiming(0);
        // ty.value = withTiming(0);
      }
    }
  );

  useAnimatedReaction(
    () => ({ k: k.value, tx: tx.value, ty: ty.value }),
    ({ k, tx, ty }) => {
      const vals = getTransformComponents(state.matrix.value);
      const pointWidth = width / DATA.length;

      // Allow 1 point overscroll on the left
      const leftOverscroll = pointWidth * 6;

      // Allow 2 points overscroll on the right
      const rightOverscroll = pointWidth * 20;

      // Calculate max right translation considering zoom scale
      const maxRightTx = -(width * k - width) - rightOverscroll;

      // Clamp translationX between left and right boundaries
      const clampedTx = Math.min(Math.max(tx, maxRightTx), leftOverscroll);

      // Apply clamped translation and scale
      const m = setTranslate(state.matrix.value, clampedTx, ty);
      state.matrix.value = setScale(m, k);
    }
  );

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={["highTmp"]}
          yAxis={[
            {
              font: font,
              enableRescaling: true,
            },
          ]}
          xAxis={{
            enableRescaling: true,
            font: font,
          }}
          transformState={state}
          onChartBoundsChange={({ top, left, right, bottom }) => {
            setWidth(right - left);
            setHeight(bottom - top);
          }}
        >
          {({ points, chartBounds }) => {
            return (
              <>
                <Area
                  points={points?.highTmp}
                  y0={chartBounds.bottom}
                  color="red"
                  opacity={0.3}
                  animate={{ type: "timing", duration: 300 }}
                />
                <Line points={points.highTmp} color="red" strokeWidth={2} />
              </>
            );
          }}
        </CartesianChart>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      >
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button
              title={"Pan Left"}
              // style={{ flex: 1 }}
              onPress={() => {
                const vals = getTransformComponents(state.matrix.value);
                const twoPointOffset = (width / DATA.length) * 1;
                const maxRightTx =
                  -(width * vals.scaleX - width) - twoPointOffset;

                const newTx = Math.max(vals.translateX - 10, maxRightTx); // clamp
                state.matrix.value = setTranslate(
                  state.matrix.value,
                  newTx,
                  vals.translateY
                );
              }}
            />

            <Button
              title={"Pan Right"}
              // style={{ flex: 1 }}
              onPress={() => {
                const vals = getTransformComponents(state.matrix.value);
                const pointWidth = width / DATA.length;
                const overscroll = pointWidth * 20;
                const maxRightTx = -(width * vals.scaleX - width) - overscroll;

                const newTx = Math.max(vals.translateX - 10, maxRightTx); // clamp to allow 2 points beyond
                state.matrix.value = setTranslate(
                  state.matrix.value,
                  newTx,
                  vals.translateY
                );
              }}
            />
          </View>
          <Button
            title="Reset"
            onPress={() => {
              // Reset scale and translation
              state.matrix.value = setScale(
                setTranslate(state.matrix.value, 0, 0),
                1
              );
              // Also reset your shared values to keep useAnimatedReaction in sync
              k.value = 1;
              tx.value = 0;
              ty.value = 0;
            }}
          />

          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button
              title={"Pan Up"}
              // style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  translate(0, 0)
                );
              }}
            />
            <Button
              title={"Pan Down"}
              // style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  translate(0, 0)
                );
              }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button
              title={"Zoom In"}
              // style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  scale(1.25, 1.25, 1, { x: width / 2, y: height / 2 })
                );
              }}
            />
            <Button
              title={"Zoom Out"}
              // style={{ flex: 1 }}
              onPress={() => {
                state.matrix.value = multiply4(
                  state.matrix.value,
                  scale(0.75, 0.75, 1, { x: width / 2, y: height / 2 })
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: "white",
  },
});
