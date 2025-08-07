/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// eslint-disable-next-line import/order
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useResetBusinessKycMutation } from '@/store/api/kyc/businessKycApi';
import { useBusinessDetails } from '@/store/selectors/business/business';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import WebView from 'react-native-webview';

const Step2_Iframe_Call = ({ back }: MultiStepFormProps) => {
  const [, setWebViewLoading] = useState(true);
  const { businessKycUrl } = useAppSelector(useBusinessDetails);
  const { auth_token, data } = useAppSelector(useBusinessDetails);
  const [resetKyc] = useResetBusinessKycMutation();
  const { data: businessCurrentData, refetch } = useGetCurrentBusinessQuery(
    undefined,
    {
      skip: !auth_token,
    },
  );
  const onMessage = () => {
    console.log('onMessage');
    refetch();
  };
  const handleBack = async () => {
    try {
      await resetKyc({}).unwrap();
      back?.();
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScreenAuth
      title="Verify ID"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        handleBack();
      }}
    >
      <View style={[globalStyle.authTopCurvedCard]}>
        <WebView
          containerStyle={{ flex: 1 }}
          source={{
            uri: `${businessKycUrl}`,
          }}
          onMessage={onMessage}
          startInLoadingState
          onLoadStart={syntheticEvent => {
            setWebViewLoading(true);
          }}
          onLoadEnd={() => setWebViewLoading(false)}
          renderLoading={() => (
            <ActivityIndicator
              color="blue"
              size="large"
              style={{
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: '#1A1A1A',
              }}
            />
          )}
        />
      </View>
    </ScreenAuth>
  );
};

export default Step2_Iframe_Call;
