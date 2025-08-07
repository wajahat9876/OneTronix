import { Pressable as Lib } from 'react-native';
import { ButtonProps } from 'react-native-paper';

const Pressable = (props: ButtonProps) => {
  const { className, ...others } = props;
  return <Lib {...others} className={`${className}`} />;
};

export default Pressable;
