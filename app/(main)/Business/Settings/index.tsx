/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import { useStatusBar } from "@hooks/StatusBarColor/index";
import Settings from "@src/components/steps/main/Business/Setting";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { LinearTransition } from "react-native-reanimated";
import About from "./About";
import Account from "./Accounts";
const Index = ({ navigation }: any) => {
  const { step, goTo } = useMultistepForm(
    [
      <Settings />, // 0
      <Account />, // 1
      <About />, //2
    ],
    {
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
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;

    const handleTabPress = () => {
      if (doublePressRef?.current) {
        if (goTo) goTo(0);
        doublePressRef.current = false;
      } else {
        doublePressRef.current = true;
        timer = setTimeout(() => {
          doublePressRef.current = false;
        }, 300);
      }
    };

    const unsubscribe = navigation.addListener("tabPress", handleTabPress);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [goTo, navigation]);
  return <View style={{ flex: 1, backgroundColor: "white" }}>{step}</View>;
};

export default Index;
