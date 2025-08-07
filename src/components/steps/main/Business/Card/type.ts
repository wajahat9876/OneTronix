import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';

export interface CardProps extends MultiStepFormProps {
  parentGoto?: (index: number) => void;
}
