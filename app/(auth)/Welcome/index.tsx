/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import WelcomeTronixLogo from "@assets/eccLogo/WelcomeTronixLogo (1).svg";
import EasyEmoneyGradient from "@src/components/globals/BackgroundGradient";
import Screen from "@src/components/globals/Screen";
import { ms } from "@utils/design/design";
import { useEffect, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
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
  const { width } = useWindowDimensions(); // instead of height
  const x = useSharedValue(0); // renamed from y
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
    x.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    });
  }, [opacity, x]);
  const swipeGesture = Gesture.Pan()
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      if (e.translationX < 0) {
        x.value = e.translationX; // only allow right-to-left swipe
      }
    })
    .onFinalize((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (x.value < -width / 3 || e.velocityX < -500) {
        x.value = withTiming(
          -width,
          { easing: Easing.out(Easing.ease), duration: 300 },
          (isFinished) => {
            if (isFinished) {
              runOnJS(setShowLoginUi)(true);
            }
          }
        );
      } else {
        x.value = withTiming(0, {
          easing: Easing.out(Easing.ease),
          duration: 300,
        });
      }
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateX: x.value, // 👈 changed from translateY
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
      {/* <BackgroundImage src={Image} /> */}
      <EasyEmoneyGradient />

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
                style={[animatedContainerStyle, { flex: 1, width: "100%" }]}
              >
                <View style={{ alignSelf: "flex-end" }}>
                  <WelcomeTronixLogo />
                </View>
                {/* <View
                  style={{
                    marginTop: vs(30),
                    alignSelf: "flex-end",
                    marginRight: vs(20),
                  }}
                >
                  <Logo />
                </View> */}

                <View
                  style={{
                    position: "absolute",
                    bottom: 150,
                    left: 20,
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      // fontWeight: "bold",
                      fontSize: ms(50),
                      lineHeight: 55,
                      fontFamily: "Excon-Medium",
                    }}
                  >
                    ONE
                  </Text>
                  <Text
                    style={{
                      color: "red",
                      fontSize: ms(55),
                      fontFamily: "Excon-Regular",
                      lineHeight: 55,
                      marginTop: -4, // tighten spacing between ONE and TRONIX
                    }}
                  >
                    TRONIX
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontSize: ms(16.5),
                      fontFamily: "Excon-Regular",
                      letterSpacing: 1,
                      lineHeight: 28,
                      marginTop: -5, // small gap from TRONIX
                    }}
                  >
                    TECHNOLOGY PARTNER
                  </Text>
                </View>

                {/* <SwipeUpToLogin /> */}
                <Text
                  style={{
                    color: "white",
                    position: "absolute",
                    bottom: 50,
                    right: 20,
                    fontFamily: "poppins-medium",
                    alignItems: "flex-start",
                    fontSize: ms(16),
                  }}
                >
                  Get Started ➜
                </Text>
              </Animated.View>
            </GestureDetector>
          )}
        </>
      </Screen>
    </>
  );
};

export default Welcome;
