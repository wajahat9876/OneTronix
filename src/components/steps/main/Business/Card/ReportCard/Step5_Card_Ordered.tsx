/* eslint-disable camelcase */
import ImgTwoCreditCards from '@assets/images/home/img-two-credit-cards.png';
import EasyEmoneyGradient from '@src/components/globals/BackgroundGradient';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'moti';
import { Image } from 'react-native';

const Step5_Card_Ordered = () => {
  return (
    <>
      <EasyEmoneyGradient />
      <ScreenAuth
        title=""
        style={{
          backgroundColor: 'transparent',
        }}
        topColor="transparent"
        bottomColor="transparent"
        darkStatus={false}
        disableTopSafeArea
        appBarProps={{
          light: false,
        }}
        disableAppBar
        back={() => {}}
      >
        <Text
          style={{
            ...globalStyle.textMedium,
            fontSize: 29,
            marginTop: vs(70),
            marginLeft: hs(16),
            color: Colors.light.theme.white,
          }}
        >
          {`Your Card is on\nits way!`}
        </Text>
        <View style={styles.creditCardImage}>
          <Image source={ImgTwoCreditCards} />
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 17,
              marginTop: vs(32),
              textAlign: 'center',
              color: Colors.light.theme.white,
            }}
          >
            {`Your debit card has been\nsuccessfully ordered.`}
          </Text>
        </View>
        <View style={globalStyle.buttonContinue}>
          <Button btnTitle="Continue" onClick={() => {}} />
        </View>
      </ScreenAuth>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  creditCardImage: {
    width: '100%',
    alignItems: 'center',
    marginTop: vs(24),
  },
});
export default Step5_Card_Ordered;
