/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
import { useCallback, useMemo, useState } from "react";

import Animated, {
  LinearTransition,
  SlideOutLeft,
} from "react-native-reanimated";

import { GlobalProps, StepType } from "@hooks/useMultiStepForm/types";
import { useRouter } from "expo-router";
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
  globalProps: GlobalProps = {}
): MultiStepFormProps => {
  const navigation = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { animated, animatedProps } = globalProps;

  const next = useCallback(() => {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }, [steps.length]);

  const back = useCallback(() => {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentStepIndex(index);
  }, []);

  const enhancedSteps = useMemo(
    () =>
      steps.map((step: StepType, index) => {
        const stepType = (
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

        if (!animated) return stepType;

        return (
          <Animated.View
            className="flex-1"
            // entering={SlideInRight.duration(500).delay(400)}
            exiting={SlideOutLeft.duration(500)}
            layout={LinearTransition}
            key={`${index}step`}
            {...animatedProps}
          >
            {stepType}
          </Animated.View>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalProps, steps?.length || 0]
  );

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
