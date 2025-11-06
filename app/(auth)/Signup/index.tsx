/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useBusinessDetails } from "@/store/selectors/business/business";
import EasyEmoneyGradient from "@src/components/globals/BackgroundGradient";
import Step0_ChooseAccount from "@src/components/steps/Auth/Signup/Step0_ChooseAccount";
import Step1_Details from "@src/components/steps/Auth/Signup/Step1_Details";
import Step2_OTP from "@src/components/steps/Auth/Signup/Step2_OTP";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { View } from "react-native";
import { LinearTransition } from "react-native-reanimated";

const Signup = () => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { step } = useMultistepForm(
    [<Step0_ChooseAccount />, <Step1_Details />, <Step2_OTP />],
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

  return (
    <>
      <EasyEmoneyGradient />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default Signup;
