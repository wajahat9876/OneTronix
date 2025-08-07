/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import DropDown from '@globals/Dropdown/index';
import { useMemo } from 'react';
import { IFormikDropDownProps } from './types';

const FormikDropDown = (props: IFormikDropDownProps) => {
  const {
    formik,
    name,
    data,
    placeHolderText,
    placeHolderTextColor,
    isSearchable,
    dropDownContainerStyle,
    dropDownTextStyle,
    optionsListStyle,
    arrowImageProps,
    hideArrow,
    flatListProps,
    onSelect,
    onSelectChangeText,
  } = props;
  return useMemo(() => {
    return (
      <DropDown
        data={data}
        isSearchable={isSearchable}
        placeHolderText={placeHolderText}
        placeHolderTextColor={placeHolderTextColor}
        errorText={formik.touched[name] && formik.errors[name]}
        dropDownContainerStyle={dropDownContainerStyle}
        dropDownTextStyle={dropDownTextStyle}
        optionsListStyle={optionsListStyle}
        arrowImageProps={arrowImageProps}
        hideArrow={hideArrow}
        flatListProps={flatListProps}
        onSelect={e => {
          // eslint-disable-next-line no-unused-expressions
          onSelect
            ? onSelect(e.value)
            : formik.handleChange({ target: { name, value: e.value } });
        }}
        onRemove={() => {
          formik.handleChange({ target: { name, value: '' } });
        }}
        onSelectChangeText={onSelectChangeText}
      />
    );
  }, [
    formik.values[name],
    formik.errors[name],
    formik.touched[name],
    formik.values[name],
    onSelect,
  ]);
};

export default FormikDropDown;
