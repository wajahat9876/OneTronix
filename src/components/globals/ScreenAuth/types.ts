/* eslint-disable @typescript-eslint/no-explicit-any */
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { ViewProps } from "react-native";
import { AppBarProps } from "../AppBar/types";

export interface IScreenAuthProps extends ViewProps, MultiStepFormProps {
  scroll?: boolean;
  topColor?: string;
  bottomColor?: string;
  whiteScan?: boolean;
  appBarProps?: AppBarProps;
  title?: string;
  titleColor?: string;
  label?: string;
  backIcon?: any;
  onPress?: () => void;
  disableBottomSafeArea?: boolean;
  disableAppBar?: boolean;
  darkStatus?: boolean;
  disableTopSafeArea?: boolean;
  newScreenAuth?: boolean;
  backColorLight?: boolean;
  isNotDefaultMode?: boolean;
}
