/* eslint-disable react/jsx-props-no-spreading */

import { useMemo } from "react";
import { Platform, ScrollView, View, View as ViewDef } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppBar from "../AppBar";
import { IScreenProps } from "./types";

const Screen = (props: IScreenProps) => {
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
      <SafeAreaView edges={Platform.OS === "android" ? [] : ["top", "bottom"]}>
        <ScrollView>
          <ViewDef {...rest}>{children}</ViewDef>
        </ScrollView>
      </SafeAreaView>
    );

  return (
    <>
      {/* <StatusBar barStyle={darkStatus ? "dark-content" : "light-content"} /> */}

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
        {!disableAppBar && (
          <AppBar
            {...appBarProps}
            title={title}
            back={back}
            label={label}
            onPress={onPress}
          />
        )}
        {children}

        {!disableBottomSafeArea && (
          <View style={{ height: bottom, backgroundColor: bottomColor }} />
        )}
      </ViewDef>
    </>
  );
};

// Screen.defaultProps = {
//   scroll: false,
//   topColor: '#000',
//   bottomColor: '#000',
//   darkStatus: false,
// };

export default Screen;
