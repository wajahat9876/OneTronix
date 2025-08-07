/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  useBusinessVerifyTermAndConditionsMutation,
  useImportantInfoMutation,
} from '@/store/api/business/authApis';
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import { FlashList } from '@shopify/flash-list';
import BulletText from '@src/components/commons/BulletText';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { kycStyles } from '@src/styles/KYC';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';

const noticeData = [
  {
    text: 'You are authorized to sign for an act on behalf of the company and no consent or approval is from any other person.',
  },
  {
    text: 'Confirming the information which you have provided within this application is accurate and correctly reflects the business profile products and services of your business and the payment services you wish to receive.',
  },
  {
    text: 'Agreeing to and authorizing the relevant searches required by the Easy E Money for the Company.',
  },
  {
    text: 'Agreeing that you have read and agree with the terms and conditions set and any other documents as the two parties from time to time may agree which together shall constitutes the entire agreement between the parties.',
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Step3_Important_Notice = ({ back }: MultiStepFormProps) => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch, isFetching } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { handleBusinessLogout } = useBusinessLogout();
  const [importantInfo, { isLoading }] = useImportantInfoMutation();
  const [verifyTermAndConditions, { isLoading: termLoading }] =
    useBusinessVerifyTermAndConditionsMutation();
  const handleSubmit = async () => {
    try {
      const response = await refetch().unwrap();
      if (!response?.data?.checkImportantInfo) {
        const res = await importantInfo({}).unwrap();
        if (res) {
          await verifyTermAndConditions({}).unwrap();
        } else {
          renderToastError('Something went wrong');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderToastSuccess(res?.message || 'Uploaded Successfully');
      } else renderToastSuccess('Already Uploaded Successfully');
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  return (
    <ScreenAuth
      title="Business Documentation"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        handleBusinessLogout();
      }}
    >
      <View style={[globalStyle.authTopCurvedCard]}>
        <Text style={{ ...kycStyles.heading, marginTop: vs(16) }}>
          Important Notice
        </Text>
        <Text style={kycStyles.subHeading}>
          Words and expressions used in this application, have the same meaning
          as et out in the terms and conditions. By signing this application,
          you are:
        </Text>

        <FlashList
          // style={{ marginBottom: vs(24) }}
          estimatedItemSize={200}
          contentContainerStyle={{ paddingBottom: vs(24) }}
          data={noticeData}
          renderItem={({ item, index }) => {
            const marginTop = index === 0 ? 32 : 8;
            return <BulletText title={item.text} marginTop={marginTop} />;
          }}
        />

        <View
          style={{
            marginLeft: hs(16),
            marginRight: hs(16),
            marginBottom: vs(24),
          }}
        >
          <Button
            btnTitle="Continue"
            loading={isLoading || isFetching || termLoading}
            onClick={() => {
              handleSubmit();
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step3_Important_Notice;
