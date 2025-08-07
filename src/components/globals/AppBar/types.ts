import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';

export interface AppBarProps extends MultiStepFormProps {
  title?: string;
  label?: string;
  light?: boolean;
  rightIcon?: boolean;
  onPress?: () => void;
}
