import GlobalLogout from "@src/components/globals/BuisnessLogoutModal";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { ScrollView, StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
// import { globalStyle } from '@src/styles/globals';
import { hs, vs } from "@utils/design/design";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
const Settings = ({ goTo }: MultiStepFormProps) => {
  const router = useRouter();

  // useEffect(() => {
  //   if (data?.alerts) {
  //     setAlert(data?.alerts === true);
  //   }
  // }, [data?.alerts]);
  // const toggleAlert = async () => {
  //   const newAlertState = !alert;
  //   try {
  //     const res = await transactionAlert({ type: newAlertState }).unwrap();
  //     setAlert(newAlertState);
  //     renderToastSuccess(res?.message);
  //   } catch (error: any) {
  //     renderToastError(error?.data?.message || 'Something went wrong');
  //   }
  // };
  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1 }}
    >
      <ScreenAuth
        title="Settings"
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
          // router.replace('/(main)/Business/Home');
        }}
      >
        <View style={styles.container}>
          <ScrollView>
            {/* <Picker
              selectedValue={selectedLanguage}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedLanguage(itemValue)
              }
            >
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
            </Picker> */}
            {/* <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 17,
                marginTop: vs(24),
              }}
            >
              Currency
            </Text>
            <SettingItem
              title="Add New Currency"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(1);
              }}
            /> */}
            {/* <SettingItem
              title="Currency Exchange"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(2);
              }}
            />
            <SettingItem
              title="Accounts Detail"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(8);
              }}
            />
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 17,
                marginTop: vs(24),
              }}
            >
              Others
            </Text>
echarts.use([SVGRenderer, LineChart, GridComponent, DataZoomComponent]);

            <SettingItem
              title="Linked Devices"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(12);
              }}
            /> */}
            {/* <SettingItem
              title="Cut-off Time"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(13);
              }}
            />
            <SettingItem
              title="Fee Invoice"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(11);
              }}
            />
            <SettingItem
              title="My Plan"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(7);
              }}
            /> */}
            {/* <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 17,
                marginTop: vs(24),
              }}
            >
              About App
            </Text>
            <SettingItem
              title="FAQS"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(4);
              }}
            />
            <SettingItem
              title="Legals"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(3);
              }}
            /> */}
            {/* <AlertsSettingsItem
              title="Transaction Alerts"
              switchValue={alert}
              onSwitchValueChange={toggleAlert}
            /> */}
          </ScrollView>
          <View style={{ marginBottom: vs(24) }}>
            <GlobalLogout key="dsa" marginTop={vs(24)} />
          </View>
        </View>
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: hs(16),
    marginTop: vs(24),
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
});
export default Settings;
// import { SVGRenderer, SvgChart } from "@wuba/react-native-echarts";
// import { LineChart } from "echarts/charts";
// import { DataZoomComponent, GridComponent } from "echarts/components";
// import * as echarts from "echarts/core";
// import React, { useEffect, useRef } from "react";
// import { Dimensions, View } from "react-native";

// echarts.use([SVGRenderer, LineChart, GridComponent, DataZoomComponent]);

// export default function ZoomChart() {
//   const chartRef = useRef<any>(null);
//   const { width } = Dimensions.get("window");
//   const height = 350;

//   // Generate fake time-series data
//   let base = +new Date(2016, 9, 3);
//   let oneDay = 24 * 3600 * 1000;
//   let valueBase = Math.random() * 300;
//   let valueBase2 = Math.random() * 50;
//   const data: [string, number][] = [];
//   const data2: [string, number][] = [];

//   for (let i = 1; i < 100; i++) {
//     const now = new Date((base += oneDay));
//     const dayStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join(
//       "-"
//     );
//     valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
//     valueBase <= 0 && (valueBase = Math.random() * 300);
//     data.push([dayStr, valueBase]);
//     valueBase2 = Math.round((Math.random() - 0.5) * 20 + valueBase2);
//     valueBase2 <= 0 && (valueBase2 = Math.random() * 50);
//     data2.push([dayStr, valueBase2]);
//   }

//   const option = {
//     backgroundColor: "#fff",
//     xAxis: {
//       type: "time",
//       splitLine: { show: false },
//     },
//     yAxis: {
//       type: "value",
//       splitLine: { show: false },
//     },
//     grid: {
//       top: 40,
//       left: 15,
//       right: 15,
//       bottom: 30,
//     },
//     // ✅ Enable zoom by pinch and drag only — no bars
//     dataZoom: [
//       {
//         type: "inside",
//         zoomOnMouseWheel: true,
//         moveOnMouseMove: true,
//         moveOnMouseWheel: true,
//         filterMode: "none",
//         throttle: 50,
//       },
//     ],
//     tooltip: { show: false }, // 🚫 disable popup tooltip
//     series: [
//       {
//         type: "line",
//         smooth: true,
//         symbol: "none",
//         sampling: "lttb",
//         itemStyle: { color: "#0770FF" },
//         lineStyle: { width: 1 },
//         areaStyle: {
//           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//             { offset: 0, color: "rgba(58,77,233,0.5)" },
//             { offset: 1, color: "rgba(58,77,233,0.1)" },
//           ]),
//         },
//         data,
//       },
//       {
//         type: "line",
//         smooth: true,
//         symbol: "none",
//         sampling: "lttb",
//         itemStyle: { color: "#F2597F" },
//         lineStyle: { width: 1 },
//         areaStyle: {
//           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//             { offset: 0, color: "rgba(213,72,120,0.5)" },
//             { offset: 1, color: "rgba(213,72,120,0.1)" },
//           ]),
//         },
//         data: data2,
//       },
//     ],
//   };

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = echarts.init(chartRef.current, "light", {
//         renderer: "svg",
//         width,
//         height,
//       });
//       chart.setOption(option);
//       return () => chart.dispose();
//     }
//   }, [width]);

//   return (
//     <View style={{ width, height }}>
//       <SvgChart ref={chartRef} style={{ flex: 1 }} />
//     </View>
//   );
// }
