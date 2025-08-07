export interface IPricingProps {
  title: string;
  subtitle: string;
  items: Item[] | any;
  footerText?: {
    text: string;
  }[];
  isLastIndex?: boolean;
  isLastSubItem?: boolean;
}

type Item = {
  left: string;
  right: string;
};
