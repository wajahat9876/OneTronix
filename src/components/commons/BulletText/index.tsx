import { kycStyles } from '@src/styles/KYC';
import { hs } from '@utils/design/design';
import { Pressable, Text } from 'react-native';

interface IRenderBulletTextProps {
  title: string;
  marginTop: number;
  marginLeft: number;
}
const BulletText = (props: IRenderBulletTextProps) => {
  const { title, marginTop, marginLeft = hs(8) } = props;
  return (
    <Pressable
      style={{
        flexDirection: 'row',
        marginTop,
        marginLeft,
        marginRight: hs(32),
      }}
    >
      <Text
        style={{
          ...kycStyles.subHeading,
          fontSize: 18,
        }}
      >{`\u2022`}</Text>
      <Text
        style={{
          ...kycStyles.subHeading,
          marginLeft: hs(8),
          marginRight: hs(8),
          textAlign: 'left',
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default BulletText;

// BulletText.defaultProps = {
//   marginLeft: hs(8),
// };
