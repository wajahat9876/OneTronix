/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step1_Report_Card from '@src/components/steps/main/Business/Card/ReportCard/Step1_Report_Card';
import Step2_Block_Card from '@src/components/steps/main/Business/Card/ReportCard/Step2_Block_Card';
import Step3_Card_Blocked from '@src/components/steps/main/Business/Card/ReportCard/Step3_Card_Blocked';
import Step4_Order_New_Card from '@src/components/steps/main/Business/Card/ReportCard/Step4_Order_New_Card';
import Step5_Card_Ordered from '@src/components/steps/main/Business/Card/ReportCard/Step5_Card_Ordered';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const ReportCard = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm(
    [
      <Step1_Report_Card />,
      <Step2_Block_Card />,
      <Step3_Card_Blocked />,
      <Step4_Order_New_Card />,
      <Step5_Card_Ordered />,
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

export default ReportCard;
