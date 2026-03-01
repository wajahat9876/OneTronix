/* eslint-disable camelcase */
/* eslint-disable import/order */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line import/order
import { useBusinessDetails } from "@/store/selectors/business/business";
import { useSigninType } from "@/store/selectors/common/signin";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
  id: "inactivity-storage",
});
/* eslint-disable import/prefer-default-export */
const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  const { data: businessData } = useAppSelector(useBusinessDetails);
  //   const { isSignedIn } = useAuth();
  const { isPinCodeAccepted } = useAppSelector(useSigninType);
  useEffect(() => {
    if (!isPinCodeAccepted) {
    }
  }, []);
  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);
  // const handleAppStateChange = async (nextAppState: AppStateStatus) => {
  //   if (nextAppState === 'background') {
  //     recordStartTime();
  //   } else if (
  //     nextAppState === 'active' &&
  //     appState.current.match(/background/)
  //   ) {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const elapsed = Date.now() - (storage.getNumber('startTime') || 0);
  //     // 30000 is for 30 second
  //     if (elapsed > 30000 && businessData?.isPinSet) {
  //       router.replace('/(auth)/VerifyPasscode');
  //     } else {
  //       return;
  //     }
  //   }
  //   appState.current = nextAppState;
  // };
  const recordStartTime = () => {
    storage.set("startTime", Date.now());
  };
  return children;
};
export default UserInactivityProvider;
