/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
import { useLazyGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import CardSvg from '@assets/icons/card/card-vertical.png';
import Logo from '@assets/images/app-logo.svg';
import EasyEmoneyGradient from '@src/components/globals/BackgroundGradient';
import Button from '@src/components/globals/Button';
import { StyleSheet, Text } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, View } from 'react-native';
import Animated from 'react-native-reanimated';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OrderedSucess = () => {
  const [trigger, { isFetching }] = useLazyGetCurrentBusinessQuery();
  const router = useRouter();
  const handleNext = async () => {
    await trigger().unwrap();
    // router.push('/(main)/Business/Home');
  };
  return (
    <>
      <EasyEmoneyGradient />
      <Animated.View
        {...pageTransitionAnimation}
        key="card"
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View
            style={{
              height: vs(200),
              paddingTop: ms(10),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Logo width="50%" height="50%" />
          </View>
          <Text
            style={{
              ...globalStyle.textBold,
              fontSize: ms(30),
              color: Colors.light.theme.white,
              paddingHorizontal: ms(20),
            }}
          >
            Your Card is on its way!
          </Text>
          <View
            style={{
              height: vs(300),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={CardSvg}
              style={{
                width: hs(220),
                height: vs(250),
              }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              ...globalStyle.textRegular,
              color: Colors.light.theme.white,
              paddingHorizontal: ms(20),
              paddingTop: ms(20),
            }}
          >
            Your debit card has been successfully ordered.
          </Text>
        </View>
        <View style={styles.submitBtn}>
          <Button
            btnTitle="Continue"
            loading={isFetching}
            onClick={() => {
              handleNext();
            }}
          />
        </View>
      </Animated.View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  submitBtn: {
    paddingVertical: ms(8),
    paddingBottom: ms(20),
    width: '85%',
    alignSelf: 'center',
  },
});
export default OrderedSucess;
