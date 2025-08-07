/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import Step1_BasicDetails from '@src/components/steps/Auth/Signin/Step1_BasicDetails';
import Step2_OTP from '@src/components/steps/Auth/Signin/Step2_OTP';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';

const Signin = () => {
  const { step } = useMultistepForm([<Step1_BasicDetails />, <Step2_OTP />], {
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });

  return step;
};

export default Signin;
