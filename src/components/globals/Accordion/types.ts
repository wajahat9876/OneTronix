/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAccordionContextType {
  opened: boolean;
  toggleAccordion: () => void;
  children?: any;
}

export interface IAccordionProps {
  children: any;
  containerStyles?: any;
  externalOpen?: boolean;
  externalToggle?: (value: boolean) => void;
}
