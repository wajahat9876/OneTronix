/* eslint-disable camelcase */
/* eslint-disable import/order */
import { useChangeInverterSettingMutation } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import FormikDropdownRNE from "@src/components/globals/DropdownRNE/FormikDropdownRNE";
import FormikInput from "@src/components/globals/FormikInput";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import ToggleSwitch from "@src/components/globals/ToggleSwitch";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { textInputUnderlinedProps } from "@src/constants/Props";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import {
  Button,
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

  //Battery Section
  const chargingAmpRef = useRef() as React.MutableRefObject<TextInput>;
  const floatToCutOffRef = useRef() as React.MutableRefObject<TextInput>;
  const floatingRef = useRef() as React.MutableRefObject<TextInput>;
  const fullRef = useRef() as React.MutableRefObject<TextInput>;
  const fullToFloatRef = useRef() as React.MutableRefObject<TextInput>;
  const lowRef = useRef() as React.MutableRefObject<TextInput>;
  // Heavy Load
  const OffTimeRef = useRef() as React.MutableRefObject<TextInput>;
  const OnTimeRef = useRef() as React.MutableRefObject<TextInput>;
  const offLevelRef = useRef() as React.MutableRefObject<TextInput>;
  const onLevelRef = useRef() as React.MutableRefObject<TextInput>;
  // Inverter
  const outputVoltLevelRef = useRef() as React.MutableRefObject<TextInput>;
  const overLoadRef = useRef() as React.MutableRefObject<TextInput>;
  // Solar
  const highVoltsRef = useRef() as React.MutableRefObject<TextInput>;
  const lowVoltsRef = useRef() as React.MutableRefObject<TextInput>;
  // Utility
  const overVoltsRef = useRef() as React.MutableRefObject<TextInput>;
  const underVoltsRef = useRef() as React.MutableRefObject<TextInput>;
  // Utility Control
  const cutOffTimeRef = useRef() as React.MutableRefObject<TextInput>;
  const utilityControlOffLevelRef =
    useRef() as React.MutableRefObject<TextInput>;
  const utilityControlOnLevelRef =
    useRef() as React.MutableRefObject<TextInput>;

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
                  placeholder: "Charging Amps",
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
                  placeholder: "Float to cut off",
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
                  placeholder: "Floating",
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
                  placeholder: "Full",
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
                  placeholder: "Full to float",
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
                  placeholder: "Low",
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
                ]}
                formik={formik}
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
                ]}
                formik={formik}
                dropdownType="sm"
                labelField="label"
                valueField="value"
                placeholder="Select Reason"
                name="type"
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
                name="offTime"
                ref={OffTimeRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Off Time",
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
                  placeholder: "On Time",
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
                  placeholder: "Off Level",
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
                name="onLevel"
                ref={onLevelRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "On Level",
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
                  placeholder: "Output Volt Level",
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
                  placeholder: "Over Load",
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
            <View>
              <ToggleSwitch
                label="Buzzer"
                onValueChange={setBuzzer}
                value={buzzer}
              />
            </View>
            <View style={{ marginTop: vs(20) }}>
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
                  placeholder: "High Volts",
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
                  placeholder: "Low Volts",
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
                  placeholder: "Over Volts",
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
                  placeholder: "Under Volts",
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
                name="cutOffTime"
                ref={cutOffTimeRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "Cut off time",
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
                  placeholder: "Off Level",
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
                name="utilityControlOnLevel"
                ref={utilityControlOnLevelRef}
                inputProps={{
                  ...textInputUnderlinedProps,
                  keyboardType: "number-pad",
                  placeholder: "On Level",
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    // if (streetRef?.current) {
                    //   streetRef.current.focus();
                    // }
                  },
                }}
              />
            </View>
            <View style={{ marginTop: vs(20), paddingHorizontal: hs(20) }}>
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

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={styles.container}
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
            extraScrollHeight={20}
            enableAutomaticScroll
            scrollEnabled
            resetScrollToCoords={{ x: 0, y: 0 }}
            extraHeight={Platform.OS === "ios" ? getRespValue(250) : 180}
            viewIsInsideTabBar
          >
            {/* Show selected tab data inside same screen */}
            {renderContent()}
          </KeyboardAwareScrollView>
        </View>

        <View style={{ position: "absolute", bottom: 1, alignSelf: "center" }}>
          <Button title="Save" onPress={() => formik.handleSubmit()} />
        </View>
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
    backgroundColor: "green",
  },
  tabText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
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
