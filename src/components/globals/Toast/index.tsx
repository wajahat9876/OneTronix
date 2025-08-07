/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */

import { Feather, Ionicons } from '@expo/vector-icons';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { hs, ms, vs } from '@utils/design/design';
import { memo } from 'react';
import { View } from 'react-native';
import { ToastProps } from './types';

const Toast = ({ variant, title, error, success }: ToastProps) => {
  return (
    <View
      style={{
        minHeight: vs(70),
        shadowColor: Colors.light.theme.backgroundDarkGray,
        shadowOffset: {
          width: 0,
          height: vs(3),
        },
        shadowOpacity: 0.27,
        shadowRadius: ms(4.65),
        elevation: 6,
        maxWidth: '100%',
        alignSelf: 'center',
        backgroundColor: Colors.light.theme.backgroundDarkGray,
        flexDirection: 'row',
      }}
      className="rounded-full w-5/6"
    >
      <View
        style={{
          flexShrink: 1,
          width: '100%',
          justifyContent: 'center',
          paddingLeft: hs(10),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexShrink: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexShrink: 1,
              alignItems: 'center',
              flexDirection: 'row',
              // justifyContent: 'space-between',
            }}
          >
            {error && <Ionicons name="close" size={ms(40)} color="#ff3333" />}

            {success && <Feather name="check" size={ms(40)} color="#5cb85c" />}

            <Text
              className="pr-2"
              style={{
                fontWeight: '600',
                flexShrink: 1,
                fontFamily: 'poppins',
                fontSize: 17,
                color:
                  variant === 'solid'
                    ? '#fff'
                    : variant !== 'outline'
                    ? '#000'
                    : 'primary',
              }}
            >
              {title && title?.length > 70
                ? `${title?.slice(0, 70)}...`
                : title}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(Toast);
