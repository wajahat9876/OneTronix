/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseToast from '@src/components/globals/Toast';

export const toastConfig = {
  success: ({ text1 }: { text1?: any }) => (
    <BaseToast
      {...{
        success: true,
        title: text1,
        variant: 'solid',
        isClosable: true,
      }}
    />
  ),
  error: ({ text1 }: { text1?: any }) => (
    <BaseToast
      {...{
        error: true,
        title: text1,
        variant: 'solid',
        isClosable: true,
      }}
    />
  ),
};
