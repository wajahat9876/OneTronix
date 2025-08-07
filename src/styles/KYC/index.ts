/* eslint-disable import/prefer-default-export */
import { hs, vs } from '@utils/design/design';
import { StyleSheet } from 'react-native';

export const kycStyles = StyleSheet.create({
  heading: {
    marginTop: vs(15),
    marginBottom: vs(8),
    marginLeft: hs(16),
    fontSize: 20,
    fontFamily: 'poppins-medium',
  },
  subHeading: {
    fontSize: 14,
    fontFamily: 'poppins',
    marginLeft: hs(16),
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vs(56),
  },
  button: {
    position: 'absolute',
    bottom: vs(24),
    left: hs(16),
    right: hs(16),
  },
});
