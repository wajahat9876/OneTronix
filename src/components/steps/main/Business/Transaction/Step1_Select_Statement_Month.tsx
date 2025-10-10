import {
  useGetAnalyticsDataQuery,
  useGetGraphDataQuery,
} from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import Excon from "@assets/fonts/Excon_Complete/Fonts/OTF/Excon-Regular.otf";
import inter from "@assets/fonts/SpaceMono-Regular.ttf";
import BulbIcon from "@assets/icons/ExchangeIcons/Bulb.png";
import FlashIcon from "@assets/icons/ExchangeIcons/flash.png";
import HomeIcon from "@assets/icons/ExchangeIcons/Home.png";
import SunIcon from "@assets/icons/ExchangeIcons/sun.png";
import FilterIcon from "@assets/icons/filter.png";
import { getStrokeWidth } from "@hooks/useGetStrokeWidth";
import { useFocusEffect } from "@react-navigation/native";
import { DashPathEffect, useFont } from "@shopify/react-native-skia";
import BarGraph2 from "@src/components/commons/business/BarGraph2";
import ExchangeBlock from "@src/components/commons/business/ExchangeBlock";
import { GeneralToolTip } from "@src/components/commons/business/GeneralTooltip";
import Loader from "@src/components/commons/business/LoaderOneTronix";
import MonthYearPicker from "@src/components/commons/business/MonthYear";
import DetailRow from "@src/components/commons/DetailRow";
import TabButtons from "@src/components/commons/TabButton";
import { TabButton } from "@src/components/commons/TabButton/types";
import DonutChart2 from "@src/components/globals/DonutChart2";
import FilterModal from "@src/components/globals/FilterModal";
import FormikDatePicker from "@src/components/globals/FormikDatePicker";
import { ScrollView } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { ms, vs } from "@utils/design/design";
import dayjs from "dayjs";
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
  Monthly = "monthly", //bad ma theek krna ha
  Yearly = "yearly",
  Total = "total",
}
export default function PanZoomPage() {
  //Filter Modal  code
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedParams, setSelectedParams] = useState<
    ("ac" | "battery" | "output" | "solar")[]
  >(["ac", "battery"]);

  //Api define
  const {
    auth_token,
    data: businessData,
    inverterData,
  } = useAppSelector(useBusinessDetails);

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
  const updatedDate =
    selectedTab === 0
      ? formik?.values?.dateOfBirth
      : selectedTab === 1
      ? dayjs(formik?.values?.dateOfBirth).format("YYYY-MM")
      : selectedTab === 2
      ? dayjs(formik?.values?.dateOfBirth).format("YYYY")
      : selectedTab === 3
      ? `${2020}-${dayjs().year()}`
      : "";
  const {
    data,
    refetch,
    isFetching: summaryFetching,
    error,
    isError,
  } = useGetGraphDataQuery(
    {
      deviceId: businessData?.devices?.[0]?._id,
      type: tabValues[selectedTab],
      date: updatedDate,
    },
    { skip: !auth_token, refetchOnMountOrArgChange: true }
  );
  const { data: analyticsData, refetch: analyticsRefetch } =
    useGetAnalyticsDataQuery(
      {
        deviceId: businessData?.devices?.[0]?._id,
        type: tabValues[selectedTab],
        date: updatedDate,
      },
      {
        skip: !auth_token,
        refetchOnMountOrArgChange: true,
      }
    );
  const { data: totalData, refetch: totalRefetch } = useGetAnalyticsDataQuery(
    {
      deviceId: businessData?.devices?.[0]?._id,
      type: "total",
      date: updatedDate,
    },
    {
      skip: !auth_token,
      refetchOnMountOrArgChange: true,
    }
  );

  React.useEffect(() => {
    refetch();
    analyticsRefetch();
  }, [
    formik.values.dateOfBirth,
    tabValues[selectedTab],
    businessData?.devices?.[0]?._id,
  ]);
  const [DATA, setDATA] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!data?.results?.length || summaryFetching || error || isError) {
      setDATA([]);
      return;
    }
    if (selectedTab === 0) {
      const mapped = data?.results.map((item: any) => {
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
    } else {
      setDATA(data);
    }
  }, [data, formik.values.dateOfBirth]);
  const actionRef = React.useRef<CartesianActionsHandle>(null);

  // Graph Code
  const font = useFont(Excon, 8);
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
  // ✅ Remove previous vertical reactions and use this instead:

  useAnimatedReaction(
    () => state.matrix.value,
    (matrix) => {
      "worklet";
      const vals = getTransformComponents(matrix);

      // Only rebuild matrix if Y deviates — no animations, no timing (instant & smooth)
      if (vals.translateY !== 0 || vals.scaleY !== 1) {
        const locked = setTranslate(
          setScale(matrix, vals.scaleX, 1),
          vals.translateX,
          0
        );
        state.matrix.value = locked;
      }
    },
    [] // optional dependency array
  );

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
      // ✅ keep last point visible instead of cutting offs
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
  // React.useEffect(() => {
  //   refetch();
  //   analyticsRefetch();
  //   totalRefetch();
  // }, [selectedTab]);
  useFocusEffect(
    React.useCallback(() => {
      // 🔥 run these when screen gets focus
      refetch();
      analyticsRefetch();
      totalRefetch();

      // optional cleanup when screen loses focus
      return () => {
        console.log("Screen lost focus");
      };
    }, [selectedTab]) // also runs again if selectedTab changes
  );
  // Ref
  const dateOfBirthRef = React.useRef() as React.MutableRefObject<TextInput>;
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
    if (!selectedParams.length || !DATA?.length) return 10;
    return Math.max(
      ...DATA.flatMap((d) => selectedParams.map((param) => d[param] ?? 0))
    );
  }, [selectedParams, DATA]);
  //Null Handle

  const NullData = [
    { hour: 0, ac: 5, battery: null, output: null, solar: null },
    { hour: 24, ac: null, battery: null, output: null, solar: null },
  ];
  // Analytics code
  const labels = ["Daily", "Monthly", "Yearly", "Net"];
  const [show, setShow] = useState(false);

  const openBottomSheet = () => {
    setShow(true);
  };
  // MonthBar Graph Data
  const defaultMaxValues = React.useMemo(() => {
    if (!DATA.length) return {};

    const result: Record<string, number> = {};
    ["ac", "battery", "output", "solar"].forEach((param) => {
      const maxVal = Math.max(...DATA.map((d) => d[param] ?? 0));
      result[param] = maxVal;
    });
    return result;
  }, [DATA]);

  return (
    <SafeAreaView
      style={styles.safeView}
      edges={Platform.OS === "android" ? ["top"] : ["top", "bottom"]}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginTop: vs(20),
              marginBottom: vs(10),
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "95%",
                // marginLeft: 10,

                alignSelf: "center",
              }}
            >
              <TabButtons
                buttons={tabButtons}
                hideMarginLeft
                hideMarginRight
                selectedTab={selectedTab}
                setSelectedTab={(index) => setSelectedTab(index)}
              />
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {selectedTab === 0 ? (
              <View
                style={{
                  width: "60%",
                  marginTop: vs(6),
                }}
              >
                <FormikDatePicker
                  ref={dateOfBirthRef}
                  formik={formik}
                  showIcon={false}
                  name="dateOfBirth"
                  inputProps={{
                    backgroundColor: "transparent",
                    selectionColor:
                      Platform.OS === "ios"
                        ? Colors.light.theme.black
                        : "#D3D3D3",
                    cursorColor: Colors.light.theme.black,
                    borderBottomColor:
                      Colors.light.theme.textInputBottomBorderColor,
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
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    paddingVertical: 10,

                    marginLeft: 10,
                  }}
                >
                  <Text>Select Date </Text>
                  <TouchableOpacity onPress={() => openBottomSheet()}>
                    <Text>{updatedDate}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <View style={{ marginTop: vs(10), marginRight: 40 }}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    source={FilterIcon}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
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
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 16,

              marginTop: 20,
              justifyContent: "center",
            }}
          >
            {selectedParams.map((param) => {
              const paramColors: Record<string, string> = {
                ac: "red",
                battery: "blue",
                output: "#F7D102",
                solar: "purple",
              };

              const raw = toolState?.y?.[param]?.value;
              const value = isActive
                ? raw?.value !== undefined
                  ? Number(raw.value).toFixed(2)
                  : "--"
                : defaultMaxValues[param] !== undefined
                ? defaultMaxValues[param]!.toFixed(2)
                : "--";

              return (
                <View key={param} style={[styles.dotText, { marginRight: 12 }]}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: paramColors[param] },
                    ]}
                  />
                  <Text style={{ color: "#111", fontSize: 10 }}>
                    {param.toUpperCase()}: {value}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}

        <View
          style={{
            width: "100%",
            height: selectedTab != 0 ? 250 : 200,
            paddingHorizontal: 16,
          }}
        >
          {selectedTab === 0 && DATA.length ? (
            <CartesianChart
              chartPressState={toolState}
              actionsRef={actionRef}
              // ref={chartRef}
              key={`${formik.values.dateOfBirth}-${selectedTab}-${
                data?.results?.length || 0
              }`}
              data={DATA}
              axisOptions={{
                axisScales: { xAxisScale: "linear", yAxisScale: "linear" },
              }}
              domain={{ x: [0, 24] }}
              domainPadding={{ top: 1, bottom: 0.1 }}
              padding={{ top: 10, bottom: 10 }}
              xKey="hour"
              yKeys={["ac", "battery", "output", "solar"]}
              frame={{
                lineWidth: { top: 0, bottom: 1, left: 1, right: 0 },
              }}
              yAxis={[
                {
                  font: font,
                  enableRescaling: false, // prevent auto-scaling
                  domain: [0, selectedMaxY], //graph ma 0 0r max value show krne k lie Yaxis ki
                  // tickValues: [0, Number(maxY.toFixed(0))],
                  tickValues: [0, Math.round(selectedMaxY / 2), selectedMaxY],
                  tickCount: 2,
                  formatYLabel: (n: number) => `${n}kW`, // 👈 label with kW
                  lineWidth: 0.2,
                  labelOffset: 3,
                  labelColor: "gray",
                  linePathEffect: <DashPathEffect intervals={[6, 4]} />,
                },
              ]}
              xAxis={{
                enableRescaling: false,
                font: font,
                tickValues: ticks,
                labelOffset: 1,
                lineWidth: 0.3,
                tickCount: Number(ticks?.length),
                labelColor: "gray",
                linePathEffect: <DashPathEffect intervals={[6, 4]} />,
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
                          // animate={{ type: "timing", duration: 300 }}
                          key={"line"}
                          points={points.ac}
                          color="red"
                          strokeWidth={getStrokeWidth(ticks?.length)}
                          curveType="basis"
                          connectMissingData={false}

                          // connectMissingData={false}
                        />
                        <Area
                          points={points.ac}
                          y0={chartBounds.bottom}
                          color="red"
                          opacity={0.2}
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
                          strokeWidth={getStrokeWidth(ticks?.length)}
                          curveType="basis"
                        />
                        <Area
                          points={points.battery}
                          y0={chartBounds.bottom}
                          color="blue"
                          opacity={0.2}
                          curveType="basis"
                        />
                      </>
                    )}
                    {selectedParams.includes("output") && (
                      <>
                        <Line
                          key={"line3"}
                          points={points.output}
                          color="#F7D102"
                          strokeWidth={getStrokeWidth(ticks?.length)}
                          curveType="basis"
                        />
                        <Area
                          points={points.output}
                          y0={chartBounds.bottom}
                          color="#F7D102"
                          opacity={0.3}
                          curveType="basis"
                        />
                      </>
                    )}
                    {selectedParams.includes("solar") && (
                      <>
                        <Line
                          key={"line4"}
                          points={points.solar}
                          color="#8C11BA"
                          strokeWidth={getStrokeWidth(ticks?.length)}
                          curveType="basis"
                        />
                        <Area
                          points={points.solar}
                          y0={chartBounds.bottom}
                          color="#8C11BA"
                          opacity={0.3}
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
                        ticks={ticks}
                      />
                    )}
                  </>
                );
              }}
            </CartesianChart>
          ) : selectedTab === 1 || selectedTab === 2 || selectedTab === 3 ? (
            // <BarGraph segment="month" data={barData} />
            <View style={{ marginVertical: 20 }}>
              <BarGraph2
                selectedTab={selectedTab}
                date={date}
                selectedParams={selectedParams}
                data={DATA?.results || []}
              />
            </View>
          ) : (
            <CartesianChart
              key={`dsadsa`}
              data={NullData}
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
                },
              ]}
              xAxis={{
                enableRescaling: false,
                font: font,
                tickValues: ticks,
                tickCount: 6,
                formatXLabel: (d: number) => {
                  const hour = Math.floor(d);
                  const min = Math.round((d - hour) * 60);
                  return `${hour}:${min.toString().padStart(2, "0")}`;
                },
              }}
              // transformState={state}
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

        <View style={{ paddingHorizontal: 8 }}>
          {/*  Production Section */}
          <DonutChart2
            type="Production"
            load={analyticsData?.results?.consumption?.dailyConsumption || 0}
            battery={analyticsData?.results?.battery?.dailyCharging || 0}
            grid={0}
          />
          {/* Consumption Section */}
          <DonutChart2
            type="Consumption"
            solar={0}
            grid={analyticsData?.results?.grid?.dailyPurchase || 0}
            battery={analyticsData?.results?.battery?.dailyDischarging || 0}
          />
          {/* <View style={{ flexDirection: "row" }}> */}
          {/* Production Section */}
          {/* <View style={styles.dailyProduction}>
              <View style={{ marginLeft: 15 }}>
                <RectangularChart
                  type="Production"
                  totalValue={
                    analyticsData?.results?.production?.dailyProduction
                  }
                  selectedTab={selectedTab}
                  unit="kWh"
                  load={
                    analyticsData?.results?.consumption?.dailyConsumption || 0
                  }
                  battery={analyticsData?.results?.battery?.dailyCharging || 0}
                  grid={0}
                />
              </View>
            </View> */}

          {/* Consumption Section */}
          {/* <View style={styles.dailyProduction}>
              <View style={{ marginLeft: 10 }}>
                <RectangularChart
                  type={"Consumption"}
                  totalValue={
                    analyticsData?.results?.consumption?.dailyConsumption || 0
                  }
                  selectedTab={selectedTab}
                  unit="kWh"
                  solar={0}
                  grid={analyticsData?.results?.grid?.dailyPurchase || 0}
                  battery={
                    analyticsData?.results?.battery?.dailyDischarging || 0
                  }
                />
              </View>
            </View> */}
          {/* </View> */}
          {/* //Home Echange */}
          <View
            style={{
              backgroundColor: "#FAFAFA",
              marginBottom: 10,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <ExchangeBlock
              title="Home Exchange"
              icon1={SunIcon}
              icon2={BulbIcon}
              label1={"Solar Energy Produced"}
              value1={Number(
                totalData?.results?.production?.totalProduction || 0
              ).toFixed(1)}
              unit1={"MWh"}
              label2={"Energy Consumed"}
              value2={Number(
                totalData?.results?.consumption?.totalConsumption || 0
              ).toFixed(1)}
              unit2={"kWh"}
            />
            {/* //Grid Exchange */}
            <ExchangeBlock
              icon1={FlashIcon}
              icon2={HomeIcon}
              title="Grid Exchange"
              label1={"Energy Export"}
              value1={Number(0).toFixed(1)}
              unit1={"MWh"}
              label2={"Energy Purchased"}
              value2={Number(
                totalData?.results?.grid?.totalPurchase || 0
              ).toFixed(1)}
              unit2={"kWh"}
            />
          </View>
          {/* Current Cycle */}
          <View style={styles.currentCycle}>
            <Text
              style={[
                styles.txtProduction,
                { alignSelf: "flex-start", padding: 10 },
              ]}
            >
              Current Cycle
            </Text>
            <View>
              <Text style={styles.txtCycle}>AC</Text>
              <DetailRow
                label="Ampare"
                value={inverterData?.inverterData?.data?.ac?.amp}
                unit={"A"}
              />
              <DetailRow
                label="Frequency"
                value={inverterData?.inverterData?.data?.ac?.freq}
                unit={"Hz"}
              />
              <DetailRow
                label="Voltage"
                value={inverterData?.inverterData?.data?.ac?.voltage}
                unit={"V"}
              />
              <DetailRow
                label="Watt"
                value={inverterData?.inverterData?.data?.ac?.watt}
                unit={"kWh"}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.txtCycle}>Battery</Text>
              <DetailRow
                label="Charging Current"
                value={inverterData?.inverterData?.data?.battery?.chargingAmp}
                unit={"A"}
              />
              <DetailRow
                label="Charging Power"
                value={inverterData?.inverterData?.data?.battery?.chargingWatt}
                unit={"W"}
              />
              <DetailRow
                label="Discharging"
                value={
                  inverterData?.inverterData?.data?.battery?.dischargingWatt
                }
                unit={"W"}
              />
              <DetailRow
                label="Inverter Current"
                value={inverterData?.inverterData?.data?.battery?.inverterAmp}
                unit={"A"}
              />

              <DetailRow
                label="Voltage"
                value={inverterData?.inverterData?.data?.battery?.voltage}
                unit={"V"}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.txtCycle}>HVDC</Text>

              <DetailRow
                label="Voltage"
                value={inverterData?.inverterData?.data?.hvdc?.voltage}
                unit={"V"}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.txtCycle}>OutPut</Text>
              <DetailRow
                label="Load Current"
                value={inverterData?.inverterData?.data?.output?.loadAmp}
                unit={"A"}
              />
              <DetailRow
                label="Power"
                value={inverterData?.inverterData?.data?.output?.watt}
                unit={"W"}
              />

              <DetailRow
                label="Voltage"
                value={inverterData?.inverterData?.data?.output?.voltage}
                unit={"V"}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.txtCycle}>Solar</Text>
              <DetailRow
                label="Voltage"
                value={inverterData?.inverterData?.data?.solar?.voltage}
                unit={"V"}
              />
              <DetailRow
                label="Current"
                value={inverterData?.inverterData?.data?.solar?.loadAmp}
                unit={"A"}
              />
              <DetailRow
                label="Power"
                value={inverterData?.inverterData?.data?.solar?.watt}
                unit={"W"}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.txtCycle}>Temperature</Text>
              <DetailRow
                label="Booster"
                value={inverterData?.inverterData?.data?.temperature?.booster}
                unit={"℃"}
              />
              <DetailRow
                label="Inverter"
                value={inverterData?.inverterData?.data?.temperature?.inverter}
                unit={"℃"}
              />
              <DetailRow
                label="MPPT"
                value={inverterData?.inverterData?.data?.temperature?.mppt}
                unit={"℃"}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {show && (
        <MonthYearPicker
          visible={show}
          selectedTab={selectedTab}
          value={date}
          minDate={new Date(2020, 0, 1)}
          maxDate={new Date()}
          onCancel={() => setShow(false)}
          onConfirm={(date) => {
            setDate(date);
            formik.setFieldValue(
              "dateOfBirth",
              moment(date).format("YYYY-MM-DD")
            );
            setShow(false);
          }}
        />
      )}
      <Loader visible={summaryFetching} message="Yahoooo" />
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
  dailyProduction: {
    // alignItems: "center",
    marginBottom: 20,
    backgroundColor: "transparent",
    padding: 3,
    // marginLeft: 5,
    borderRadius: 10,
    width: "50%",
  },
  currentCycle: {
    // alignItems: "center",
    marginBottom: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  txtProduction: {
    fontSize: ms(14),
    fontFamily: "Excon-Medium",
    fontWeight: "600",

    marginBottom: 8,
    // alignSelf: "center",s
  },
  txtCycle: {
    fontFamily: "Excon-medium",
    paddingHorizontal: 12,
    fontSize: ms(13),
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  dotText: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5, // makes it a circle
    marginRight: 6, // space between dot and text
  },
  card: {
    marginLeft: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 15,
    // height: 50,
    padding: 20,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
    elevation: Platform.OS === "ios" ? 0.5 : 0.5,
    marginBottom: 10,
  },
  txtStyle: { fontSize: ms(10), fontWeight: "600", paddingVertical: 8 },
  labelStyles: { fontSize: ms(11), fontFamily: "Excon-Regular" },
});
