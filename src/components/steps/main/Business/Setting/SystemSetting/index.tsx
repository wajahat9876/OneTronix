import { useBusinessDetails } from "@/store/selectors/business/business";
import SettingItem from "@src/components/commons/main/settings_stack/SettingItem";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { ScrollView, StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
// import { globalStyle } from '@src/styles/globals';
import { hs, vs } from "@utils/design/design";
import { Platform, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SettingProps } from "../type";
const SystemSetting = ({ goTo, parentGoto }: SettingProps) => {
  const { data } = useAppSelector(useBusinessDetails);

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_moneyssasasa"
      style={{ flex: 1, backgroundColor: "#F9F9F9" }}
    >
      <ScreenAuth
        title="System Setting"
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
          parentGoto?.(0);
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
              Authentication
            </Text>
            <SettingItem
              title="Change Password"
              marginTop={vs(0)}
              //   isIconVisible
              //   icon={DeviceIcon}
              borderBottomWidth={0}
              onClick={() => {
                goTo?.(1);
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
export default SystemSetting;
