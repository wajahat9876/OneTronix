/* eslint-disable react/jsx-props-no-spreading */
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DismissKeyboardView = ({ children }: { children: any }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;
