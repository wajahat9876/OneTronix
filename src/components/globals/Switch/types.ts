import { SwitchProps } from 'react-native';

export interface ISwitchProps extends SwitchProps {
  onColor?: string;
  offColor?: string;
  label?: string;
  labelStyle?: object;
  isOn?: boolean;
  onToggle?: () => void;
  toggleStyles?: object;
  type?: string;
  backgroundColor?: string;
  backgroundColorActive?: string;
  toggleColor?: string;
  toggleColorActive?: string;
}
