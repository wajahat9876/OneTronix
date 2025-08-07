import { OptionType } from '@mobile-reality/react-native-select-pro';
import { FormikProps } from 'formik';
import { FlatListProps } from 'react-native';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IDropDownProps {
  data: Array<{ label: string; value: string }>;
  placeHolderText: string;
  errorText?: string;
  placeHolderTextColor?: string;
  isSearchable?: boolean;
  dropDownContainerStyle?: any;
  dropDownTextStyle?: any;
  optionsTextStyle?: any;
  optionsListStyle?: any;
  arrowImageProps?: any;
  hideArrow?: boolean;
  flatListProps?: Omit<
    FlatListProps<OptionType>,
    'ref' | 'data' | 'getItemLayout' | 'renderItem' | 'keyExtractor'
  >;
  onSelect?: React.Dispatch<React.SetStateAction<any>>;
  onRemove?: () => void;
  onSelectChangeText?: (text: string) => void;
}

export interface IFormikDropDownProps extends IDropDownProps {
  formik: FormikProps<any>;
  name: string;
  onSelect?: React.Dispatch<React.SetStateAction<any>>;
}
