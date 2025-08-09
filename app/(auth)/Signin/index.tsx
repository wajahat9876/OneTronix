/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import EasyEmoneyGradient from "@src/components/globals/BackgroundGradient";
import Step1_BasicDetails from "@src/components/steps/Auth/Signin/Step1_BasicDetails";
import Step2_OTP from "@src/components/steps/Auth/Signin/Step2_OTP";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { View } from "react-native";

const Signin = () => {
  const { step } = useMultistepForm([<Step1_BasicDetails />, <Step2_OTP />], {
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });

  return (
    <>
      <EasyEmoneyGradient />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default Signin;
