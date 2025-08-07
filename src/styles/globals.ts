/* eslint-disable import/prefer-default-export */
import Colors from '@src/constants/Colors';
import { hs, ms, vs } from '@utils/design/design';
import { StyleSheet } from 'react-native';

export const globalStyle = StyleSheet.create({
  mainBlackBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1E1E',
    // position: 'absolute',
  },
  mainWhiteBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    backgroundColor: '#FAF9F6',
    // position: 'absolute',
  },
  mainTopCurvedCard: {
    flex: 1,
    marginTop: vs(20),
    paddingLeft: hs(16),
    paddingRight: hs(16),
    paddingTop: vs(16),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
  authTopCurvedCard: {
    flex: 1,
    marginTop: vs(20),
    paddingLeft: hs(16),
    paddingRight: hs(16),
    paddingTop: vs(16),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    backgroundColor: Colors.light.theme.white,
  },
  whiteRoundedCard: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: ms(16),
    shadowRadius: ms(16),
    shadowColor: '#394779',
    shadowOffset: { width: ms(2), height: ms(2) },
    shadowOpacity: 0.05,
    padding: ms(16),
    marginTop: vs(20),
    marginLeft: hs(16),
    marginRight: hs(16),
  },
  keyboard: {
    height: '50%',
    marginTop: ms(12),
    marginLeft: ms(16),
    marginRight: ms(16),
    borderRadius: ms(16),
  },
  textMedium: {
    fontSize: 20,
    fontFamily: 'poppins-medium',
  },
  textRegular: {
    fontSize: 14,
    fontFamily: 'poppins',
  },
  textRegularSmall: { fontSize: ms(12), fontFamily: 'poppins' },
  textSemibold: {
    fontSize: 16,
    fontFamily: 'poppins-semibold',
  },
  textBold: {
    fontSize: 16,
    fontFamily: 'poppins-bold',
  },
  buttonContinue: {
    bottom: vs(32),
    left: hs(24),
    right: hs(24),
    position: 'absolute',
  },
});
