import { Text } from '@src/components/libraries';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { Image, ImageSourcePropType, View } from 'react-native';

interface IExchangeRateItemProps {
  countryFlag: ImageSourcePropType;
  countryCode: string;
  date: string;
  time: string;
  currencyConvertFrom: string;
  currecnyConvertTo: string;
  marginTop: number;
}

const ExchangeRateItem = (props: IExchangeRateItemProps) => {
  const {
    countryFlag,
    countryCode,
    date,
    time,
    currencyConvertFrom,
    currecnyConvertTo,
    marginTop,
  } = props;
  return (
    <View
      style={{
        ...globalStyle.whiteRoundedCard,
        marginTop,
        paddingLeft: hs(8),
        marginLeft: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <View className="flex-row items-center">
        <Image
          source={countryFlag}
          style={{ width: hs(45), height: vs(45), borderRadius: ms(100) }}
        />
        <View className="ml-2">
          <Text style={{ ...globalStyle.textRegular, fontSize: 12.51 }}>
            {countryCode}
          </Text>
          <Text
            style={{
              ...globalStyle.textRegular,
              fontSize: 9.73,
              color: '#999999',
            }}
          >
            {`${date} · ${time} `}
          </Text>
        </View>
      </View>
      <View className="flex-row">
        <Text style={{ ...globalStyle.textRegular, fontSize: 12.22 }}>
          {currencyConvertFrom}{' '}
        </Text>
        <Text style={{ ...globalStyle.textRegular, fontSize: 12.2 }}>=</Text>
        <Text style={{ ...globalStyle.textRegular, fontSize: 12.22 }}>
          {' '}
          {currecnyConvertTo}
        </Text>
      </View>
    </View>
  );
};

export default ExchangeRateItem;
