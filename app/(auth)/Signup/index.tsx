/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useBusinessDetails } from "@/store/selectors/business/business";
import EasyEmoneyGradient from "@src/components/globals/BackgroundGradient";
import Step0_ChooseAccount from "@src/components/steps/Auth/Signup/Step0_ChooseAccount";
import Step1_Details from "@src/components/steps/Auth/Signup/Step1_Details";
import Step2_OTP from "@src/components/steps/Auth/Signup/Step2_OTP";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { View } from "react-native";

const Signup = () => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { step } = useMultistepForm(
    [<Step0_ChooseAccount />, <Step1_Details />, <Step2_OTP />],
    {
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    }
  );

  return (
    <>
      <EasyEmoneyGradient />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default Signup;
