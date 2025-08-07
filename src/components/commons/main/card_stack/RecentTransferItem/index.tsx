/* eslint-disable react/require-default-props */
import IconPerson from '@assets/icons/card/IconPersonBlack.svg';
import { Text } from '@src/components/libraries';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';

interface IRecentTransferItemProps {
  name: string;
  date?: string;
  time?: string;
  amount?: number;
  marginTop: number;
  country?: string;
  currency?: string;
  isCurrency?: boolean;
}

const RecentTransferItem = (props: IRecentTransferItemProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, date, time, amount, marginTop, country, currency, isCurrency } =
    props;

  return (
    <View
      style={{
        // ...globalStyle.whiteRoundedCard,
        // marginTop: vs(marginTop),
        marginBottom: vs(12),
        paddingLeft: hs(8),
        marginLeft: 0,
        marginRight: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        width: '90%',
      }}
    >
      <View className="flex-row items-center">
        <View
        // style={{
        //   backgroundColor:
        //     Colors.light.theme.backgroundColorCurrentBalanceContainer,
        //   padding: ms(14),
        //   borderRadius: ms(100),
        // }}
        >
          <IconPerson />
        </View>
        <View style={{ width: '80%' }} className="ml-2">
          <Text
            numberOfLines={1}
            style={{
              ...globalStyle.textRegular,
              fontSize: 12.51,
            }}
          >
            {name}
          </Text>

          <Text
            style={{
              ...globalStyle.textRegular,
              fontSize: 9.73,
              color: '#999999',
            }}
          >
            {`${date} ${' '} ${time} `}
          </Text>
        </View>
      </View>

      <Text style={{ ...globalStyle.textRegular, fontSize: 12.22 }}>
        {amount}
      </Text>
    </View>
  );
};

export default RecentTransferItem;
