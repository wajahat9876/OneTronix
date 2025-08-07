/* eslint-disable import/order */
// hooks/useBusinessLogout.js
import {
  businessLogout,
  resetBeneficiaryDetails,
} from '@/store/slices/business/businessSlice';
import { resetSignInType } from '@/store/slices/common/signInTypeSlice';
import { useAppDispatch } from '@src/hooks/useReduxHooks';
import { useRouter } from 'expo-router';

const useBusinessLogout = () => {
  const businessDispatch = useAppDispatch();
  const router = useRouter();
  const handleBusinessLogout = () => {
    businessDispatch(resetSignInType());
    businessDispatch(businessLogout());
    businessDispatch(resetBeneficiaryDetails());
    // businessDispatch(logoutPushToken());
    router.replace('/(auth)/Welcome');
  };

  return { handleBusinessLogout };
};

export default useBusinessLogout;
