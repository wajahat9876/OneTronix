import React from 'react';
import { TextInput } from 'react-native';

import DefaultInput from './DefaultInput';
import UnderlinedInput from './UnderlinedInput';
import { MyTextInputProps } from './types';

const Input = React.forwardRef<TextInput, MyTextInputProps>((props, ref) => {
  const { type = 'default' } = props;

  const inputs = {
    default: DefaultInput,
    underlined: UnderlinedInput,
  };

  const ReturnInput = inputs[type || 'default'];

  return <ReturnInput {...props} ref={ref} />;
});

export default Input;

Input.defaultProps = {
  password: false,
  errorText: '',
  last: false,
  backgroundColor: '',
  borderTopColor: '',
  borderBottomColor: 'transparent',
  borderBottomHeight: 0,
  lineHeight: 23,
  type: 'default',
  roundedRadius: 'xl',
};
