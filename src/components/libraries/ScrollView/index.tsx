import React, { forwardRef } from 'react';
import { ScrollView as Lib, ScrollViewProps } from 'react-native';

const ScrollView = forwardRef((props: ScrollViewProps, ref: React.Ref<Lib>) => {
  return <Lib {...props} ref={ref} />;
});

export default ScrollView;
