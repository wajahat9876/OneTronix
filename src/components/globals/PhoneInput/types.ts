import { TextInputProps } from 'react-native-paper';

export interface MyTextInputProps extends TextInputProps {
  value?: string;
  errorText?: string;
  backgroundColor?: string;
  containerBackgroundColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderBottomHeight?: number;
  lineHeight?: number;
  countryCodeColor?: string;
  inputColor?: string;
  borderRadius?: any;
  onChangePhoneNumber?: (e: string) => void;
}
