/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */

import Pressable from '@src/components/libraries/Pressable';

import { getRespValue } from '@utils/getRespValue';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, ButtonProps } from 'react-native-paper';

interface MyButtonProps extends ButtonProps {
  buttonStyles?: object;
  light?: boolean;
  buttonType: 'simple' | 'large' | 'xsm' | 'xlarge' | 'login' | 'kycbutton';
  color?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
}
const Buttons = (props: MyButtonProps) => {
  const {
    buttonStyles,
    children,
    loading,
    icon,
    light,
    buttonType,
    disabled,
    className,
    color,
    ...others
  } = props;

  const Simple = () => {
    const [isPressed, setIsPressed] = useState(false);
    return (
      <Pressable
        {...others}
        disabled={disabled}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={{
          ...styles.simple,
          ...buttonStyles,
          borderRadius: getRespValue(10),
          backgroundColor: isPressed
            ? 'gray'
            : color || styles.simple.backgroundColor,
        }}
        className={` ${light ? 'bg-[#d9d9d9]' : 'bg-[#EAB67D]'}  ${className} ${
          disabled ? 'bg-[#EFEFEF]' : ''
        }`}
      >
        {loading ? (
          <View className="flex w-full h-full items-center justify-center">
            <ActivityIndicator size="small" color="white" />
          </View>
        ) : (
          <View className="flex-row justify-center items-center w-full h-full px-3">
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              className={`text-[#000F6D] font-aeonik ${
                disabled ? 'opacity-20' : ''
              }`}
            >
              {children}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };
  const KycButton = () => {
    const [isPressed, setIsPressed] = useState(false);
    return (
      <Pressable
        {...others}
        disabled={disabled}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={{
          ...styles.kycbtn,
          ...buttonStyles,
          borderRadius: getRespValue(10),
          // alignSelf: 'center',
          backgroundColor: isPressed ? 'gray' : color || '#2C2C2C',
        }}
        className={` ${light ? 'bg-[#D9D9D9]' : 'bg-[#EAB67D]'}  ${className} ${
          disabled ? 'bg-[#EFEFEF]' : ''
        }`}
      >
        {loading ? (
          <View className="flex w-full h-full items-center justify-center ">
            <ActivityIndicator size="small" color="white" />
          </View>
        ) : (
          <View className="flex-row  items-center w-full h-full px-2">
            <Image
              source={icon}
              style={{
                marginRight: getRespValue(40),
                marginLeft: 10,
              }}
            />
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{ fontSize: 15 }}
              className={`text-white font-aeonik ${
                disabled ? 'opacity-20' : ''
              }`}
            >
              {children}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };
  const Login = () => {
    const [isPressed, setIsPressed] = useState(false);
    return (
      <Pressable
        {...others}
        disabled={disabled}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={{
          ...styles.simple,
          ...buttonStyles,
          backgroundColor: isPressed
            ? 'gray'
            : color || styles.simple.backgroundColor,
        }}
        className={` rounded-full  ${
          light ? 'bg-[#D9D9D9]' : 'bg-[#EAB67D]'
        }  ${className} ${disabled ? 'bg-[#EFEFEF]' : ''}`}
      >
        {loading ? (
          <View className="flex w-full h-full items-center justify-center">
            <ActivityIndicator size="small" color="white" />
          </View>
        ) : (
          <View className="flex-row justify-center items-center w-full h-full px-3">
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              className={`text-white font-aeonik ${
                disabled ? 'opacity-20' : ''
              }`}
            >
              {children}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };
  const Large = () => {
    const [isPressed, setIsPressed] = useState(false);
    return (
      <Pressable
        {...others}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={{
          ...styles.large,
          ...buttonStyles,
          backgroundColor: isPressed ? 'gray' : '#000F6C',
        }}
        className={`w-full   ${
          light ? 'bg-[#000F6C] ' : 'bg-[#000F6C]'
        }  ${className} ${disabled ? 'bg-[#EFEFEF]' : ''}`}
      >
        {loading ? (
          <View className="flex w-full h-full items-center justify-center">
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : (
          <View className="flex-row justify-center items-center w-full h-full px-3">
            <Text
              className={`text-white font-aeonik ${
                disabled ? 'opacity-20' : ''
              }`}
            >
              {children}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };
  const xLarge = () => {
    const [isPressed, setIsPressed] = useState(false);
    return (
      <Pressable
        {...others}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={{
          ...styles.large,
          ...buttonStyles,
          backgroundColor: isPressed
            ? 'gray'
            : color || styles.simple.backgroundColor,
        }}
        className={`w-full rounded-full  ${
          light ? 'bg-[#D9D9D9] ' : 'bg-[#EAB67D]'
        }  ${className} ${disabled ? 'bg-[#EFEFEF]' : ''}`}
      >
        {loading ? (
          <View className="flex w-full h-full items-center justify-center">
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : (
          <View className="flex-row justify-center items-center w-full h-full  px-3">
            <Text
              className={`text-[#000F6D] font-aeonik  ${
                disabled ? 'opacity-20' : ''
              }`}
            >
              {children}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };
  const xSmall = () => {
    const [isPressed, setIsPressed] = useState(false);
    return (
      <Pressable
        {...others}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={disabled}
        style={{
          ...styles.xsm,
          ...buttonStyles,
          backgroundColor: isPressed
            ? 'gray'
            : color || styles.simple.backgroundColor,
        }}
        className={`w-full rounded-full  ${
          light ? 'bg-[#D9D9D9]' : 'bg-[#EAB67D]'
        }  ${className} ${disabled ? 'bg-[#EFEFEF]' : ''}`}
      >
        {loading ? (
          <View className="flex w-full h-full items-center justify-center">
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : (
          <View className="flex-row justify-center items-center w-full h-full  px-3">
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              className={`text-[#000F6D] font-aeonik  ${
                disabled ? 'opacity-20' : ''
              }`}
            >
              {children}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };
  const views = {
    simple: Simple,
    large: Large,
    xsm: xSmall,
    xlarge: xLarge,
    login: Login,
    kycbutton: KycButton,
  };
  const CurrentView = views[buttonType];
  return <CurrentView />;
};

export default Buttons;

// Buttons.defaultProps = {
//   buttonStyles: {},
//   light: false,
// };

const styles = StyleSheet.create({
  simple: {
    height: getRespValue(47),
    width: getRespValue(297),
    backgroundColor: 'white',
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: getRespValue(25),
  },
  large: { height: getRespValue(47) },
  xsm: {
    height: getRespValue(46),
    width: getRespValue(188),
  },
  kycbtn: {
    height: getRespValue(65),
    width: getRespValue(380),
    backgroundColor: '#000F6D',
    padding: 10,
  },
});
