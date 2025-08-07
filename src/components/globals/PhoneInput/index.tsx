/* eslint-disable @typescript-eslint/no-unused-vars */
import ImgFlagUK from '@assets/images/signup/user/img-uk-flag.png';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { MyTextInputProps } from './types';

const PhoneInput = React.forwardRef<TextInput, MyTextInputProps>(
  (props, ref) => {
    const {
      className,
      style,
      value,
      errorText,
      backgroundColor,
      borderTopColor,
      borderBottomColor,
      borderBottomHeight,
      cursorColor,
      selectionColor,
      keyboardType,
      returnKeyType,
      lineHeight,
      containerBackgroundColor,
      countryCodeColor,
      inputColor,
      borderRadius,
      onChangePhoneNumber,
      onSubmitEditing,
      ...others
    } = props;
    return (
      <>
        <View
          className="justify-center items-center"
          style={{
            width: '100%',
            maxHeight: vs(110),
            borderBottomColor: '#00000047',
            borderBottomWidth: 1.5,
            paddingLeft: hs(8),
            backgroundColor: containerBackgroundColor,
            borderRadius,
          }}
        >
          <View style={styles.inputRow} className="mb-1.5">
            <Image
              source={ImgFlagUK}
              style={{
                width: hs(30),
                height: vs(20),
              }}
            />

            <View
              style={{
                marginLeft: 8,
                height: vs(25),
                backgroundColor: '#00000072',
                width: 1.5,
              }}
            />

            <Text
              style={{
                margin: 3,
                fontSize: 16,
                marginLeft: 6,

                color: countryCodeColor || 'black',
              }}
            >
              +44
            </Text>

            <TextInput
              ref={ref}
              value={value}
              cursorColor={cursorColor}
              selectionColor={selectionColor}
              keyboardType={keyboardType}
              returnKeyType={returnKeyType}
              style={{
                width: '70%',
                height: 40,
                fontSize: 16,

                color: inputColor || 'black',
                backgroundColor: errorText
                  ? backgroundColor
                  : backgroundColor || Colors.light.theme.darkYellow,
                // borderBottomColor: borderBottomColor || 'transparent',
                // borderBottomWidth: borderBottomHeight || 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                ...(style as object),
              }}
              onChangeText={onChangePhoneNumber}
              onSubmitEditing={onSubmitEditing}
              // className={`w-full rounded-xl text-xl ${className}`}
            />
          </View>
        </View>
        <AnimatePresence>
          {errorText && (
            <MotiView
              key={errorText}
              from={{
                height: 0,
                marginTop: 0,
              }}
              animate={{
                height: 20,
                marginTop: vs(8),
              }}
              exit={{
                height: 0,
                marginTop: 0,
              }}
              transition={{
                type: 'timing',
              }}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingLeft: hs(0),
                paddingRight: hs(8),
              }}
            >
              <Text
                style={{
                  ...globalStyle.textRegular,
                  color: Colors.light.theme.errorColor,
                  fontSize: 12,
                }}
              >
                {errorText}
              </Text>
            </MotiView>
          )}
        </AnimatePresence>
      </>
    );
  },
);
const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    width: '110%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  countryCode: {
    fontSize: 14,
    marginLeft: hs(5),
    marginBottom: vs(2),
    color: 'black',
    fontFamily: 'poppins',
    alignSelf: 'flex-end',
  },
  rightErrorIcon: {
    height: vs(20),
    width: hs(20),
    marginTop: -5,
  },
});

export default PhoneInput;
PhoneInput.defaultProps = {
  value: '',
  backgroundColor: '',
  errorText: '',
  borderTopColor: '',
  borderBottomColor: 'transparent',
  borderBottomHeight: 0,
  lineHeight: 23,
  onChangePhoneNumber: () => {},
};
