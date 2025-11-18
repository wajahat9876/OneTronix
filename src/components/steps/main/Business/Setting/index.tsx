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
import aboutIcon from "@assets/icons/MenuIcons/about.png";
import DeviceIcon from "@assets/icons/MenuIcons/device.png";
import LogoutIcon from "@assets/icons/MenuIcons/logout.png";
import ProfileIcon from "@assets/icons/MenuIcons/profile.png";
import systemIcon from "@assets/icons/MenuIcons/systemsetting.png";
import { MaterialIcons } from "@expo/vector-icons";
import { hs, ms, vs } from "@utils/design/design";
import { router } from "expo-router";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
const Settings = ({ goTo }: MultiStepFormProps) => {
  const { data } = useAppSelector(useBusinessDetails);

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1, backgroundColor: "#F9F9F9" }}
    >
      <ScreenAuth
        title="Settings"
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
        back={() => {}}
      >
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => {
                  goTo?.(1);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Image
                    source={ProfileIcon}
                    style={{ width: 35, height: 35 }}
                  />
                  <View>
                    <Text
                      style={{
                        fontFamily: "Excon-Medium",
                        fontSize: 18,
                        color: "black",
                      }}
                    >
                      {data?.firstName}
                    </Text>
                    <Text
                      style={{
                        color: "gray",
                        fontFamily: "Excon-Regular",
                        fontSize: ms(10),
                      }}
                    >
                      View Profile
                    </Text>
                  </View>
                </View>
                <MaterialIcons name="arrow-right" size={40} color="black" />
              </TouchableOpacity>
            </View>

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
              Services
            </Text>
            <SettingItem
              title="Device Management"
              marginTop={vs(0)}
              isIconVisible
              icon={DeviceIcon}
              borderBottomWidth={0}
              onClick={() => {
                router.push("/(main)/Business/Info");
              }}
            />
            <SettingItem
              title="System Setting"
              marginTop={vs(0)}
              borderBottomWidth={0}
              isIconVisible
              icon={systemIcon}
              onClick={() => {
                // goTo?.(1);
              }}
            />
            <SettingItem
              title="About"
              icon={aboutIcon}
              isIconVisible
              marginTop={vs(0)}
              onClick={() => {
                goTo?.(2);
              }}
            />

            <View style={{ marginBottom: vs(30) }}>
              <GlobalLogout key="dsa" marginTop={vs(30)} icon={LogoutIcon} />
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
  card: {
    marginRight: hs(10),
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    width: "94%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === "ios" ? 2 : 2,
  },
});
export default Settings;
