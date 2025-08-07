import CreatePin from '@src/components/globals/PinOverlay/CreatePin';
import { useState } from 'react';
import { Portal } from 'react-native-paper';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import EnterPin from './EnterPin';

const PinCodeOverlay = () => {
  const [user] = useState<boolean>(false); // mock user state for testing only

  if (user) {
    return (
      <Portal>
        <Animated.View
          entering={FadeInUp.duration(300).delay(500)}
          exiting={FadeOutDown.duration(300)}
          layout={LinearTransition}
          key="enter-pin"
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          <CreatePin />
        </Animated.View>
      </Portal>
    );
  }
  return <EnterPin />;
};

export default PinCodeOverlay;
