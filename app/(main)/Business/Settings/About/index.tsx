import { useBusinessDetails } from "@/store/selectors/business/business";
import SettingItem from "@src/components/commons/main/settings_stack/SettingItem";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { ScrollView, StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
// import { globalStyle } from '@src/styles/globals';
import TCIcon from "@assets/icons/MenuIcons/Tc.png";
import PPIcon from "@assets/icons/MenuIcons/pp.png";
import { hs, vs } from "@utils/design/design";
import { Platform, Text, View } from "react-native";
import Animated from "react-native-reanimated";

const About = ({ goTo }: MultiStepFormProps) => {
  const { data } = useAppSelector(useBusinessDetails);

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_monessy"
      style={{ flex: 1, backgroundColor: "#F9F9F9" }}
    >
      <ScreenAuth
        title="About"
        style={{
          backgroundColor: "#F9F9F9",
        }}
        topColor={"#F9F9F9"}
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus
        appBarProps={{
          light: true,
          rightIcon: true,
        }}
        back={() => {
          goTo?.(0);
        }}
      >
        <View style={styles.container}>
          <ScrollView>
            <Text
              style={{
                marginTop: vs(30),
                fontFamily: "Excon-Regular",
                fontSize: 15,
                padding: 5,
                paddingHorizontal: hs(10),
                color: "gray",
              }}
            >
              Legal & Information
            </Text>
            <SettingItem
              title="Terms and Conditions"
              marginTop={vs(0)}
              isIconVisible
              icon={TCIcon}
              borderBottomWidth={0}
              onClick={() => {
                // goTo?.(1);
              }}
            />
            <SettingItem
              title="Privacy Policy"
              marginTop={vs(0)}
              borderBottomWidth={0}
              isIconVisible
              icon={PPIcon}
              onClick={() => {
                // goTo?.(1);
              }}
            />
          </ScrollView>
        </View>
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: hs(16),
    marginTop: vs(24),
  },
  card: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    width: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === "ios" ? 2 : 2,
  },
});
export default About;
