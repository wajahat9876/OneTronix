import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';

export interface TransactionHistoryProps extends MultiStepFormProps {
  parentGoto?: (index: number) => void;
}
