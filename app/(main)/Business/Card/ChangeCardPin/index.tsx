/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */

import Step1_Current_Card_Pin from '@src/components/steps/main/Business/Card/ChangeCardPin/Step1_Current_Card_Pin';
import Step2_Card_New_Pin from '@src/components/steps/main/Business/Card/ChangeCardPin/Step2_Card_New_Pin';
import Step3_Confirm_Card_New_Pin from '@src/components/steps/main/Business/Card/ChangeCardPin/Step3_Confirm_Card_New_Pin';
import Step4_Code_Confirmation from '@src/components/steps/main/Business/Card/ChangeCardPin/Step4_Code_Confirmation';
import Step5_Card_Pin_Changed from '@src/components/steps/main/Business/Card/ChangeCardPin/Step5_Card_Pin_Changed';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const ChangeCardPin = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm(
    [
      <Step1_Current_Card_Pin />,
      <Step2_Card_New_Pin />,
      <Step3_Confirm_Card_New_Pin />,
      <Step4_Code_Confirmation />,
      <Step5_Card_Pin_Changed />,
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

export default ChangeCardPin;
