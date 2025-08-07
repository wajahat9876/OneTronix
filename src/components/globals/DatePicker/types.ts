import { MyTextInputProps } from '../Input/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DatePickerProps {
  errorText?: string;
  value?: any;
  inputProps?: MyTextInputProps;
  datePickerProps?: any;
  onDateConfirm: (date: any) => void;
  minDate?: any;
}
