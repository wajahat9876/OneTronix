/* eslint-disable camelcase */
/* eslint-disable import/order */

import { useBusinessDetails } from "@/store/selectors/business/business";
import IconBottomTabCard from "@assets/icons/bottom-tabs/home-payment-card-icon.svg";
// import IconBottomTabInfo from "@assets/icons/bottom-tabs/home-profile-icon.svg";
import IconBottomTabSettings from "@assets/icons/bottom-tabs/home-setting-icon.svg";
// import IconBottomTabSendMoney from "@assets/icons/bottom-tabs/home-transfer-money.svg";
import IconBottomTabHome from "@assets/icons/bottom-tabs/homepage-home-icon.svg";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { ms, vs } from "@utils/design/design";
import Home from "app/(main)/Business/Home/index";
// import Info from "app/(main)/Business/Info/index";
import Setting from "app/(main)/Business/Settings/index";
// import TransferMoney from "app/(main)/Business/TransferMoney/index";
import { Redirect } from "expo-router";
import Transaction from "./Transaction";
// Icons
// const MainStack = createBottomTabNavigator<RootTabParamList>();
const Layout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { auth_token, data: businessData } = useAppSelector(useBusinessDetails);
  if (!auth_token) {
    return <Redirect href="/(auth)/Welcome" />;
  }
  // if (auth_token && !businessData?.isPinSet) {
  //   return <Redirect href="/(auth)/ChoosePin/Business" />;
  // }
  // if (!user?.data?.email) return <Redirect href="/(auth)/Welcome/" />;
  const Tab = createMaterialBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      barStyle={{
        backgroundColor: Colors.light.theme.white,
        height: vs(80),
      }}
      activeIndicatorStyle={{
        borderRadius: ms(0),
        marginBottom: vs(20),
        borderTopWidth: 3,
        borderColor: "black",
      }}
      screenOptions={{
        tabBarColor: Colors.light.theme.white,
      }}
      keyboardHidesNavigationBar={false}
      shifting
      sceneAnimationEnabled
      sceneAnimationType="shifting"
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => <IconBottomTabHome />,
        }}
      />

      <Tab.Screen
        name="Report"
        component={Transaction}
        options={{
          tabBarIcon: () => <IconBottomTabCard />,
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
          tabBarIcon: () => <IconBottomTabSettings />,
        }}
      />
    </Tab.Navigator>
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
