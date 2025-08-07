/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
import CheckIcon from '@assets/icons/on-boarding/icon-check.svg';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedTickProps {
//   size?: number; // Size of the tick icon
//   color?: string; // Color of the tick icon
  delay?: number; // Animation delay
  duration?: number; // Animation duration
}

const AnimatedTick: React.FC<AnimatedTickProps> = ({

  delay = 500,
  duration = 800,
}) => {
  const tickScale = useSharedValue(0);

  useEffect(() => {
    tickScale.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.exp),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, duration]);

  const tickStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tickScale.value }],
    opacity: tickScale.value,
  }));

  return (
    <Animated.View style={[styles.container, tickStyle]}>
      <CheckIcon />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedTick;
