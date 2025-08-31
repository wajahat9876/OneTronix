/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useBusinessDetails } from "@/store/selectors/business/business";
import EasyEmoneyGradient from "@src/components/globals/BackgroundGradient";
import Step1_BasicDetails from "@src/components/steps/Auth/Signin/Step1_BasicDetails";
import Step2_OTP from "@src/components/steps/Auth/Signin/Step2_OTP";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { View } from "react-native";

const Signin = () => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  }); // --- IGNORE ---;
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
