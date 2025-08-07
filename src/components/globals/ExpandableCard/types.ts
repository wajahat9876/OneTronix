/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IExpandableCardContextType {
  expanded: boolean;
  children?: any;
  isShowButton?: boolean;
  toggleCard: () => void;
  buttonClick: () => void;
}

export interface IExpandableCardProps {
  children: any;
  externalOpen?: boolean;
  isShowButton?: boolean;
  externalButtonClick?: () => void;
  externalToggle?: (value: boolean) => void;
}
