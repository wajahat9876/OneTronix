/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, Text, TouchableOpacity } from '@src/components/libraries';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import { View } from 'react-native';

interface IFrequentUseProps {
  title: string;
  icon: any;
  color: string;
  onClick: () => void;
}

const FrequentUseItem = (props: IFrequentUseProps) => {
  const { title, icon, color, onClick } = props;
  return (
    <TouchableOpacity style={styles.column} onPress={onClick}>
      <View
        style={{
          width: hs(70),
          height: vs(70),
          backgroundColor: color,
          borderRadius: ms(16),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          ...globalStyle.textRegular,
          fontSize: getRespValue(16),
          textAlign: 'center',
          marginTop: vs(8),
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  column: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default FrequentUseItem;
