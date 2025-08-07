/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step1_Code_Confirmation from '@src/components/steps/main/Business/Card/ViewDebitCardPin/Step1_Code_Confirmation';
import Step2_Debit_Card_Pin from '@src/components/steps/main/Business/Card/ViewDebitCardPin/Step2_Debit_Card_Pin';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const ViewDebitCardPin = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm(
    [<Step1_Code_Confirmation />, <Step2_Debit_Card_Pin />],
    {
      parentGoto,
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    },
  );

  return <View className="flex-1">{step}</View>;
};

export default ViewDebitCardPin;
