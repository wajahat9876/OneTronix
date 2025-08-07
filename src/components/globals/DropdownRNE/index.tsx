/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, ms } from '@utils/design/design';
import React, { forwardRef } from 'react';
import { FlatListProps, Platform, Text, View } from 'react-native';
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown';

interface Item {
  label: string;
  value: string;
}
export interface DropRNEProps {
  dropdownType: 'sm' | 'lg' | 'custom' | 'currency';
  onChange: React.Dispatch<React.SetStateAction<any>>;
  data: Array<{ label: string; value: string }> | any;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  errorText?: any;
  selectArrowIconStyle?: any;
  selectContainerStyle?: any;
  disabled?: boolean;
  labelField: 'label' | 'value';
  valueField: 'label' | 'value';
  autoScroll?: boolean;
  style?: any;
  containerStyle?: any;
  dropdownPosition: 'auto' | 'bottom' | 'top';
  accessibilityLabel?: string;
  search?: boolean;
  placeholderStyle?: any;
  iconStyle?: any;
  maxHeight?: number;
  minHeight?: number;
  iconColor?: string;
  inputSearchStyle?: any;
  key?: string;
  selectedTextStyle?: any;
  selectedTextProps?: any;
  itemContainerStyle?: any;
  itemTextStyle?: any;
  keyboardAvoiding?: boolean;
  onChangeText?: React.Dispatch<React.SetStateAction<any>>;
  value: string;
  searchPlaceholder?: string;
  activeColor?: string;
  showsVerticalScrollIndicator?: boolean;
  mode?: 'auto' | 'default' | 'modal';
  flatListProps?: FlatListProps<Item>;
  renderLeftIcon?: () => any;
  renderItem?: (
    item: { label: string; value: string },
    selected?: boolean | undefined,
  ) => JSX.Element;
  searchQuery?: (keyword: string, labelValue: string) => boolean;
  renderInputSearch?: (onSearch: (text: string) => void) => JSX.Element;
}
const DropdownRNE = forwardRef(
  (props: DropRNEProps, ref: IDropdownRef | any) => {
    const {
      dropdownType,
      onFocus,
      onBlur,
      data,
      onChangeText,
      onChange,
      renderItem,
      renderLeftIcon,
      activeColor,
      itemContainerStyle,
      showsVerticalScrollIndicator,
      keyboardAvoiding,
      selectedTextStyle,
      searchPlaceholder,
      itemTextStyle,
      value,
      key,
      mode,
      labelField,
      selectedTextProps,
      search,
      valueField,
      inputSearchStyle,
      iconColor,
      minHeight,
      containerStyle,
      errorText,
      placeholder,
      maxHeight,
      iconStyle,
      renderInputSearch,
      accessibilityLabel,
      selectArrowIconStyle,
      selectContainerStyle,
      placeholderStyle,
      searchQuery,
      autoScroll,
      flatListProps,
      disabled,
      style,
      dropdownPosition,
      ...others
    } = props;

    if (dropdownType === 'custom') {
      return (
        <>
          <Dropdown
            {...others}
            data={data}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            ref={ref}
            labelField={labelField}
            valueField={valueField}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            autoScroll={autoScroll}
            style={style}
            disable={disabled}
            containerStyle={containerStyle}
            dropdownPosition={dropdownPosition}
            accessibilityLabel={accessibilityLabel}
            search={search}
            placeholder={placeholder}
            placeholderStyle={placeholderStyle}
            iconStyle={iconStyle}
            maxHeight={200}
            minHeight={minHeight}
            iconColor={iconColor}
            inputSearchStyle={inputSearchStyle}
            key={key}
            activeColor={activeColor}
            selectedTextStyle={selectedTextStyle}
            selectedTextProps={selectedTextProps}
            itemContainerStyle={itemContainerStyle}
            itemTextStyle={itemTextStyle}
            keyboardAvoiding={keyboardAvoiding}
            onChangeText={onChangeText}
            value={value}
            searchPlaceholder={searchPlaceholder}
          />
          {errorText && (
            <View>
              <Text
                style={{
                  ...globalStyle.textRegular,
                  color: Colors.light.theme.errorColor,
                  fontSize: 12,
                }}
              >
                {errorText}
              </Text>
            </View>
          )}
        </>
      );
    }
    // this Dropdown is for UserDetails screen
    if (dropdownType === 'sm') {
      return (
        <>
          <Dropdown
            {...others}
            data={data}
            ref={ref}
            renderItem={renderItem}
            renderLeftIcon={renderLeftIcon}
            labelField={labelField}
            valueField={valueField}
            onFocus={onFocus}
            onBlur={onBlur}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            onChange={onChange}
            autoScroll={autoScroll}
            activeColor={activeColor}
            style={{
              borderBottomWidth: 1.5,
              borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
              padding: 5,
              ...style,
            }}
            disable={disabled}
            containerStyle={containerStyle}
            dropdownPosition={dropdownPosition}
            accessibilityLabel={accessibilityLabel}
            search={search}
            placeholder={placeholder}
            placeholderStyle={{
              fontFamily: 'poppins',
              fontSize: ms(14),
              marginLeft: hs(-6),
              color: 'gray',
              ...placeholderStyle,
            }}
            iconStyle={iconStyle}
            maxHeight={maxHeight}
            minHeight={minHeight}
            iconColor={iconColor}
            inputSearchStyle={inputSearchStyle}
            key={key}
            selectedTextStyle={{
              fontFamily: 'poppins',
              fontSize: ms(14),
              marginLeft: hs(-5),
              ...selectedTextStyle,
            }}
            selectedTextProps={selectedTextProps}
            itemContainerStyle={{
              borderBottomWidth: 0.5,
              borderColor: 'gray',
              // borderBottomLeftRadius: 15,
              // borderBottomRightRadius: 15,
              ...itemContainerStyle,
            }}
            itemTextStyle={{ fontSize: ms(14), ...itemTextStyle }}
            keyboardAvoiding={keyboardAvoiding}
            onChangeText={onChangeText}
            value={value}
            searchPlaceholder={searchPlaceholder}
          />

          {errorText && (
            <View>
              <Text
                style={{
                  ...globalStyle.textRegular,
                  color: Colors.light.theme.errorColor,
                  fontSize: 12,
                }}
              >
                {errorText}
              </Text>
            </View>
          )}
        </>
      );
    }
    if (dropdownType === 'lg') {
      return (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Dropdown
              {...others}
              data={data}
              key={key}
              onFocus={onFocus}
              onBlur={onBlur}
              backgroundColor="transparent"
              mode={mode}
              searchQuery={searchQuery}
              renderItem={renderItem}
              ref={ref}
              renderInputSearch={renderInputSearch}
              labelField={labelField}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              valueField={valueField}
              onChange={onChange}
              autoScroll={autoScroll}
              flatListProps={flatListProps}
              activeColor={activeColor}
              style={style}
              disable={disabled}
              containerStyle={containerStyle}
              dropdownPosition={dropdownPosition}
              accessibilityLabel={accessibilityLabel}
              search={search}
              placeholder={placeholder}
              placeholderStyle={placeholderStyle}
              iconStyle={iconStyle}
              maxHeight={maxHeight}
              minHeight={minHeight}
              iconColor={iconColor}
              inputSearchStyle={inputSearchStyle}
              selectedTextStyle={selectedTextStyle}
              selectedTextProps={selectedTextProps}
              itemContainerStyle={itemContainerStyle}
              itemTextStyle={itemTextStyle}
              keyboardAvoiding={keyboardAvoiding}
              onChangeText={onChangeText}
              value={value}
              searchPlaceholder={searchPlaceholder}
            />
            {errorText && (
              <Text
                className="font-aeonik flex text-center "
                style={{
                  fontSize: 13,
                  marginTop: -10,
                  marginBottom: 10,
                  color: Colors.dark.errorText,
                  fontWeight: Platform.OS === 'ios' ? '400' : '400',
                }}
              >
                {errorText}
              </Text>
            )}
          </View>
        </>
      );
    }

    return <></>;
  },
);

export default DropdownRNE;
