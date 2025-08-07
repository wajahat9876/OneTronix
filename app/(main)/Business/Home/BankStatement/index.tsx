/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step1_BankStatement from '@src/components/steps/main/Business/Home/BankStatement/Step1_BankStatement';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const BankStatements = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm([<Step1_BankStatement />], {
    parentGoto,
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });

  return <View className="flex-1">{step}</View>;
};

export default BankStatements;
