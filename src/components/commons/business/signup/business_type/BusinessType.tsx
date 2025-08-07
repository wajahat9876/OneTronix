/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, Text, TouchableOpacity } from '@src/components/libraries';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';

interface IBusinessTypeProps {
  title: string;
  image: any;
  onClick: () => void;
}

const BusinessType = (props: IBusinessTypeProps) => {
  const { title, image, onClick } = props;
  return (
    <TouchableOpacity
      className="flex-row justify-between items-center"
      style={globalStyle.whiteRoundedCard}
      onPress={onClick}
    >
      <Text style={{ ...globalStyle.textMedium }}>{title}</Text>
      <View style={styles.image}>{image}</View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  image: {
    width: hs(65),
    height: vs(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default BusinessType;
