import SettingItem from "@src/components/commons/main/settings_stack/SettingItem";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { ScrollView, StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
// import { globalStyle } from '@src/styles/globals';
import CPIcon from "@assets/icons/MenuIcons/changePassword.png";
import { hs, ms, vs } from "@utils/design/design";
import { Platform, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SettingProps } from "../type";
const SystemSetting = ({ goTo, parentGoto }: SettingProps) => {
  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_moneyssasasa"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScreenAuth
        title="System Setting"
        style={{
          backgroundColor: "transparent",
        }}
        topColor={"transparent"}
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
              allowFontScaling={false}
              style={{
                marginTop: vs(10),
                fontFamily: "Excon-Medium",
                fontSize: ms(14),
                padding: 5,
                paddingHorizontal: hs(10),
                color: "black",
              }}
            >
              Authentication
            </Text>
            <SettingItem
              title="Change Password"
              marginTop={vs(10)}
              isIconVisible
              icon={CPIcon}
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
    marginTop: vs(20),
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
