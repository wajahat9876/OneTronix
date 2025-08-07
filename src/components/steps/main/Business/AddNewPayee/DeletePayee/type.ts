import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';

export interface DeleteProps extends MultiStepFormProps {
  parentGoto?: (index: number) => void;
}
