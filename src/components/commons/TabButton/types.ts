export interface TabButton {
  title: string;
  accessibilityLabel: string;
}

export interface TabButtonsProps {
  disableRadious?: boolean;
  hideMarginLeft?: boolean;
  hideMarginRight?: boolean;
  buttons: TabButton[];
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  currentActive?: number;
  isWhite?: boolean;
  onPress?: () => void;
}
