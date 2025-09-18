import { useGetGraphDataQuery } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import FilterIcon from "@assets/icons/filter.png";
import ResetIcon from "@assets/icons/reset.png";
import { useFont } from "@shopify/react-native-skia";
import { GeneralToolTip } from "@src/components/commons/business/GeneralTooltip";
import TabButtons from "@src/components/commons/TabButton";
import { TabButton } from "@src/components/commons/TabButton/types";
import FilterModal from "@src/components/globals/FilterModal";
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
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Area,
  CartesianActionsHandle,
  CartesianChart,
  CartesianChartRef,
  getTransformComponents,
  Line,
  setScale,
  setTranslate,
  useChartPressState,
  useChartTransformState,
} from "victory-native";
export enum SelectMethod {
  Daily = "daily",
  Monthly = "monthlllly", //bad ma theek krna ha
  Yearly = "yearly",
  Total = "total",
}

export default function PanZoomPage() {
  //Filter Modal  code
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParams, setSelectedParams] = useState<
    ("ac" | "battery" | "output" | "solar")[]
  >(["ac", "battery"]);
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
      accessibilityLabel: "monthly", //bad ma theek krna ha
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
  React.useEffect(() => {
    refetch();
  }, [
    formik.values.dateOfBirth,
    tabValues[selectedTab],
    businessData?.devices?.[0]?._id,
  ]);
  const [DATA, setDATA] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!data?.results?.length) {
      setDATA([]);
      return;
    }

    const mapped = data.results.map((item: any) => {
      const time = moment.utc(item.createdAt);
      const hour = time.hour() + time.minute() / 60;
      return {
        hour,
        ac: item.data?.ac?.watt ?? 0,
        battery: item.data?.battery?.chargingWatt ?? 0,
        output: item.data?.output?.watt ?? 0,
        solar: item.data?.solar?.watt ?? 0,
      };
    });

    setDATA(mapped);
  }, [data, formik.values.dateOfBirth]);
  const actionRef = React.useRef<CartesianActionsHandle>(null);

  // Graph Code
  const font = useFont(inter, 8);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const { state } = useChartTransformState();

  const k = useSharedValue<any>(1);
  const tx = useSharedValue<any>(0);
  const ty = useSharedValue(0);
  // const onePointOffset = width / DATA?.length;
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
  const [ticks, setTicks] = useState([0, 6, 12, 18, 24]);
  const ticksShared = useSharedValue(ticks);

  useAnimatedReaction(
    () => ({ k: k.value, tx: tx.value }),
    ({ k, tx }) => {
      const maxZoom = 5; // 🚀 max zoom in
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
      const currentVisibleStart = -tx / (pointWidth * DATA.length * k);
      // Apply the same visible start position with new zoom
      let targetTx = -currentVisibleStart * pointWidth * DATA.length * clampedK;
      // Make sure we don't scroll too far
      const clampedTx = Math.min(
        Math.max(targetTx, maxRightTx),
        leftOverscroll
      );
      // Apply the zoom and translation
      let m = setTranslate(state.matrix.value, clampedTx, 0);
      state.matrix.value = setScale(m, clampedK, 1);
      // Lock zoom and update translation if needed
      if (k !== clampedK) {
        k.value = clampedK;
        // FIX: Also update the translation to maintain position
        tx.value = clampedTx;
      }

      const value = Math.round(clampedK * 10) / 10;
      if (selectedTab === 0) {
        let newTicks: number[] = [];
        if (value > 0.5 && value <= 1.5) {
          // 6h → 0,6,12,18,24
          newTicks = [0, 6, 12, 18, 24];
        } else if (value > 1.5 && value <= 2.5) {
          // 3h → 0,3,6,...24
          newTicks = [0, 3, 6, 9, 12, 15, 18, 21, 24];
        } else if (value > 2.5 && value <= 3.5) {
          // 2h → 0,2,4,...24
          newTicks = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
        } else if (value > 3.5 && value <= 4.5) {
          // 1h → 0,1,2,...24
          newTicks = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24,
          ];
        } else if (value > 4.5 && value <= 5.5) {
          // 30 min → 0,0.5,1,1.5,...24
          newTicks = [
            0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8,
            8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15,
            15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5,
            22, 22.5, 23, 23.5, 24,
          ];
        } else {
          // 5 min → 0,0.0833,0.1666,...24
          newTicks = [
            0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8,
            8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15,
            15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5,
            22, 22.5, 23, 23.5, 24,
          ];
        }
        if (JSON.stringify(ticksShared.value) !== JSON.stringify(newTicks)) {
          ticksShared.value = newTicks;
          runOnJS(setTicks)(newTicks);
        }
      }
    }
  );
  // const maxY = Math.max(...DATA.map((d) => d.solarPower));
  React.useEffect(() => {
    refetch();
  }, [selectedTab]);
  // Ref
  const dateOfBirthRef = React.useRef() as React.MutableRefObject<TextInput>;
  // const selectedMaxY = React.useMemo(() => {
  //   if (!selectedParams.length) return 100; // default max
  //   return Math.max(
  //     ...DATA.flatMap((d) =>
  //       selectedParams.map((param) => {
  //         switch (param) {
  //           case "ac":
  //             return d.ac;
  //           case "battery":
  //             return d.battery;
  // case "Ups-Load":
  //   return d.upsLoad;
  // case "Feed-in Power":
  //   return d.feedInPower;
  // case "Purchasing Power":
  //   return d.purchasingPower;
  // case "SOC":
  //   return d.soc;
  // case "Charging Power":
  //   return d.chargingPower;
  // case "Discharging Power":
  //   return d.dischargingPower;
  //           default:
  //             return 0;
  //         }
  //       })
  //     )
  //   );
  // }, [selectedParams]);
  const { state: toolState, isActive } = useChartPressState<{
    x: number;
    y: Record<"ac" | "battery" | "output" | "solar", number>;
  }>({
    x: 0,
    y: { ac: 0, battery: 0, output: 0, solar: 0 },
  });

  const chartRef =
    React.useRef<CartesianChartRef<typeof toolState | undefined>>(null);
  const selectedMaxY = React.useMemo(() => {
    if (!selectedParams.length || !DATA.length) return 10;
    return Math.max(
      ...DATA.flatMap((d) => selectedParams.map((param) => d[param] ?? 0))
    );
  }, [selectedParams, DATA]);
  //Null Handle

  const NullData = [
    { hour: 0, ac: null, battery: null, output: null, solar: null },
    { hour: 24, ac: null, battery: null, output: null, solar: null },
  ];

  return (
    <SafeAreaView
      style={styles.safeView}
      edges={Platform.OS === "android" ? ["top"] : ["top", "bottom"]}
    >
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
        <View
          style={{
            marginTop: vs(20),
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: "65%",
              marginTop: vs(6),
              marginRight: 30,
              marginLeft: -10,
            }}
          >
            <FormikDatePicker
              ref={dateOfBirthRef}
              formik={formik}
              name="dateOfBirth"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Select Date",
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
          <View style={{ marginTop: vs(8) }}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  source={FilterIcon}
                  style={{ width: 23, height: 23, marginRight: 30 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
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
              >
                <Image source={ResetIcon} style={{ width: 23, height: 23 }} />
              </TouchableOpacity>
            </View>

            <FilterModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              options={["ac", "battery", "output", "solar"]}
              defaultSelected={["ac", "battery"]}
              onConfirm={(selected: any) => setSelectedParams(selected)}
            />
          </View>
        </View>
      </View>
      {selectedTab === 0 && DATA.length ? (
        <View style={{ paddingVertical: 10, paddingHorizontal: 25 }}>
          {selectedParams.includes("ac") && (
            <View style={styles.dotText}>
              <View style={[styles.colorDot, { backgroundColor: "orange" }]} />
              <Text style={{ color: "black", fontSize: 12 }}>AC</Text>
            </View>
          )}
          {selectedParams.includes("battery") && (
            <View style={styles.dotText}>
              <View style={[styles.colorDot, { backgroundColor: "blue" }]} />
              <Text style={{ color: "black", fontSize: 12 }}>Battery</Text>
            </View>
          )}
          {selectedParams.includes("output") && (
            <View style={styles.dotText}>
              <View style={[styles.colorDot, { backgroundColor: "red" }]} />
              <Text style={{ color: "black", fontSize: 12 }}>Output</Text>
            </View>
          )}
          {selectedParams.includes("solar") && (
            <View style={styles.dotText}>
              <View style={[styles.colorDot, { backgroundColor: "purple" }]} />
              <Text style={{ color: "black", fontSize: 12 }}>Solar</Text>
            </View>
          )}
        </View>
      ) : (
        <></>
      )}
      <View style={{ width: "100%", paddingHorizontal: 16, height: 200 }}>
        {selectedTab === 0 && DATA.length ? (
          <CartesianChart
            chartPressState={toolState}
            actionsRef={actionRef}
            ref={chartRef}
            key={`${formik.values.dateOfBirth}-${selectedTab}-${DATA.length}`}
            data={DATA.length ? DATA : NullData}
            axisOptions={{
              axisScales: { xAxisScale: "linear", yAxisScale: "linear" },
            }}
            domain={{ x: [0, 24] }}
            domainPadding={{ top: 1, bottom: 1 }}
            padding={{ top: 10, bottom: 10 }}
            xKey="hour"
            yKeys={["ac", "battery", "output", "solar"]}
            yAxis={[
              {
                font: font,
                enableRescaling: false, // prevent auto-scaling
                domain: [0, selectedMaxY], //graph ma 0 0r max value show krne k lie Yaxis ki
                // tickValues: [0, Number(maxY.toFixed(0))],
                tickValues: [0, Math.round(selectedMaxY / 2), selectedMaxY],
                tickCount: 3,
                formatYLabel: (n: number) => `${n}kW`, // 👈 label with kW
              },
            ]}
            xAxis={{
              enableRescaling: false,
              font: font,
              tickValues: ticks,
              tickCount: Number(ticks?.length),
              formatXLabel: (d: number) => {
                const hour = Math.floor(d);
                const min = Math.round((d - hour) * 60);
                return `${hour}:${min.toString().padStart(2, "0")}`;
              },
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
                  {selectedParams.includes("ac") && (
                    <>
                      <Line
                        key={"line"}
                        points={points.ac}
                        color="orange"
                        strokeWidth={0.8}
                        curveType="basis"
                        connectMissingData={false}

                        // connectMissingData={false}
                      />
                      <Area
                        points={points.ac}
                        y0={chartBounds.bottom}
                        color="orange"
                        opacity={0.1}
                        curveType="basis"
                      />
                    </>
                  )}

                  {selectedParams.includes("battery") && (
                    <>
                      <Line
                        key={"line2"}
                        points={points.battery}
                        color="blue"
                        strokeWidth={0.8}
                        curveType="basis"
                      />
                      <Area
                        points={points.battery}
                        y0={chartBounds.bottom}
                        color="blue"
                        opacity={0.1}
                        curveType="basis"
                      />
                    </>
                  )}
                  {selectedParams.includes("output") && (
                    <>
                      <Line
                        key={"line3"}
                        points={points.output}
                        color="red"
                        strokeWidth={0.8}
                        curveType="basis"
                      />
                      <Area
                        points={points.output}
                        y0={chartBounds.bottom}
                        color="red"
                        opacity={0.1}
                        curveType="basis"
                      />
                    </>
                  )}
                  {selectedParams.includes("solar") && (
                    <>
                      <Line
                        key={"line4"}
                        points={points.solar}
                        color="purple"
                        strokeWidth={0.5}
                        curveType="basis"
                      />
                      <Area
                        points={points.solar}
                        y0={chartBounds.bottom}
                        color="purple"
                        opacity={0.2}
                        curveType="basis"
                      />
                    </>
                  )}
                  {isActive && (
                    <GeneralToolTip
                      xPos={toolState.x.position} // pixel space
                      xVal={toolState.x.value} // data space (for HH:mm conversion)
                      chartBounds={chartBounds} // pass chart bounds
                      fontSrc={inter}
                    />
                  )}
                </>
              );
            }}
          </CartesianChart>
        ) : (
          <CartesianChart
            data={NullData}
            domain={{ x: [0, 24] }}
            domainPadding={{ top: 1, bottom: 1 }}
            padding={{ top: 10, bottom: 10 }}
            xKey="hour"
            yKeys={[]}
            yAxis={[
              {
                font: font,
                enableRescaling: true,
                domain: [0, selectedMaxY],

                tickValues: [0, Math.round(selectedMaxY / 2), selectedMaxY],
                tickCount: 3,
              },
            ]}
            xAxis={{
              enableRescaling: false,
              font: font,
              tickValues: ticks,
              tickCount: Number(ticks?.length),
              formatXLabel: (d: number) => {
                const hour = Math.floor(d);
                const min = Math.round((d - hour) * 60);
                return `${hour}:${min.toString().padStart(2, "0")}`;
              },
            }}
            transformState={undefined}
            onChartBoundsChange={({ top, left, right, bottom }) => {
              setWidth(right - left);
              setHeight(bottom - top);
            }}
          >
            {({ points, chartBounds }) => {
              return <></>;
            }}
          </CartesianChart>
        )}
      </View>
    </SafeAreaView>
  );
}

// const DATA = [
//   {
//     hour: 0,
//     ac: 40,
//     battery: 20,
//   },
//   {
//     hour: 1,
//     ac: 40 + 30 * Math.random(),
//     battery: 40 + 30 * Math.random(),
//   },
//   {
//     hour: 2,
//     ac: 40 + 30 * Math.random(),
//     battery: 40 + 30 * Math.random(),
//   },
//   {
//     hour: 5,
//     ac: 0,
//     battery: 0,
//   },
//   {
//     hour: 10,
//     ac: 100,
//     battery: 5,
//   },
// ];

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: "white",
  },
  dotText: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5, // makes it a circle
    marginRight: 6, // space between dot and text
  },
});
