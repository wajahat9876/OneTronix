/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step1_Enter_Card_Last_Digits from '@src/components/steps/main/Business/Card/ActivateDebitCard/Step1_Enter_Card_Last_Digits';
import Step2_Card_Activated from '@src/components/steps/main/Business/Card/ActivateDebitCard/Step2_Card_Activated';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const ActivateDebitCard = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm(
    [<Step1_Enter_Card_Last_Digits />, <Step2_Card_Activated />],
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

export default ActivateDebitCard;
