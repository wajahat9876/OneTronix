import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';

export interface CreateAccountProps extends MultiStepFormProps {
  parentGoto?: (index: number) => void;
}
