/* eslint-disable react-hooks/exhaustive-deps */
import { useFocusEffect } from '@react-navigation/native';
import {
  Blur,
  BlurMask,
  Canvas,
  Circle,
  Group,
} from '@shopify/react-native-skia';
import { ms } from '@utils/design/design';
import { useCallback } from 'react';

import { useWindowDimensions } from 'react-native';
import {
  Easing,
  runOnUI,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const EasyEmoneyGradient = () => {
  const { width, height } = useWindowDimensions();

  // const leftColor = useSharedValue(0);
  // const rightColor = useSharedValue(endingColor);

  // useEffect(() => {
  //   animateGradient();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const translateX = useSharedValue(width);
  const translateYellowX = useSharedValue(0);

  const translateY = useSharedValue(100);
  const translateYellowY = useSharedValue(400);

  const translateBlueY = useSharedValue(20);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const animateGradient = () => {
  //   translateX.value = withRepeat(withTiming(0, { duration: 8000 }), -1, true);
  //   translateYellowX.value = withRepeat(
  //     withTiming(width, { duration: 8000 }),
  //     -1,
  //     true,
  //   );
  //   translateY.value = withRepeat(
  //     withTiming(400, { duration: 8000 }),
  //     -1,
  //     true,
  //   );
  //   translateYellowY.value = withRepeat(
  //     withTiming(100, { duration: 8000 }),
  //     -1,
  //     true,
  //   );
  //   translateBlueY.value = withRepeat(
  //     withTiming(height - 20, { duration: 8000 }),
  //     -1,
  //     true,
  //   );
  // };
  useFocusEffect(
    useCallback(() => {
      runOnUI(animateGradient)();

      return () => {
        translateX.value = 0;
        translateYellowX.value = 0;
        translateY.value = 0;
        translateYellowY.value = 0;
        translateBlueY.value = 0;
      };
    }, []),
  );
  const animateGradient = useCallback(() => {
    'worklet';

    // Indicates this is a worklet function
    translateX.value = withRepeat(
      withTiming(0, { duration: 8000, easing: Easing.linear }),
      -1,
      true,
    );
    translateYellowX.value = withRepeat(
      withTiming(width, { duration: 8000 }),
      -1,
      true,
    );
    translateY.value = withRepeat(
      withTiming(400, { duration: 8000 }),
      -1,
      true,
    );
    translateYellowY.value = withRepeat(
      withTiming(100, { duration: 8000 }),
      -1,
      true,
    );
    translateBlueY.value = withRepeat(
      withTiming(height - 20, { duration: 8000 }),
      -1,
      true,
    );
  }, []);
  return (
    <Canvas
      style={{
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundColor: 'black',
      }}
    >
      <Group>
        <BlurMask blur={90} />
        <Circle
          r={50}
          cx={translateYellowX}
          cy={translateYellowY}
          color="#FFD45C"
        />
        <Circle r={100} cx={width / 2} cy={translateBlueY} color="#000F6C" />
        <Circle r={60} cx={translateX} cy={ms(650)} color="#B088F9" />
        <Circle r={50} cx={translateX} cy={ms(850)} color="#15569C" />
      </Group>
      <Blur blur={50} />
    </Canvas>
  );
};

export default EasyEmoneyGradient;
