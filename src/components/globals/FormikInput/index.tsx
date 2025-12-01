/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import Input from "@src/components/globals/Input";
import React, { useMemo } from "react";
import { TextInput } from "react-native";
import { MyFormikProps } from "./types";

const FormikInput = React.forwardRef<TextInput, MyFormikProps>((props, ref) => {
  const { formik, name, value, inputProps, fontFamily } = props;
  const finalFontFamily = fontFamily || inputProps?.fontFamily;
  return useMemo(() => {
    return (
      <Input
        {...inputProps}
        fontFamily={finalFontFamily}
        key={name}
        ref={ref}
        errorText={formik.touched[name] && formik.errors[name]}
        value={value || formik.values[name]}
        onChangeText={(e) =>
          formik.handleChange({ target: { name, value: e?.trimStart() } })
        }
      />
    );
  }, [formik, inputProps, name, ref, value]);
});

export default FormikInput;

// FormikInput.defaultProps = {
//   value: '',
//   inputProps: {},
// };
