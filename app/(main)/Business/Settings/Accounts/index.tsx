/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import CreateAccount from '@src/components/steps/main/Business/Setting/Account/CreateAccount';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm, {
  MultiStepFormProps,
} from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';

const Index = (props: MultiStepFormProps) => {
  const { goTo: parentGoto } = props;
  const { step } = useMultistepForm([<CreateAccount />], {
    parentGoto,
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });

  return <View className="flex-1">{step}</View>;
};

export default Index;
