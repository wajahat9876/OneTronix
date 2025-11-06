/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import { useStatusBar } from "@hooks/StatusBarColor/index";
import Settings from "@src/components/steps/main/Business/Setting";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { LinearTransition } from "react-native-reanimated";
import Account from "./Accounts";
import ExchangeCuttOffTime from "./ExchangeCuttOffTime";
import Faqs from "./Faqs";
import FeeInvoice from "./FeeInvoice";
import Fee_Plan from "./FeePlan";
import Legals from "./Legals";
import AntiBriberyPolicy from "./Legals/AntiBriberyPolicy";
import CookiePolicy from "./Legals/CookiePolicy";
import PrivacyPolicy from "./Legals/PrivacyPolicy";
import TermsAndConditions from "./Legals/TermsAndConditions";
import LinkedDevices from "./LinkedDevices";
import MultiCurrency from "./MultiCurrency";
import SubAccountDeatil from "./SubAccountDetail";
const Index = ({ navigation }: any) => {
  const { step, goTo } = useMultistepForm(
    [
      <Settings />, // 0
      <Account />, // 1
      <MultiCurrency />, // 2
      <Legals />, // 3
      <Faqs />, // 4
      <TermsAndConditions />, // 5
      <PrivacyPolicy />, // 6
      <Fee_Plan />, // 7
      <SubAccountDeatil />, // 8
      <AntiBriberyPolicy />, // 9
      <CookiePolicy />, // 10
      <FeeInvoice />, // 11
      <LinkedDevices />, // 12
      <ExchangeCuttOffTime />, // 13
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
  return <View className="flex-1">{step}</View>;
};

export default Index;
