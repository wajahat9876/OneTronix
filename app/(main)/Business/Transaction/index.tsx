/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step0_TransactionHistory from "@src/components/steps/main/Business/Transaction/Step0_TransactionHistory";
import Step1_Select_Statement_Month from "@src/components/steps/main/Business/Transaction/Step1_Select_Statement_Month";
import Step2_Enter_Passcode from "@src/components/steps/main/Business/Transaction/Step2_Enter_Passcode";
import Step3_Bank_Statement from "@src/components/steps/main/Business/Transaction/Step3_Bank_Statement";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useMultistepForm, {
  MultiStepFormProps,
} from "@src/hooks/useMultiStepForm";
import { View } from "react-native";

const Transaction = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm(
    [
      <Step1_Select_Statement_Month />,
      <Step0_TransactionHistory />,
      <Step1_Select_Statement_Month />,
      <Step2_Enter_Passcode />,
      <Step3_Bank_Statement />,
    ],
    {
      parentGoto,
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    }
  );

  return <View className="flex-1">{step}</View>;
};

export default Transaction;
