/* eslint-disable camelcase */
/* eslint-disable import/order */
import { useChangeInverterSettingMutation } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import ConfirmIcon from "@assets/icons/confirmModel.svg";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import Button from "@src/components/globals/Button";
import FormikDropdownRNE from "@src/components/globals/DropdownRNE/FormikDropdownRNE";
import FormikInput from "@src/components/globals/FormikInput";
import PortalBottomSheet from "@src/components/globals/PortalBottomSheet";
import { PortalBottomSheetRef } from "@src/components/globals/PortalBottomSheet/types";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import ToggleSwitch from "@src/components/globals/ToggleSwitch";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { textInputUnderlinedProps } from "@src/constants/Props";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated from "react-native-reanimated";
import * as Yup from "yup";
const TABS = [
  { key: "Inverter", label: "Inverter" },
  { key: "Misc", label: "Misc" },
  { key: "Solar", label: "Solar" },
  { key: "Utility", label: "Utility" },
];

const Step2_SettingOnGrid = ({ back, goTo }: MultiStepFormProps) => {
  const [selectedTab, setSelectedTab] = useState("Inverter");
  const { lastSelectedDeviceData, lastSelectedDeviceId } =
    useAppSelector(useBusinessDetails);
  console.log(lastSelectedDeviceData, "On Grid");

  const [changeSetting, { isLoading }] = useChangeInverterSettingMutation();
  // Misc
  const [buzzer, setBuzzer] = useState(lastSelectedDeviceData?.misc?.buzzer);
  const [lcdBacklight, setlcdBacklight] = useState(
    lastSelectedDeviceData?.misc?.lcdBacklight
  );
  const [softStart, setSoftStart] = useState(
    lastSelectedDeviceData?.misc?.softStart
  );

  // Inverter
  const outputVoltLevelRef = useRef<TextInput>(null);
  const nominalFreqRef = useRef<TextInput>(null);
  const powerFactorRef = useRef<TextInput>(null);

  // Solar
  const highVoltsRef = useRef<TextInput>(null);
  const lowVoltsRef = useRef<TextInput>(null);
  const mpptTrackSpeedRef = useRef<TextInput>(null);

  // Utility
  const overVoltsRef = useRef<TextInput>(null);
  const underVoltsRef = useRef<TextInput>(null);
  const maxExportPowerRef = useRef<TextInput>(null);
  const overFreqRef = useRef<TextInput>(null);
  const underFreqRef = useRef<TextInput>(null);
  const [antiIslanding, setAntiIsland] = useState(
    lastSelectedDeviceData?.utility?.antiIslanding
  );
  const [exportEnabled, setExportEnabled] = useState(
    lastSelectedDeviceData?.utility?.exportEnabled
  );
  const [phaseSync, setPhaseSync] = useState(
    lastSelectedDeviceData?.utility?.phaseSync
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // Inverter
      outputVoltLevel: String(
        lastSelectedDeviceData?.inverter?.outputVoltLevel ?? ""
      ),
      nominalFreq: String(lastSelectedDeviceData?.inverter?.nominalFreq ?? ""),
      powerFactor: String(lastSelectedDeviceData?.inverter?.powerFactor ?? ""),
      syncMode: String(lastSelectedDeviceData?.inverter?.syncMode ?? ""),

      // Solar
      highVolts: String(lastSelectedDeviceData?.solar?.highVolts ?? ""),
      lowVolts: String(lastSelectedDeviceData?.solar?.lowVolts ?? ""),
      mpptTrackSpeed: String(
        lastSelectedDeviceData?.solar?.mpptTrackSpeed ?? ""
      ),

      // Utility
      overVolts: String(lastSelectedDeviceData?.utility?.overVolts ?? ""),
      underVolts: String(lastSelectedDeviceData?.utility?.underVolts ?? ""),
      maxExportPower: String(
        lastSelectedDeviceData?.utility?.maxExportPower ?? ""
      ),
      overFreq: String(lastSelectedDeviceData?.utility?.overFreq ?? ""),
      underFreq: String(lastSelectedDeviceData?.utility?.underFreq ?? ""),
    },
    validationSchema: Yup.object({
      //Battery Section
      // chargingAmp: Yup.string().required("Required"),
      // floatToCutOff: Yup.string().required("Required"),
      // floating: Yup.string().required("Required"),
      // full: Yup.string().required("Required"),
      // fullToFloat: Yup.string().required("Required"),
      // low: Yup.string().required("Required"),
      // typeOfBattery: Yup.string().required("Required"),
      // // Charging Source
      // type: Yup.string().required("Required"),
      // // Heavy Load
      // offTime: Yup.string().required("Required"),
      // onTime: Yup.string().required("Required"),
      // offLevel: Yup.string().required("Required"),
      // onLevel: Yup.string().required("Required"),
      // // Inverter
      // outputVoltLevel: Yup.string().required("Required"),
      // overLoad: Yup.string().required("Required"),
      // // Solar
      // highVolts: Yup.string().required("Required"),
      // lowVolts: Yup.string().required("Required"),
      // // Utility
      // overVolts: Yup.string().required("Required"),
      // underVolts: Yup.string().required("Required"),
      // // Utility Control
      // cutOffTime: Yup.string().required("Required"),
      // utilityControlOffLevel: Yup.string().required("Required"),
      // utilityControlOnLevel: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("values", values);
      const numericValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
          if (["syncMode"].includes(key)) {
            return [key, value]; // keep as string
          }
          return [key, Number(value)];
        })
      );

      const payload = {
        deviceId: lastSelectedDeviceId,
        settings: {
          utility: {
            underVolts: numericValues.underVolts,
            overVolts: numericValues.overVolts,
            maxExportPower: numericValues.maxExportPower,
            overFreq: numericValues.overFreq,
            underFreq: numericValues.underFreq,
            phaseSync,
            antiIslanding,
            exportEnabled,
          },

          solar: {
            highVolts: numericValues.highVolts,
            lowVolts: numericValues.lowVolts,
            mpptTrackSpeed: numericValues.mpptTrackSpeed,
          },

          inverter: {
            outputVoltLevel: numericValues.outputVoltLevel,
            nominalFreq: numericValues.nominalFreq,
            powerFactor: numericValues.powerFactor,
            syncMode: numericValues.syncMode,
          },
          misc: {
            buzzer,
            lcdBacklight,
            softStart,
          },
        },
      };

      console.log("Final Payload:", payload);

      try {
        const res = await changeSetting(payload).unwrap();
        renderToastSuccess(res.message);
      } catch (error: any) {
        renderToastError(error?.data?.message || "Something went wrong");
      }
    },
  });

  const renderContent = () => {
    switch (selectedTab) {
      case "Inverter":
        return (
          <View style={styles.mainView}>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="outputVoltLevel"
                ref={outputVoltLevelRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Output Volt Level (V)",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    if (nominalFreqRef?.current) {
                      nominalFreqRef.current.focus();
                    }
                  },
                }}
              />
            </View>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="nominalFreq"
                ref={nominalFreqRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Nominal Freq (Hz)",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    if (powerFactorRef?.current) {
                      powerFactorRef.current.focus();
                    }
                  },
                }}
              />
            </View>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="powerFactor"
                ref={powerFactorRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Power Factor",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
            <View style={styles.txt}>
              <FormikDropdownRNE
                data={[
                  {
                    label: "PLL",
                    value: "PLL",
                  },
                ]}
                formik={formik}
                selectedTextStyle={{ color: "black" }}
                placeholderStyle={{ color: "black" }}
                itemTextStyle={{ color: "black" }}
                dropdownType="sm"
                labelField="label"
                valueField="value"
                placeholder="Select"
                name="syncMode"
                value={formik?.values?.syncMode}
                dropdownPosition="bottom"
                maxHeight={220}
                style={{ padding: 15 }}
              />
            </View>
          </View>
        );
      case "Misc":
        return (
          <View style={{ padding: 20, marginTop: vs(10) }}>
            <View
              style={{
                borderBottomColor:
                  Colors.light.theme.textInputBottomBorderColor,
                borderBottomWidth: 1.5,
                paddingBottom: vs(10),
              }}
            >
              <ToggleSwitch
                label="Buzzer"
                onValueChange={setBuzzer}
                value={buzzer}
              />
            </View>
            <View
              style={{
                marginTop: vs(20),
                borderBottomColor:
                  Colors.light.theme.textInputBottomBorderColor,
                borderBottomWidth: 1.5,
                paddingBottom: vs(10),
              }}
            >
              <ToggleSwitch
                label="Lcd Back light"
                onValueChange={setlcdBacklight}
                value={lcdBacklight}
              />
            </View>
            <View
              style={{
                marginTop: vs(20),
                borderBottomColor:
                  Colors.light.theme.textInputBottomBorderColor,
                borderBottomWidth: 1.5,
                paddingBottom: vs(10),
              }}
            >
              <ToggleSwitch
                label="Soft Start"
                onValueChange={setSoftStart}
                value={softStart}
              />
            </View>
          </View>
        );
      case "Solar":
        return (
          <View style={styles.mainView}>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="highVolts"
                ref={highVoltsRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "High Volts (V)",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="lowVolts"
                ref={lowVoltsRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Low Volts (V)",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="mpptTrackSpeed"
                ref={mpptTrackSpeedRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Mppt Track Speed",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
          </View>
        );
      case "Utility":
        return (
          <View style={styles.mainView}>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="overVolts"
                ref={overVoltsRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Over Volts (V)",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="underVolts"
                ref={underVoltsRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Under Volts (V)",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="maxExportPower"
                ref={maxExportPowerRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Max Export Power (W)",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="overFreq"
                ref={overFreqRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Over Freq (Hz)",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="underFreq"
                ref={underFreqRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Under Freq (Hz)",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
            <View
              style={[
                styles.txt,
                {
                  borderBottomColor:
                    Colors.light.theme.textInputBottomBorderColor,
                  borderBottomWidth: 1.5,
                  paddingBottom: vs(10),
                },
              ]}
            >
              <ToggleSwitch
                label="Anti Islanding"
                onValueChange={setAntiIsland}
                value={antiIslanding}
              />
            </View>
            <View
              style={[
                styles.txt,
                {
                  borderBottomColor:
                    Colors.light.theme.textInputBottomBorderColor,
                  borderBottomWidth: 1.5,
                  paddingBottom: vs(10),
                },
              ]}
            >
              <ToggleSwitch
                label="Export Enabled"
                onValueChange={setExportEnabled}
                value={exportEnabled}
              />
            </View>
            <View
              style={[
                styles.txt,
                {
                  borderBottomColor:
                    Colors.light.theme.textInputBottomBorderColor,
                  borderBottomWidth: 1.5,
                  paddingBottom: vs(10),
                },
              ]}
            >
              <ToggleSwitch
                label="Phase Sync"
                onValueChange={setPhaseSync}
                value={phaseSync}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const openSheet = () => {
    bottomSheetRef.current?.open();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScreenAuth
        title="Inverter Setting"
        style={styles.screenAuthStyle}
        topColor={Colors.light.theme.backgroundTopCurveSection}
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus
        appBarProps={{
          light: true,
          rightIcon: true,
        }}
        back={() => goTo?.(0)}
      >
        {/* Everything inside same screen layout */}
        <View style={styles.innerContainer}>
          {/* Horizontal Scroll Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {TABS.map((tab) => {
              const isActive = selectedTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabButton, isActive && styles.activeTabButton]}
                  onPress={() => setSelectedTab(tab.key)}
                >
                  <Text
                    style={[styles.tabText, isActive && styles.activeTabText]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? getRespValue(10) : 20,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            enableOnAndroid
            scrollEnabled
            resetScrollToCoords={{ x: 0, y: 0 }}
            viewIsInsideTabBar
            extraHeight={0}
            extraScrollHeight={5}
            enableAutomaticScroll={false}
          >
            {renderContent()}
          </KeyboardAwareScrollView>
        </View>

        <View
          style={{
            width: "80%",
            position: "absolute",
            bottom: vs(10),
            alignSelf: "center",
          }}
        >
          <Button
            btnTitle="Submit"
            btnColor="#f41a2c"
            loading={isLoading}
            disabled={isLoading}
            btnTitleColor="white"
            onClick={() => openSheet()}
          />
        </View>
        <PortalBottomSheet
          ref={bottomSheetRef}
          snapPoints={Platform.OS === "ios" ? ["52%"] : ["48%"]}
          handleComponent={undefined}
          backgroundStyle={{ backgroundColor: "#e8eaec" }}
          handleIndicatorStyle={{
            backgroundColor: "#c2c3c4",
          }}
          enableContentPanningGesture
          enableHandlePanningGesture
          TouchComponent={() => <></>}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              onPress={closeSheet}
            />
          )}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                alignItems: "center",
                marginTop: vs(15),
                marginBottom: vs(10),
              }}
            >
              <ConfirmIcon />
            </View>
            <Text style={styles.modalText}>
              Changes will be reflected after 5-10 minutes.
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                btnTitleColor="black"
                btnTitle="Cancel"
                onClick={closeSheet}
                btnColor="#c9cacc"
              />
              <Button
                btnTitle="Proceed"
                loading={false}
                onClick={() => {
                  formik.handleSubmit();
                  closeSheet();
                }}
                btnColor="#f41a2c"
                btnTitleColor="white"
              />
            </View>
          </View>
        </PortalBottomSheet>
      </ScreenAuth>
    </Animated.View>
  );
};

export default Step2_SettingOnGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  modalText: {
    width: "75%",
    fontSize: ms(24),
    textAlign: "center",
    marginBottom: Platform.OS === "ios" ? vs(20) : vs(40), // 20,
    fontFamily: "Excon-Medium",
    color: "#030302cc",
    alignSelf: "center",
  },
  buttonContainer: {
    alignSelf: "center",
    width: "80%",

    gap: vs(20),
  },
  mainView: {
    marginTop: vs(10),
  },
  txt: {
    marginLeft: hs(10),
    marginRight: hs(10),
    marginTop: vs(10),
  },
  screenAuthStyle: {
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  tabsContainer: {
    paddingVertical: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: hs(24),
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    marginRight: 10,
  },
  activeTabButton: {
    backgroundColor: "black",
  },
  tabText: {
    color: "#333",
    fontSize: 14,
    fontFamily: "Excon-Regular",
  },
  activeTabText: {
    color: "white",
  },
  tabContentText: {
    fontSize: 16,
    color: "#444",
    marginTop: 20,
  },
});
