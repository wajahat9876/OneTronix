import { Text } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { globalStyle } from "@src/styles/globals";
import { hs, ms, vs } from "@utils/design/design";
import React, { useCallback, useState } from "react";
import { TextInput, View } from "react-native";
import { TextInput as TextInputPaper } from "react-native-paper";
import { UnderlinedTextInputProps } from "../types";

const UnderlinedInput = React.forwardRef<TextInput, UnderlinedTextInputProps>(
  (props, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const {
      className,
      style,
      contentStyle,
      password,
      errorText,
      last,
      value,
      onChangeText,
      backgroundColor,
      borderTopColor,
      borderBottomColor,
      borderBottomHeight,
      lineHeight,
      ...others
    } = props;

    const togglePasswordVisibility = useCallback(() => {
      setIsPasswordVisible((prev) => !prev);
    }, []);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    return (
      <View style={{ position: "relative", width: "100%" }}>
        {/* Placeholder */}
        {(isFocused || value) && (
          <View
            style={{
              position: "absolute",
              top: vs(-10), // Adjust for perfect alignment
              left: hs(4), // Align with text
              zIndex: 1,
            }}
          >
            <Text
              style={{
                color: "gray",
                fontSize: ms(12),
                fontFamily: "Excon-Medium",
              }}
            >
              {props.placeholder}
            </Text>
          </View>
        )}

        {/* Input Field */}
        <TextInputPaper
          {...others}
          ref={ref}
          autoCorrect={false}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          placeholder={!isFocused && !value ? props.placeholder : " "}
          underlineStyle={{
            backgroundColor: "transparent",
          }}
          contentStyle={{
            paddingLeft: hs(4),
            fontFamily: "Excon-Regular",
            fontSize: ms(14),
            ...(contentStyle as object),
          }}
          style={{
            borderBottomLeftRadius: vs(5), // Adjust radius
            borderBottomRightRadius: vs(5),
            backgroundColor: backgroundColor || Colors.light.theme.darkYellow,
            height: vs(40),
            borderTopColor: borderTopColor || "white",
            borderBottomColor: borderBottomColor || "transparent",
            borderBottomWidth: borderBottomHeight || 0,
            ...(style as object),
            lineHeight,
          }}
          className={`w-full rounded-xl text-xl ${
            last ? "border-b-2" : ""
          } ${className}`}
          secureTextEntry={password ? !isPasswordVisible : false}
          right={
            password && (
              <TextInputPaper.Icon
                icon={!isPasswordVisible ? "eye-off" : "eye"}
                forceTextInputFocus={false}
                size={20}
                onPress={togglePasswordVisibility}
              />
            )
          }
        />

        {/* Error Text */}
        {errorText && (
          <View
            style={{
              marginTop: vs(8),
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "flex-start",
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
          </View>
        )}
      </View>
    );
  }
);

// UnderlinedInput.defaultProps = {
//   password: false,
//   errorText: '',
//   last: false,
//   backgroundColor: '',
//   borderTopColor: '',
//   borderBottomColor: 'transparent',
//   borderBottomHeight: 0,
//   lineHeight: 23,
//   type: 'default',
// };

export default React.memo(UnderlinedInput);
