import { Text } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { globalStyle } from "@src/styles/globals";
import { hs, ms, vs } from "@utils/design/design";
import { AnimatePresence, MotiView } from "moti";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { TextInput as TextInputPaper } from "react-native-paper";
import { DefaultTextInputProps } from "../types";

const DefaultInput = React.forwardRef<TextInput, DefaultTextInputProps>(
  (props, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    // const [checked] = React.useState(true);

    const {
      className,
      style,
      contentStyle,
      value,
      password,
      errorText,
      last,
      backgroundColor,
      borderTopColor,
      borderBottomColor,
      borderBottomHeight,
      lineHeight,
      roundedRadius,
      height,
      width,
      ...others
    } = props;
    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };
    return (
      <>
        <TextInputPaper
          {...others}
          ref={ref}
          autoCorrect={false}
          value={value}
          underlineStyle={{
            backgroundColor: "transparent",
          }}
          contentStyle={{
            paddingLeft: hs(16),
            fontFamily: "Excon-Regular",
            fontSize: ms(14),
            ...(contentStyle as object),
          }}
          style={{
            backgroundColor: errorText
              ? backgroundColor
              : backgroundColor || "white",
            borderTopColor: errorText
              ? backgroundColor
              : borderTopColor || "white",
            borderBottomColor: borderBottomColor || "transparent",
            borderBottomWidth: borderBottomHeight || 0,
            height: height || vs(60),
            width: width || "100%",
            lineHeight,
            ...(style as object),
          }}
          className={`w-full rounded-${roundedRadius} text-xl ${
            last ? "border-b-2" : ""
          } ${className}`}
          secureTextEntry={password ? !isPasswordVisible : false}
          right={
            password && (
              <TextInputPaper.Icon
                icon={!isPasswordVisible ? "eye-off" : "eye"}
                size={20}
                forceTextInputFocus={false}
                onPress={() => {
                  togglePasswordVisibility();
                }}
              />
            )
          }
        />
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
              // transition={{
              //   type: 'timing',
              // }}
              style={{
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingLeft: hs(8),
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
  }
);

// DefaultInput.defaultProps = {
//   password: false,
//   errorText: '',
//   last: false,
//   backgroundColor: '',
//   borderTopColor: '',
//   borderBottomColor: 'transparent',
//   borderBottomHeight: 0,
//   lineHeight: 23,
//   type: 'default',
//   roundedRadius: 'xl',
// };

export default DefaultInput;
