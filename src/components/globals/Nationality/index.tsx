import ImgFlagUK from '@assets/images/signup/user/img-uk-flag.png';
import { StyleSheet, Text } from '@src/components/libraries';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { Image, View } from 'react-native';

const Nationality = () => {
  return (
    <View style={styles.countryContainer}>
      <View style={styles.inputRow} className="mb-1">
        <Image
          source={ImgFlagUK}
          style={{
            width: hs(30),
            height: vs(25),
          }}
        />

        <View
          style={{
            marginLeft: hs(8),
            height: vs(25),
            backgroundColor: '#00000072',
            width: 1.5,
          }}
        />

        <Text
          style={{
            ...globalStyle.textRegular,
            marginTop: vs(0),
            marginLeft: hs(8),
            alignSelf: 'center',
          }}
        >
          United Kingdom
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  countryContainer: {
    borderBottomColor: '#00000047',
    borderBottomWidth: 1.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'flex-end',
    opacity: 0.7,
  },
});
export default Nationality;
