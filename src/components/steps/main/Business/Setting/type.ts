import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';

export interface SettingProps extends MultiStepFormProps {
  parentGoto?: (index: number) => void;
}
