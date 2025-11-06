/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import { useStatusBar } from "@hooks/StatusBarColor/index";
import Step1_Select_Statement_Month from "@src/components/steps/main/Business/Transaction/Step1_Select_Statement_Month";
import useMultistepForm, {
  MultiStepFormProps,
} from "@src/hooks/useMultiStepForm";
import { View } from "react-native";
import { LinearTransition } from "react-native-reanimated";

const Transaction = (props: MultiStepFormProps) => {
  useStatusBar("dark");
  const { goTo: parentGoto } = props;

  const { step, goTo } = useMultistepForm([<Step1_Select_Statement_Month />], {
    animated: true,
    animatedProps: {
      style: {
        flex: 1,
      },
      // entering: FadeInUp.duration(300).delay(200),
      // exiting: FadeOutDown.duration(300),
      layout: LinearTransition,
    },
  });

  return <View className="flex-1">{step}</View>;
};

export default Transaction;
