/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Card from '@src/components/steps/main/Business/Card';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import ActivateDebitCard from './ActivateDebitCard';
import BlockCard from './BlockCard';
import CardDetails from './CardDetails';
import ChangeCardPin from './ChangeCardPin';
import OrderCard from './OrderCard';
import OrderedSucess from './OrderedSucess';
import ReportCard from './ReportCard';
import ViewDebitCardPin from './ViewDebitCardPin';

const Index = () => {
  const { data, auth_token } = useAppSelector(useBusinessDetails);
  const { data: businessCurrentData } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { step, goTo } = useMultistepForm(
    [
      <Card />, // 0
      <OrderCard />, // 1
      <OrderedSucess />, // 2
      <CardDetails />, // 3
      <ActivateDebitCard />, // 4
      <BlockCard />, // 5
      <ChangeCardPin />, // 6
      <ViewDebitCardPin />, // 7
      <ReportCard />, // 8
    ],
    {
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    },
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (data && data?.cardStatus) {
      // if (data?.cardStatus === 'pending') {
      //   goTo?.(2);
      // }
      if (
        data?.cardStatus === 'inactive' ||
        data?.cardStatus === 'pending' ||
        data?.cardStatus === 'active' ||
        data?.cardStatus === 'suspended'
      ) {
        goTo?.(3);
      }
    }
    setLoading(false);
  }, [data?.cardStatus, businessCurrentData]);
  if (loading) {
    // Display a loader while determining the screen
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return <View className="flex-1">{step}</View>;
};

export default Index;
