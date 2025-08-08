/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import Step1_Details from "@src/components/steps/Auth/Signup/Step1_Details";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { View } from "react-native";

const Signup = () => {
  const { step } = useMultistepForm([
  <Step1_Details />], {
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });

  return (
    <>
     
      <View className="flex-1">{step}</View>
    </>
  );
};

export default Signup;
