/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
// import { IPhoneInputProps } from '@stable/PhoneInput';
import DatePicker from "@src/components/globals/DatePicker";
import moment from "moment";
import React, { useMemo } from "react";
import { TextInput } from "react-native";
import { MyFormikProps } from "./types";

const FormikDatePicker = React.forwardRef<TextInput, MyFormikProps>((props) => {
  const {
    formik,
    name,
    value,
    inputProps,
    datePickerProps,
    onDateConfirm,
    showIcon,
  } = props;

  return useMemo(() => {
    return (
      <DatePicker
        inputProps={inputProps}
        showIcon={showIcon}
        datePickerProps={datePickerProps}
        errorText={formik.touched[name] && formik.errors[name]}
        value={value || formik.values[name]}
        onDateConfirm={(e) => {
          if (e) {
            formik.handleChange({
              target: {
                name,
                value: moment(e).format("YYYY-MM-DD")?.replace(/\//g, "-"),
              },
            });
          }
          if (onDateConfirm) {
            onDateConfirm(e);
          }
        }}
      />
    );
  }, [formik.values[name], formik.errors[name], formik.touched[name], value]);
});

// FormikDatePicker.defaultProps = {
//   value: '',
//   inputProps: {},
//   datePickerProps: {},
// };

export default FormikDatePicker;
