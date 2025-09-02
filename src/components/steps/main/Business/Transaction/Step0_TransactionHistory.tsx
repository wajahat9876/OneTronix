/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import BottomSheet from "@gorhom/bottom-sheet";
import { useFont } from "@shopify/react-native-skia";
import { PortalBottomSheetRef } from "@src/components/globals/PortalBottomSheet/types";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import Colors from "@src/constants/Colors";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  CartesianChart,
  getTransformComponents,
  Line,
  useChartTransformState,
} from "victory-native";
type Pt = { hour: number; value: number };

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  lowTmp: 20 + 10 * Math.random(),
  highTmp: 40 + 30 * Math.random(),
}));
const Step0_TransactionHistory = () => {
  const font = useFont(inter, 12);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [xTicks, setXTicks] = useState<number[]>([0, 6, 12, 18, 24]);
  const [yTicks, setYTicks] = useState<number[]>([0, 5, 10, 15, 20]);
  const [trigger, setTrigger] = useState(false);
  // Enable pan/zoom by creating a transform state and passing it to the chart
  // const { state } = useChartTransformState(); // defaults: pan + pinch enabled

  // // Helper to generate aligned ticks for a [min,max] domain with a given step
  // const makeTicks = (min: number, max: number, step: number) => {
  //   const ticks: number[] = [];
  //   for (let v = Math.ceil(min / step) * step; v <= max; v += step) {
  //     ticks.push(v);
  //   }
  //   return ticks.length > 0 ? ticks : [Math.floor(min), Math.ceil(max)];
  // };
  const { state } = useChartTransformState();

  const makeTicks = (min: number, max: number, step: number): number[] => {
    const ticks: number[] = [];
    for (let v = Math.ceil(min / step) * step; v <= max; v += step) {
      ticks.push(v);
    }
    return ticks.length > 0 ? ticks : [Math.floor(min), Math.ceil(max)];
  };

  const handleState = () => {
    const vals = getTransformComponents(state.matrix.value);
    let scaleX = vals?.scaleX || 1;
    let scaleY = vals?.scaleY || 1;

    // 🔒 Clamp zoom so it never goes above 5
    if (scaleX > 5) scaleX = 5;
    if (scaleY > 5) scaleY = 5;

    // --- X Axis ---
    const minX = 0,
      maxX = 100;
    const stepX = Math.max(1, Math.round(10 - (scaleX - 1) * 2));
    const newXTicks = makeTicks(minX, maxX, stepX);
    setXTicks((prev) =>
      prev.join(",") !== newXTicks.join(",") ? newXTicks : prev
    );

    // --- Y Axis ---
    const minY = 0,
      maxY = 100;
    const stepY = Math.max(1, Math.round(10 - (scaleY - 1) * 2));
    const newYTicks = makeTicks(minY, maxY, stepY);
    setYTicks((prev) =>
      prev.join(",") !== newYTicks.join(",") ? newYTicks : prev
    );
  };

  const onScaleChange = () => {
    handleState();
  };
  // We read the chart's scales when they change and compute a step of 6/4/2/1
  // const onScaleChange = () => {
  //   const vals = getTransformComponents(state.matrix.value);

  //   const scaleX = vals?.scaleX || 1;
  //   const scaleY = vals?.scaleY || 1;

  //   // --- X Axis ---
  //   const minX = 0;
  //   const maxX = 24;

  //   let stepX = 6;
  //   if (scaleX >= 1.2) stepX = 4;
  //   if (scaleX >= 1.4) stepX = 2;
  //   if (scaleX >= 1.6) stepX = 1;

  //   setXTicks(makeTicks(minX, maxX, stepX));

  //   // --- Y Axis ---
  //   const minY = 0;
  //   const maxY = 20;

  //   let stepY = 5;
  //   if (scaleY >= 1.2) stepY = 3;
  //   if (scaleY >= 1.4) stepY = 2;
  //   if (scaleY >= 1.6) stepY = 1;

  //   setYTicks(makeTicks(minY, maxY, stepY));
  // };
  // Memo points key for the line

  const router = useRouter();
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };
  const bottomSheetRef2 = useRef<BottomSheet>(null);
  const chartKey = `${xTicks.join(",")}_${yTicks.join(",")}`;
  return (
    <ScreenAuth
      title="Report"
      style={{
        backgroundColor: Colors.light.theme.backgroundTopCurveSection,
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        router.replace("/(main)/Business/Home");
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ padding: 12, height: 320 }}>
          {font && (
            <CartesianChart
              key={chartKey}
              data={DATA}
              xKey="day"
              yKeys={["lowTmp", "highTmp"]}
              transformState={state}
              transformConfig={{
                pan: { dimensions: "x" },
                pinch: { dimensions: "x" },
              }}
              axisOptions={{
                font,
                lineColor: "black",
                labelColor: "black",
                lineWidth: 1,
              }}
              onScaleChange={() => {
                onScaleChange();
              }}
              xAxis={{
                font,
                tickValues: xTicks,
                formatXLabel: (n: number) => `${n}`,
                labelColor: "black",
                lineColor: "black",
              }}
              yAxis={[
                {
                  enableRescaling: true,
                  font,
                  tickValues: yTicks,
                  formatYLabel: (n: number) => `${n}`,
                  labelColor: "black",
                  lineColor: "black",
                },
              ]}
            >
              {({ points }) => (
                <Line points={points.highTmp} color="red" strokeWidth={3} />
              )}
            </CartesianChart>
          )}
        </View>
      </GestureHandlerRootView>
      {/* <PortalBottomSheet
        ref={bottomSheetRef}
        snapPoints={['55%']}
        handleComponent={undefined}
        enableContentPanningGesture
        enableHandlePanningGesture
        handleIndicatorStyle={{
          backgroundColor: 'black',
        }}
        TouchComponent={() => <></>}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            onPress={() => bottomSheetRef.current?.close()}
          />
        )}
      >
        <TransactionSummary
          transactionDetails={transDetails}
          activeCurrency={businessData?.activeCurrency}
        />
      </PortalBottomSheet> */}
    </ScreenAuth>
  );
};

export default Step0_TransactionHistory;

const styles = StyleSheet.create({
  transStyle: {
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === "ios" ? 2 : 0,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "gray",
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    paddingTop: 50,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2c3e50",
  },
  infoPanel: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  activeText: {
    fontSize: 12,
    color: "#3366cc",
    fontWeight: "bold",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#3366cc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
  },
  resetButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
  },
  buttonText: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  chartContainer: {
    height: 300,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataPreview: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
  },
  dataText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
  instructions: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
  },
  instructionText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
});
