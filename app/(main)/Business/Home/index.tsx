/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useBusinessDetails } from "@/store/selectors/business/business";
import Home from "@src/components/steps/main/Business/Home";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { useEffect, useRef } from "react";
import { View } from "react-native";

const Index = ({ navigation }: any) => {
  const { auth_token, isDarkMode } = useAppSelector(useBusinessDetails);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { step, goTo } = useMultistepForm([<Home />], {
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });
  const doublePressRef = useRef(false);
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
  return (
    <View
      className="flex-1"
      style={{ backgroundColor: isDarkMode ? "#252525" : "white" }}
    >
      {step}
    </View>
  );
};

export default Index;
