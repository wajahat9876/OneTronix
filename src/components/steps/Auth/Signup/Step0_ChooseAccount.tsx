/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { setRole } from "@/store/slices/business/businessSlice";
import BottomSheet from "@gorhom/bottom-sheet";
// import { Picker } from "@react-native-picker/picker";
import Logoicon from "@assets/eccLogo/one-tronix-logo.png";
import Step2ScanQr from "@src/components/steps/Qr";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm/types";
import { useAppDispatch } from "@src/hooks/useReduxHooks";
import { hs, ms, vs } from "@utils/design/design";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import Picker from "react-native-animated-wheel-picker";
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
      <View
        style={{
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
      </View>
      <Image
        source={Logoicon}
        style={{
          position: "absolute",
          width: 200,
          height: 230,
          alignSelf: "flex-end",
        }}
      />
      <View
        style={{
          marginLeft: hs(15),
          marginTop: vs(80),
        }}
      >
        <Text
          style={{
            color: "red",
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
            marginTop: -3, // small gap from TRONIX
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
              fontFamily: "Ranade-Regular",
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
    </>
  );
};
export default Step0_ChooseAccount;
