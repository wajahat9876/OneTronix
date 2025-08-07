/* eslint-disable react/jsx-props-no-spreading */
import {
  Platform,
  TouchableOpacity as TouchableOpacityDef,
} from 'react-native';
import { TouchableOpacity as TouchableOpacityGesture } from 'react-native-gesture-handler';
import { GenericTouchableProps } from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';

const TouchableOpacity = (props: GenericTouchableProps) => {
  const { children, className, ...others } = props;

  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacityGesture className={className} {...others}>
        {children}
      </TouchableOpacityGesture>
    );
  }

  return (
    <TouchableOpacityDef className={className} {...others}>
      {children}
    </TouchableOpacityDef>
  );
};

export default TouchableOpacity;
