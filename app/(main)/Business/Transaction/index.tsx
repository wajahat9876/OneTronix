/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import { useStatusBar } from "@hooks/StatusBarColor/index";
import Step1_Select_Statement_Month from "@src/components/steps/main/Business/Transaction/Step1_Select_Statement_Month";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useMultistepForm, {
  MultiStepFormProps,
} from "@src/hooks/useMultiStepForm";
import { View } from "react-native";

const Transaction = (props: MultiStepFormProps) => {
  useStatusBar("dark");
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm([<Step1_Select_Statement_Month />], {
    parentGoto,
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });

  return <View className="flex-1">{step}</View>;
};

export default Transaction;
