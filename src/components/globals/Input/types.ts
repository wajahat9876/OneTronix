import { TextInputProps } from "react-native-paper";

export interface MyTextInputProps extends TextInputProps {
  password?: boolean;
  errorText?: string;
  last?: boolean;
  backgroundColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderBottomHeight?: number;
  lineHeight?: number;
  roundedRadius?: string;
  type?: "default" | "underlined";
  fontFamily?: string;
  height?: number;
  width?: string;
}

export interface DefaultTextInputProps extends TextInputProps {
  password?: boolean;
  errorText?: string;
  last?: boolean;
  backgroundColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderBottomHeight?: number;
  lineHeight?: number;
  roundedRadius?: string;
  type?: "default" | "underlined";
  height?: number;
  width?: string;
  fontFamily?: string;
}

export interface UnderlinedTextInputProps extends TextInputProps {
  password?: boolean;
  errorText?: string;
  last?: boolean;
  backgroundColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderBottomHeight?: number;
  lineHeight?: number;
  type?: "default" | "underlined";
}
