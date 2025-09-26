import { MyTextInputProps } from "../Input/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MyFormikProps {
  formik: any;
  name: string;
  value?: string;
  inputProps?: MyTextInputProps;
  datePickerProps?: any;
  onDateConfirm?: (date: Date) => void;
  showIcon?: boolean;
}
