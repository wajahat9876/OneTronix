/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
// eslint-disable-next-line import/order
import { useBusinessDetails } from "@/store/selectors/business/business";
import { useConfig } from "@/store/selectors/config/config";
import { setModal, setValue } from "@/store/slices/config/configSlice";
import { useNotifcations } from "@src/hooks/useNotification";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxHooks";
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
} from "expo-notifications";
import { Redirect, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import DeviceInfo from "react-native-device-info";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

const Index = () => {
  // This is the default configuration
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });
  useEffect(() => {
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested", // Suppress this warning
    ]);
  }, []);
  const businessData = useAppSelector(useBusinessDetails);
  const { isVerifiedEmail } = useAppSelector(useBusinessDetails);
  const rootNavigationState = useRootNavigationState();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { deviceId, tempDeviceId, deviceType } = useAppSelector(useConfig);
  // getUniqueId for device
  const getDeviceId = async () => {
    DeviceInfo.getUniqueId().then((uniqueId) => {
      dispatch(
        setValue({
          type: "deviceId",
          value: uniqueId,
        })
      );
    });
  };
  // getDevicemodal
  useEffect(() => {
    const fetchDeviceModel = async () => {
      const modal = DeviceInfo.getModel();
      const type = DeviceInfo?.getDeviceType();
      dispatch(
        setModal({
          modal,
          type,
        })
      );
    };
    fetchDeviceModel();
  }, []);

  if (!deviceId) {
    getDeviceId();
  }
  // pushnotification code
  const {
    registerForPushNotificationsAsync,
    handleNotificationResponse,
    handleNotification,
  } = useNotifcations();

  useEffect(() => {
    const registerNotifications = async () => {
      await registerForPushNotificationsAsync();
      // setNotificationHandler({
      //   handleNotification: async () => ({
      //     shouldShowAlert: true,
      //     shouldPlaySound: true,
      //     shouldSetBadge: true,
      //   }),
      // });
      const responseListener = addNotificationResponseReceivedListener(
        handleNotificationResponse
      );
      const responseListener2 =
        addNotificationReceivedListener(handleNotification);
      return () => {
        if (responseListener) removeNotificationSubscription(responseListener);
        if (responseListener2)
          removeNotificationSubscription(responseListener2);
      };
    };
    registerNotifications();
  }, []);
  console.log(isVerifiedEmail, businessData?.auth_token, "BusinessData");
  if (!rootNavigationState?.key) {
    // Wait for navigation to be ready
    return null;
  }
  if (businessData?.auth_token && isVerifiedEmail) {
    return <Redirect href="/(main)/Business/Home" />;
  }
  return <Redirect href="/(auth)/Welcome" />;
};
export default Index;
