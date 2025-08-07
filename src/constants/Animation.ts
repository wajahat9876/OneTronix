/* eslint-disable import/prefer-default-export */
import {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';

export const pageTransitionAnimationFn = (duration = 500, delay = 300) => {
  return {
    entering: FadeInDown.duration(duration).delay(delay),
    exiting: FadeOutDown.duration(duration),
    layout: LinearTransition,
  };
};

export const pageTransitionAnimation = pageTransitionAnimationFn();
