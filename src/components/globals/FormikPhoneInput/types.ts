import { ReactNativePhoneInputProps } from 'react-native-phone-input';
import { MyTextInputProps } from '../Input';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MyFormikProps extends ReactNativePhoneInputProps {
  formik: any;
  name: string;
  value?: string;
  inputProps?: MyTextInputProps;
}
