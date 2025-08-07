/* eslint-disable @typescript-eslint/no-explicit-any */
import { BouncyCheckboxProps } from 'react-native-bouncy-checkbox';

export interface ICheckboxProps extends BouncyCheckboxProps {
  label?: any;
  value: string;
  onPress: () => void;
}
