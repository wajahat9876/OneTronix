import CardSvg from '@assets/icons/card/card-vertical.png';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import { Image, View } from 'react-native';
import Animated from 'react-native-reanimated';

const Card = ({ next }: MultiStepFormProps) => {
  const router = useRouter();
  return (
    <Animated.View {...pageTransitionAnimation} key="card" style={{ flex: 1 }}>
      <ScreenAuth
        title="Cards"
        style={{
          backgroundColor: Colors.light.theme.backgroundTopCurveSection,
        }}
        topColor={Colors.light.theme.backgroundTopCurveSection}
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus
        appBarProps={{
          light: true,
          rightIcon: true,
        }}
        back={() => {
          router.replace('/(main)/Business/Home');
        }}
      >
        <View style={styles.container}>
          <Text
            style={{
              ...globalStyle.textSemibold,
              fontSize: ms(19),
              color: Colors.light.text,
              paddingHorizontal: ms(20),
              textAlign: 'center',
            }}
          >
            Order your new Easy E-Money Card!
          </Text>
          <Image
            source={CardSvg}
            style={{
              alignSelf: 'center',
              width: hs(280),
              height: vs(320),
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              ...globalStyle.textSemibold,
              color: Colors.light.text,
              paddingHorizontal: ms(20),
              paddingTop: ms(10),
              textAlign: 'center',
            }}
          >
            The all new Easy E-Money Cards are out! Order your’s now!
          </Text>
          <Text
            style={{
              ...globalStyle.textRegular,
              color: Colors.light.text,
              fontSize: ms(10),
              paddingHorizontal: ms(20),
              textAlign: 'center',
            }}
          >
            This Visa card is issued by Transact Payments Limited. Transact
            Payments Limited is authorised and regulated by the Gibraltar
            Financial Services Commission.
          </Text>
          <Text
            style={{
              ...globalStyle.textRegular,
              color: Colors.light.text,
              fontSize: ms(10),
              paddingHorizontal: ms(20),
              textAlign: 'center',
            }}
          >
            Visa is a trademark owned by Visa International Service Association
            and used under license.
          </Text>
        </View>
        <View style={styles.submitBtn}>
          <Button
            btnTitle="Continue"
            onClick={() => {
              next?.();
            }}
          />
        </View>
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
  submitBtn: {
    paddingVertical: ms(8),
    width: '85%',
    alignSelf: 'center',
  },
});
export default Card;
