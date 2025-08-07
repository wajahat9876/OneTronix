/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import * as Burnt from 'burnt';
import ToastNew from 'react-native-toast-message';

export const renderToastSuccess = (title: string) => {
  // make first letter uppercase

  return ToastNew.show({
    type: 'success',
    position: 'bottom',
    swipeable: true,
    visibilityTime: 4000,
    text1: title,
  });
};

export const renderToastError = (title: string) => {
  return ToastNew.show({
    type: 'error',
    position: 'bottom',
    swipeable: true,
    visibilityTime: 4000,
    text1: title,
  });
};

export const renderAlertSuccess = (title: string, message?: string) => {
  return Burnt.alert({
    title,
    message,
    preset: 'done',
    duration: 2,
    shouldDismissByTap: true,
  });
};

export const renderAlertError = (title: string, message?: string) => {
  return Burnt.alert({
    title,
    message,
    preset: 'error',
    duration: 2,
    shouldDismissByTap: true,
  });
};
