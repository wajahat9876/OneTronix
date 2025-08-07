/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import { FormikProps } from 'formik';
import React, { useMemo } from 'react';
import { FlatListProps, TextInput } from 'react-native';
import { IDropdownRef } from 'react-native-element-dropdown';
import DropdownRNE from '.';

interface Item {
  label: string;
  value: string;
}
interface MyFormikRNEProps {
  formik: FormikProps<any>;
  name: string;
  style?: any;
  onChange?: React.Dispatch<React.SetStateAction<any>>;
  data: Array<{ label: string; value: string }>;
  selectedTextStyle?: any;
  autoScroll?: boolean;
  placeholder?: string;
  placeholderStyle?: any;
  search?: boolean;
  onSelectChangeTetx?: (text: string) => void;
  disabled?: boolean;
  errorText?: any;
  value: string;
  dropdownType: 'sm' | 'lg' | 'custom' | 'currency';
  labelField: 'label' | 'value';
  valueField: 'label' | 'value';
  containerStyle?: any;
  iconStyle?: any;
  onChangeText?: (text: string) => void;
  searchPlaceholder?: string;
  keyboardAvoiding?: boolean;
  showsVerticalScrollIndicator?: boolean;
  activeColor?: string;
  inputSearchStyle?: any;
  itemContainerStyle?: any;
  itemTextStyle?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  dropdownPosition: 'auto' | 'top' | 'bottom';
  maxHeight?: number;
  mode?: 'auto' | 'default' | 'modal';
  minHeight?: number;
  flatListProps?: FlatListProps<Item>;
  renderItem?: (item: Item, selected?: boolean | undefined) => JSX.Element;
  searchQuery?: (keyword: string, labelValue: string) => boolean;
  renderInputSearch?: (onSearch: (text: string) => void) => JSX.Element;
  key?: string;
}

const FormikDropdownRNE = React.forwardRef<
  IDropdownRef | TextInput,
  MyFormikRNEProps
>((props: MyFormikRNEProps, ref: IDropdownRef | any) => {
  const {
    formik,
    value,
    key,
    onFocus,
    onBlur,
    inputSearchStyle,
    itemContainerStyle,
    itemTextStyle,
    renderInputSearch,
    renderItem,
    name,
    mode,
    maxHeight,
    data,
    style,
    activeColor,
    keyboardAvoiding,
    showsVerticalScrollIndicator,
    onChange,
    disabled,
    searchPlaceholder,
    iconStyle,
    search,
    onChangeText,
    autoScroll,
    minHeight,
    placeholder,
    labelField,
    valueField,
    placeholderStyle,
    errorText,
    dropdownType,
    selectedTextStyle,
    flatListProps,
    containerStyle,
    dropdownPosition,
  } = props;

  return useMemo(() => {
    return (
      <DropdownRNE
        {...props}
        mode={mode}
        onFocus={onFocus}
        onBlur={onBlur}
        key={key}
        ref={ref}
        minHeight={minHeight}
        flatListProps={flatListProps}
        dropdownPosition={dropdownPosition}
        labelField={labelField}
        valueField={valueField}
        errorText={errorText || (formik.touched[name] && formik.errors[name])}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onChange={e => {
          // eslint-disable-next-line no-unused-expressions
          onChange
            ? onChange(e.value)
            : formik.handleChange({ target: { name, value: e.value } });
        }}
        onChangeText={onChangeText}
        renderItem={renderItem}
        maxHeight={maxHeight}
        dropdownType={dropdownType}
        activeColor={activeColor}
        inputSearchStyle={inputSearchStyle}
        keyboardAvoiding={keyboardAvoiding}
        disabled={disabled}
        data={data}
        renderInputSearch={renderInputSearch}
        placeholder={placeholder}
        placeholderStyle={placeholderStyle}
        search={search}
        autoScroll={autoScroll}
        style={style}
        itemContainerStyle={itemContainerStyle}
        itemTextStyle={itemTextStyle}
        selectedTextStyle={selectedTextStyle}
        containerStyle={containerStyle}
        iconStyle={iconStyle}
        value={value}
        searchPlaceholder={searchPlaceholder}
      />
    );
  }, [
    formik.values[name],
    formik.errors[name],
    formik.touched[name],
    value,
    formik.values[name],
    errorText,
    onChange,
  ]);
});

export default FormikDropdownRNE;
// FormikDropdownRNE.defaultProps = {
//   value: '',
// };
