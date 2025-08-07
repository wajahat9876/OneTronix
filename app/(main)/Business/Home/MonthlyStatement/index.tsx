/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step1_Monthly_Statement from '@src/components/steps/main/Business/Home/MonthlyStatements/Step1_Monthly_Statement';
import Step2_Monthly_Statement from '@src/components/steps/main/Business/Home/MonthlyStatements/Step2_Monthly_Statement';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { useState } from 'react';
import { View } from 'react-native';

const MonthlyStatements = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const [statementData, setStatementData] = useState<any>(null);
  const { step } = useMultistepForm(
    [
      <Step1_Monthly_Statement setStatementData={setStatementData} />,
      <Step2_Monthly_Statement statementData={statementData} />,
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

export default MonthlyStatements;
