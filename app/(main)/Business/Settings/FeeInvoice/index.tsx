/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useGetFeeInvoiceQuery } from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Statemenicon from '@assets/icons/home-screen/Statement-Icon.svg';
import InvoceTable from '@src/components/commons/main/InvoiceTable';
import LoadingModal from '@src/components/globals/LoadingModal';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { useEffect } from 'react';
import { View } from 'react-native';

const Index = ({ goTo }: MultiStepFormProps) => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { data, refetch, isFetching } = useGetFeeInvoiceQuery({
    skip: !auth_token,
  });
  useEffect(() => {
    refetch();
  }, []);

  return (
    <ScreenAuth
      title="Fee Invoice"
      style={{
        backgroundColor: Colors.light.theme.backgroundTopCurveSection,
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        goTo?.(0);
      }}
    >
      <View style={globalStyle.authTopCurvedCard}>
        <View className=" self-center ">
          <Statemenicon width={50} height={50} />
        </View>
        <InvoceTable data={data?.data} />
        <LoadingModal isLoading={isFetching} />
      </View>
    </ScreenAuth>
  );
};

export default Index;
