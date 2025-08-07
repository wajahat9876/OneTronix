import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';

export interface BankStatementProps extends MultiStepFormProps {
  parentGoto?: (index: number) => void;
}
