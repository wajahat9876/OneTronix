/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step1_Current_Pin from '@src/components/steps/main/Business/Setting/ChangePin/Step1_Current_Pin';
import Step2_New_Pin from '@src/components/steps/main/Business/Setting/ChangePin/Step2_New_Pin';
import Step3_Confirm_Pin from '@src/components/steps/main/Business/Setting/ChangePin/Step3_Confirm_Pin';
import Step4_Code_Confirmation from '@src/components/steps/main/Business/Setting/ChangePin/Step4_Code_Confirmation';
import Step5_Pin_Changed from '@src/components/steps/main/Business/Setting/ChangePin/Step5_Pin_Changed';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const ChangePassword = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm(
    [
      <Step1_Current_Pin />,
      <Step2_New_Pin />,
      <Step3_Confirm_Pin />,
      <Step4_Code_Confirmation />,
      <Step5_Pin_Changed />,
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

export default ChangePassword;
