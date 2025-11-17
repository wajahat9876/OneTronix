import { useBusinessDetails } from "@/store/selectors/business/business";
import SettingItem from "@src/components/commons/main/settings_stack/SettingItem";
import GlobalLogout from "@src/components/globals/BuisnessLogoutModal";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { ScrollView, StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
// import { globalStyle } from '@src/styles/globals';
import { hs, vs } from "@utils/design/design";
import { router } from "expo-router";
import { View } from "react-native";
import Animated from "react-native-reanimated";
const Settings = ({ goTo }: MultiStepFormProps) => {
  const { data } = useAppSelector(useBusinessDetails);

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScreenAuth
        title="Settings"
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
        back={() => {}}
      >
        <View style={styles.container}>
          <ScrollView>
            <SettingItem
              title={data?.firstName || "Profile"}
              isIconVisible
              marginTop={vs(30)}
              onClick={() => {
                goTo?.(1);
              }}
            />
            <SettingItem
              title="Device Management"
              marginTop={vs(30)}
              onClick={() => {
                router.push("/(main)/Business/Info");
              }}
            />
            <SettingItem
              title="System Setting"
              marginTop={vs(30)}
              onClick={() => {
                // goTo?.(1);
              }}
            />
            <SettingItem
              title="Terms and Conditions"
              marginTop={vs(30)}
              onClick={() => {
                // goTo?.(1);
              }}
            />
            <SettingItem
              title="Privacy Policy"
              marginTop={vs(30)}
              onClick={() => {
                // goTo?.(1);
              }}
            />

            <View style={{ marginBottom: vs(30) }}>
              <GlobalLogout key="dsa" marginTop={vs(30)} />
            </View>
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
});
export default Settings;
