/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import { useStatusBar } from "@hooks/StatusBarColor/index";
import SystemSetting from "@src/components/steps/main/Business/Setting/SystemSetting";
import useMultistepForm, {
  MultiStepFormProps,
} from "@src/hooks/useMultiStepForm";
import { useRef } from "react";
import { View } from "react-native";
import { LinearTransition } from "react-native-reanimated";
import Step0_CurrentPassword from "./ChangePassword/Step0_CurrentPassword";
import Step1_NewPassword from "./ChangePassword/Step1_NewPassword";
const Index = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step, goTo } = useMultistepForm(
    [<SystemSetting />, <Step0_CurrentPassword />, <Step1_NewPassword />],
    {
      parentGoto,
      animated: true,
      animatedProps: {
        style: {
          flex: 1,
        },
        // entering: FadeInUp.duration(300).delay(200),
        // exiting: FadeOutDown.duration(300),
        layout: LinearTransition,
      },
    }
  );

  const doublePressRef = useRef(false);
  useStatusBar("dark");
  //   useEffect(() => {
  //     let timer: string | number | NodeJS.Timeout | undefined;

  //     const handleTabPress = () => {
  //       if (doublePressRef?.current) {
  //         if (goTo) goTo(0);
  //         doublePressRef.current = false;
  //       } else {
  //         doublePressRef.current = true;
  //         timer = setTimeout(() => {
  //           doublePressRef.current = false;
  //         }, 300);
  //       }
  //     };

  //     const unsubscribe = navigation.addListener("tabPress", handleTabPress);

  //     return () => {
  //       clearTimeout(timer);
  //       unsubscribe();
  //     };
  //   }, [goTo, navigation]);
  return <View style={{ flex: 1, backgroundColor: "white" }}>{step}</View>;
};

export default Index;
