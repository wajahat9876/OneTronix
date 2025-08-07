/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */

import Step1_Block_Card from '@src/components/steps/main/Business/Card/BlockCard/Step1_Block_Card';
import { pageTransitionAnimation } from '@src/constants/Animation';
// eslint-disable-next-line prettier/prettier
import useMultistepForm, { MultiStepFormProps, } from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const BlockCard = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm([<Step1_Block_Card />], {
    parentGoto,
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });

  return <View className="flex-1">{step}</View>;
};

export default BlockCard;
