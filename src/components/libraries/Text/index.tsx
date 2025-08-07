/* eslint-disable react/jsx-props-no-spreading */
import { ms } from '@utils/design/design';
import { forwardRef } from 'react';
import { Text as DefText, TextProps, TextStyle } from 'react-native';

const Text = forwardRef<DefText, TextProps>((props, ref) => {
  const { style, children, className, ...rest } = props;
  const { fontSize: fontSizeDefault, lineHeight: lineHeightDefault } = (style ||
    {}) as TextStyle;
  const fontSize = (fontSizeDefault && ms(fontSizeDefault)) || 16;
  const lineHeight = lineHeightDefault || fontSize + ms(4);

  return (
    <DefText
      ref={ref}
      style={[style, { fontSize, lineHeight }]}
      className={className}
      {...rest}
    >
      {children}
    </DefText>
  );
});

export default Text;
