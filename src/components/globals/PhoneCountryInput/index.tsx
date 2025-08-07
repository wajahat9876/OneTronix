/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';

interface PhoneInput {
  value: string;
  onChangePhoneNumber: (phoneNumber: string) => void;
  errorText?: string;
  selectedTextStyle?: any;
  inputStyle?: any;
  placeholder?: string;
}
const PhoneInputWithCountryPicker = (props: PhoneInput) => {
  const {
    value,
    onChangePhoneNumber,
    errorText,
    selectedTextStyle,
    inputStyle,
    placeholder,
  } = props;
  const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>('GB'); // Default country code
  const [callingCode, setCallingCode] = useState('44'); // Default calling code for UK

  const onSelect = (country: Country) => {
    const newCallingCode = country.callingCode[0];
    setCountryCode(country.cca2 as CountryCode);
    setCallingCode(newCallingCode);

    // Update Formik with the new calling code and the current phone number
    onChangePhoneNumber(`+${newCallingCode}${''}`);
    setCountryPickerVisible(false);
  };

  const handlePhoneNumberChange = (text: any) => {
    // Combine the updated calling code with the entered phone number
    onChangePhoneNumber(`+${callingCode}${text}`);
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 2,
          paddingTop: 5,
          ...selectedTextStyle,
        }}
      >
        <TouchableOpacity
          style={styles.countryPickerButton}
          onPress={() => setCountryPickerVisible(true)}
        >
          <CountryPicker
            withFlag
            withCallingCode
            withFilter
            withEmoji
            visible={isCountryPickerVisible}
            onSelect={onSelect}
            onClose={() => setCountryPickerVisible(false)}
            countryCode={countryCode}
            theme={{
              fontSize: 14,
              onBackgroundTextColor: 'gray',
            }}
            modalProps={{
              presentationStyle: 'formSheet',
            }}
          />
          <Text style={styles.callingCodeText}>+{callingCode}</Text>
        </TouchableOpacity>
        <TextInput
          style={{ flex: 1, fontSize: 16, ...inputStyle }}
          placeholder={placeholder || 'Enter phone number'}
          keyboardType="phone-pad"
          value={value.replace(`+${callingCode}`, '')} // Display phone number without calling code
          onChangeText={handlePhoneNumberChange}
        />
      </View>
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingBottom: 8,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  callingCodeText: {
    fontSize: 16,
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default PhoneInputWithCountryPicker;
