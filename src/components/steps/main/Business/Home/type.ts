import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';

export interface HomeProps extends MultiStepFormProps {
  parentGoto?: (index: number) => void;
}
