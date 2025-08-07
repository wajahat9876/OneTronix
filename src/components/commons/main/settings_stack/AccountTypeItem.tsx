import Checkbox from '@src/components/globals/Checkbox';
import { Text } from '@src/components/libraries';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';

interface IAccountTypeItemProps {
  title: string;
  checkboxValue: string;
  onCheckboxValueChange: () => void;
}

const AccountTypeItem = (props: IAccountTypeItemProps) => {
  const { title, checkboxValue, onCheckboxValueChange } = props;
  return (
    <View
      style={{
        ...globalStyle.whiteRoundedCard,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: hs(0),
        marginTop: vs(16),
        padding: 0,
      }}
    >
      <View className="flex-row items-center">
        <Checkbox onPress={onCheckboxValueChange} value={checkboxValue} />
        <Text style={{ ...globalStyle.textMedium, fontSize: 15.34 }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default AccountTypeItem;
