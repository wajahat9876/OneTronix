/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/require-default-props */
import ArrowDownIcon from '@assets/icons/ArrowDownGray.svg';
import Colors from '@src/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

interface CountryPickerProps {
  onOpen?: () => void;
  onClose?: () => void;
  onPress?: () => void;
  visible?: any;
  onSelect: any;
  countryCodes?: any;
  theme?: any;
  countryCode?: any;
  filterProps?: any;
}

const CountryPickerSimple = ({
  visible,
  onClose,
  onSelect,

  countryCode,
  countryCodes,
  onOpen,
  onPress,
  filterProps,
  theme,
}: CountryPickerProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.pickerContainer}>
        <CountryPicker
          withFlag
          onOpen={onOpen}
          onClose={onClose}
          withFilter
          withEmoji
          onSelect={onSelect}
          withFlagButton
          containerButtonStyle={{}}
          visible={visible}
          withCountryNameButton
          theme={theme}
          countryCode={countryCode}
          countryCodes={countryCodes}
          filterProps={filterProps}
        />
      </View>
      <ArrowDownIcon style={styles.arrowIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    borderBottomWidth: 1.5,
    width: '100%',
    borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
    // paddingVertical: getRespValue(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
    marginRight: 5,
  },
  arrowIcon: {
    marginTop: 10,
    marginRight: 5,
    marginBottom: 5,
  },
});

export default CountryPickerSimple;
