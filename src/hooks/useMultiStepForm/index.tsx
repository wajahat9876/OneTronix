/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useMemo, useState } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  AnimateProps,
  FadeInUp,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';

interface StepType {
  type: React.FC;
  props: object;
}

export interface MultiStepFormProps {
  currentStepIndex?: number;
  step?: React.ReactElement;
  steps?: React.ReactElement[];
  isFirstStep?: boolean;
  isLastStep?: boolean;
  goTo?: (index: number) => void;
  next?: () => void;
  back?: () => void;
}

const useMultistepForm = (
  steps: StepType[],
  globalProps: {
    parentGoto?: (index: number) => void;
    disableNewHookFor?: number[];
    newHook?: boolean;
    animatedViewProps?: AnimateProps<ViewProps>;
  } = {},
): MultiStepFormProps => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentStepIndex(i => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }, [steps.length]);

  const back = useCallback(() => {
    setCurrentStepIndex(i => {
      if (i <= 0) return i;
      return i - 1;
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentStepIndex(index);
  }, []);

  const enhancedSteps = useMemo(() => {
    return steps.map((step: any, index) => {
      if (
        globalProps?.newHook &&
        !globalProps?.disableNewHookFor?.includes(index)
      ) {
        return (
          <Animated.View
            entering={FadeInUp.duration(300).delay(500)}
            exiting={FadeOutDown.duration(500)}
            layout={LinearTransition}
            key={`${index}step`}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
            {...globalProps?.animatedViewProps}
          >
            <step.type
              {...{ ...step.props, ...globalProps }}
              goTo={goTo}
              next={next}
              back={back}
              key={index}
              currentStepIndex={currentStepIndex}
              isFirstStep={currentStepIndex === 0}
              isLastStep={currentStepIndex === steps.length - 1}
            />
          </Animated.View>
        );
      }
      return (
        <step.type
          {...{ ...step.props, ...globalProps }}
          goTo={goTo}
          next={next}
          back={back}
          key={index}
          currentStepIndex={currentStepIndex}
          isFirstStep={currentStepIndex === 0}
          isLastStep={currentStepIndex === steps.length - 1}
        />
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalProps]);

  return {
    currentStepIndex,
    step: enhancedSteps[currentStepIndex],
    steps: enhancedSteps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back,
  };
};

export default useMultistepForm;
