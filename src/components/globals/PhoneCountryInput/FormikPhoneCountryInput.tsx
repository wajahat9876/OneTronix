import React, { useCallback } from 'react';
import { TextInput } from 'react-native';
import PhoneInputWithCountryPicker from '.';

const FormikPhoneInputWithCountryPicker = React.forwardRef<TextInput, any>(
  ({ formik, name, inputProps, selectedTextStyle, inputStyle }, ref) => {
    const handlePhoneChange = useCallback(
      (fullPhoneNumber: any) => {
        formik.setFieldValue(name, fullPhoneNumber); // Set phone with calling code in Formik
      },
      [formik, name],
    );
    return (
      <PhoneInputWithCountryPicker
        ref={ref}
        selectedTextStyle={selectedTextStyle}
        inputStyle={inputStyle}
        value={formik.values[name] || ''} // Ensure we use Formik's value, default to empty string
        onChangePhoneNumber={handlePhoneChange}
        errorText={formik.touched[name] && formik.errors[name]}
        {...inputProps}
      />
    );
  },
);

export default FormikPhoneInputWithCountryPicker;
