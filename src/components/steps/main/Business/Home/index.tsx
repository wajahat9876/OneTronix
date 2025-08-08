/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useBusinessDetails } from "@/store/selectors/business/business";
import BottomSheet from "@gorhom/bottom-sheet";
import { PortalBottomSheetRef } from "@src/components/globals/PortalBottomSheet/types";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { ms } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Platform, StatusBar, View } from "react-native";
import Animated from "react-native-reanimated";

const Index = ({ goTo }: MultiStepFormProps) => {
  const router = useRouter();

  const { auth_token, data: businessData } = useAppSelector(useBusinessDetails);

  const {
    refetch: currentFetch,
    isFetching: currentFetching,
    data,
  } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

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
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content", true);
      return () => {
        StatusBar.setBarStyle("dark-content", true);
      };
    }, [])
  );

  return (
    <Animated.View {...pageTransitionAnimation} key="home" className="flex-1">
      <ScreenAuth
        title=""
        style={{
          backgroundColor: "transparent",
        }}
        topColor="transparent"
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus={false}
        disableTopSafeArea
        appBarProps={{
          light: false,
        }}
        disableAppBar
        back={() => {}}
      >
        <View style={styles.container}>{/* header section */}</View>
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
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
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
