/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowBackDark from '@assets/icons/commons/icon-arrow-back-dark.svg';
import ArrowBackLight from '@assets/icons/on-boarding/icon-arrow-back.svg';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { hs, ms, vs } from '@utils/design/design';
import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
// import SupportButton from '../SupportButton';
import { AppBarProps } from './types';

const AppBar = (props: AppBarProps) => {
  const { title, light, rightIcon, back, label, onPress } = props;

  return (
    <>
      <View
        style={{
          paddingHorizontal: hs(20),
          paddingTop: vs(35),
          borderBottomLeftRadius: ms(18),
          borderBottomRightRadius: ms(18),
          backgroundColor: 'transparent',
        }}
      >
        {back ? (
          <View className="flex-row justify-between">
            <View style={{ width: '20%' }}>
              <TouchableOpacity
                style={{ width: 50 }}
                onPress={() => {
                  if (onPress) onPress();
                  if (back) {
                    back();
                  } else {
                    //   router.replace('(auth)/Signin');
                  }
                }}
              >
                {light ? <ArrowBackDark /> : <ArrowBackLight />}
              </TouchableOpacity>
            </View>
            <View style={{ width: '60%' }}>
              <Text
                style={{
                  fontSize: 16,
                  paddingBottom: vs(20),
                  color: light
                    ? Colors.light.theme.black
                    : Colors.light.theme.white,
                }}
                className="text-xs font-poppins-medium text-center"
              >
                {title}
              </Text>
              <Text className="text-xs font-poppins-medium text-center text-white">
                {label}
              </Text>
            </View>
            {rightIcon ? (
              <View
                style={{
                  width: '20%',
                  flexDirection: 'row',
                  gap: ms(10),
                  justifyContent: 'center',
                  marginLeft: 10,
                }}
              >
                {/* <SupportButton light={light} /> */}
                {/* <TouchableOpacity
                  disabled={isFetching || userFetching}
                  onPress={
                    () => handleCodeSubmit()
                    // Linking.openURL('mailto:support@easyemoney.co.uk')
                  }
                >
                  {light ? <ContactIocn /> : <ContactWhiteIcon />}
                </TouchableOpacity> */}
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  width: '20%',
                  gap: ms(10),
                  justifyContent: 'center',
                }}
              />
            )}
          </View>
        ) : (
          <View className="flex-row justify-between">
            <View style={{ width: '20%' }}>
              <TouchableOpacity
                style={{ width: 50 }}
                onPress={() => {
                  if (onPress) onPress();
                  // router.replace('(auth)/Signin');
                }}
              >
                {light ? <ArrowBackDark /> : <ArrowBackLight />}
              </TouchableOpacity>
            </View>
            <View style={{ width: '60%' }}>
              <Text
                style={{
                  fontSize: 16,
                  paddingBottom: vs(20),
                  color: light
                    ? Colors.light.theme.black
                    : Colors.light.theme.white,
                }}
                className="text-xs font-poppins-medium text-center"
              >
                {title}
              </Text>
              <Text className="text-xs font-poppins-medium text-center text-white">
                {label}
              </Text>
            </View>
            {rightIcon ? (
              <View
                style={{
                  width: '20%',
                  flexDirection: 'row',
                  gap: ms(10),
                  justifyContent: 'center',
                }}
              >
                {/* <SupportButton light={light} /> */}
                {/* <TouchableOpacity
                onPress={() =>
                  Linking.openURL('mailto:support@easyemoney.co.uk')
                }
              >
                <Ionicons name="mail-outline" size={24} color="black" />
              </TouchableOpacity> */}
              </View>
            ) : (
              <View
                style={{
                  width: '20%',
                  flexDirection: 'row',
                  gap: ms(10),
                  justifyContent: 'center',
                }}
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};
// AppBar.defaultProps = {
//   title: '',
// };
export default memo(AppBar);
