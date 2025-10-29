/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import { useStatusBar } from "@hooks/StatusBarColor/index";
import Step0_Info from "@src/components/steps/main/Business/Info";
import Step1_Setting from "@src/components/steps/main/Business/Info/Setting/Step1_Setting";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useMultistepForm, {
  MultiStepFormProps,
} from "@src/hooks/useMultiStepForm";
import { View } from "react-native";

const Info = (props: MultiStepFormProps) => {
  useStatusBar("dark");
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm([<Step0_Info />, <Step1_Setting />], {
    parentGoto,
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });

  return <View className="flex-1">{step}</View>;
};

export default Info;
