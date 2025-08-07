import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { View } from 'react-native';
import { IDirectorProps } from './types';

const Director = (props: IDirectorProps) => {
  const { name } = props;
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text
          style={{
            ...globalStyle.textMedium,
            color: Colors.light.theme.white,
            fontSize: 14,
          }}
        >
          {name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hs(4),
  },
  item: {
    backgroundColor: Colors.light.theme.primaryColor,
    paddingHorizontal: hs(6),
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },
});

export default Director;
