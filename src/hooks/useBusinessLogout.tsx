/* eslint-disable import/order */
// hooks/useBusinessLogout.js
import { businessLogout } from "@/store/slices/business/businessSlice";
import { resetSignInType } from "@/store/slices/common/signInTypeSlice";
import { useAppDispatch } from "@src/hooks/useReduxHooks";

const useBusinessLogout = () => {
  const businessDispatch = useAppDispatch();

  const handleBusinessLogout = () => {
    businessDispatch(resetSignInType());
    businessDispatch(businessLogout());

    // businessDispatch(logoutPushToken());
  };

  return { handleBusinessLogout };
};

export default useBusinessLogout;
