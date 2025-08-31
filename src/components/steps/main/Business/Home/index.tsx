/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useLazyGetInverterDataQuery } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import BottomSheet from "@gorhom/bottom-sheet";
import FlowDiagram from "@src/components/globals/FlowDiagram";
import { PortalBottomSheetRef } from "@src/components/globals/PortalBottomSheet/types";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError } from "@src/hooks/useToasty";
import { ms } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";
import Animated from "react-native-reanimated";

const Index = ({ goTo }: MultiStepFormProps) => {
  // const router = useRouter();
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
  const [trigger] = useLazyGetInverterDataQuery();
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
    if (!deviceId) return;

    // Run immediately on mount
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

  // To show only active Curre
  // useFocusEffect(
  //   useCallback(() => {
  //     StatusBar.setBarStyle("light-content", false);
  //     return () => {
  //       StatusBar.setBarStyle("dark-content", true);
  //     };
  //   }, [])
  // );

  return (
    <Animated.View {...pageTransitionAnimation} key="home" className="flex-1">
      <ScreenAuth
        title=""
        style={{
          backgroundColor: "transparent",
        }}
        topColor="transparent"
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus={true}
        disableTopSafeArea
        appBarProps={{
          light: false,
        }}
        disableAppBar
        back={() => {}}
      >
        <View style={styles.container}>
          <FlowDiagram
            solar={result?.results?.inverterData?.data?.solar?.watt}
            grid={99} // negative = importing
            consumption={result?.results?.inverterData?.data?.output?.watt}
            battery={result?.results?.inverterData?.data?.battery?.watt}
            batteryWatt={result?.results?.inverterData?.data?.battery?.watt}
            batteryStatus={result?.results?.inverterData?.data?.battery?.status} // 🔹 "charging" | "discharging" | "full" from API
          />
        </View>
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
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  transactionsCard: {
    marginLeft: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === "ios" ? 2 : 0,
    marginBottom: 10,
  },
});
export default Index;
