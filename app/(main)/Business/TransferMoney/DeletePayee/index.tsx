/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step1_Delete_Payee from '@src/components/steps/main/Business/AddNewPayee/DeletePayee/Step1_Delete_Payee';
import Step2_Delete_Succes from '@src/components/steps/main/Business/AddNewPayee/DeletePayee/Step2_Delete_Succes';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const Delete_Payee = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm(
    [<Step1_Delete_Payee />, <Step2_Delete_Succes />],
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

export default Delete_Payee;
