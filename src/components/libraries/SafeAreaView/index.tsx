import {
  SafeAreaView as Lib,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';

const SafeAreaView = (props: SafeAreaViewProps) => {
  return <Lib {...props} />;
};

export default SafeAreaView;
