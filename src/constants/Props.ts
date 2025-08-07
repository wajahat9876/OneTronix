/* eslint-disable import/prefer-default-export */
import { MyTextInputProps } from '@src/components/globals/Input/types';
import { hs, ms, vs } from '@utils/design/design';
import { Platform } from 'react-native';
import Colors from './Colors';

export const textInputDefaultProps = {
  textColor: Colors.light.theme.white,
  backgroundColor: Colors.light.theme.textInputBackgroundDark,
  placeholderTextColor: Colors.light.theme.placeholderColor,
  cursorColor: Colors.light.theme.white,
  selectionColor: Platform.OS === 'ios' ? Colors.light.theme.white : '#D3D3D3',
};

export const textInputUnderlinedProps: MyTextInputProps = {
  type: 'underlined',
  backgroundColor: 'transparent',
  selectionColor: Platform.OS === 'ios' ? Colors.light.theme.black : '#D3D3D3',
  cursorColor: Colors.light.theme.black,
  borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
  placeholderTextColor: Colors.light.theme.placeholderColor,
  borderBottomHeight: 1.5,
};

export const dropDownProps = {
  dropdownType: 'lg',
  maxHeight: vs(280),
  zIndex: 4000,
  listMode: 'SCROLLVIEW' as const,
  zIndexInverse: 1000,
  style: {
    borderTopWidth: 0,
    height: vs(60),
  },
  labelStyle: {
    color: Colors.light.theme.black,
    fontSize: ms(14),
    textAlign: 'left',
    fontFamily: 'poppins',
  },
  arrowIconContainerStyle: {
    right: hs(35),
  },
  placeHolderStyles: {
    color: Colors.light.theme.placeholderColor,
    fontSize: ms(14),
    paddingLeft: 0,
    textAlign: 'left',
    fontFamily: 'poppins',
  },
  dropdownContainerStyle: {
    backgroundColor: Colors.light.theme.white,
    borderWidth: 0,
  },
  listItemLabelStyle: {
    fontSize: ms(16),
    color: Colors.light.theme.backgroundDarkGray,
    lineHeight: vs(20),
  },
  listItemContainerStyle: {
    backgroundColor: Colors.light.theme.white,
    height: vs(40),
  },
  itemSeperatorStyle: {
    backgroundColor: 'transparent',
  },
};
