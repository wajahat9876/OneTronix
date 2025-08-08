/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import Logo from "@assets/eccLogo/ecc 1.svg";
import Image from "@assets/images/BackgroundImage/Background.png";
import SwipeUpToLogin from "@src/components/commons/user/welcome/SwipeUpToLogin";
import BackgroundImage from "@src/components/globals/BackgroundImage";
import Screen from "@src/components/globals/Screen";
import { vs } from "@utils/design/design";
import React, { useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Signin from "../Signin";

const Welcome = () => {
  const { height } = useWindowDimensions();
  const y = useSharedValue(0);
  const [showLoginUI, setShowLoginUi] = useState<boolean>(false);

  // const handleBackArrowClick = () => {
  //   y.value = withTiming(
  //     0,
  //     { easing: Easing.out(Easing.linear), duration: 100 },
  //     isFinished => {
  //       if (isFinished) {
  //         runOnJS(setShowLoginUi)(false);
  //       }
  //     },
  //   );
  // };
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
        y.value = withTiming(
          -height,
          { easing: Easing.linear },
          (isFinished) => {
            if (isFinished) {
              runOnJS(setShowLoginUi)(true);
            }
          }
        );
      } else {
        y.value = withTiming(0, { easing: Easing.linear }, (isFinished) => {
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

  return (
    <>
      <BackgroundImage src={Image} />
      {/* <EasyEmoneyGradient /> */}
      <Screen
        topColor="transparent"
        bottomColor="transparent"
        darkStatus={false}
        disableAppBar
      >
        <>
          {showLoginUI && <Signin />}
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
        </>
      </Screen>
    </>
  );
};

export default Welcome;
