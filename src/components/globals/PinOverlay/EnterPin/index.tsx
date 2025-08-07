import Logo from '@assets/images/app-logo.svg';
import { SafeAreaView, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { vs } from '@utils/design/design';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import EasyEmoneyGradient from '../../BackgroundGradient';
import ButtonsGrid from '../../GridButtons';
import OTP from '../../OTP';

const EnterPin = () => {
  const [input, updateInput] = useState<string>('');

  const reset = useCallback(() => {
    updateInput('');
  }, []);
  return (
    <Portal>
      <>
        <EasyEmoneyGradient />
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
          <SafeAreaView style={styles.container}>
            <View style={styles.logo}>
              <Logo />
              <Text
                style={{ fontSize: 16, marginTop: vs(36) }}
                className="text-white font-poppins"
              >
                Please enter you pin code
              </Text>
            </View>

            <Animated.View className="justify-center items-center">
              <OTP
                inputTextColor={Colors.light.theme.white}
                code={input}
                pinCount={4}
                width={70}
                editable={false}
                secureTextEntry
                boxColor={Colors.light.theme.textInputBackgroundDark}
                onCodeFilled={() => {}}
              />
            </Animated.View>
            <View
              style={[
                globalStyle.keyboard,
                { backgroundColor: Colors.light.theme.textInputBackgroundDark },
              ]}
            >
              <ButtonsGrid
                keyboardButtonsColor={Colors.light.theme.white}
                maxInputLength={4}
                input={input}
                onUpdate={updateInput}
                onBackspace={updateInput}
                onReset={reset}
                onMaxReached={() => {}}
              />
            </View>
          </SafeAreaView>
        </Animated.View>
      </>
    </Portal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    marginTop: vs(75),
    alignItems: 'center',
  },
});
export default EnterPin;
