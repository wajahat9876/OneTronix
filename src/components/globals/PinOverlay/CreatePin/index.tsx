/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import useMultistepForm from '@src/hooks/useMultiStepForm';
import React from 'react';
import EasyEmoneyGradient from '../../BackgroundGradient';

const CreatePin = () => {
  const [code, setCode] = React.useState('');
  const { step } = useMultistepForm([], {
    setCode,
    code,
    newHook: true,
  });

  return (
    <>
      <EasyEmoneyGradient />
      {step}
    </>
  );
};

export default CreatePin;
