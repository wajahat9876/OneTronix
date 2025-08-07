/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, Text } from '@src/components/libraries';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';
import Button from '../../Button';
import { ITabContentProps } from './types';

const TabContent = (props: ITabContentProps) => {
  const { title, description, image, onContinueClick } = props;
  return (
    <>
      <View style={globalStyle.whiteRoundedCard}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.image}>{image}</View>
      </View>
      <View style={styles.button}>
        <Button btnTitle="Continue" onClick={onContinueClick} />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'poppins-medium',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: vs(24),
  },
  description: {
    fontSize: 13,
    fontFamily: 'poppins',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: vs(8),
  },
  image: {
    marginTop: vs(26),
  },
  button: {
    position: 'absolute',
    bottom: vs(32),
    left: hs(16),
    right: hs(16),
  },
});
export default TabContent;
