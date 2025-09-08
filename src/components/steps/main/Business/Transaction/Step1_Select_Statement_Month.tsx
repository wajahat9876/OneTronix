import { useGetGraphDataQuery } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import FilterIcon from "@assets/icons/filter.png";
import { useFont } from "@shopify/react-native-skia";
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
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
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

export default function PanZoomPage() {
  //Filter Modal  code
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParams, setSelectedParams] = useState<string[]>([
    "Solar Power",
    "Consumption Power",
  ]);
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
  const font = useFont(inter, 8);
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

      const clampedTx = Math.min(Math.max(tx, maxRightTx), leftOverscroll);

      // Apply horizontal zoom only
      let m = setTranslate(state.matrix.value, clampedTx, 0);
      state.matrix.value = setScale(m, clampedK, 1);

      // Lock zoom
      if (k !== clampedK) {
        k.value = clampedK;
      }
      const value = Math.round(clampedK * 10) / 10;
      if (selectedTab === 0) {
        console.log(value);
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

  const maxY = Math.max(...DATA.map((d) => d.solarPower));
  React.useEffect(() => {
    refetch();
  }, [selectedTab]);
  // Ref
  const dateOfBirthRef = React.useRef() as React.MutableRefObject<TextInput>;
  const selectedMaxY = React.useMemo(() => {
    if (!selectedParams.length) return 100; // default max
    return Math.max(
      ...DATA.flatMap((d) =>
        selectedParams.map((param) => {
          switch (param) {
            case "Solar Power":
              return d.solarPower;
            case "Consumption Power":
              return d.consumptionPower;
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
            default:
              return 0;
          }
        })
      )
    );
  }, [selectedParams]);

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
        <View
          style={{
            marginTop: vs(20),
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View style={{ width: "75%", marginTop: vs(6) }}>
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
          <View style={{}}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>

            <FilterModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              options={[
                "Solar Power",
                "Consumption Power",
                "Ups-Load",
                "Feed-in Power",
                "Purchasing Power",
                "SOC",
                "Charging Power",
                "Discharging Power",
              ]}
              defaultSelected={["Solar Power", "Consumption Power"]}
              onConfirm={(selected) => setSelectedParams(selected)}
            />
          </View>
        </View>
      </View>

      <View style={{ flex: 1, width: "100%", paddingHorizontal: 16 }}>
        <CartesianChart
          data={DATA}
          axisOptions={{
            axisScales: { xAxisScale: "linear", yAxisScale: "linear" },
          }}
          domain={{ x: [0, 24] }}
          domainPadding={{ top: 1, bottom: 1 }}
          padding={{ top: 10, bottom: 10 }}
          xKey="day"
          yKeys={["solarPower", "consumptionPower"]}
          yAxis={[
            {
              font: font,
              enableRescaling: false, // prevent auto-scaling
              domain: [0, selectedMaxY], //graph ma 0 0r max value show krne k lie Yaxis ki
              // tickValues: [0, Number(maxY.toFixed(0))],
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
          transformState={state}
          onChartBoundsChange={({ top, left, right, bottom }) => {
            setWidth(right - left);
            setHeight(bottom - top);
          }}
        >
          {({ points, chartBounds }) => {
            return (
              <>
                {selectedParams.includes("Solar Power") && (
                  <>
                    <Line
                      points={points.solarPower}
                      color="orange"
                      strokeWidth={0.5}
                    />
                    <Area
                      points={points.solarPower}
                      y0={chartBounds.bottom}
                      color="orange"
                      opacity={0.2}
                    />
                  </>
                )}

                {selectedParams.includes("Consumption Power") && (
                  <>
                    <Line
                      points={points.consumptionPower}
                      color="blue"
                      strokeWidth={0.5}
                    />
                    <Area
                      points={points.consumptionPower}
                      y0={chartBounds.bottom}
                      color="blue"
                      opacity={0.2}
                    />
                  </>
                )}

                {/* {selectedParams.includes("Ups-Load") && (
        <>
          <Line points={points.upsLoad} color="green" strokeWidth={0.5} />
          <Area points={points.upsLoad} y0={chartBounds.bottom} color="green" opacity={0.2} />
        </>
      )} */}
                {/* Add other parameters similarly */}
              </>
              // <>
              //   <Line
              //     points={points.solarPower}
              //     color="orange"
              //     strokeWidth={0.5}
              //   />
              //   <Area
              //     points={points.solarPower}
              //     y0={chartBounds.bottom}
              //     color="orange"
              //     opacity={0.2}
              //   />

              //   <Line
              //     points={points.consumptionPower}
              //     color="blue"
              //     strokeWidth={0.5}
              //   />
              //   <Area
              //     points={points.consumptionPower}
              //     y0={chartBounds.bottom}
              //     color="blue"
              //     opacity={0.2}
              //   />
              // </>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const DATA = [
  {
    day: 0,
    solarPower: 40,
    consumptionPower: 20,
  },
  {
    day: 1,
    solarPower: 40 + 30 * Math.random(),
    consumptionPower: 40 + 30 * Math.random(),
  },
  {
    day: 2,
    solarPower: 40 + 30 * Math.random(),
    consumptionPower: 40 + 30 * Math.random(),
  },
  {
    day: 5,
    solarPower: 0,
    consumptionPower: 0,
  },
  {
    day: 10,
    solarPower: 100,
    consumptionPower: 5,
  },
];
// const DATA = Array.from({ length: 289 }, (_, i) => {
//   // 289 points = 24h in 5min intervals
//   const hour = (i * 5) / 60; // 0 → 24
//   console.log("hour", hour);
//   return {
//     day: hour, // x-axis
//     solarPower: Math.max(
//       0,
//       Math.sin((Math.PI * hour) / 24) * 1000 + Math.random() * 50
//     ), // dummy solar curve
//     consumptionPower: Math.max(
//       0,
//       500 + Math.cos((Math.PI * hour) / 12) * 200 + Math.random() * 30
//     ),
//   };
// });

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
