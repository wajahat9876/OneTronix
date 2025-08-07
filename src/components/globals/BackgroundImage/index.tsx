/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { ImageBackground, ImageSourcePropType, StyleSheet } from 'react-native';

interface ImageBackgroundProps {
  children?: any;
  style?: any;
  src: ImageSourcePropType;
}
const BackgroundImage = ({ children, style, src }: ImageBackgroundProps) => {
  return (
    <ImageBackground
      resizeMode="stretch"
      source={src}
      style={[styles.background, style]}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
});

export default BackgroundImage;
