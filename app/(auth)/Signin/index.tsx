/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useBusinessDetails } from "@/store/selectors/business/business";
import EasyEmoneyGradient from "@src/components/globals/BackgroundGradient";
import Step1_BasicDetails from "@src/components/steps/Auth/Signin/Step1_BasicDetails";
import Step2_OTP from "@src/components/steps/Auth/Signin/Step2_OTP";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { View } from "react-native";
import { LinearTransition } from "react-native-reanimated";

const Signin = () => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  }); // --- IGNORE ---;
  const { step } = useMultistepForm([<Step1_BasicDetails />, <Step2_OTP />], {
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

  return (
    <>
      <EasyEmoneyGradient />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default Signin;
