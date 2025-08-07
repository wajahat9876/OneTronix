import { Text, TouchableOpacity } from '@src/components/libraries';
import { globalStyle } from '@src/styles/globals';
import { vs } from '@utils/design/design';

interface IAccountMethodProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

const AccountMethod = (props: IAccountMethodProps) => {
  const { title, subtitle, onClick } = props;
  return (
    <TouchableOpacity
      style={[
        globalStyle.whiteRoundedCard,
        { alignItems: 'flex-start', marginTop: vs(16) },
      ]}
      onPress={onClick}
    >
      <Text style={{ ...globalStyle.textMedium, marginTop: vs(8) }}>
        {title}
      </Text>
      <Text
        style={{
          ...globalStyle.textRegular,
          marginTop: vs(5),
          marginBottom: vs(8),
        }}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};

export default AccountMethod;
