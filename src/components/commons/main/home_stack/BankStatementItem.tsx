import IconBankSatetmentSmall from '@assets/icons/home-screen/icon-bank-statement-small.svg';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { View } from 'react-native';

interface IBankStatementItemProps {
  date: string;
  marginTop: number;
  onClick: () => void;
}

const BankStatementItem = (props: IBankStatementItemProps) => {
  const { date, marginTop, onClick } = props;
  return (
    <View style={{ marginTop }}>
      <Text style={{ ...globalStyle.textRegular, fontSize: 12.51 }}>
        {date}
      </Text>
      <TouchableOpacity
        style={{
          ...globalStyle.whiteRoundedCard,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: hs(0),
          marginTop: vs(8),
          paddingRight: hs(8),
          paddingLeft: hs(8),
          paddingTop: vs(8),
          paddingBottom: vs(8),
          borderColor: '#E0E8F2',
          borderWidth: 0.5,
        }}
        onPress={onClick}
      >
        <View className="flex-row items-center">
          <View
            style={{
              backgroundColor:
                Colors.light.theme.backgroundColorCurrentBalanceContainer,
              borderRadius: ms(100),
              paddingTop: vs(8),
              paddingBottom: vs(8),
              paddingLeft: hs(8),
              paddingRight: hs(8),
            }}
          >
            <IconBankSatetmentSmall />
          </View>
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 12.51,
              marginLeft: hs(8),
            }}
          >
            Bank Statement
          </Text>
        </View>
        <MaterialIcons name="arrow-right" size={42} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default BankStatementItem;
