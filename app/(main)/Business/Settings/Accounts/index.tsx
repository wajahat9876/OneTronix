/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
import { useBusinessDetails } from "@/store/selectors/business/business";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { Text } from "react-native";
import Animated from "react-native-reanimated";
import { useSelector } from "react-redux";

const CreateAccount = ({ back }: MultiStepFormProps) => {
  const { data: businessData } = useSelector(useBusinessDetails);

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScreenAuth
        title="Profile"
        style={{
          backgroundColor: "white",
        }}
        topColor={"white"}
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus
        appBarProps={{
          light: true,
          rightIcon: true,
        }}
        back={() => back?.()}
      >
        <Text style={{ color: "black", fontFamily: "Excon-Medium" }}>
          Profile
        </Text>
      </ScreenAuth>
    </Animated.View>
  );
};

export default CreateAccount;
