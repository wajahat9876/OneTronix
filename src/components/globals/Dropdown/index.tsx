/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import arrowDropDownIcon from '@assets/icons/arrow-down-black.png';
import { Select } from '@mobile-reality/react-native-select-pro';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { AnimatePresence, MotiView } from 'moti';
import { IDropDownProps } from './types';

const DropDown = (props: IDropDownProps) => {
  const {
    data,
    placeHolderText,
    errorText,
    placeHolderTextColor,
    isSearchable,
    dropDownContainerStyle,
    dropDownTextStyle,
    optionsTextStyle,
    optionsListStyle,
    arrowImageProps,
    hideArrow,
    flatListProps,
    onSelect,
    onRemove,
    onSelectChangeText,
  } = props;

  return (
    <>
      <Select
        options={data}
        searchable={isSearchable}
        placeholderText={placeHolderText}
        placeholderTextColor={placeHolderTextColor}
        onSelect={onSelect}
        onRemove={onRemove}
        onSelectChangeText={onSelectChangeText}
        hideArrow={hideArrow}
        flatListProps={flatListProps}
        styles={{
          select: {
            container: {
              backgroundColor: 'transparent',
              borderTopColor: 'transparent',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
              borderRadius: 0,
              borderBottomWidth: 1.5,
              ...dropDownContainerStyle,
            },
            text: {
              fontFamily: 'poppins',
              fontSize: ms(14),
              marginLeft: hs(-12),
              ...dropDownTextStyle,
            },
            arrow: {
              icon: { height: 13, width: 13 },
            },
          },
          option: {
            text: {
              fontFamily: 'poppins',
              fontSize: ms(14),
              ...optionsTextStyle,
            },
          },
          optionsList: {
            borderColor: 'transparent',
            ...optionsListStyle,
          },
        }}
        arrowImageProps={{
          source: arrowDropDownIcon,
          ...arrowImageProps,
        }}
      />
      <AnimatePresence>
        {errorText && (
          <MotiView
            key="drop-down"
            from={{
              height: 0,
              marginTop: 0,
            }}
            animate={{
              height: 20,
              marginTop: vs(16),
            }}
            exit={{
              height: 0,
              marginTop: 0,
            }}
            // transition={{
            //   type: 'timing',
            // }}
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingLeft: hs(0),
              paddingRight: hs(8),
            }}
          >
            <Text
              style={{
                ...globalStyle.textRegular,
                color: Colors.light.theme.errorColor,
                fontSize: 12,
              }}
            >
              {errorText}
            </Text>
          </MotiView>
        )}
      </AnimatePresence>
    </>
  );
};
// DropDown.defaultProps = {
//   placeHolderTextColor: Colors.light.theme.placeholderColor,
//   errorText: '',
//   isSearchable: false,
//   hideArrow: false,
//   dropDownContainerStyle: {},
//   dropDownTextStyle: {},
//   optionsListStyle: {},
//   onSelect: () => {},
//   onRemove: () => {},
//   onSelectChangeText: () => {},
// };
export default DropDown;
