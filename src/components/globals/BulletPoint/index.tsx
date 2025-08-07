/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ms } from '@utils/design/design';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BulletPointList = ({ items }: any) => {
  return (
    <View style={styles.container}>
      {items.map((item: any, index: any) => (
        <View key={index} style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    marginRight: 5,
  },
  bulletText: {
    lineHeight: 20,
    fontSize: ms(14),
  },
});

export default BulletPointList;
