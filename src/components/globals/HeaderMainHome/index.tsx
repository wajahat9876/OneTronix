/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  View,
  View as ViewDef,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { IScreenAuthProps } from "../ScreenAuth/types";
import GlobalHeader from "./HeaderHome";

const HeaderMain = (props: IScreenAuthProps) => {
  const {
    scroll,
    title,
    className,
    children,
    topColor,
    bottomColor,
    style,
    appBarProps,
    disableBottomSafeArea,
    disableTopSafeArea,
    disableAppBar,
    darkStatus,
    backColorLight,
    back,
    onPress,
    label,
    ...rest
  } = props;

  const { top, bottom } = useSafeAreaInsets();

  const paddingTop = useMemo(
    () => (Platform.OS === "android" ? top * 0.9 : top),
    [top]
  );

  if (scroll)
    return (
      <SafeAreaView
        edges={Platform.OS === "android" ? ["top"] : ["top", "bottom"]}
      >
        <ScrollView>
          <ViewDef {...rest}>{children}</ViewDef>
        </ScrollView>
      </SafeAreaView>
    );

  return (
    <>
      <StatusBar barStyle={darkStatus ? "dark-content" : "light-content"} />
      <ViewDef
        {...rest}
        style={{
          flex: 1,

          backgroundColor: "transparent",
          ...(style as object),
        }}
        className={`flex-1 ${className}`}
      >
        {!disableTopSafeArea && (
          <View style={{ height: paddingTop, backgroundColor: topColor }} />
        )}
        {!disableAppBar && <GlobalHeader backColorLight={backColorLight} />}
        {children}

        {!disableBottomSafeArea && (
          <View style={{ height: bottom, backgroundColor: bottomColor }} />
        )}
      </ViewDef>
    </>
  );
};

// ScreenAuth.defaultProps = {
//   scroll: false,
//   topColor: '#000',
//   bottomColor: '#000',
//   whiteScan: false,
//   appBarProps: {
//     light: false,
//     rightIcon: false,
//   },
//   disableBottomSafeArea: false,
//   disableTopSafeArea: false,
//   disableAppBar: false,
//   newScreenAuth: false,
//   darkStatus: false,
//   title: '',
//   label: '',
//   titleColor: Colors.light.theme.white,
//   backIcon: <ArrowBack />,
//   onPress: () => null,
// };

export default HeaderMain;
