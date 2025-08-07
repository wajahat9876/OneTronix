/* eslint-disable react/require-default-props */
import Switch from '@src/components/globals/Switch';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { Text, View } from 'react-native';

interface IFaceIdSettingItemProps {
  title: string;
  switchValue: boolean;
  onSwitchValueChange: () => void;
  disabled?: any;
}

const AlertsSettingsItem = (props: IFaceIdSettingItemProps) => {
  const { title, switchValue, onSwitchValueChange, disabled } = props;
  return (
    <View
      style={{
        ...globalStyle.whiteRoundedCard,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: hs(0),
        marginTop: vs(16),
      }}
    >
      <Text style={{ ...globalStyle.textMedium, fontSize: 15.34 }}>
        {title}
      </Text>
      <Switch
        isOn={switchValue}
        backgroundColorActive={Colors.light.theme.switchEnabledColor}
        backgroundColor={Colors.light.theme.textInputBackgroundLight}
        toggleColor={Colors.light.theme.white}
        toggleColorActive={Colors.light.theme.white}
        onToggle={onSwitchValueChange}
        disabled={disabled}
      />
    </View>
  );
};

export default AlertsSettingsItem;
