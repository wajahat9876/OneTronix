/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import { Text, TouchableOpacity } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { hs, ms, vs } from '@utils/design/design';
import { View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { ICheckboxProps } from './types';

const Checkbox = (props: ICheckboxProps) => {
  const { label = '', value, className, children, onPress, ...others } = props;
  return (
    <TouchableOpacity
      style={{
        height: vs(70),
      }}
      onPress={onPress}
      className={`flex-row justify-center items-center px-4 ${className}`}
    >
      <View
        style={{
          borderRadius: ms(5),
          borderWidth: 1,
          borderColor: Colors.light.theme.black,
          alignItems: 'center',
          justifyContent: 'center',
          width: hs(20),
          height: vs(20),
        }}
      >
        <BouncyCheckbox
          {...others}
          onPress={onPress}
          isChecked={value === 'on'}
          iconStyle={{
            borderRadius: ms(5),
            width: hs(20),
            height: vs(20),
          }}
          innerIconStyle={{
            borderRadius: ms(5),
            borderColor: 'transparent',
          }}
          style={{
            borderRadius: ms(5),
            width: hs(20),
            height: vs(20),
          }}
          fillColor={Colors.light.theme.backgroundDarkGray}
        />
      </View>
      {(children as React.ReactNode) || (
        <Text
          style={{
            fontSize: 12,
            alignSelf: 'center',
            marginLeft: hs(8),
            fontFamily: 'poppins',
            color: Colors.light.theme.black,
          }}
          accessibilityLabel="checkbox-label"
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;
