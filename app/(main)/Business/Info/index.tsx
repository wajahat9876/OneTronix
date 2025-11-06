/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import { useStatusBar } from "@hooks/StatusBarColor/index";
import Step0_Info from "@src/components/steps/main/Business/Info";
import Step1_Setting from "@src/components/steps/main/Business/Info/Setting/Step1_Setting";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { View } from "react-native";
import { LinearTransition } from "react-native-reanimated";

const Info = () => {
  useStatusBar("dark");

  const { step, goTo } = useMultistepForm([<Step0_Info />, <Step1_Setting />], {
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

  return <View style={{ flex: 1 }}>{step}</View>;
};

export default Info;
