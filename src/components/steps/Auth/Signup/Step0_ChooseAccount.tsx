/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { setRole } from "@/store/slices/business/businessSlice";
import Logo from "@assets/eccLogo/oneTronixLogo.svg";
import BottomSheet from "@gorhom/bottom-sheet";
// import { Picker } from "@react-native-picker/picker";
import Step2ScanQr from "@src/components/steps/Qr";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm/types";
import { useAppDispatch } from "@src/hooks/useReduxHooks";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import Picker from "react-native-animated-wheel-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const Step0_ChooseAccount = ({ next, goTo }: MultiStepFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isActive, setActive] = useState(false);
  const [selectedValue, setSelectedValue] = useState(1);
  // refs

  const bottomSheetRef = useRef<BottomSheet>(null);
  const closeBottomSheet = () => {
    setActive(false);
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openBottomSheet = () => {
    setActive(true);
    setBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };
  const snapPoints = useMemo(() => ["100%"], []);
  const [, setBottomSheetVisible] = useState(false);
  const handlePress = () => {
    if (selectedValue === 1) {
      openBottomSheet();
    } else {
      console.log("Trigger");
      dispatch(setRole(true));
      goTo?.(1);
    }
  };
  const DATA = [
    { title: "Customer", value: 1 },
    { title: "Installer", value: 2 },
  ];
  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? getRespValue(10) : 10,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20}
        enableAutomaticScroll
        scrollEnabled
        extraHeight={Platform.OS === "ios" ? getRespValue(250) : 80}
        viewIsInsideTabBar
        keyboardOpeningTime={0}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: hs(18),
            paddingVertical: hs(30),
            marginTop: Platform.OS === "ios" ? vs(10) : vs(10),
          }}
        >
          <TouchableOpacity onPress={() => router.replace("/(auth)/Signin")}>
            <Text
              style={{
                color: "white",
                fontSize: ms(16),
                marginTop: vs(10),
                fontFamily: "Ranade-Regular",
              }}
            >
              ← Back
            </Text>
          </TouchableOpacity>
          <View
            style={{
              alignSelf: "flex-end",
            }}
          >
            <Logo />
          </View>
        </View>
        <View
          style={{
            // alignItems: "flex-start",
            marginLeft: 14,
            marginTop: vs(12),
          }}
        >
          <Text
            style={{
              color: "red",
              fontWeight: "900",
              fontSize: ms(44),
              lineHeight: 45,
              fontFamily: "Excon-Black",
            }}
          >
            ONE
          </Text>
          <Text
            style={{
              color: "red",
              fontSize: ms(44),
              fontFamily: "Excon-Regular",
              lineHeight: 45,
              marginTop: -4, // tighten spacing between ONE and TRONIX
            }}
          >
            TRONIX
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: ms(13),
              fontFamily: "Excon-Regular",
              letterSpacing: 1,
              lineHeight: 18,
              marginTop: -5, // small gap from TRONIX
            }}
          >
            TECHNOLOGY PARTNER
          </Text>
        </View>
        <View
          style={{
            height: 250,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: vs(60),
          }}
        >
          {/* "I am" text */}
          <Text
            style={{
              color: "gray",
              fontSize: ms(28),
              fontFamily: "Excon-Regular",
              marginRight: -40,
              marginLeft: 40,
            }}
          >
            I am
          </Text>

          <Picker
            itemHeight={45}
            pickerData={DATA}
            textStyle={{
              fontSize: 32,
              fontFamily: "Excon-Regular",
            }}
            onSelected={(item) => setSelectedValue(item?.value)}
          />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: vs(40),
            right: hs(20),
          }}
        >
          <TouchableOpacity onPress={() => handlePress()}>
            <Text
              style={{
                color: "white",
                fontSize: ms(16),
              }}
            >
              Next →
            </Text>
          </TouchableOpacity>
        </View>

        <Step2ScanQr
          snapPoints={snapPoints}
          bottomSheetRef={bottomSheetRef}
          key="dssa"
          closeBottomSheet={closeBottomSheet}
          active={isActive}
          next={next}
        />
      </KeyboardAwareScrollView>
    </>
  );
};
export default Step0_ChooseAccount;
