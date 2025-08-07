/* eslint-disable import/order */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
import { setIsNetworkConnected } from '@/store/slices/common/signInTypeSlice';
import WifiOff from '@assets/icons/wifi-no-signal.png';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '@src/hooks/useReduxHooks';
import { getRespValue } from '@utils/getRespValue';
import { BlurView } from 'expo-blur';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect } from 'react';
import {
  BackHandler,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Portal } from 'react-native-paper';

const CheckNetwork = () => {
  const [visible, setVisible] = React.useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, [visible]);
  useEffect(() => {
    const unsubscribe = NetInfo?.addEventListener(state => {
      if (!state?.isConnected && !state?.isInternetReachable) {
        // if (false) {
        Keyboard.dismiss();
        setVisible(true);
        dispatch(setIsNetworkConnected(false));
      } else {
        dispatch(setIsNetworkConnected(true));
        setVisible(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  // variables

  // renders

  return (
    <Portal>
      <AnimatePresence exitBeforeEnter>
        {visible && (
          <MotiView
            key="loader"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
          >
            <View style={{ justifyContent: 'flex-end', flex: 1 }}>
              <BlurView
                tint="dark"
                intensity={60}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={{
                  backgroundColor:
                    Platform.OS === 'ios' ? 'transparent' : 'white',
                  height: '60%',
                  width: '100%',
                }}
              >
                <BlurView
                  tint="light"
                  intensity={90}
                  style={StyleSheet.absoluteFill}
                />
                <View className="flex-1 justify-center items-center gap-y-5 ">
                  <Image
                    source={WifiOff}
                    style={{
                      width: getRespValue(200),
                      height: getRespValue(200),
                    }}
                  />
                  <Text
                    className="font-aeonik-bold text-[#000F6D]"
                    style={{
                      fontSize: getRespValue(30),
                      textAlign: 'center',
                    }}
                  >
                    No internet connection
                  </Text>
                  <Text
                    className="font-aeonik text-[#000F6D]"
                    style={{
                      fontSize: getRespValue(15),
                      width: '80%',
                      textAlign: 'center',
                    }}
                  >
                    Sorry! you need an active internet connection to access.
                  </Text>
                </View>
              </View>
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </Portal>
  );
};

// CheckNetwork.defaultProps = {
//   title: '',
//   type: 'button',
//   inputProps: {},
//   buttonProps: {},
//   isKeyboardOpen: false,
// };

export default CheckNetwork;
