/* eslint-disable import/prefer-default-export */
import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Horizontally scale the font size
// Example: width, marginLeft, marginRight etc.
const hs = (size: number) => (width / guidelineBaseWidth) * size;
// Vertically scale the font size
// Example: height, marginTop, marginBottom etc.
const vs = (size: number) => (height / guidelineBaseHeight) * size;
// Moderately scale the font size
// Example: fontSize,borderRadius etc.
const ms = (size: number, factor: number = 0.5) =>
  size + (hs(size) - size) * factor;

export { hs, ms, vs };
