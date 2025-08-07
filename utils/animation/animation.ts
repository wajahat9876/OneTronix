/* eslint-disable import/prefer-default-export */
export const animationConfig = {
  from: {
    opacity: 0,
    translateY: -100,
  },
  animate: {
    opacity: 1,
    translateY: 0,
  },
  exit: {
    opacity: 0,
    translateY: -100,
  },
  transition: {
    type: 'timing',
    delay: 100,
    duration: 500,
  },
};
