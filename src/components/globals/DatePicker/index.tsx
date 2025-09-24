/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import { Feather } from "@expo/vector-icons";
import Input from "@src/components/globals/Input";
import { TouchableOpacity } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { hs } from "@utils/design/design";
import moment from "moment";
import { AnimatePresence, MotiView } from "moti";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Portal } from "react-native-paper";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import { DatePickerProps } from "./types";

const DatePicker = (props: DatePickerProps) => {
  const { onDateConfirm, errorText, value, datePickerProps, inputProps } =
    props;

  // Date Picker
  const [date, setDate] = useState<DateType>(datePickerProps.date);
  const [open, setOpen] = useState(false);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback((params: any) => {
    setDate(String(params.date));
    onDateConfirm(String(params.date));
    setTimeout(() => {
      setOpen(false);
    }, 300);
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setOpen(true);
          Keyboard.dismiss();
        }}
        style={{ marginLeft: hs(32), marginRight: hs(16) }}
      >
        <View style={{ position: "relative", width: "100%" }}>
          <Input
            {...inputProps}
            errorText={errorText}
            editable={false}
            value={value && moment(value).format("DD/MM/YYYY")}
          />
          <Feather
            name="calendar"
            size={24}
            color={Colors.light.theme.placeholderColor}
            style={{ position: "absolute", right: 0, top: 0, left: 100 }}
          />
        </View>
      </TouchableOpacity>
      <Portal>
        <AnimatePresence>
          {open && (
            <MotiView
              key="date-picker"
              from={{
                translateX: 0,
                translateY: 350,
                transform: [{ scaleX: 0 }, { scaleY: 0 }],
                borderRadius: 250,
              }}
              animate={{
                translateX: 0,
                translateY: 0,
                transform: [{ scaleX: 1 }, { scaleY: 1 }],
                borderRadius: 0,
              }}
              exit={{
                translateX: 0,
                translateY: 350,
                transform: [{ scaleX: 0 }, { scaleY: 0 }],
                borderRadius: 250,
              }}
              // transition={{
              //   type: 'timing',
              //   duration: 450,
              // }}
              // exitTransition={{
              //   type: 'timing',
              //   duration: 450,
              // }}
              style={{
                flex: 1,
                zIndex: 9999,
                pointerEvents: "box-none",
                overflow: "hidden",
                backgroundColor: "transparent",
              }}
            >
              <Pressable
                style={styles.container}
                onPress={() => {
                  setOpen(false);
                }}
              >
                <TouchableWithoutFeedback
                  style={styles.subContainer}
                  onPress={() => {}}
                >
                  <View style={styles.datePicker}>
                    <DateTimePicker
                      {...datePickerProps}
                      date={date}
                      locale="en"
                      mode="single"
                      displayFullDays
                      minDate={
                        datePickerProps?.minDate || "1800-01-01T19:00:00.000Z"
                      }
                      onChange={(params) => onConfirmSingle(params)}
                      todayTextStyle={{
                        fontWeight: "bold",
                      }}
                      headerButtonColor="#000F6D"
                      selectedItemColor="#000F6D"
                      todayContainerStyle={{
                        borderWidth: 1,
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

// DatePicker.defaultProps = {
//   value: undefined,
//   errorText: undefined,
//   inputProps: {},
//   datePickerProps: {},
// };
export default DatePicker;
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    zIndex: -9999,
    alignItems: "center",
    justifyContent: "center",
  },
  subContainer: {
    backgroundColor: "transparent",
    pointerEvents: "none",
    zIndex: 9999,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  datePicker: {
    alignSelf: "center",
    width: 330,
    backgroundColor: "#F8F8FF",
    padding: 15,
    borderRadius: 15,
    elevation: 20,
    shadowRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
  },
});
