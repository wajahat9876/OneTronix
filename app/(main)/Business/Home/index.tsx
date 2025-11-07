/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useBusinessDetails } from "@/store/selectors/business/business";
import Home from "@src/components/steps/main/Business/Home";
import useMultistepForm from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { View } from "react-native";
import { LinearTransition } from "react-native-reanimated";
const Index = ({ navigation }: any) => {
  const { auth_token, isDarkMode } = useAppSelector(useBusinessDetails);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });

  const { step, goTo } = useMultistepForm([<Home />], {
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
    <View
      className="flex-1"
      style={{ backgroundColor: isDarkMode ? "#252525" : "white" }}
    >
      {step}
    </View>
  );
};

export default Index;
