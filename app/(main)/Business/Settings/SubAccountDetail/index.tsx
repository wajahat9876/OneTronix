/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useBusinessDetails } from '@/store/selectors/business/business';
import AllDataTable from '@src/components/commons/main/All_Account_Table';
import LoadingModal from '@src/components/globals/LoadingModal';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { useGetAllAccountBalanceQuery } from '@store/api/business/mainApis';
import { vs } from '@utils/design/design';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

const Index = ({ goTo }: MultiStepFormProps) => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { data, refetch, isLoading } = useGetAllAccountBalanceQuery({
    skip: !auth_token,
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1 }}
    >
      <ScreenAuth
        title="Sub Account Detail"
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
        <View style={{ marginBottom: vs(20) }}>
          <AllDataTable data={data} />
        </View>
      </ScreenAuth>
      <LoadingModal isLoading={isLoading} />
    </Animated.View>
  );
};

export default Index;
