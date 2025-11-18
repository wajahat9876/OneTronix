/* eslint-disable camelcase */
/* eslint-disable import/order */

import { useBusinessDetails } from "@/store/selectors/business/business";
// import IconBottomTabInfo from "@assets/icons/bottom-tabs/home-profile-icon.svg";
// import IconBottomTabSendMoney from "@assets/icons/bottom-tabs/home-transfer-money.svg";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { hs, ms, vs } from "@utils/design/design";
import Home from "app/(main)/Business/Home/index";
// import Info from "app/(main)/Business/Info/index";
import Setting from "app/(main)/Business/Settings/index";
// import TransferMoney from "app/(main)/Business/TransferMoney/index";
import DevicesBlack from "@assets/icons/bottom-tabs/blackDevices.svg";
import HomeBlack from "@assets/icons/bottom-tabs/blackHome.svg";
import ReportBlack from "@assets/icons/bottom-tabs/blackReport.svg";
import SettingBlack from "@assets/icons/bottom-tabs/user.png";
import SettingWhite from "@assets/icons/bottom-tabs/userWhite.png";
import Devices from "@assets/icons/bottom-tabs/whiteDevices.svg";
import HomeWhite from "@assets/icons/bottom-tabs/whiteHome.svg";
import ReportWhite from "@assets/icons/bottom-tabs/whiteReport.svg";
import Info from "app/(main)/Business/Info/index";
import { Redirect } from "expo-router";
import { Image, Platform } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import Transaction from "./Transaction";
// Icons
// const MainStack = createBottomTabNavigator<RootTabParamList>();
const Layout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    auth_token,
    data: businessData,
    isDarkMode,
  } = useAppSelector(useBusinessDetails);
  const Tab = createMaterialBottomTabNavigator();
  const theme = {
    ...(isDarkMode ? MD3DarkTheme : MD3LightTheme),
    fonts: {
      ...(isDarkMode ? MD3DarkTheme : MD3LightTheme).fonts,
      labelLarge: {
        fontSize: ms(12),
        fontFamily: "Excon-Regular",
        marginTop: vs(-3),
      },
      labelMedium: {
        fontSize: ms(12),
        fontFamily: "Excon-Regular",
        marginTop: vs(-3),
      },
      labelSmall: {
        fontSize: ms(12),
        fontFamily: "Excon-Regular",
        marginTop: vs(-3),
      },
    },
  };
  if (!auth_token) {
    return <Redirect href="/(auth)/Welcome" />;
  }

  return (
    <PaperProvider theme={theme}>
      <Tab.Navigator
        initialRouteName="Home"
        barStyle={{
          backgroundColor: isDarkMode ? "#303030" : "#F2F2F2",
          height: vs(85),
          marginBottom: Platform.OS === "ios" ? vs(5) : vs(0),
        }}
        activeIndicatorStyle={{
          height: vs(6),
          width: ms(30),
          borderRadius: ms(20),
          backgroundColor: "#ff0000",
          shadowColor: "#ff0000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 8,
          elevation: 10,
          borderWidth: Platform.OS === "android" ? 2 : 0,
          borderColor: "rgba(255, 0, 0, 0.4)",
          bottom: vs(-32),
          position: "absolute",
        }}
        activeColor={isDarkMode ? "white" : "black"}
        screenOptions={{
          tabBarColor: isDarkMode ? "black" : Colors.light.theme.white,
        }}
        inactiveColor={isDarkMode ? "white" : "black"}
        keyboardHidesNavigationBar={false}
        shifting={false}
        sceneAnimationEnabled={false}
        sceneAnimationType="shifting"
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: () => (isDarkMode ? <HomeWhite /> : <HomeBlack />),
          }}
        />
        <Tab.Screen
          name="Report"
          component={Transaction}
          options={{
            tabBarIcon: () => (isDarkMode ? <ReportWhite /> : <ReportBlack />),
          }}
        />
        <Tab.Screen
          name="Info"
          component={Info}
          options={{
            tabBarLabel: "Devices",
            tabBarIcon: () => (isDarkMode ? <Devices /> : <DevicesBlack />),
          }}
        />

        {/* <Tab.Screen
        name="TransferMoney"
        component={TransferMoney}
        options={{
          tabBarIcon: () => <IconBottomTabSendMoney />,
          tabBarLabel: "",
        }}
      />

      <Tab.Screen
        name="Info"
        component={Info}
        options={{
          tabBarIcon: () => <IconBottomTabInfo />,
        }}
      /> */}

        <Tab.Screen
          name="Settings"
          component={Setting}
          options={{
            tabBarLabel: "Menu",
            tabBarIcon: () =>
              isDarkMode ? (
                <Image
                  source={SettingWhite}
                  style={{ width: hs(25), height: vs(30) }}
                />
              ) : (
                <Image
                  source={SettingBlack}
                  style={{ width: hs(25), height: vs(30) }}
                />
              ),
          }}
        />
      </Tab.Navigator>
    </PaperProvider>
  );
};

export default Layout;

// const styles = StyleSheet.create({
//   iconSquare: {
//     width: getRespValue(35),
//     height: getRespValue(35),
//   },
//   iconHorizontal: {
//     width: getRespValue(45),
//     height: getRespValue(45),
//   },
//   tabBarStyle: {
//     backgroundColor: Colors.light.background,
//     height: hp('11%'),
//     paddingTop: hp('2%'),
//     paddingBottom: Platform.OS === 'ios' ? hp('3.5%') : hp('2%'),
//   },
//   tabBarLabelStyle: {
//     fontSize: getRespValue(13),
//     fontFamily: 'aeonik',
//   },
// });
