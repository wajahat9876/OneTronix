import {
  useGetAnalyticsDataQuery,
  useGetGraphDataQuery,
} from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import BulbIcon from "@assets/icons/ExchangeIcons/Bulb.png";
import FlashIcon from "@assets/icons/ExchangeIcons/flash.png";
import HomeIcon from "@assets/icons/ExchangeIcons/Home.png";
import SunIcon from "@assets/icons/ExchangeIcons/sun.png";
import FilterIcon from "@assets/icons/filter.png";
import ExchangeBlock from "@src/components/commons/business/ExchangeBlock";
import Loader from "@src/components/commons/business/LoaderOneTronix";
import MonthYearPicker from "@src/components/commons/business/MonthYear";
import DetailRow from "@src/components/commons/DetailRow";
import TabButtons from "@src/components/commons/TabButton";
import { TabButton } from "@src/components/commons/TabButton/types";
import DonutChart2 from "@src/components/globals/DonutChart2";
import FilterModal from "@src/components/globals/FilterModal";
import FormikDatePicker from "@src/components/globals/FormikDatePicker";
import PinchZoomLineChart from "@src/components/globals/ResponsiveChart";
import EmptyChart from "@src/components/globals/ResponsiveChart/EmptyChartResponsive";
import ZoomBarChart from "@src/components/globals/ZoomableChart/barChart";
import { ScrollView } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { ms, vs } from "@utils/design/design";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { useFormik } from "formik";
import moment from "moment";
import * as React from "react";
import { useState } from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export enum SelectMethod {
  Daily = "daily",
  Monthly = "monthly", //bad ma theek krna ha
  Yearly = "yearly",
  Total = "total",
}
export default function PanZoomPage() {
  //Filter Modal  code
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [date, setDate] = useState(new Date());
  const [chartHeight, setChartHeight] = useState(100);
  const [selectedParams, setSelectedParams] = useState<any[]>([]);
  const [modalDefaultSelected, setModalDefaultSelected] = useState<any[]>([]);

  // Update selectedParams whenever the tab changes
  React.useEffect(() => {
    const defaults =
      selectedTab === 0
        ? ["Purchase", "Consumption"]
        : ["Energy Purchased", "Energy Consumed"];
    setSelectedParams(defaults); // Update chart state
    setModalDefaultSelected(defaults); // Update modal default selection
  }, [selectedTab]);

  //Api define
  const {
    auth_token,
    data: businessData,
    inverterData,
  } = useAppSelector(useBusinessDetails);

  // Tab Button Code

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

  useFocusEffect(
    React.useCallback(() => {
      // 🔥 run these when screen gets focus
      refetch();
      analyticsRefetch();
      totalRefetch();

      return () => {
        console.log("Screen got focus");
      };
    }, [
      selectedTab,
      formik.values.dateOfBirth,
      tabValues[selectedTab],
      businessData?.devices?.[0]?._id,
    ]) // also runs again if selectedTab changes
  );
  React.useEffect(() => {
    if (selectedParams.length === 1) {
      setChartHeight(150);
    }
    if (selectedParams.length === 2) {
      setChartHeight(180);
    }
    if (selectedParams.length === 3) {
      setChartHeight(250);
    }
    if (selectedParams.length === 4) {
      setChartHeight(250);
    }
  }, [selectedParams]);

  React.useEffect(() => {
    refetch();
    analyticsRefetch();
    totalRefetch();

    const interval = setInterval(() => {
      console.log("⏳ Refreshing in background...");
      refetch();
      analyticsRefetch();
      totalRefetch();
    }, 500000);

    return () => clearInterval(interval);
  }, []);

  // Ref
  const dateOfBirthRef = React.useRef() as React.MutableRefObject<TextInput>;

  const [show, setShow] = useState(false);

  const openBottomSheet = () => {
    setShow(true);
  };

  const mapped = React.useMemo(() => {
    if (!data?.results?.length) return [];

    return data.results.map((item: any) => {
      const time = moment.utc(item.createdAtPK);
      const hour = time.hour() + time.minute() / 60;
      return {
        hour,
        Purchase: item.data?.ac?.watt ?? 0,
        Charging: item.data?.battery?.chargingWatt ?? 0,
        Discharging: item.data?.battery?.dischargingWatt ?? 0,
        Consumption: item.data?.output?.watt ?? 0,
        Solar: item.data?.solar?.watt ?? 0,
      };
    });
  }, [data?.results]);

  return (
    <SafeAreaView
      style={styles.safeView}
      edges={Platform.OS === "android" ? ["top"] : ["top", "bottom"]}
    >
      <StatusBar barStyle={"dark-content"} />
      <ScrollView>
        <Text
          style={{
            paddingHorizontal: 12,
            marginTop: 20,
            marginBottom: vs(20),
            fontSize: ms(16),
            fontFamily: "Ranade-Medium",
          }}
        >
          Usage & Generation
        </Text>
        <View
          style={{
            // backgroundColor: "#FAFAFA",
            backgroundColor: "white",
            paddingHorizontal: 10,
            paddingBottom: 10,
          }}
        >
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
                  disabled={summaryFetching}
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
                        moment(
                          formik.values.dateOfBirth,
                          "YYYY-MM-DD"
                        ).toDate(),
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
                </View>
                <FilterModal
                  key={selectedTab}
                  visible={modalVisible}
                  onClose={() => setModalVisible(false)}
                  options={
                    selectedTab === 0
                      ? [
                          "Purchase",
                          "Consumption",
                          "Charging",
                          "Discharging",
                          "Solar",
                        ]
                      : [
                          "Energy Purchased",
                          "Energy Consumed",
                          "Energy Charged",
                          "Energy Discharged",
                          "Solar Production",
                        ]
                  }
                  defaultSelected={modalDefaultSelected}
                  onConfirm={(selected: any) => setSelectedParams(selected)}
                />
              </View>
            </View>
          </View>
          {/* {selectedTab === 0 && DATA.length ? (
         //Legend Code
          ) : null} */}

          <View
            style={
              {
                // width: "100%",
                // height: selectedTab != 0 ? vs(290) : vs(320),
                // paddingHorizontal: 15,
                // marginLeft: -4,
                // backgroundColor: "red",
              }
            }
          >
            {selectedTab === 0 && data?.results?.length ? (
              <PinchZoomLineChart
                data={mapped}
                selectedParams={selectedParams}
                selectTab={selectedTab}
              />
            ) : //   data={mapped}
            //   selectedParams={selectedParams}
            //   ticks={ticks}
            // />
            selectedTab === 1 || selectedTab === 2 || selectedTab === 3 ? (
              // <BarGraph segment="month" data={barData} />
              <View>
                <ZoomBarChart
                  data={data}
                  selectedParams={selectedParams}
                  selectTab={selectedTab}
                  selectedDate={formik?.values?.dateOfBirth}
                />
                {/* <VictoryBar
                  setChartHeight={setChartHeight}
                  selectedDate={formik?.values?.dateOfBirth}
                  selectedTab={selectedTab}
                  selectedParams={selectedParams}
                  datas={data}
                /> */}
              </View>
            ) : (
              <EmptyChart selectedParams={selectedParams} />
            )}
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            marginTop: chartHeight ? vs(chartHeight * 0.3) : 35,
          }}
        >
          {/*  Production Section */}
          <DonutChart2
            type="Production"
            selectedTab={selectedTab}
            totalValue={parseFloat(
              (analyticsData?.results?.production?.production || 0).toFixed(2)
            )}
            load={parseFloat(
              Math.max(
                0,
                (analyticsData?.results?.production?.production || 0) -
                  ((analyticsData?.results?.battery?.charging || 0) +
                    (analyticsData?.results?.grid?.export || 0))
              ).toFixed(2)
            )}
            battery={parseFloat(
              (analyticsData?.results?.battery?.charging || 0).toFixed(2)
            )}
            grid={parseFloat(
              (analyticsData?.results?.grid?.export || 0).toFixed(2)
            )}
          />
          {/* Consumption Section */}
          <DonutChart2
            type="Consumption"
            selectedTab={selectedTab}
            totalValue={parseFloat(
              (analyticsData?.results?.consumption.consumption || 0).toFixed(2)
            )}
            solar={parseFloat(
              Math.max(
                0,
                (analyticsData?.results?.production?.production || 0) -
                  ((analyticsData?.results?.battery?.charging || 0) +
                    (analyticsData?.results?.grid?.export || 0))
              ).toFixed(2)
            )}
            grid={parseFloat(
              Math.max(
                0,
                (analyticsData?.results?.consumption?.consumption || 0) -
                  (Math.max(
                    0,
                    (analyticsData?.results?.production?.production || 0) -
                      (analyticsData?.results?.battery?.charging || 0) -
                      (analyticsData?.results?.grid?.export || 0)
                  ) +
                    (analyticsData?.results?.battery?.discharging || 0))
              ).toFixed(2)
            )}
            battery={parseFloat(
              (analyticsData?.results?.battery?.discharging || 0).toFixed(2)
            )}
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
                totalData?.results?.production?.production || 0
              ).toFixed(1)}
              unit1={"kWh"}
              label2={"Energy Consumed"}
              value2={Number(
                totalData?.results?.consumption?.consumption || 0
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
              unit1={"kWh"}
              label2={"Energy Purchased"}
              value2={Number(totalData?.results?.grid?.purchase || 0).toFixed(
                1
              )}
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
