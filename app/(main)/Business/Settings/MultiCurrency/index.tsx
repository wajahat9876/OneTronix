/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step1_MultiCurrency from '@src/components/steps/main/Business/Setting/MultiCurrency/Step1_MultiCurrency';
import Step2_ExchangeTransaction from '@src/components/steps/main/Business/Setting/MultiCurrency/Step2_ExchangeTransaction';
import Step3_CreateAccount from '@src/components/steps/main/Business/Setting/MultiCurrency/Step3_CreateAccount';
import Step4_Succes from '@src/components/steps/main/Business/Setting/MultiCurrency/Step4_Success';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const MultiCurrency = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm(
    [
      <Step1_MultiCurrency />,
      <Step2_ExchangeTransaction />,
      <Step3_CreateAccount />,
      <Step4_Succes />,
    ],
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

export default MultiCurrency;
