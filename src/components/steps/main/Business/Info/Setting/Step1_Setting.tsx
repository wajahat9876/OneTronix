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
  { key: "Battery", label: "Battery" },
  { key: "Charging Source", label: "Charging Source" },
  { key: "Heavy Load", label: "Heavy Load" },
  { key: "Inverter", label: "Inverter" },
  { key: "Misc", label: "Misc" },
  { key: "Solar", label: "Solar" },
  { key: "Utility", label: "Utility" },
  { key: "Utility Control", label: "Utility Control" },
];

const Step1_Setting = ({ back }: MultiStepFormProps) => {
  const [selectedTab, setSelectedTab] = useState("Battery");
  const { lastSelectedDeviceData, lastSelectedDeviceId } =
    useAppSelector(useBusinessDetails);
  console.log(lastSelectedDeviceData, "Hybrid");

  const [changeSetting, { isLoading }] = useChangeInverterSettingMutation();
  // Misc
  const [buzzer, setBuzzer] = useState(lastSelectedDeviceData?.misc?.buzzer);
  const [lcdBacklight, setlcdBacklight] = useState(
    lastSelectedDeviceData?.misc?.lcdBacklight
  );
  //Utility Control
  const [enable, setEnable] = useState(
    lastSelectedDeviceData?.utilityControl?.enabled
  );
  const chargingAmpRef = useRef<TextInput>(null);
  const floatToCutOffRef = useRef<TextInput>(null);
  const floatingRef = useRef<TextInput>(null);
  const fullRef = useRef<TextInput>(null);
  const fullToFloatRef = useRef<TextInput>(null);
  const lowRef = useRef<TextInput>(null);

  // Heavy Load
  const OffTimeRef = useRef<TextInput>(null);
  const OnTimeRef = useRef<TextInput>(null);
  const offLevelRef = useRef<TextInput>(null);
  const onLevelRef = useRef<TextInput>(null);

  // Inverter
  const outputVoltLevelRef = useRef<TextInput>(null);
  const overLoadRef = useRef<TextInput>(null);

  // Solar
  const highVoltsRef = useRef<TextInput>(null);
  const lowVoltsRef = useRef<TextInput>(null);

  // Utility
  const overVoltsRef = useRef<TextInput>(null);
  const underVoltsRef = useRef<TextInput>(null);

  // Utility Control
  const cutOffTimeRef = useRef<TextInput>(null);
  const utilityControlOffLevelRef = useRef<TextInput>(null);
  const utilityControlOnLevelRef = useRef<TextInput>(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // Battery Section
      chargingAmp: String(lastSelectedDeviceData?.battery?.chargingAmp ?? ""),
      floatToCutOff: String(
        lastSelectedDeviceData?.battery?.floatToCutOff ?? ""
      ),
      floating: String(lastSelectedDeviceData?.battery?.floating ?? ""),
      full: String(lastSelectedDeviceData?.battery?.full ?? ""),
      fullToFloat: String(lastSelectedDeviceData?.battery?.fullToFloat ?? ""),
      low: String(lastSelectedDeviceData?.battery?.low ?? ""),
      typeOfBattery: String(
        lastSelectedDeviceData?.battery?.typeOfBattery ?? ""
      ),

      // Charging Source
      type: String(lastSelectedDeviceData?.chargingSource?.type ?? ""),

      // Heavy Load
      offTime: String(lastSelectedDeviceData?.heavyLoad?.offTime ?? ""),
      onTime: String(lastSelectedDeviceData?.heavyLoad?.onTime ?? ""),
      offLevel: String(lastSelectedDeviceData?.heavyLoad?.offLevel ?? ""),
      onLevel: String(lastSelectedDeviceData?.heavyLoad?.onLevel ?? ""),

      // Inverter
      outputVoltLevel: String(
        lastSelectedDeviceData?.inverter?.outputVoltLevel ?? ""
      ),
      overLoad: String(lastSelectedDeviceData?.inverter?.overLoad ?? ""),

      // Solar
      highVolts: String(lastSelectedDeviceData?.solar?.highVolts ?? ""),
      lowVolts: String(lastSelectedDeviceData?.solar?.lowVolts ?? ""),

      // Utility
      overVolts: String(lastSelectedDeviceData?.utility?.overVolts ?? ""),
      underVolts: String(lastSelectedDeviceData?.utility?.underVolts ?? ""),

      // Utility Control
      cutOffTime: String(
        lastSelectedDeviceData?.utilityControl?.cutOffTime ?? ""
      ),
      utilityControlOffLevel: String(
        lastSelectedDeviceData?.utilityControl?.offLevel ?? ""
      ),
      utilityControlOnLevel: String(
        lastSelectedDeviceData?.utilityControl?.onLevel ?? ""
      ),
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
          if (["typeOfBattery", "type"].includes(key)) {
            return [key, value]; // keep as string
          }
          return [key, Number(value)];
        })
      );

      const payload = {
        deviceId: lastSelectedDeviceId,
        settings: {
          battery: {
            low: numericValues.low,
            full: numericValues.full,
            floating: numericValues.floating,
            chargingAmp: numericValues.chargingAmp,
            typeOfBattery: numericValues.typeOfBattery,
            fullToFloat: numericValues.fullToFloat,
            floatToCutOff: numericValues.floatToCutOff,
          },
          utility: {
            underVolts: numericValues.underVolts,
            overVolts: numericValues.overVolts,
          },
          utilityControl: {
            enabled: enable, // from your state
            onLevel: numericValues.onLevel,
            offLevel: numericValues.offLevel,
            cutOffTime: numericValues.cutOffTime,
          },
          chargingSource: {
            type: numericValues.type,
          },
          solar: {
            highVolts: numericValues.highVolts,
            lowVolts: numericValues.lowVolts,
          },
          heavyLoad: {
            onLevel: numericValues.onLevel,
            offLevel: numericValues.offLevel,
            onTime: numericValues.onTime,
            offTime: numericValues.offTime,
          },
          inverter: {
            outputVoltLevel: numericValues.outputVoltLevel,
            overLoad: numericValues.overLoad,
          },
          misc: {
            buzzer,
            lcdBacklight,
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
      case "Battery":
        return (
          <View style={styles.mainView}>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="chargingAmp"
                ref={chargingAmpRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Charging Amps (A)",
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
                name="floatToCutOff"
                ref={floatToCutOffRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Float to cut off (h)",
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
                name="floating"
                ref={floatingRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Floating (V)",
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
                name="full"
                ref={fullRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Full (V)",
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
                name="fullToFloat"
                ref={fullToFloatRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Full to float (h)",
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
                name="low"
                ref={lowRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Low (V)",
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
                    label: "Led Acid",
                    value: "Led Acid",
                  },
                  {
                    label: "Dry",
                    value: "Dry",
                  },
                  {
                    label: "Tubular",
                    value: "Tubular",
                  },
                  {
                    label: "Li Ion",
                    value: "Li Ion",
                  },
                ]}
                formik={formik}
                selectedTextStyle={{
                  color: "black",
                  fontFamily: "Ranade-Regular",
                }}
                placeholderStyle={{
                  color: "black",
                  fontFamily: "Ranade-Regular",
                }}
                itemTextStyle={{ color: "black", fontFamily: "Ranade-Regular" }}
                dropdownType="sm"
                labelField="label"
                valueField="value"
                placeholder="Select Reason"
                name="typeOfBattery"
                value={formik?.values?.typeOfBattery}
                dropdownPosition="bottom"
                maxHeight={220}
                style={{ padding: 15 }}
              />
            </View>
          </View>
        );
      case "Charging Source":
        return (
          <View style={styles.mainView}>
            <View style={styles.txt}>
              <FormikDropdownRNE
                data={[
                  {
                    label: "Utility + Solar",
                    value: "Utility + Solar",
                  },
                  {
                    label: "Solar",
                    value: "Solar",
                  },
                  {
                    label: "Utility",
                    value: "Utility",
                  },
                ]}
                formik={formik}
                dropdownType="sm"
                labelField="label"
                valueField="value"
                placeholder="Select Reason"
                name="type"
                selectedTextStyle={{
                  color: "black",
                  fontFamily: "Ranade-Regular",
                }}
                placeholderStyle={{
                  color: "black",
                  fontFamily: "Ranade-Regular",
                }}
                itemTextStyle={{ color: "black", fontFamily: "Ranade-Regular" }}
                value={formik?.values?.type}
                dropdownPosition="bottom"
                maxHeight={220}
                style={{ padding: 15 }}
              />
            </View>
          </View>
        );
      case "Heavy Load":
        return (
          <View style={styles.mainView}>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="onLevel"
                ref={onLevelRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "On Level (V)",
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
                name="offLevel"
                ref={offLevelRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Off Level (V)",
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
                name="offTime"
                ref={OffTimeRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Off Time (s)",
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
                name="onTime"
                ref={OnTimeRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "On Time (s)",
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
                name="overLoad"
                ref={overLoadRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Over Load (A)",
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
          </View>
        );
      case "Utility Control":
        return (
          <View style={styles.mainView}>
            <View style={styles.txt}>
              <FormikInput
                formik={formik}
                name="utilityControlOnLevel"
                ref={utilityControlOnLevelRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "On Level (V)",
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
                name="utilityControlOffLevel"
                ref={utilityControlOffLevelRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Off Level (V)",
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
                name="cutOffTime"
                ref={cutOffTimeRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Cut off time (min)",
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
              style={{
                marginLeft: hs(10),
                marginRight: hs(10),
                marginTop: vs(20),
                borderBottomColor:
                  Colors.light.theme.textInputBottomBorderColor,
                borderBottomWidth: 1.5,
                paddingBottom: vs(10),
              }}
            >
              <ToggleSwitch
                label="Enable"
                onValueChange={setEnable}
                value={enable}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
        back={() => back?.()}
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

export default Step1_Setting;

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
    paddingHorizontal: 18,
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
