import { TextInputProps } from "react-native";
import { MyTextInputProps } from "../Input/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MyFormikProps extends TextInputProps {
  formik: any;
  name: string;
  value?: string;
  inputProps?: MyTextInputProps;
  fontFamily?: string;
}
