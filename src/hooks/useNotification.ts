/* eslint-disable camelcase */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
// import useMyI18n from '@hooks/useMyI18n';
// import { debug } from '@utils/helpers/debug';
// import appConfig from 'app.config';
// import { useNavigation } from '@react-navigation/native';
// import { getCurrentUser } from '@store/actions/user';
// import { addToTransactionAdd } from '@store/slices/transaction/add';
// import { addToTransactionOut } from '@store/slices/transaction/out';
import { setPushToken, setValue } from '@/store/slices/config/configSlice';
import { useAppDispatch } from '@hooks/useReduxHooks';
import { renderAlertError, renderToastError } from '@hooks/useToasty';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
// import { useToast } from 'native-base';
import { Platform } from 'react-native';

export const useNotifcations = () => {
  const dispatch = useAppDispatch();
  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        dispatch(setValue({ type: 'pushNotificationDisabled', value: false }));

        if (finalStatus !== 'granted') {
          if (Platform.OS === 'ios') {
            renderAlertError(
              'Please enable push notifications to receive updates and alerts',
            );
          } else
            renderToastError(
              'Please enable push notifications to receive updates and alerts',
            );

          dispatch(setValue({ type: 'pushNotificationDisabled', value: true }));
          return;
        }

        const data = await Notifications.getExpoPushTokenAsync({
          projectId: '1c712b9b-6d4f-4f59-a301-006412798e29',
        });

        const { data: token } = data;

        // await AsyncStorage.setItem('pushToken', token);
        dispatch(setPushToken(token));
        console.log('pushNotification token in Hook ', token);
        //   this.setState({ expoPushToken: token });
      } catch (error: any) {
        // renderToastError(error.message);
        console.log('push token error', error?.message);
      }
    } else {
      renderToastError('something went wrong');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  const handleNotification = (notification: any) => {
    // if (notification) {
    // }
    // could be useful if you want to display your own toast message
    // could also make a server call to refresh data in other part of the app
    // debug('handleNotification', notification?.request?.content?.data);
    // if (notification) {
    //   if (notification?.request?.content?.data?.refreshUser) {
    //     dispatch(getCurrentUser(''));
    //   }
    //   if (notification?.request?.content?.data?.cashinSuccess) {
    //     dispatch(
    //       addToTransactionAdd({
    //         type: 'cashInSuccess',
    //         value: true,
    //       }),
    //     );
    //     dispatch(
    //       addToTransactionAdd({
    //         type: 'cashInSuccessPayload',
    //         value: {
    //           ...notification?.request?.content?.data,
    //         },
    //       }),
    //     );
    //   }
    //   if (
    //     notification?.request?.content?.data?.cashoutId &&
    //     notification?.request?.content?.data?.status === 'COMPLETED'
    //   ) {
    //     dispatch(
    //       addToTransactionOut({
    //         type: 'cashOutSuccess',
    //         value: true,
    //       }),
    //     );
    //     dispatch(
    //       addToTransactionOut({
    //         type: 'cashOutSuccessPayload',
    //         value: {
    //           ...notification?.request?.content?.data,
    //         },
    //       }),
    //     );
    //   }
    // }
  };

  const handleNotificationResponse = (response: any) => {
    const { data } = response.notification.request.content;
    // router.push('/(main)/User/Settings/Accounts/');

    // if (data) router.replace('/(auth)/Welcome/');

    // if (data?.notificationType === 'hubspotChat' && user?.firstName) {
    //   navigation.navigate('ChatHelp' as never);
    // }
    // if (data?.url) Linking.openURL(data.url);
  };
  return {
    registerForPushNotificationsAsync,
    handleNotificationResponse,
    handleNotification,
  };
};
