/* eslint-disable react/require-default-props */
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { View } from 'react-native';

interface ICurrentBalanceCardProps {
  balance: any;
  // eslint-disable-next-line react/no-unused-prop-types
  onPress?: () => void;
  currency?: number;
}

const CurrentBalanceCard = (props: ICurrentBalanceCardProps) => {
  const { balance, currency } = props;
  const { getCurrencySymbol, getCurrencyCode } = useCurrencyFlag();
  return (
    <View style={styles.container}>
      <Text
        style={{
          ...globalStyle.textMedium,
          fontSize: 16,
          color: Colors.light.theme.white,
        }}
      >
        Current Balance
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Text
          style={{
            ...globalStyle.textMedium,
            fontSize: 30,
            color: Colors.light.theme.white,
            marginTop: vs(7),
          }}
        >
          {getCurrencySymbol(getCurrencyCode(currency))}{' '}
        </Text>
        <Text
          style={{
            ...globalStyle.textSemibold,
            fontSize: 30,
            color: Colors.light.theme.white,
            marginTop: vs(8),
          }}
        >
          {Number(balance).toFixed(2) || '0.00'}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.light.theme.black,
    borderRadius: ms(24),
    marginTop: vs(16),
    paddingTop: vs(16),
    paddingBottom: vs(16),
    paddingLeft: hs(56),
    paddingRight: hs(56),
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});
export default CurrentBalanceCard;
