/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Image from "@assets/images/BackgroundImage/Background.png";
import BackgroundImage from "@src/components/globals/BackgroundImage";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { useState } from "react";
import { View } from "react-native";

const Forgot = () => {
  const [checkData, setCheckData] = useState<{
    isPhone: boolean;
    email: string;
    phone: string;
  }>({
    isPhone: false,
    email: "",
    phone: "",
  });
  const { step } = useMultistepForm([], {});
  return (
    <>
      <BackgroundImage src={Image} />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default Forgot;
