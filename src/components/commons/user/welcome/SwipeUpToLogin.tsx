import ArrowSwipeUp from '@assets/icons/on-boarding/icon-arrow-up.svg';
import { View } from 'moti';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const SwipeUpToLogin = () => {
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withRepeat(
          withSequence(
            withTiming(-15, { duration: 300 }),
            withDelay(1500, withTiming(0, { duration: 1000 })),
            withTiming(-15),
          ),
          -1,
        ),
      },
    ],
    opacity: withRepeat(
      withSequence(
        withDelay(1500, withTiming(1)),
        withDelay(3000, withTiming(1)),
      ),
      -1,
    ),
  }));
  return (
    <Animated.View
      style={animatedStyles}
      className="items-center self-center mb-4"
    >
      <View className="bg-[#29292980] p-4 rounded-full">
        <ArrowSwipeUp />
      </View>
      <Text
        style={{ fontSize: 15 }}
        className="mt-4 font-poppins-medium text-[#DDDDDD]"
      >
        Swipe up to Log In
      </Text>
    </Animated.View>
  );
};

export default SwipeUpToLogin;
