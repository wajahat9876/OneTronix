/* eslint-disable import/order */
/* eslint-disable camelcase */

import { useVerifyBusinessPinMutation } from '@/store/api/business/authApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import { setIsPinCodeAccepted } from '@/store/slices/common/signInTypeSlice';
import Logo from '@assets/eccLogo/ecc 1.svg';
import Image from '@assets/images/BackgroundImage/Background.png';
import SwipeUpToLogin from '@src/components/commons/user/welcome/SwipeUpToLogin';
import BackgroundImage from '@src/components/globals/BackgroundImage';
import ButtonsGrid from '@src/components/globals/GridButtons';
import LoadingModal from '@src/components/globals/LoadingModal';
import OTP from '@src/components/globals/OTP';
import Screen from '@src/components/globals/Screen';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { useAppDispatch, useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { kycStyles } from '@src/styles/KYC';
import { vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const VerifyPasscode = () => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { height } = useWindowDimensions();
  const y = useSharedValue(0);
  const [showLoginUI, setShowLoginUi] = useState<boolean>(false);
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 1000, // Animation duration for entrance
      easing: Easing.out(Easing.ease),
    });
    y.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    });
  }, [opacity, y]);
  const swipeGesture = Gesture.Pan()
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      y.value = e.translationY;
    })
    .onFinalize((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (y.value < -height / 2 || e.velocityY < -500) {
        y.value = withTiming(-height, { easing: Easing.linear }, isFinished => {
          if (isFinished) {
            runOnJS(setShowLoginUi)(true);
          }
        });
      } else {
        y.value = withTiming(0, { easing: Easing.linear }, isFinished => {
          if (isFinished) {
            runOnJS(setShowLoginUi)(false);
          }
        });
      }
    });
  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateY: y.value, // Just use the current value
      },
    ],
  }));
  // const animatedContainerStyle = useAnimatedStyle(() => ({
  //   opacity: opacity.value,
  //   transform: [
  //     {
  //       translateY: withTiming(y.value, {
  //         duration: 50,
  //         easing: Easing.linear,
  //       }),
  //     },
  //   ],
  // }));
  const [input, updateInput] = useState<string>('');

  const [verifyBusinessPasscode, { isLoading: businessLoading }] =
    useVerifyBusinessPinMutation();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();
  const reset = useCallback(() => {
    updateInput('');
    setHasSubmitted(false);
  }, []);
  const dispatch = useAppDispatch();

  const { handleBusinessLogout } = useBusinessLogout();

  const handleBusinessSubmit = async (pin: string) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    try {
      const res = await verifyBusinessPasscode({
        pin,
      }).unwrap();
      dispatch(setIsPinCodeAccepted(true));
      router.replace('/(main)/Business/Home');
      renderToastSuccess(res?.message || 'Confirm Successfully');
      updateInput('');
    } catch (error: any) {
      renderToastError(error?.data?.message || 'PassCode Failed');
      if (
        error?.data?.message === 'Session Expired' ||
        error?.data?.message === 'Please provide you auth token' ||
        error?.data?.message === 'Token is Required'
      ) {
        router.replace('/(auth)/Welcome');
        handleBusinessLogout();
      }
      updateInput('');
      setHasSubmitted(false);
    }
  };
  const handleBiometricSuccess = () => {
    dispatch(setIsPinCodeAccepted(true));
    router.replace('/(main)/Business/Home');
  };
  useEffect(() => {
    if (input.length === 4 && !hasSubmitted) {
      handleBusinessSubmit(input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, hasSubmitted]);

  const handleLogout = () => {
    handleBusinessLogout();
  };
  useEffect(() => {
    if (!auth_token) {
      router.replace('/(auth)/Welcome');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth_token]);
  return (
    <>
      <BackgroundImage src={Image} />
      <Screen
        topColor="transparent"
        bottomColor="transparent"
        darkStatus={false}
        disableAppBar
      >
        {showLoginUI && (
          <ScreenAuth
            title="Verify Pin"
            style={{
              backgroundColor: 'transparent',
            }}
            topColor="transparent"
            bottomColor="transparent"
            appBarProps={{
              light: false,
            }}
            back={() => {
              handleLogout();
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[kycStyles.heading, { color: 'white' }]}>
                Enter Pin Code
              </Text>
              <Text style={[kycStyles.subHeading, { color: 'white' }]}>
                Please confirm your chosen 4-digit PIN for account security.
              </Text>

              <View className="justify-center items-center mt-4">
                <OTP
                  inputTextColor={Colors.light.theme.white}
                  pinCount={4}
                  code={input}
                  width={70}
                  editable={false}
                  secureTextEntry
                  boxColor={Colors.light.theme.textInputBackgroundDark}
                  onCodeFilled={() => {}}
                />
              </View>

              <View
                style={[
                  globalStyle.keyboard,
                  {
                    backgroundColor: Colors.light.theme.textInputBackgroundDark,
                  },
                ]}
              >
                <ButtonsGrid
                  maxInputLength={4}
                  input={input}
                  keyboardButtonsColor="white"
                  onUpdate={updateInput}
                  onBackspace={updateInput}
                  onReset={reset}
                  showBiometric
                  onBiometricSuccess={handleBiometricSuccess}
                  // onMaxReached={pin => {
                  //   handleSubmit(pin);
                  // }}
                />
              </View>
            </View>
          </ScreenAuth>
        )}
        {!showLoginUI && (
          <GestureDetector gesture={swipeGesture}>
            <Animated.View
              style={[animatedContainerStyle]}
              className="flex-1 justify-between items-center w-full"
            >
              <View style={{ marginTop: vs(100) }}>
                <Logo />
              </View>

              <SwipeUpToLogin />
            </Animated.View>
          </GestureDetector>
        )}

        <LoadingModal isLoading={businessLoading} />
      </Screen>
    </>
  );
};

export default VerifyPasscode;
