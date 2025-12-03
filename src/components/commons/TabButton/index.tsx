/* eslint-disable no-unused-expressions */
import { hs, ms, vs } from "@utils/design/design";
import { FC, useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TabButtonsProps } from "./types";

const TabButtons: FC<TabButtonsProps> = ({
  disableRadious,
  hideMarginLeft,
  hideMarginRight,
  buttons,
  selectedTab,
  setSelectedTab,
  currentActive,
  isWhite,
  onPress,
  disabled,
}) => {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / buttons.length;
  // const padding = 0;
  // this will keep track of the translationX value of our moving tab
  const tabPositionX = useSharedValue(0);
  // on view layout, we measure the width and height and
  // set in state so we know how far to move the tab
  useEffect(() => {
    if (currentActive !== undefined) {
      tabPositionX.value = withTiming(buttonWidth * currentActive);
      setSelectedTab(currentActive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActive, buttonWidth]);
  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  // We can set a callback for any functionality that should fire once the animation is finished
  const handlePressCb = (index: number) => {
    setSelectedTab(index);
  };

  const onTabPress = (index: number) => {
    // animate the tab and fire callback
    tabPositionX.value = withTiming(buttonWidth * index, {}, () => {
      runOnJS(handlePressCb)(index);
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    // apply animated value to the style, moving the tab
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View
      // accessibilityRole="tabbar"
      style={{
        backgroundColor: isWhite ? "white" : "#F5F4F4",
        marginLeft: hideMarginLeft ? hs(0) : hs(42),
        marginRight: hideMarginRight ? hs(0) : hs(42),
        justifyContent: "center",
        borderRadius: disableRadious ? ms(0) : ms(8),
        // height: vs(50),
      }}
    >
      <Animated.View
        className="rounded-xl absolute"
        style={[
          animatedStyle,
          {
            height: dimensions.height,
            width: buttonWidth,
            backgroundColor: "#030302",
            opacity: 0.8,
          },
        ]}
      />
      <View onLayout={onTabbarLayout} className="flex-row">
        {buttons.map((button, index) => {
          const color = selectedTab === index ? "white" : "black";
          const colorWhite = selectedTab === index ? "black" : "gray";
          return (
            <Pressable
              disabled={disabled}
              key={button.title}
              className="flex-1"
              accessibilityRole="tab"
              style={{ paddingVertical: vs(10) }}
              accessibilityLabel={button.accessibilityLabel}
              onPress={() => {
                onTabPress(index);
                onPress && onPress();
              }}
            >
              <Text
                allowFontScaling={false}
                style={{
                  color: isWhite ? colorWhite : color,
                  fontSize: ms(14),
                  fontFamily: "poppins-medium",
                  alignSelf: "center",
                }}
              >
                {button.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default TabButtons;
