/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import EasyEmoneyGradient from "@src/components/globals/BackgroundGradient";
import Step0_VerifyEmail from "@src/components/steps/Auth/ForgotPassword/Step0_VerifyEmailForgot";
import Step1_VerifyOtp from "@src/components/steps/Auth/ForgotPassword/Step1_VerifyOtp";
import Step2_ResetPassword from "@src/components/steps/Auth/ForgotPassword/Step2_ResetPassword";

import useMultistepForm from "@src/hooks/useMultiStepForm";
import { View } from "react-native";

const Forgot = () => {
  const { step } = useMultistepForm(
    [<Step0_VerifyEmail />, <Step1_VerifyOtp />, <Step2_ResetPassword />],
    {}
  );
  return (
    <>
      <EasyEmoneyGradient />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default Forgot;
