/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useLazyGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import SuccessIcon from '@assets/icons/SuccessIcon.svg';
import Button from '@src/components/globals/Button';
import { SafeAreaView, Text } from '@src/components/libraries';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';
import { CardProps } from '../type';

const Step2_Card_Activated = ({ parentGoto }: CardProps) => {
  const [trigger, { isFetching }] = useLazyGetCurrentBusinessQuery();
  const handleNext = async () => {
    await trigger().unwrap();
    parentGoto?.(3);
  };
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}
    >
      <View className="items-center justify-center flex-1">
        <SuccessIcon />
        <Text
          style={{
            ...globalStyle.textSemibold,
            fontSize: 24,
            marginTop: vs(24),
            marginLeft: hs(16),
            marginRight: hs(16),
            textAlign: 'center',
            color: 'white',
          }}
        >
          Card Activated Successfully.
        </Text>
      </View>
      <View style={{ ...globalStyle.buttonContinue, bottom: vs(24) }}>
        <Button
          btnTitle="Continue"
          loading={isFetching}
          onClick={() => {
            handleNext();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Step2_Card_Activated;
