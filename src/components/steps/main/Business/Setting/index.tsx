import { useBusinessDetails } from "@/store/selectors/business/business";
import SettingItem from "@src/components/commons/main/settings_stack/SettingItem";
import GlobalLogout from "@src/components/globals/BuisnessLogoutModal";
import { StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
// import { globalStyle } from '@src/styles/globals';
import aboutIcon from "@assets/icons/MenuIcons/about.png";
import DeviceIcon from "@assets/icons/MenuIcons/device.png";
import LogoutIcon from "@assets/icons/MenuIcons/logout.png";
import ProfileIcon from "@assets/icons/MenuIcons/profile.png";
import systemIcon from "@assets/icons/MenuIcons/systemsetting.png";
import HeaderMain from "@src/components/globals/HeaderMain";
import { hs, ms, vs } from "@utils/design/design";
import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

import BackgroundImage from "@assets/icons/settingBackground.png";
const Settings = ({ goTo }: MultiStepFormProps) => {
  const { data } = useAppSelector(useBusinessDetails);

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1, backgroundColor: "white" }} //#F9F9F9
    >
      <View
        style={{
          width: "100%",
          height: "40%", // adjust as needed
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          overflow: "hidden",
          position: "absolute",
          top: 0,
        }}
      >
        <ImageBackground
          source={BackgroundImage}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      </View>
      <HeaderMain
        title=""
        style={{
          backgroundColor: "transparent",
        }}
        isNotDefaultMode={true}
        topColor=""
        bottomColor={"transparent"}
        darkStatus={false}
        disableTopSafeArea
        appBarProps={{
          light: true,
        }}
        // disableAppBar
        back={() => {}}
      >
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => {
              // goTo?.(1);
            }}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Image source={ProfileIcon} style={{ width: 55, height: 55 }} />
              <View>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: "Ranade-Medium",
                    fontSize: ms(24),
                    color: "white",
                    marginTop: vs(5),
                  }}
                >
                  {data?.firstName}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: "gray",
                    fontFamily: "Ranade-Medium",
                    fontSize: ms(13),
                  }}
                >
                  {data?.email}
                </Text>
              </View>
            </View>
            {/* <AntDesign
              name="right"
              size={20}
              color="gray"
              style={{ marginRight: -10, marginTop: vs(30) }}
            /> */}
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <ScrollView>
            <Text
              allowFontScaling={false}
              style={[styles.txt, { marginTop: vs(15) }]}
            >
              Services
            </Text>
            <SettingItem
              title="Device Management"
              marginTop={vs(10)}
              isIconVisible
              icon={DeviceIcon}
              borderBottomWidth={0}
              onClick={() => {
                router.push("/(main)/Business/Info");
              }}
            />
            <SettingItem
              title="System Setting"
              marginTop={vs(15)}
              borderBottomWidth={0}
              isIconVisible
              icon={systemIcon}
              onClick={() => {
                goTo?.(3);
              }}
            />
            <SettingItem
              title="About"
              icon={aboutIcon}
              isIconVisible
              marginTop={vs(15)}
              onClick={() => {
                goTo?.(2);
              }}
            />
            <Text style={[styles.txt, { marginTop: vs(20) }]}>Other</Text>
            <View style={{ alignSelf: "center", marginBottom: vs(30) }}>
              <GlobalLogout key="dsa" marginTop={vs(10)} icon={LogoutIcon} />
            </View>
          </ScrollView>
        </View>
      </HeaderMain>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: hs(16),
    marginTop: vs(200),
  },
  txt: {
    fontFamily: "Excon-Medium",
    fontSize: ms(14),
    padding: 5,
    paddingHorizontal: hs(10),
    color: "black",
  },
  card: {
    position: "absolute",
    top: Platform.OS === "ios" ? "25%" : "28%", // card sits inside the image like your design
    alignSelf: "center",
    backgroundColor: "transparent",
    borderRadius: 15,
    padding: 20,
    width: "99%",
  },
});
export default Settings;
