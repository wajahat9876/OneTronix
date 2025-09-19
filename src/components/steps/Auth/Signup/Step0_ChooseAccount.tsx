/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { setRole } from "@/store/slices/business/businessSlice";
import Logo from "@assets/eccLogo/oneTronixLogo.svg";
import BottomSheet from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import Button from "@src/components/globals/Button";
import Step2ScanQr from "@src/components/steps/Qr";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm/types";
import { useAppDispatch } from "@src/hooks/useReduxHooks";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const Step0_ChooseAccount = ({ next, goTo }: MultiStepFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isActive, setActive] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  // refs
  const passwordRef = useRef() as React.MutableRefObject<TextInput>;
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

  console.log("selectedLanguage", selectedValue);
  const handlePress = () => {
    if (selectedValue === "user") {
      openBottomSheet();
    } else {
      console.log("Trigger");
      dispatch(setRole(true));
      goTo?.(1);
    }
  };
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
            alignSelf: "flex-end",
            padding: hs(26),
            marginTop: Platform.OS === "ios" ? vs(5) : vs(15),
          }}
        >
          <Logo />
        </View>
        <View
          style={{
            // alignItems: "flex-start",
            marginLeft: 12,
            marginTop: vs(32),
          }}
        >
          <Text
            style={{
              color: "red",
              fontWeight: "900",
              fontSize: ms(44),
              fontFamily: "Excon-Black",
              lineHeight: 45,
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
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="User" value="user" color="white" />
          <Picker.Item label="Installer" value="installer" color="white" />
        </Picker>
        <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
          {/* Button and Scan in a Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View style={{ width: "80%" }}>
              <Button
                disabled={!selectedValue}
                btnTitle="Continue"
                btnColor="#F4192C"
                btnTitleColor="white"
                onClick={() => {
                  handlePress();
                }}
              />
            </View>
          </View>
          <View style={{ width: "80%", marginTop: 10 }}>
            <Button
              btnTitle="Back"
              btnColor="#F4192C"
              btnTitleColor="white"
              onClick={() => {
                router.replace("/(auth)/Signin");
              }}
            />
          </View>
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
