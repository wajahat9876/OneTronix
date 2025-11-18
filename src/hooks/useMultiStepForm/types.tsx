import { ViewProps } from "react-native";
import { AnimatedProps } from "react-native-reanimated";

export interface GlobalProps {
  animated?: boolean;
  animatedProps?: AnimatedProps<ViewProps>;
  parentGoto?: (index: number) => void;
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

export interface StepType {
  type: React.FC<MultiStepFormProps>;
  props: object;
}
