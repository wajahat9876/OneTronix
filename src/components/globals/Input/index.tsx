import React from "react";
import { TextInput } from "react-native";

import DefaultInput from "./DefaultInput";
import UnderlinedInput from "./UnderlinedInput";
import { MyTextInputProps } from "./types";

const Input = React.forwardRef<TextInput, MyTextInputProps>((props, ref) => {
  const {
    type = "default",
    password = false,
    errorText = "",
    last = false,
    backgroundColor = "",
    borderTopColor = "",
    borderBottomColor = "",
    borderBottomHeight = 0,
    lineHeight = 23,
    roundedRadius = "xl",
    fontFamily,
  } = props;

  const inputs = {
    default: DefaultInput,
    underlined: UnderlinedInput,
  };

  const ReturnInput = inputs[type || "default"];

  return <ReturnInput {...props} ref={ref} />;
});

export default Input;
