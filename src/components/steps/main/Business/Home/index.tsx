/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useLazyGetInverterDataQuery } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import { setDarkMode } from "@/store/slices/business/businessSlice";
import BottomSheet from "@gorhom/bottom-sheet";
import HouseDiagram from "@src/components/commons/main/HouseDiagram";
import HeaderMainHome from "@src/components/globals/HeaderMainHome";
import { PortalBottomSheetRef } from "@src/components/globals/PortalBottomSheet/types";
import { StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useFormatDate from "@src/hooks/useFormatDate";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError } from "@src/hooks/useToasty";
import { ms } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import Animated from "react-native-reanimated";

const Index = ({ goTo }: MultiStepFormProps) => {
  const [isDark, setIsDark] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkTimeForDarkMode = () => {
      const currentHour = moment().hour(); // e.g. 22 for 10 PM
      // Enable dark mode between 8 PM and 5 AM
      if (currentHour >= 20 || currentHour < 5) {
        setIsDark(true);
        dispatch(setDarkMode(true));
      } else {
        setIsDark(false);
        dispatch(setDarkMode(false));
      }
    };
    // Check immediately on mount
    checkTimeForDarkMode();
    // Recheck every 15 minutes (optional)
    const interval = setInterval(checkTimeForDarkMode, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Use it everywhere below instead of scheme
  const textColor = isDark ? "white" : "black";
  const bgColor = isDark ? "#252525" : "white";
  const cardBg = isDark ? "#333333" : "#F2F2F2";
  const [result, setResult] = useState<any>(null);
  const { auth_token, data: businessData } = useAppSelector(useBusinessDetails);

  const {
    refetch: currentFetch,
    isFetching: currentFetching,
    data,
  } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const deviceId = businessData?.devices?.[0]?._id;

  // 2nd API → run only if deviceId exists
  // const { data: inverterData, isFetching } = useGetInverterDataQuery(
  //   { deviceId },
  //   {
  //     skip: !auth_token || !deviceId,
  //   }
  // );
  const [trigger, { isLoading }] = useLazyGetInverterDataQuery();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTrigger = async () => {
    try {
      if (deviceId && auth_token) {
        const res = await trigger({ deviceId });
        setResult(res?.data);
        console.log("res", res);
      }
    } catch (error: any) {
      renderToastError(error?.data?.message);
    }
  };
  useEffect(() => {
    handleTrigger();
    // Run every 5 seconds
    const interval = setInterval(() => {
      handleTrigger();
    }, 300000);

    // Cleanup interval when deviceId changes or component unmounts
    return () => clearInterval(interval);
  }, [deviceId]);

  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const openBottomSheet = () => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.open();
  };
  const [, setBottomSheetVisible] = useState(false);
  // 2ndBototmSheet for Currency
  const currencyModalRef = useRef<BottomSheet>(null);
  const closeCurrencySheet = () => {
    setBottomSheetVisible(false);
    currencyModalRef.current?.close();
  };
  const currencyPoints = useMemo(() => ["70%"], []);
  const { formatTime } = useFormatDate();

  return (
    <Animated.View {...pageTransitionAnimation} key="home" className="flex-1">
      <HeaderMainHome
        title=""
        style={{
          backgroundColor: bgColor,
        }}
        backColorLight={isDark ? false : true}
        topColor=""
        bottomColor={"transparent"}
        darkStatus={isDark ? false : true}
        disableTopSafeArea
        appBarProps={{
          light: false,
        }}
        // disableAppBar
        back={() => {}}
      >
        {/* <Text
          style={{
            marginTop: ms(10),
            marginLeft: ms(20),
            fontSize: ms(14),
            fontFamily: "Ranade-Medium",
            color: textColor,
          }}
        >
          System Status
        </Text> */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[styles.container, { backgroundColor: bgColor }]}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleTrigger}
              tintColor={"#6EB482"} // spinner color (iOS)
              colors={["#6EB482"]} // spinner color (Android)
            />
          }
        >
          <HouseDiagram
            solar={result?.results?.inverterData?.data?.solar?.watt ?? 0}
            grid={result?.results?.inverterData?.data?.grid?.watt ?? 0}
            home={result?.results?.inverterData?.data?.output?.watt ?? 0}
            battery={result?.results?.inverterData?.data?.battery?.watt ?? 0}
            batteryWatt={result?.results?.inverterData?.data?.battery?.watt}
            batteryStatus={result?.results?.inverterData?.data?.battery?.status}
          />
          {/* <Image
            source={Diagram}
            style={{ width: 369, height: 360, alignSelf: "center" }}
          /> */}
          {/* <FlowDiagram
            solar={result?.results?.inverterData?.data?.solar?.watt}
            grid={99}
            consumption={result?.results?.inverterData?.data?.output?.watt}
            battery={result?.results?.inverterData?.data?.battery?.watt}
            batteryWatt={result?.results?.inverterData?.data?.battery?.watt}
            batteryStatus={result?.results?.inverterData?.data?.battery?.status}
          /> */}
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Excon-Regular",
              fontSize: ms(11),
              color: textColor,
            }}
          >
            Last Updated:{" "}
            {result?.results?.inverterData?.createdAt
              ? formatTime(result?.results?.inverterData.createdAt)
              : "-"}
          </Text>
          <View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "center",
              }}
            >
              <View
                style={[styles.transactionsCard, { backgroundColor: cardBg }]}
              >
                <Text style={[styles.txt, { color: textColor }]}>
                  Daily Production
                </Text>
                <Text style={[styles.txtStyle, { color: textColor }]}>
                  {Number(
                    result?.results?.dailySummary?.production
                      ?.dailyProduction ?? 0
                  ).toFixed(2)}
                  <Text style={[styles.unitTxt, { color: textColor }]}>
                    {" "}
                    kWh
                  </Text>
                </Text>
              </View>
              <View
                style={[styles.transactionsCard, { backgroundColor: cardBg }]}
              >
                <Text style={[styles.txt, { color: textColor }]}>
                  Daily Consumption
                </Text>
                <Text style={[styles.txtStyle, { color: textColor }]}>
                  {Number(
                    result?.results?.dailySummary?.consumption
                      ?.dailyConsumption || 0
                  ).toFixed(2)}{" "}
                  <Text style={[styles.unitTxt, { color: textColor }]}>
                    {" "}
                    kWh
                  </Text>
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <View style={styles.dailyCard}>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Excon-Regular",
                    fontSize: ms(13),
                  }}
                >
                  Daily Purchase
                </Text>
                <Text style={[styles.dailyTxt, { color: "white" }]}>
                  {Number(
                    result?.results?.dailySummary?.grid?.dailyPurchase || 0
                  ).toFixed(2)}{" "}
                  <Text style={styles.unitTxt}> kWh</Text>
                </Text>
              </View>
              <View
                style={[
                  styles.transactionsCard,
                  { backgroundColor: "transparent" },
                ]}
              >
                <Text style={[styles.txt, { color: textColor }]}>
                  Total Production
                </Text>
                <Text style={[styles.txtStyle, { color: textColor }]}>
                  {Number(
                    result?.results?.dailySummary?.consumption
                      ?.dailyConsumption || 0
                  ).toFixed(2)}{" "}
                  <Text style={styles.unitTxt}> kWh</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
          backdropComponent={(
            props, // Custom backdrop to handle press
          ) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              onPress={() => bottomSheetRef.current?.close()}
            />
          )}
        >
        
        </PortalBottomSheet> */}
      </HeaderMainHome>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginTop: 10,
  },
  unitTxt: {
    fontSize: ms(13),
    fontFamily: "Excon-Regular",
  },
  bottomSheet: {
    backgroundColor: "white",
    borderCurve: "circular",
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "#f9f9f9",
  },
  topHeader: {
    backgroundColor: "black",
    height: "41%",
    overflow: "hidden",
    borderBottomLeftRadius: ms(42),
    borderBottomRightRadius: ms(42),
  },
  viewTrans: {
    flexDirection: "row",
    marginTop: 2,
    justifyContent: "space-between",
  },
  directionTxt: {
    color: "black",
    fontWeight: "400",
    fontSize: getRespValue(16),
  },
  txtAccount: {
    color: "black",
    fontWeight: "600",
    width: "70%",
    fontSize: getRespValue(16),
  },
  txtTrans: { color: "black", fontWeight: "600", fontSize: getRespValue(16) },
  txtStyle: {
    fontSize: ms(30),
    fontWeight: "600",
    paddingVertical: 10,
    fontFamily: "Ranade-Medium",
  },
  dailyTxt: {
    fontSize: ms(30),
    fontWeight: "600",
    paddingVertical: 10,
    fontFamily: "Ranade-Medium",
  },
  dailyCard: {
    marginLeft: 1,
    justifyContent: "space-between",
    backgroundColor: "red",
    borderRadius: 5,
    // height: 50,
    padding: 20,
    width: "45%",
    // shadowColor: "#000",
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: Platform.OS === "ios" ? 2 : 2,
    marginBottom: 1,
  },
  transactionsCard: {
    marginLeft: 1,
    justifyContent: "space-between",
    borderRadius: 3,
    // height: 50,
    padding: 20,
    width: "45%",
    // shadowColor: "#000",
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: Platform.OS === "ios" ? 2 : 2,
    marginBottom: 1,
  },
  txt: {
    fontFamily: "Excon-Regular",
    fontSize: ms(13),
  },
});
export default Index;
