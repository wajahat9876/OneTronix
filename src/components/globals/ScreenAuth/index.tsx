/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  View,
  View as ViewDef,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppBar from '../AppBar';
import { IScreenAuthProps } from './types';

const ScreenAuth = (props: IScreenAuthProps) => {
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
    () => (Platform.OS === 'android' ? top * 0.9 : top),
    [top],
  );

  if (scroll)
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ScrollView>
          <ViewDef {...rest}>{children}</ViewDef>
        </ScrollView>
      </SafeAreaView>
    );

  return (
    <>
      <StatusBar barStyle={darkStatus ? 'dark-content' : 'light-content'} />
      <ViewDef
        {...rest}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
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

export default ScreenAuth;
