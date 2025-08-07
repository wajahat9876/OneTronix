/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import PhoneInput from '@src/components/globals/PhoneInput';
import React, { useCallback } from 'react';
import { TextInput } from 'react-native';
import { MyFormikProps } from './types';

const FormikPhoneInput = React.forwardRef<TextInput, MyFormikProps>(
  (props, ref) => {
    const { formik, name, value, inputProps } = props;
    // This is temporary for now, we need to find a better way to set the default value

    const handlePhoneChange = useCallback((e: string) => {
      formik.handleChange({
        target: {
          name,
          value: e,
        },
      });
    }, []);

    return (
      <PhoneInput
        {...inputProps}
        key={name}
        ref={ref}
        errorText={formik.touched[name] && formik.errors[name]}
        value={value || formik.values[name]}
        onChangePhoneNumber={handlePhoneChange}
      />
    );
  },
);

export default FormikPhoneInput;
// FormikPhoneInput.defaultProps = {
//   value: '',
//   inputProps: {},
// };
