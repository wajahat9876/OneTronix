import { useGetGraphDataQuery } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import { useFont } from "@shopify/react-native-skia";
import TabButtons from "@src/components/commons/TabButton";
import { TabButton } from "@src/components/commons/TabButton/types";
import FormikDatePicker from "@src/components/globals/FormikDatePicker";
import Colors from "@src/constants/Colors";
import { textInputUnderlinedProps } from "@src/constants/Props";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { vs } from "@utils/design/design";
import { useFormik } from "formik";
import moment from "moment";
import * as React from "react";
import { useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
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

export enum SelectMethod {
  Daily = "daily",
  Monthly = "monthly",
  Yearly = "yearly",
  Total = "total",
}

export const PanZoom = () => {};

export default function PanZoomPage() {
  //Api define
  const { auth_token, data: businessData } = useAppSelector(useBusinessDetails);

  // Tab Button Code
  const [selectedTab, setSelectedTab] = useState(0);
  const tabButtons: TabButton[] = [
    {
      title: "Day",
      accessibilityLabel: "daily",
    },
    {
      title: "Month",
      accessibilityLabel: "monthly",
    },
    {
      title: "Year",
      accessibilityLabel: "yearly",
    },
    {
      title: "Total",
      accessibilityLabel: "total",
    },
  ];
  const tabValues = [
    SelectMethod.Daily,
    SelectMethod.Monthly,
    SelectMethod.Yearly,
    SelectMethod.Total,
  ];

  // DataPicker Code
  const formik = useFormik({
    initialValues: {
      dateOfBirth: moment().format("YYYY-MM-DD"), // sirf yyyy-mm-dd
    },
    onSubmit: () => {},
  });
  //Api Call
  const { data, refetch } = useGetGraphDataQuery(
    {
      deviceId: businessData?.devices?.[0]?._id,
      type: tabValues[selectedTab],
      date: formik?.values?.dateOfBirth,
    },
    { skip: !auth_token }
  );
  // Graph Code
  const font = useFont(inter, 12);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const { state } = useChartTransformState();

  const k = useSharedValue<any>(1);
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
    () => ({ k: k.value, tx: tx.value }),
    ({ k, tx }) => {
      const maxZoom = 6; // 🚀 max zoom in
      const minZoom = 1; // 🚀 min zoom out
      const clampedK = Math.max(Math.min(k, maxZoom), minZoom);

      const pointWidth = width / DATA.length;
      const totalContentWidth = pointWidth * DATA.length * clampedK; // scaled width of data

      const leftOverscroll = pointWidth * 0; // adjust as you like
      const rightOverscroll = Math.max(
        pointWidth * 2,
        pointWidth * Math.floor(DATA.length / 3)
      );

      // ✅ keep last point visible instead of cutting off
      const maxRightTx = -(totalContentWidth - width) - rightOverscroll;

      const clampedTx = Math.min(Math.max(tx, maxRightTx), leftOverscroll);

      // Apply horizontal zoom only
      let m = setTranslate(state.matrix.value, clampedTx, 0);
      state.matrix.value = setScale(m, clampedK, 1);

      // Lock zoom
      if (k !== clampedK) {
        k.value = clampedK;
      }
    }
  );

  const maxY = Math.max(...DATA.map((d) => d.highTmp));
  React.useEffect(() => {
    refetch();
  }, [selectedTab]);
  // Ref
  const dateOfBirthRef = React.useRef() as React.MutableRefObject<TextInput>;
  return (
    <SafeAreaView style={styles.safeView}>
      <View
        style={{
          width: "90%",
          alignSelf: "center",
          marginTop: vs(20),
          marginBottom: vs(10),
        }}
      >
        <TabButtons
          buttons={tabButtons}
          hideMarginLeft
          hideMarginRight
          selectedTab={selectedTab}
          setSelectedTab={(index) => setSelectedTab(index)}
        />
        <View style={{ marginTop: vs(20) }}>
          <FormikDatePicker
            ref={dateOfBirthRef}
            formik={formik}
            name="dateOfBirth"
            inputProps={{
              ...textInputUnderlinedProps,
              placeholder: "Date of Birth",
              placeholderTextColor: Colors.light.theme.placeholderColor,
            }}
            datePickerProps={{
              maxDate: moment(new Date(), "YYYY-MM-DD").toDate(),
              date:
                formik.values.dateOfBirth &&
                moment(formik.values.dateOfBirth, "YYYY-MM-DD").toDate(),
              onChange: (selectedDate: any) => {
                formik.setFieldValue(
                  "dateOfBirth",
                  moment(selectedDate).format("YYYY-MM-DD")
                );
              },
            }}
          />
        </View>
      </View>

      <View style={{ flex: 1, width: "100%", paddingHorizontal: 16 }}>
        <CartesianChart
          data={DATA}
          axisOptions={{
            axisScales: { xAxisScale: "linear", yAxisScale: "linear" },
          }}
          domainPadding={{ top: 1, bottom: 1 }}
          padding={{ top: 10, bottom: 10 }}
          xKey="day"
          yKeys={["highTmp", "lowTmp"]}
          yAxis={[
            {
              font: font,
              enableRescaling: false, // prevent auto-scaling
              domain: [0, maxY], //graph ma 0 0r max value show krne k lie Yaxis ki
              tickValues: [0, maxY],
              tickCount: 3,
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
                <Line
                  points={points.highTmp}
                  color="red"
                  strokeWidth={0.5}
                  curveType="linear"
                />
                <Area
                  points={points?.lowTmp}
                  y0={chartBounds.bottom}
                  color="blue"
                  opacity={0.3}
                  animate={{ type: "timing", duration: 300 }}
                />
                <Line
                  points={points.lowTmp}
                  color="blue"
                  strokeWidth={0.5}
                  curveType="linear"
                />
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
          <Button
            title={"Refetch"}
            // style={{ flex: 1 }}
            onPress={() => {
              refetch();
            }}
          />
          {/* <View style={{ flexDirection: "row", gap: 20 }}>
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
          </View> */}
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

          {/* <View style={{ flexDirection: "row", gap: 20 }}>
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
          </View> */}
          {/* <View style={{ flexDirection: "row", gap: 20 }}>
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
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const DATA = [
  { day: 0, highTmp: 25, lowTmp: 0 },
  { day: 2, highTmp: 32, lowTmp: 15 },
  { day: 3, highTmp: 28, lowTmp: 5 },
  { day: 4, highTmp: 45, lowTmp: 35 },
  { day: 5, highTmp: 35, lowTmp: 45 },
];

// const DATA = Array.from({ length: 31 }, (_, i) => ({
//   day: i,
//   highTmp: 40 + 30 * Math.random(),
// }));

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: "white",
  },
});
