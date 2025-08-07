/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from '@assets/images/BackgroundImage/homecardimage.png';
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

interface ImageBackgroundProps {
  children?: any;
  style?: any;
}
const HomeCardBackgroundImage = ({ children, style }: ImageBackgroundProps) => {
  return (
    <ImageBackground source={Image} style={[styles.background, style]}>
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

export default HomeCardBackgroundImage;
